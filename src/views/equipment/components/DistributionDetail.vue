<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      disabled
      v-loading="loading"
      style="margin-top: 20px; margin-left: -20px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="分发人名称" prop="distributeUserName">
            <el-input
              v-model="form.distributeUserName"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="接收人名称" prop="receiveUserName">
            <el-input
              v-model="form.receiveUserName"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="文件标题" prop="heading">
            <el-input v-model="form.heading" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="文件编号" prop="code">
            <el-input v-model="form.code" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="文件密级" prop="secretLevelLabel">
            <el-input v-model="form.secretLevelLabel"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="分发时间" prop="distributeTime">
            <el-input v-model="form.distributeTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接收时间" prop="receiveTime">
            <el-input v-model="form.receiveTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { distributeDetailApi } from "@/api/data";
export default {
  name: "AddData",
  props: {
    formLine: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      form: {},
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
            distributeDetailApi({
              distribute2UserId:this.formLine.distribute2UserId
            }).then((res) => {
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
  methods: {},
};
</script>

<style lang="scss" src="./headerScss.scss" scoped></style>

<style lang="scss" scoped>
.form-styles {
  width: 420px;
  height: 32px;
}
</style>
