<template>
  <div>
    <div class="drawer-header">
      <div class="drawer-header title">新增审批单</div>
      <div class="equipment-button">
        <div class="equipment-button_btn">
          <img src="@/assets/icon/保存@2x.png" />
          <span>完成配置</span>
        </div>
      </div>
    </div>
    <el-form
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="right"
      ref="form"
      style="margin-top: 20px"
    >
      <el-form-item label="模板名称" prop="name">
        <el-input
          placeholder="请输入模板名称"
          v-model="form.name"
          style="width: 1000px"
        ></el-input>
      </el-form-item>

      <el-form-item label="应用模块" prop="categoryValue">
        <el-select
          v-model="form.categoryValue"
          placeholder="请选择应用模块"
          style="width: 1000px"
          clearable
        >
          <el-option
            v-for="item in categoryValueList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文件" prop="file">
        <el-upload
          style="width: 500px; font-size: 16px"
          action="#"
          :http-request="() => {}"
          accept=".xlsx"
          :on-change="handleSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="排序" prop="sequence">
        <el-input-number
          v-model="form.sequence"
          :min="1"
          :max="10"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "NewApprovalForm",
  data() {
    return {
      form: {
        name: "",
        categoryValue: "",
        file: "",
        sequence: 0,
      },
      categoryValueList: [
        {
          id: 1,
          label: "设备登记",
        },
        {
          id: 16,
          label: "设备移交",
        },
        {
          id: 32,
          label: "设备销毁",
        },
        {
          id: 64,
          label: "设备借用",
        },
        {
          id: 256,
          label: "设备外送",
        },
      ],
      rules: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        categoryValue: [
          { required: true, message: "请输入应用模块", trigger: "blur" },
        ],
        file: [{ required: true, message: "请上传文件", trigger: "blur" }],
      },
    };
  },
  methods: {
    //上传文件
    handleSuccess(file) {
      const formData = new FormData();
      formData.append("uploadFile", file.raw);
      formData.append("userId", this.$store.state.login.loginData.userId);

      const headers = {
        "Content-Type": "multipart/form-data",
      };
      // axios
      //   .post("device/register/uploadSmFile", formData, headers)
      //   .then((res) => {
      //     this.$message.success(res.msg);
      //     this.pagePersonData();
      //   });
    },
  },
};
</script>

<style>
</style>
