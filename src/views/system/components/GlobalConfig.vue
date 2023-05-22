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
      <!-- <el-form-item
        v-if="nodeData.kind === 'secret'"
        label="密级设置"
        prop="value"
      >
        <el-select
          v-model="form.value"
          placeholder="请选择密级"
          class="form-styles"
          style="width: 100%"
        >
          <el-option
            v-for="item in secretOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="form.name" class="form-styles"></el-input>
      </el-form-item>

      <el-form-item label="排序号" prop="sequence">
        <el-input-number
          v-model="form.sequence"
          class="form-styles"
          style="width: 100%"
          controls-position="right"
        ></el-input-number>
      </el-form-item>

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
    nodeData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        name: "",
        sequence: null,
        enabled: true,
        value: null,
      },
      // secretOptions: [
      //   {
      //     value: 1,
      //     label: "level 1",
      //   },
      //   {
      //     value: 2,
      //     label: "level 2",
      //   },
      //   {
      //     value: 4,
      //     label: "level 3",
      //   },
      //   {
      //     value: 8,
      //     label: "level 4",
      //   },
      //   {
      //     value: 16,
      //     label: "level 5",
      //   },
      // ],
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sequence: [
          { required: true, message: "排序号不能为空", trigger: "blur" },
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
          console.log(res);
          Object.assign(this.form, res.data);
          console.log(this.form);
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
          console.log(this.form);
          const params = {
            ...this.form,
            kind: this.nodeData.kind,
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

<style
  lang="scss"
  src="../../equipment/components/headerScss.scss"
  scoped
></style>
