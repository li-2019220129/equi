<template>
  <div>
    <div class="dialog-btn-layout">
      <div class="handle send" @click="handleSave(true)">保存并送审</div>
      <div class="handle save" @click="handleSave(false)">保存</div>
    </div>
    <hr />
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      :disabled="isDetail"
      v-loading="loading"
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
            <!-- <template slot="label">
              <div
                style="
                  letter-spacing: 8px;
                  position: absolute;
                  margin-left: 45px;
                "
              >
                申请人
              </div>
            </template> -->
            <el-input
              v-model="form.ownerUserName"
              class="form-styles"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="文件标题" prop="heading">
            <el-input v-model="form.heading" style="width: 1056px"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="文件编号" prop="code">
            <el-input v-model="form.code" style="width: 1056px"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="文件密级" prop="secretLevel">
            <el-select
              v-model="form.secretLevel"
              placeholder="请选择"
              class="form-styles"
            >
              <el-option
                v-for="item in secretOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
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
            <el-input v-model="form.fromZone" class="form-styles"></el-input>
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
              <el-option
                v-for="item in classifyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { saveDraft, loadDetail } from "@/api/data";
export default {
  name: "AddData",
  props: {
    formLine: {
      type: Object,
      default: () => {},
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        heading: "", //标题
        secretLevel: "", //密级数值  1为内文，  2为秘密，4为机密，  8为绝密，16为核心机密
        secretLevelLabel: "", //密级中文值
        createUserId: this.$store.state.login.loginData.userId, //记录创建人主键
        ownerUserId: this.$store.state.login.loginData.userId, //申请人主键
        ownerUserName: this.$store.state.login.loginData.userName, //申请人名称
        ownerDeptId: this.$store.state.login.loginData.organId, //部门主键
        ownerDeptName: this.$store.state.login.loginData.organName, // 部门名称
        code: "", //文件编号
        registerTime: "", //产生日期
        fromZone: "", //来文单位
        toZone: "", //发往单位
        witness: "", //见证人
        classifyType: "", //归属类型（1是个人资产   2是保密室资产）
      },
      rules: {
        ownerDeptName: [
          { required: true, message: "请选择所在机构", trigger: "change" },
        ],
        ownerUserName: [
          { required: true, message: "请选择申请人", trigger: "blur" },
        ],
        heading: [
          { required: true, message: "请输入文件标题", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入文件编号", trigger: "change" },
        ],
        classifyType: [
          { required: true, message: "请选择资料类别", trigger: "change" },
        ],
      },
      classifyOptions: [
        {
          value: 1,
          label: "个人资产",
        },
        {
          value: 2,
          label: "保密室资产",
        },
      ],

      secretOptions: [
        {
          value: 1,
          label: "内文",
        },
        {
          value: 2,
          label: "秘密",
        },
        {
          value: 4,
          label: "机密",
        },
        {
          value: 8,
          label: "绝密",
        },
        {
          value: 16,
          label: "核心秘密",
        },
      ],
    };
  },
  created() {
    // this.getOrganTree();
  },
  watch: {
    formLine: {
      immediate: true,
      handler() {
        if (JSON.stringify(this.formLine) !== "{}") {
          try {
            this.loading = true;
            const params = {
              id: this.formLine.id ? this.formLine.id : this.formLine.applyId,
            };
            loadDetail(params).then((res) => {
              Object.assign(this.form, res.data);
              this.loading = false;
            });
          } catch (error) {
            this.loading = false;
          }
        } else {
          this.$nextTick(() => {
            this.$refs.form.resetFields();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    handleSave(flag) {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const res = await saveDraft(this.form);
          this.$message.success(res.msg);
          if (flag) {
            this.$emit("handleParams", res.data);
          } else {
            this.$emit("close");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" src="./headerScss.scss" scoped >
</style>

<style lang="scss" scoped>
.form-styles {
  width: 420px;
  height: 32px;
}
</style>
