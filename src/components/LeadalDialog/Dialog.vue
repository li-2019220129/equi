<template>
  <div class="dialog-container">
    <el-dialog
      :visible="visible"
      v-if="visible"
      :show-close="true"
      :destroy-on-close="false"
      :close-on-click-modal="false"
      :width="width"
      :title="title"
      :center="center"
      :before-close="close"
      :append-to-body="true"
      :custom-class="backImage !== '' ? 'customClass' : ''"
      :style="'margin-top:' + marginTop + 'px'"
    >
      <slot ref="contents" name="content" />
      <!-- 底部按钮 -->
      <div v-if="footer" slot="footer" class="dialog-footer position-btn">
        <el-button
          class="dialog-cancel-btn"
          style="margin-left: -20px"
          @click="close"
          >取 消</el-button
        >
        <el-button
          type="primary"
          class="dialog-submit-btn"
          @click="submit"
          :loading="btnLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<style>
.customClass .el-dialog__body {
  padding: 14px;
  background: #f0f0f5;
}
</style>

<script>
import { number } from "echarts/lib/export";
export default {
  name: "Dialog",
  props: {
    title: {
      type: String,
      default: "添加新计划",
    },
    width: {
      type: String,
      default: "50%",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
    sure: {
      type: String,
      default: "确定",
    },
    footer: {
      // 底部按钮
      type: Boolean,
      default: false,
    },
    btnLoading: {
      // 确定按钮加载
      type: Boolean,
      default: false,
    },
    marginTop: {
      type: Number,
      default: 0,
    },
    backImage: {
      type: String,
      default: "",
    },
  },
  mounted() {},

  methods: {
    // 右上角打岔关闭
    close() {
      this.$emit("close");
    },
    // 点击确定按钮
    submit() {
      this.$emit("submit");
    },
  },
};
</script>



