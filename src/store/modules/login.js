import {
  userTree,
  ssoLogin,
  countRegisterDisagree,
  countBorrow,
  countModify,
  countTakeout,
  countDestory,
  countAudit,
  findSecretOrTab,
} from "@/api/common/index";
import { findMenu } from "@/api/login";
import {
  countAuditedMedia,
  countDataBorrow,
  countDataHander,
  countDataTakeout,
  countDataRecycle,
  mediaCount,
} from "@/api/data";
const state = {
  loginData: sessionStorage.getItem("loginUserData")
    ? JSON.parse(sessionStorage.getItem("loginUserData"))
    : {},
  userTreeData: sessionStorage.getItem("userTreeData")
    ? JSON.parse(sessionStorage.getItem("userTreeData"))
    : [],
  userAuth: sessionStorage.getItem("userAuth")
    ? JSON.parse(sessionStorage.getItem("userAuth"))
    : [],
  // userAuth: [],
  equipmentSecret: [],
  dataTerm: [],
  equipmentTab: [],

  equipmentRegisterBadge: 0, //设备登记角标
  equipmentBorrowBadge: {}, //设备借用角标
  equipmentTransferBadge: {}, //设备移交角标
  equipmentDeliverBadge: {}, //设备外送角标
  equipmentDestoryBadge: {}, //设备销毁角标
  equipmentAuditBadge: {}, //设备待审批角标

  dataRegisterBadge: 0, //资料登记角标
  dataBorrowBadge: {}, //资料借用角标
  dataTransferBadge: {}, //资料移交角标
  dataDeliverBadge: {}, //资料外送角标
  dataDestoryBadge: {}, //资料销毁角标
  dataAuditBadge: {}, //资料待审批角标
};

const mutations = {
  SET_LOGINID: (state, data) => {
    state.loginData = data;
  },

  SET_USERTREEDATA: (state, data) => {
    state.userTreeData = data;
  },

  SET_USERAUTH: (state, data) => {
    state.userAuth = data;
  },

  SET_EQUIPMENTSECRET: (state, data) => {
    state.equipmentSecret = data;
  },
  SET_DATATERM(state, data) {
    state.dataTerm = data;
  },
  SET_EQUIPMENTTAB: (state, data) => {
    state.equipmentTab = data;
  },

  //设备
  SET_EQUIPMENTREGISTERBADGE: (state, data) => {
    state.equipmentRegisterBadge = data;
  },
  SET_EQUIPMENTBORROWBADGE: (state, data) => {
    state.equipmentBorrowBadge = data;
  },
  SET_EQUIPMENTTRANSFERBADGE: (state, data) => {
    state.equipmentTransferBadge = data;
  },
  SET_EQUIPMENTDELIVERBADGE: (state, data) => {
    state.equipmentDeliverBadge = data;
  },
  SET_EQUIPMENTTDESTORYBADGE: (state, data) => {
    state.equipmentDestoryBadge = data;
  },
  SET_EQUIPMENTTAUDITBADGE: (state, data) => {
    state.equipmentAuditBadge = data;
  },

  //资料
  SET_DATAREGISTERBADGE: (state, data) => {
    state.dataRegisterBadge = data;
  },
  SET_DATABORROWBADGE: (state, data) => {
    state.dataBorrowBadge = data;
  },
  SET_DATATRANSFERBADGE: (state, data) => {
    state.dataTransferBadge = data;
  },
  SET_DATADELIVERBADGE: (state, data) => {
    state.dataDeliverBadge = data;
  },
  SET_DATATDESTORYBADGE: (state, data) => {
    state.dataDestoryBadge = data;
  },
  SET_DATATAUDITBADGE: (state, data) => {
    state.dataAuditBadge = data;
  },
};

