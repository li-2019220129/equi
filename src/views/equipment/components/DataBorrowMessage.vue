<template>
  <div>
    <div class="drawer-form">
      <div class="drawer-form title">申请信息</div>
      <el-form
        :model="applyForm"
        :rules="rules"
        ref="form"
        label-width="80px"
        :disabled="isDetail"
        label-position="right"
      >
        <el-form-item label="编号" prop="serialNum" label-width="80px">
          <el-input v-model="applyForm.serialNum"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="reason" label-width="80px">
          <el-input v-model="applyForm.reason"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item
            style="margin-left: 15px"
            label="申请部门"
            prop="organName"
          >
            <el-select
              v-model="organName"
              placeholder="请选择申请部门"
              style="width: 300px"
              disabled
            ></el-select>
          </el-form-item>
          <el-form-item
            label="申请人"
            prop="borrowUserName"
            label-width="100px"
          >
            <template slot="label">
              <div style="letter-spacing: 4px; margin-left: 5px">申请人</div>
            </template>
            <el-select
              v-model="applyForm.borrowUserName"
              placeholder="请选择申请人"
              ref="tree"
              style="width: 300px"
              disabled
            >
              <el-option style="height: auto" :value="applyForm.borrowUserName">
                <el-tree
                  :props="defaultProps"
                  :data="treeData"
                  node-key="id"
                  class="tree-no-background"
                  @node-click="handleNodeClick"
                >
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <tree-slot :node="node" :data="data"></tree-slot>
                  </div>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="申请事由" prop="content" label-width="96px">
          <el-input type="textarea" v-model="applyForm.content"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item
            label="借用时间"
            label-width="96px"
            prop="borrowStartTime"
          >
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="applyForm.borrowStartTime"
              style="width: 300px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="至" prop="borrowEndTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="applyForm.borrowEndTime"
              style="width: 300px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </div>

        <el-form-item label="保管方式" label-width="96px" prop="keepType">
          <el-input
            v-model="applyForm.keepType"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="申请时间" label-width="96px" prop="applyTime">
            <el-date-picker
              v-model="applyForm.applyTime"
              type="date"
              style="width: 300px"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="联系方式" prop="telephone">
            <el-input
              type="number"
              v-model="applyForm.telephone"
              style="width: 300px"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <data-message
      :maxHeight="'calc(30vh - 60px)'"
      :editDevTable="editDevTable"
      :currentApplyId="applyForm.id"
      :applyId="applyId"
    />
  </div>
</template>

<script>
import TreeSlot from "@/components/TreeSlot/index.vue";
import DataMessage from "./DataMessage.vue";
import moment from "moment";
import { createBorrowId, loadBorrow } from "@/api/data/index";
export default {
  name: "DataBorrowMessage",
  components: {
    DataMessage,
    TreeSlot,
  },
  inject: ["root"],
  props: {
    formLine: {
      type: Object,
      default: () => {},
    },
    isDetail:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      applyId: this.formLine.id,
      title: this.root.title,
      btnTitle: this.root.btnTitle,
      // isDetail: this.root.isDetail,
      treeData: this.$store.state.login.userTreeData, //树
      organName: this.$store.state.login.loginData.organName,
      applyForm: {
        serialNum: "", //编号
        reason: "", //标题
        borrowUserId: this.$store.state.login.loginData.userId, //申请人
        borrowUserName: this.$store.state.login.loginData.userName, //申请人
        content: "", //内容
        borrowStartTime: "", //借用开始时间
        borrowEndTime: "", //借用结束时间
        applyTime: moment(new Date()).format("YYYY-MM-DD"), //申请时间
        nodeId: "", //节点主键
        userId: this.$store.state.login.loginData.userId, //创建人主键
        userName: this.$store.state.login.loginData.userName, //创建人
        id: "", //登记记录主键
        keepType: "", //保管方式
        telephone: "", //联系方式
      },
      editDevTable: [], //编辑时的借用设备信息
      defaultProps: {
        children: "children",
        label: "caption",
      },
      rules: {
        telephone: [
          {
            required: true,
            message: "请输入联系方式！",
            trigger: "blur",
          },
        ],
        reason: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请输入申请事由", trigger: "blur" },
        ],
        borrowStartTime: [
          { required: true, message: "请输入借用开始时间", trigger: "blur" },
        ],
        borrowEndTime: [
          { required: true, message: "请输入借用结束时间", trigger: "blur" },
        ],
        keepType: [
          { required: true, message: "请输入保管方式", trigger: "blur" },
        ],
        applyTime: [
          { required: true, message: "请输入申请时间", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    formLine: {
      immediate: true,
      deep: true,
      async handler() {
        if (JSON.stringify(this.formLine) !== "{}") {
          const params = {
            id: this.formLine.applyId || this.formLine.id,
          };
          const res = await loadBorrow(params);
          Object.assign(this.applyForm, res.data);
        } else {
          this.$nextTick(() => {
            this.createIdData();
            this.$refs.form.resetFields();
          });
        }
      },
    },
  },
  createId() {},
  methods: {
    createIdData() {
      createBorrowId().then((res) => {
        this.applyForm.id = res.data.borrowId;
      });
    },

    handleNodeClick(node) {
      if (node.ntype === "User") {
        this.applyForm.borrowUserName = node.caption;
        this.applyForm.borrowUserId = node.id;
        this.$refs.tree.blur();
      }
    },

    saveBorrow() {
      if (this.applyId) {
        this.applyForm.id = this.applyId;
      }
      this.$emit("saveBorrow", this.applyForm);
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
