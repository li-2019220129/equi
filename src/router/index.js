import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/login",
    name: "login",
    // redirect: "login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/",
    component: () => import("@/layout"),
    redirect: "equipment",
    name: "equipment",
    meta: {
      icon: "item-home-icon",
      department: "equipment",
      // requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: "/equipment",
        name: "equipment",
        component: () => import("@/views/equipment/index"),
        meta: {
          title: "涉密载体",
          icon: "item-home-icon",
        },
      },

      {
        path: "/detail",
        name: "detail",
        component: () => import("@/views/detail/index"),
        hidden: true,
      },

      {
        path: "/dataDetail",
        name: "dataDetail",
        component: () => import("@/views/dataDetail/index"),
        hidden: true,
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
