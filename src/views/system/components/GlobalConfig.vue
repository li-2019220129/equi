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
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="form.name" class="form-styles"></el-input>
      </el-form-item>
      <!--
      <el-form-item label="排序号" prop="sequence">
        <el-input v-model="form.sequence" class="form-styles"></el-input>
      </el-form-item> -->

      <el-form-item label="是否启用" prop="enabled" class="form-styles">
        <el-switch v-model="form.enabled"> </el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveGlobalConfigContent, loadGlobalConfigContent } from "@/api/system";
export default {
  name: "ShiftConfirmation",
  props: {
    kindId: {
      type: String,
      default: "",
    },
    configId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        name: "",
        // sequence: "",
        enabled: true,
      },
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sequence: [
          { required: true, message: "排序号不能为空", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "排序号需为数字", trigger: "blur" },
        ],
        enabled: [{ required: true, message: "启用不能为空", trigger: "blur" }],
      },
    };
  },
  watch: {
    configId: {
      immediate: true,
      async handler() {
        if (this.configId) {
          const params = {
            id: this.configId,
          };
          const res = await loadGlobalConfigContent(params);
          Object.assign(this.form, res.data);
        } else {
          this.$nextTick(() => {
            this.$refs["form"].resetFields();
          });
        }
      },
    },
  },
  methods: {
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const params = {
            ...this.form,
            parentId: this.kindId,
          };
          saveGlobalConfigContent(params).then((res) => {
            this.$message.success(res.msg);
            this.$emit("closeDialog");
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" src="../../equipment/components/headerScss.scss" scoped >
</style>
