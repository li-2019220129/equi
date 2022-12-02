<template>
  <div>
    <div class="dialog-btn-layout">
      <div class="handle save" @click="save">保存</div>
    </div>
    <hr />
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="120px"
      style="margin: 100px"
    >
      <el-form-item
        :label="title.indexOf('种类') > -1 ? '种类名称' : '分类名称'"
        prop="name"
      >
        <el-input v-model="form.name" class="form-styles"></el-input>
      </el-form-item>

      <el-form-item label="排序号" prop="sequence">
        <el-input v-model="form.sequence" class="form-styles"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  onSaveDeviceKind,
  updateDeviceKind,
  onSaveDeviceCategory,
} from "@/api/equipment";
export default {
  name: "ShiftConfirmation",
  props: {
    deviceKindData: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    kindId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        name: "",
        sequence: "",
      },
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sequence: [
          { required: true, message: "排序号不能为空", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "排序号需为数字", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    deviceKindData(val) {
      this.form = {
        name: val.name,
        sequence: val.sequence,
      };
    },
    visible(val) {
      this.$refs["form"].resetFields();
    },
  },
  methods: {
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title === "编辑种类") {
            const parmas = {
              ...this.form,
              id: this.deviceKindData.id,
              // parentId: this.parentId,
              enabled: true,
            };
            updateDeviceKind(parmas).then((res) => {
              this.$message.success(res.msg);
              this.$emit("closeDialog", false);
            });
          } else if (this.title === "新增种类") {
            const params = {
              ...this.form,
              parentId: this.parentId,
            };
            onSaveDeviceKind(params).then((res) => {
              this.$message.success(res.msg);
              this.$emit("closeDialog", false);
            });
          } else if (this.title === "新增分类") {
            const parmas = {
              ...this.form,
              kindId: this.kindId,
            };
            onSaveDeviceCategory(parmas).then((res) => {
              this.$message.success(res.msg);
              this.$emit("closeDialog", false);
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" src="./headerScss.scss" scoped >
</style>
