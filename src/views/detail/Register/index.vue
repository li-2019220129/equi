<template>
  <div>
    <div class="drawer-header">
      <div class="drawer-header title">设备登记申请详情</div>
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

    <!-- <div class="leader-line"></div> -->
    <div class="detail-drawer">
      <div class="detail-equipment-message">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          style="margin-top: 20px"
          :disabled="true"
          v-loading="loading"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备分类" prop="categoryLabel">
                <el-select
                  v-model="form.categoryLabel"
                  class="form-styles"
                  placeholder="请选择"
                >
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备品牌" porp="brand">
                <el-input v-model="form.brand" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备型号" prop="model">
                <el-input v-model="form.model" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="" prop="sn">
                <template slot="label">
                  <div
                    style="
                      letter-spacing: 8px;
                      position: absolute;
                      margin-left: 45px;
                    "
                  >
                    序列号
                  </div>
                </template>
                <el-input v-model="form.sn" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="购置时间" prop="purchaseDate">
                <el-date-picker
                  v-model="form.purchaseDate"
                  type="date"
                  placeholder="选择日期"
                  class="form-styles"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="启用时间" prop="enabledTime">
                <el-date-picker
                  v-model="form.enabledTime"
                  type="date"
                  placeholder="选择日期"
                  class="form-styles"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备密级" prop="secret">
                <el-select
                  v-model="form.secretLabel"
                  placeholder="请选择"
                  class="form-styles"
                >
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="保密室编号" prop="secretRoomCode">
                <el-input
                  v-model="form.secretRoomCode"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="保密系统编号" prop="code">
                <el-input v-model="form.code" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="门禁编号" prop="entranceGuardCode">
                <el-input
                  v-model="form.entranceGuardCode"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="存放位置" prop="storagePlace">
                <el-input
                  v-model="form.storagePlace"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备类型" prop="classify">
                <el-select
                  v-model="form.classify"
                  placeholder="请选择"
                  class="form-styles"
                >
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="所属部门" prop="organName">
                <el-input
                  v-model="form.organName"
                  style="width: 1003px"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="原因用途" prop="reason">
                <el-input
                  type="textarea"
                  v-model="form.reason"
                  placeholder="请输入内容"
                  :rows="5"
                  style="width: 1003px"
                ></el-input>
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
import {
  loadRecordByInfoId,
  batchDeviceRegistration,
  batchDeviceDisAgree,
} from "@/api/equipment";
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
        categoryLabel: "", // 设备分类名称
        categoryId: "", // 设备分类
        brand: "", // 设备品牌
        model: "", // 设备型号
        sn: "", // 序号
        purchaseDate: "", // 购置时间
        enabledTime: "", // 启用时间
        secret: "", // 设备密级
        secretLabel: "", // 设备密级名称
        secretRoomCode: "", // 保密室编号
        code: "", // 保密系统编号
        entranceGuardCode: "", // 门禁编号
        storagePlace: "", // 存放位置
        classify: "", // 设备类型
        reason: "", // 原因用途
        organName: "", // 部门
        nodeId: "", //节点主键
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
          infoId: this.root.id,
        };
        const res = await loadRecordByInfoId(params);
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
        reason: this.ruleForm.desc,
        currentUserId: this.userId,
        data: [
          {
            applyId: this.root.id,
            nodeId: this.form.nodeId,
          },
        ],
      };

      this.ruleForm.agree
        ? this.agreeOrDisagree(batchDeviceRegistration(params))
        : this.agreeOrDisagree(batchDeviceDisAgree(params));
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
