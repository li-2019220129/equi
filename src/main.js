import axios from "axios";
import Vue from "vue";
import Cookies from "js-cookie";
import Element from "element-ui";
import { cloneDeep } from "lodash";
import App from "./App";
import store from "./store";
import router from "./router";
import vuescroll from "vuescroll";
import Util from "@/utils/util.js";
import echarts from "echarts";

import "normalize.css/normalize.css";
import "./styles/element-variables.scss";
import "@/styles/index.scss";
import "vuescroll/dist/vuescroll.css";
import "./icons";
import "./permission";
import "./utils/error-log";
import "@/assets/font/font.css";

import "@/directive/directive.js";
/** 全局方法挂载 **/
Vue.prototype.$cloneDeep = cloneDeep;
Vue.prototype.$echarts = echarts;

Vue.use(Util);
Vue.use(Element);
Vue.use(vuescroll);
// register global utility filters

// if (process.env.NODE_ENV == "development") {
//   // axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
// } else if (process.env.NODE_ENV == "production") {

// }

Vue.config.productionTip = false;

// function getServerConfig() {
//   axios.get("serverconfig.json").then((res) => {
//     if (res.data) {
//       console.log(res.data);
//       Vue.prototype.$EquipmentUrl = res.data.EquipmentUrl; //接口地址
//       Vue.prototype.$DataUrl = res.data.DataUrl; //接口地址

//     }
//   });
// }
// getServerConfig();
// async function init() {
//   await getServerConfig();
// }
// init();
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
