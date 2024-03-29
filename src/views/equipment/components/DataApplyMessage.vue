<template>
  <div>
    <div class="drawer-form">
      <div class="drawer-form title">申请信息</div>
      <el-form
        :model="applyForm"
        ref="form"
        label-width="80px"
        :disabled="isDetail"
        label-position="right"
        v-loading="loading"
      >
        <el-form-item label="标题" label-width="80px">
          <template slot="label">
            <div style="letter-spacing: 15px; margin-left: 5px">标题</div>
          </template>
          <el-input v-model="applyForm.content"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="申请部门">
            <el-select v-model="organName" placeholder="请选择申请部门" style="width: 330px" disabled></el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <template slot="label">
              <div
                style="
                  letter-spacing: 4px;
                  margin-left: 5px;
                "
              >申请人</div>
            </template>
            <el-select
              v-model="applyForm.userName"
              placeholder="请选择申请人"
              style="width: 300px"
              disabled
            ></el-select>
          </el-form-item>
        </div>
        <el-form-item label="接收人" prop="receiveUserName" label-width="80px">
          <template slot="label">
            <div style="letter-spacing: 4px;margin-left: 5px">接收人</div>
          </template>
          <el-select
            v-if="!selectText"
            v-model="applyForm.receiveUserName"
            placeholder="请选择接收人"
            ref="tree"
            style="width: 300px"
          >
            <el-option style="height: auto" :value="applyForm.receiveUserName">
              <el-tree
                class="tree-no-background"
                :props="defaultProps"
                highlight-current
                lazy
                :load="loadNode"
                @node-click="nodeClick"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <tree-slot :showIcon="false" :node="node" :data="data"></tree-slot>
                </div>
              </el-tree>
            </el-option>
          </el-select>
          <el-input v-else v-model="applyForm.receiveUserName"></el-input>
        </el-form-item>

        <el-form-item>
          <label slot="label" style="font-weight: 400">{{ title }}事由</label>
          <el-input type="textarea" v-model="applyForm.reason"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <data-message
        :maxHeight="'calc(50vh - 50px)'"
        :editDevTable="editDevTable"
        :currentApplyId="applyForm.id"
        v-on="$listeners"
      />
      <!-- :mediaIdStr.sync="applyForm.mediaIdStr" -->
    </div>
  </div>
</template>

