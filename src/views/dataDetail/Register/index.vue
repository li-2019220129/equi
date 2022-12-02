<template>
  <div>
    <div class="drawer-header">
      <div class="drawer-header title">资料登记申请详情</div>
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

    <div class="detail-drawer">
      <div class="detail-equipment-message">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          disabled
          style="margin-top: 20px; margin-left: -20px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="所在机构" prop="ownerDeptName">
                <el-select
                  v-model="form.ownerDeptName"
                  placeholder="请选择申请部门"
                  disabled
                  class="form-styles"
                >
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="申请人" prop="ownerUserName">
                <el-input
                  v-model="form.ownerUserName"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="文件标题" prop="heading">
                <el-input
                  v-model="form.heading"
                  style="width: 1012px"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="文件编号" prop="code">
                <el-input v-model="form.code" style="width: 1012px"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="文件密级" prop="secretLevel">
                <el-select
                  v-model="form.secretLevel"
                  placeholder="请选择"
                  class="form-styles"
                >
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="产生日期" prop="registerTime">
                <el-date-picker
                  v-model="form.registerTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  class="form-styles"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="来文单位" prop="fromZone">
                <el-input
                  v-model="form.fromZone"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="发往单位" prop="toZone">
                <el-input v-model="form.toZone" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="见证人" prop="witness">
                <el-input v-model="form.witness" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="资料类别" prop="classifyType">
                <el-select
                  v-model="form.classifyType"
                  placeholder="请选择"
                  class="form-styles"
                >
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <leadal-dialog
        :visible="dialogVisible"
        title="销毁审批"
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
  </div>
</template>

<script>
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import { loadDetail, auditAgree, auditDisAgree } from "@/api/data";
export default {
  name: "Register",
  components: {
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
      loading: false,
      form: {
        heading: "", //标题
        secretLevel: "", //密级数值  1为内文，  2为秘密，4为机密，  8为绝密，16为核心机密
        secretLevelLabel: "", //密级中文值
        createUserId: "", //记录创建人主键
        ownerUserId: "", //申请人主键
        ownerUserName: "", //申请人名称
        ownerDeptId: "", //部门主键
        ownerDeptName: "", // 部门名称
        code: "", //文件编号
        registerTime: "", //产生日期
        fromZone: "", //来文单位
        toZone: "", //发往单位
        witness: "", //见证人
        classifyType: "", //归属类型（1是个人资产   2是保密室资产）
      },
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
  created() {
    this.loadDetail();
  },
  methods: {
    async loadDetail() {
      try {
        this.loading = true;
        const params = {
          id: this.root.id,
        };
        const res = await loadDetail(params);
        Object.assign(this.form, res.data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    agree() {
      this.dialogVisible = true;
    },

    handleSubmit() {
      const params = {
        id: this.id, //申请ID
        nodeId: this.form.nodeId, //审批节点id
        reason: this.ruleForm.desc, //原因
        currentUserId: this.userId, //当前用户主键
      };
      this.ruleForm.agree
        ? this.agreeOrDisagree(auditAgree(params))
        : this.agreeOrDisagree(auditDisAgree(params));
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
// 分割线统一样式
.leader-line {
  width: 100%;
  border-top: 1px #b4b4b4 solid;
  margin: 20px 0;
}
.detail-drawer {
  display: flex;
  // justify-content: center;
  // align-content: center;
  padding: 100px 358px;
  height: calc(90vh - 10px);
  .drawer-title {
    font-family: SourceHanSansCN-Medium;
    font-size: 22px;
    margin: 10px 0;
    color: #3d464c;
    letter-spacing: 0;
    font-weight: 500;
  }
}
.form-styles {
  width: 420px;
  height: 32px;
}
</style>