const actions = {
  /**
   * 获取登入人信息
   * @param {*} param0
   */
  loginAction({ commit }) {
    return new Promise((resoleve, reject) => {
      ssoLogin()
        .then((res) => {
          sessionStorage.setItem("loginUserData", JSON.stringify(res.data));
          // commit(
          //   "SET_LOGINID",
          //   JSON.parse(sessionStorage.getItem("loginUserData"))
          // );
          commit("SET_LOGINID", res.data);
          resoleve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  userAuth({ commit }) {
    return new Promise((resoleve, reject) => {
      findMenu({ userId: state.loginData.userId })
        .then((res) => {
          const menu = res.data.mViews.map((item) => item.menu.name);
          let childMenu = [];
          res.data.mViews.forEach((item) => {
            const element = item.childMenus.map((i) => i.code);
            childMenu.push(element);
          });
          childMenu = childMenu.flat(1);
          const role = res.data.role.split(",");
          role.forEach((item) => {
            childMenu.push(item);
          });
          sessionStorage.setItem(
            "userAuth",
            JSON.stringify({ menu, childMenu })
          );
          commit("SET_USERAUTH", { menu, childMenu });
          resoleve(childMenu);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /**
   * 获取用户树
   */

  userTreeData({ commit }) {
    userTree().then((res) => {
      sessionStorage.setItem("userTreeData", JSON.stringify(res.data));
      commit("SET_USERTREEDATA", res.data);
    });
  },

  /**
   * 获取设备密级配置
   */
  async getEquipmentSecret({ commit }) {
    const params = {
      kind: "secret",
    };
    const res = await findSecretOrTab(params);
    commit("SET_EQUIPMENTSECRET", res.data);
  },
  /**
   * 获取设备资料保密期限
   */
  async getDataTerm({ commit }) {
    const params = {
      kind: "term",
    };
    const res = await findSecretOrTab(params);
    commit("SET_DATATERM", res.data);
  },
  /**
   * 获取设备标签配置
   */
  async getEquipmentTab({ commit }) {
    const params = {
      kind: "tab",
    };
    const res = await findSecretOrTab(params);
    console.log(res,'我是你打奶')
    commit("SET_EQUIPMENTTAB", res.data);
  },

  //获取设备登记角标
  async getRegisterBadge({ commit }) {
    const params = {
      stockinUserId: state.loginData.userId,
    };
    const res = await countRegisterDisagree(params);
    commit("SET_EQUIPMENTREGISTERBADGE", res.data);
  },

  //获取设备借用角标
  async getBorrowBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countBorrow(params);
    commit("SET_EQUIPMENTBORROWBADGE", res.data);
  },

  //获取设备移交角标
  async getTransferBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countModify(params);
    commit("SET_EQUIPMENTTRANSFERBADGE", res.data);
  },

  //获取设备外送角标
  async getDeliverBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countTakeout(params);
    commit("SET_EQUIPMENTDELIVERBADGE", res.data);
  },

  //获取设备销毁角标
  async getDestoryBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countDestory(params);
    commit("SET_EQUIPMENTTDESTORYBADGE", res.data);
  },

  //获取设备待审批角标
  async getAuditBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countAudit(params);
    commit("SET_EQUIPMENTTAUDITBADGE", res.data);
  },

  //获取资料登记角标
  async getDataRegisterBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countAuditedMedia(params);
    commit("SET_DATAREGISTERBADGE", res.data);
  },

  //获取资料借阅角标
  async getDataBorrowBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countDataBorrow(params);
    commit("SET_DATABORROWBADGE", res.data);
  },

  //获取资料移交角标
  async getDataTransferBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    console.log("23232323", "垃圾代码");
    const res = await countDataHander(params);
    commit("SET_DATATRANSFERBADGE", res.data);
  },

  //获取资料外送角标
  async getDataDeliverBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countDataTakeout(params);
    commit("SET_DATADELIVERBADGE", res.data);
  },

  //获取资料销毁角标
  async getDataDestoryBadge({ commit }) {
    const params = {
      userId: state.loginData.userId,
    };
    const res = await countDataRecycle(params);
    commit("SET_DATATDESTORYBADGE", res.data);
  },

  //获取资料待审批角标
  async getDataAuditBadge({ commit }) {
    const params = {
      toUserId: state.loginData.userId,
      status: 1,
    };
    const res = await mediaCount(params);
    commit("SET_DATATAUDITBADGE", res.data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