<script>
import TreeSlot from "@/components/TreeSlot/index.vue";
import DataMessage from "./DataMessage.vue";
import { createHanderId, createTakeout, createRecycle } from "@/api/data/index";
import { dataUserTree, loadHander, loadTakeout, loadRecycle } from "@/api/data";
export default {
  name: "ApplyMessage",
  components: {
    DataMessage,
    TreeSlot
  },
  props: {
    selectText: {
      type: Boolean,
      defalut: false
    },
    isData: {
      type: Boolean,
      default: false
    },
    formLine: {
      type: Object,
      default: () => {}
    }
  },
  inject: ["root"],

  data() {
    return {
      title: this.root.title,
      isDetail: this.root.isDetail,
      drawerTitle: this.root.drawerTitle,
      organName: this.$store.state.login.loginData.organName,
      applyForm: {
        id: "", //申请id
        content: "", //内容
        userId: this.$store.state.login.loginData.userId, //申请人主键
        userName: this.$store.state.login.loginData.userName, //申请人名称
        receiveUserId: "", //接收人主键
        receiveUserName: "", //接收人名称
        nodeId: "", //节点主键
        reason: "", //事由
        toUserId: "", //审批人主键
        toUserName: "" //审批人名称
      },
      editDevTable: [],
      // devIds: "", //设备id
      defaultProps: {
        children: "children",
        label: "caption",
        isLeaf: "leaf"
      },
      rules: {
        receiveUserName: [
          { required: true, message: "请选择接收人", trigger: "change" }
        ]
      },
      loading: false
    };
  },
  created() {
    // this.createIdData();
  },
  watch: {
    formLine: {
      immediate: true,
      handler() {
        console.log(this.formLine);
        if (JSON.stringify(this.formLine) !== "{}") {
          const params = {
            id: this.formLine.id || this.formLine.applyId
          };
          if (this.drawerTitle === "资料移交") {
            this.loadDetail(loadHander(params));
          } else if (this.drawerTitle === "资料外送") {
            this.loadDetail(loadTakeout(params));
          } else if (this.drawerTitle === "资料销毁") {
            this.loadDetail(loadRecycle(params));
          }
        } else {
          this.$nextTick(() => {
            //区分编辑和新建
            this.createIdData();
            this.$refs.form.resetFields();
          });
        }
      },
      deep: true
    }
  },
  methods: {
    //获取创建id
    async createIdData() {
      if (this.drawerTitle === "资料移交") {
        const res = await createHanderId();
        this.applyForm.id = res.data.id;
      } else if (this.drawerTitle === "资料外送") {
        const res = await createTakeout();
        this.applyForm.id = res.data;
      } else if ((this.drawerTitle = "资料销毁")) {
        const res = await createRecycle();
        this.applyForm.id = res.data.id;
      }
    },

    loadNode(node, resolve) {
      //加载用户数据
      const params = {
        id: node.level === 0 ? null : node.data.id,
        userId:
          this.drawerTitle === "资料移交"
            ? this.$store.state.login.loginData.userId
            : null
      };
      dataUserTree(params).then(res => {
        const treeArray = res.data
          .filter(item => {
            return item.caption !== this.$store.state.login.loginData.userName;
          })
          .map(item => {
            if (!item.hasChild) {
              this.$set(item, "leaf", true);
            }
            return item;
          });
        resolve(treeArray);
      });
    },

    nodeClick(data) {
      if (data.ntype === "User") {
        this.applyForm.receiveUserId = data.id;
        this.applyForm.receiveUserName = data.caption;
        this.$refs.tree.blur();
      }
    },

    //申请
    saveApply() {
      console.log(this.applyForm, "applyform");
      this.$emit("saveApply", this.applyForm);
    },

    //编辑查询详情
    async loadDetail(promise) {
      try {
        this.loading = true;
        const res = await promise;
        this.$set(this.applyForm, "id", this.formLine.id);
        Object.assign(this.applyForm, res.data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/* ::v-deep .el-tree-node__content > label.el-checkbox {
  margin-right: -18px;
  margin-left: 20px;
  margin-top: -3px;
} */
::v-deep .el-icon-arrow-right {
  display: none;
}

// 对树的样式进行修改
::v-deep .el-tree-node__content {
  height: 38px;
  // padding-left: 20px !important;
}
.custom-tree-node{
  width: 100%;
  height: 100%;
}



// 树形控件

.leadal-menu-tree .el-tree {
  color: #3b3b3b;
}
.leadal-menu-tree .el-tree-node__label {
  font-size: 20px;
}
.leadal-menu-tree .el-tree-node__content:hover {
  background-color: #dff1ff;
}
.leadal-menu-tree
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #dff1ff;
}

// 树样式

::v-deep .el-tree-node__expand-icon {
  /* display: none; */
  font-size:20px;
}




.child-triangle {
  transition: all 0.3s;
  margin-left: -20px;
  &.rodge {
    transform: rotate(90deg);
  }
  &.treeTriangle {
    margin: 0 30px !important;
    margin-left: -50px !important;
  }
  &.treeTriangleSelect{
    margin: 0 30px !important;
    margin-left: -40px !important;
  }
}

::v-deep .el-tree-node__loading-icon {
  /* margin-right: 8px; */
  font-size: 14px;
  margin: 0 0 0 3px;
  color: #c0c4cc;
  position: absolute;
  // left: 0;
}

.drawer-form {
  .title {
    font-family: SourceHanSansCN-Medium;
    font-size: 22px;
    margin: 10px 0;
    color: #3d464c;
    letter-spacing: 0;
    font-weight: 500;
  }
  .flex-item {
    display: flex;
    justify-content: space-between;
  }
}
</style>
