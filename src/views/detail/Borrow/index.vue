<template>
  <div>
    <div class="drawer-header">
      <div class="drawer-header title">设备借用申请详情</div>
      <div class="equipment-button">
        <div
          class="equipment-button_btn"
          @click="agree"
          v-show="isAudit === 'true'"
        >
          <img src="@/assets/icon/审批@2x.png" />
          <span>审批</span>
        </div>
      </div>
    </div>

    <div class="drawer-container">
      <div class="drawer-left"></div>
      <div class="drawer-right">
        <div class="equipment-header">
          <div class="equipment-header-left">
            <div
              :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
              @click="activeTab = 1"
            >
              基础信息
            </div>
            <div
              :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
              @click="activeTab = 2"
            >
              相关文件
            </div>
            <div
              :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
              @click="activeTab = 3"
            >
              办理过程
            </div>
          </div>
        </div>
        <component
          :is="componentName"
          v-bind="$attrs"
          ref="borrowMessage"
          :applyForm.sync="applyForm"
        />
      </div>
    </div>

    <leadal-dialog
      :visible="dialogVisible"
      title="借用审批"
      width="800px"
      class="dialog"
      :footer="true"
      @submit="handleSubmit"
      @close="dialogVisible = false"
    >
      <template #content>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="审批意见" prop="resource">
            <el-radio-group v-model="ruleForm.agree">
              <el-radio :label="true">同意</el-radio>
              <el-radio :label="false">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审批意见" prop="desc">
            <el-input
              type="textarea"
              v-model="ruleForm.desc"
              :rows="7"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import BorrowMessage from "./BorrowMessage.vue";
import RelativeFile from "../components/RelativeFile.vue";
import HandleProcess from "../components/HandleProcess.vue";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import { batchBorrowAgree, batchBorrowDisAgree } from "@/api/equipment";
export default {
  name: "BorrowDrawer",
  components: {
    BorrowMessage,
    RelativeFile,
    HandleProcess,
    LeadalDialog,
  },
  props: {
    isAudit: {
      type: String,
      default: "true",
    },
  },
  inject: ["root"],
  data() {
    return {
      activeTab: 1,
      componentName: "BorrowMessage",
      id: this.root.id,
      userId: this.root.userId,
      dialogVisible: false,
      applyForm: {}, //表单数据
      ruleForm: {
        agree: true,
        desc: "",
      },
    };
  },
  methods: {
    agree() {
      this.dialogVisible = true;
    },

    handleSubmit() {
      const params = {
        reason: this.ruleForm.desc,
        currentUserId: this.userId,
        data: [
          {
            applyId: this.root.id,
            nodeId: this.applyForm.nodeId,
          },
        ],
      };

      this.ruleForm.agree
        ? this.agreeOrDisagree(batchBorrowAgree(params))
        : this.agreeOrDisagree(batchBorrowDisAgree(params));
    },
    async agreeOrDisagree(promise) {
      const res = await promise;
      this.$message.success(res.msg);
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  display: flex;
  height: calc(90vh - 40px);
  .drawer-left {
    width: 52%;
    height: 100%;
    margin-right: 30px;
    margin-top: 10px;
    overflow-y: scroll;
    border: 1px solid rgba(231, 231, 231, 1);
  }
  .drawer-right {
    margin-top: 10px;
    width: 48%;
  }
}
</style>
