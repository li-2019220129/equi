import { asyncRoutes, constantRoutes } from "@/router";
// import { getUser } from "@/api/config/user.js";
// import { individuation } from "@/api/config/page";
import { cloneDeep } from "lodash";
/**
 * Use meta.role to determine if the current user has pergetUsermission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: [],
  userObj: {},
  personalise: {},
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },

  SET_USER: (state, data) => {
    state.userObj = data;
    if (data.canArrage) {
    }
  },

  // SET_PERSONALISE: (state, data) => {
  //   state.personalise = data.value.data;
  // },
};

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      let accessedRoutes;
      if (roles.includes("admin")) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    }).catch((error) => {
      console.log(error);
    });
  },

  // getUserData({ commit }) {
  //   return new Promise((resolve) => {
  //     getUser().then((res) => {
  //       let index;
  //       if (!res.value.canArrage) {
  //         index = asyncRoutes.findIndex((item) => item.path === "/schedule");
  //         asyncRoutes.splice(index, 1);
  //       }
  //       if (!res.value.configManager) {
  //         index = asyncRoutes.findIndex((item) => item.path === "/config");
  //         asyncRoutes.splice(index, 1);
  //       }
  //       commit("SET_USER", res.value);
  //     });
  //     resolve(true);
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // },

//   personalise({ commit }) {
//     return new Promise((resolve) => {
//       individuation().then((res) => {
//         commit("SET_PERSONALISE", res);
//       });
//     }).catch((error) => {
//       console.log(error);
//     });
//   },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
