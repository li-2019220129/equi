<template>
  <div class="item-container">
    <div :class="['item-icon', icon]"></div>
    <div class="item-title">{{ title }}</div>
  </div>
</template>
<script>
export default {
  name: "MenuItem",
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      flag: false,
      planUrl: "",
    };
  },
  mounted() {},

  computed: {
    isShow() {
      //数量为0不显示任务角标
      if ("任务" === this.title && this.$store.state.task.noApproved !== 0) {
        return true;
      }
      //数量为0和领导角色不显示首页角标
      if (
        "首页" === this.title &&
        this.$store.state.task.indexTaskNum !== 0 &&
        !this.$store.state.userLogin.isLeader
      ) {
        return true;
      }
      return false;
    },
    setVal() {
      if (this.title === "任务") {
        return this.$store.state.task.noApproved;
      } else {
        return this.$store.state.task.indexTaskNum;
      }
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.item-container {
  width: 100%;
  height: 84px;
  padding-top: 5px;
  cursor: pointer;
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.item-container:hover {
  background-color: #7895f4;
}
.el-menu-item.is-active .item-container {
  background-color: #7895f4;
}
.item-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto;
}
.item-title {
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 2;
}
::v-deep .el-badge__content {
  height: 20px;
}
::v-deep .el-badge__content.is-fixed {
  top: 1px;
}
</style>
