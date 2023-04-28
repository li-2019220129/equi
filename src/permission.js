
import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  const hasToken = getToken();
  if (hasToken) {
    if (store.getters.permission_routes.length > 0) {
      next();
    } else {
      try {
        // const accessRoutes = await store.dispatch("permission/generateRoutes", [
        //   "admin",
        // ]);
        // router.addRoutes(accessRoutes);
        // next({ ...to, replace: true });
        // store.dispatch("login/userAuth").then(async (res) => {

        //   if (res?.length > 0) {
        //     const accessRoutes = await store.dispatch(
        //       "permission/generateRoutes",
        //       ["admin"]
        //     );
        //     router.addRoutes(accessRoutes);
        //     next({ ...to, replace: true });
        //   }
        // });
        store.dispatch("login/loginAction").then((res) => {
          if (res) {
            store.dispatch("login/userAuth").then(async (res) => {
              if (res?.length > 0) {
                const accessRoutes = await store.dispatch(
                  "permission/generateRoutes",
                  ["admin"]
                );
                router.addRoutes(accessRoutes);
                next({ ...to, replace: true });
              }
            }); //获取用户权限
          }
        });
      } catch (error) {
        await store.dispatch("user/resetToken");
        Message.error(error || "Has Error");
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }
    // }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
