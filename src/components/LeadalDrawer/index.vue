<template>
  <el-drawer
    :visible.sync="visible"
    :size="size"
    :with-header="false"
    :before-close="handleClose"
    :destroy-on-close="true"
    z-index="1003"
  >
    <div class="drawer-container">
      <div class="drawer-btn">
        <div class="drawer-btn back" @click="handleClose">
          <img src="@/assets/icon/back@2x.png" />
          <span>返回</span>
        </div>
      </div>

      <slot name="content" />
    </div>
  </el-drawer>
</template>
<script>
export default {
  name: "Drawer",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "calc(100%)",
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.drawer-container {
  padding: 10px 20px;
  .drawer-btn {
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .back {
      cursor: pointer;
      img {
        height: 20px;
        width: 28px;
        margin-right: 12px;
      }
      span {
        font-family: SourceHanSansCN-Normal;
        font-size: 22px;
        color: #3d464c;
        letter-spacing: 0;
        font-weight: 400;
      }
    }
  }
}
</style>
