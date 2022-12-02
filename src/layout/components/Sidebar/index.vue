<template>
  <div :class="{ 'has-logo': showLogo }">
    <div class="logo-img">
      <img src="@/assets/logo.png" width="50px" height="50px" />
      <div class="logo-text">电子保密室</div>
    </div>

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="select"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
      <span class="out" @click="logout">退出</span>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import { debounce } from "lodash";
export default {
  components: { SidebarItem },

  mounted() {
    this.$store.dispatch("login/userTreeData");
  },
  methods: {
    select: debounce(function (key) {
      setTimeout(() => {
        this.$router.replace({ path: "/redirect" });
      }, 0);
      setTimeout(() => {
        this.$router.replace({ path: key });
      }, 0);
    }, 300),
    logout() {
      this.$confirm(`是否退出账号？`)
        .then((_) => {
          sessionStorage.removeItem("loginUserData");
          // sessionStorage.removeItem("createId");
          // this.$store.commit("login/SET_LOGINID", {});
          this.$router.replace("/login");
        })
        .catch((_) => {});
    },
  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>


<style lang="scss" scoped>
.logo-img {
  position: absolute;
  left: 50%;
  top: 28px;
  transform: translate(-50%, 0);
  z-index: 999;
  text-align: center;
  img {
    margin: 0 auto;
  }
  .logo-text {
    opacity: 0.8 !important;
    font-family: SourceHanSansCN-Medium !important;
    font-size: 15px !important;
    color: #ffffff !important;
    letter-spacing: 0 !important;
    font-weight: 500 !important;
    width: 84px;
    text-align: center;
    margin-top: 12px;
  }
}
.out {
  position: absolute;
  color: #ffffff;
  cursor: pointer;
  top: 90%;
  left: 20px;
}
</style>
