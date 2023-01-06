<template>
  <div>
    <div class="drawer-form">
      <div class="drawer-form title">申请信息</div>
      <el-form
        :model="applyForm"
        ref="form"
        label-width="80px"
        label-position="right"
        v-loading="loading"
      >
        <el-form-item label="标题">
          <template slot="label">
            <div
              style="letter-spacing: 30px; position: absolute; margin-left: 5px"
            >
              标题
            </div>
          </template>
          <el-input v-model="applyForm.content"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="申请部门">
            <el-select
              v-model="organName"
              placeholder="请选择申请部门"
              style="width: 330px"
              disabled
            >
            </el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <template slot="label">
              <div
                style="
                  letter-spacing: 8px;
                  position: absolute;
                  margin-left: 5px;
                "
              >
                申请人
              </div>
            </template>
            <el-select
              v-model="applyForm.userName"
              placeholder="请选择申请人"
              style="width: 330px"
              disabled
            >
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="接收人" prop="receiveUserName">
          <template slot="label">
            <div
              style="letter-spacing: 8px; position: absolute; margin-left: 5px"
            >
              接收人
            </div>
          </template>
          <el-select
            v-model="applyForm.receiveUserName"
            placeholder="请选择接收人"
            ref="tree"
            style="width: 330px"
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
                  <tree-slot :node="node" :data="data"></tree-slot>
                </div>
              </el-tree>
            </el-option>
          </el-select>
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
    TreeSlot,
  },
  props: {
    isData: {
      type: Boolean,
      default: false,
    },
    formLine: {
      type: Object,
      default: () => {},
    },
  },
  inject: ["root"],

  data() {
    return {
      title: this.root.title,
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
        toUserName: "", //审批人名称
      },
      editDevTable: [],
      // devIds: "", //设备id
      defaultProps: {
        children: "children",
        label: "caption",
        isLeaf: "leaf",
      },
      rules: {
        receiveUserName: [
          { required: true, message: "请选择接收人", trigger: "change" },
        ],
      },
      loading: false,
    };
  },
  created() {
    // this.createIdData();
  },
  watch: {
    formLine: {
      immediate: true,
      handler() {
        console.log(this.formLine)
        if (JSON.stringify(this.formLine) !== "{}") {
          const params = {
            id: this.formLine.id,
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
      deep: true,
    },
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
            : null,
      };
      dataUserTree(params).then((res) => {
        const treeArray = res.data.map((item) => {
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
      console.log(this.applyForm,'applyform')
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
    },
  },
};
</script>

<style lang="scss" scoped>
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
