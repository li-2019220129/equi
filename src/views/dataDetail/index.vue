<template>
  <div id="main">
    <component :is="mark" :isAudit="isAudit" />
  </div>
</template>

<script>
import borrow from "./Borrow";
import transfer from "./Transfer";
import deliver from "./Deliver";
import destory from "./Destory";
import register from "./Register";
export default {
  name: "detail",
  components: {
    borrow,
    transfer,
    deliver,
    destory,
    register,
  },
  provide() {
    return {
      root: this,
    };
  },
  data() {
    return {
      mark: "", //模式
      id: "",
      userId: "",
      isAudit: "true",
    };
  },
  mounted() {
    this.mark = this.getQueryString("mark");
    this.id = this.getQueryString("id");
    this.userId = this.getQueryString("userId");
    this.isAudit = this.getQueryString("isAudit");
  },
  methods: {
    getQueryString(name) {
      //获取url后用"?"分割域名和参数，再进行查找
      let search = window.location.hash.split("?")[1];
      if (search) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = search.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#main {
  height: 100%;
  background: #fff;
  padding: 20px;
}
</style>
