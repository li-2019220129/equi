import axios from "axios";
import Vue from "vue";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

//设备
export const service = axios.create({
  // baseURL: window.g.EquipmentUrl + "/api/",
  // baseURL: window.location.contextPath
  //   ? window.location.origin + window.location.contextPath + "/api/"
  // : window.location.origin + "/api/",
  // baseURL: window.location.contextPath + "/api/",
  // baseURL: "http://127.0.0.1:8080/api/",
  // baseURL: process.env.VUE_APP_BASE_API + "/api/",
  // baseURL:
  // timeout: 50000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (config.arrType) {
      return config;
    }
    if (config.method === "post") {
      config.data = {
        ...config.data,
      };
    } else if (config.method === "get") {
      config.params = {
        ...config.params,
      };
    }

    if (store.getters.token) {
      config.headers["X-Token"] = getToken();
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    //过滤数组  过滤某些没有res.status标识的接口
    const filterApiList = ["/api/device/ledger/downloadExist"];
    //如果请求url在数组里则不走拦截器
    if (filterApiList.includes(response.config.url)) {
      const result = response.data;
      return result;
    }
    // 二进制数据则直接返回
    if (
      response.request.responseType === "blob" ||
      response.request.responseType === "arraybuffer"
    ) {
      return response.data;
    }
    const res = response.data;
    // || !res.success
    if (res.status !== 200) {
      Message({
        message: res.msg || "请求失败,请稍后再试",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(res.msg || "请求失败,请稍后再试"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

//资料
export const service2 = axios.create({
  // baseURL: window.location.contextPath
  //   ? window.location.contextPath + "/api/"
  //   : "/api/",
  // baseURL: Vue.prototype.$DataUrl,
  // baseURL: window.location.contextPath + "/api/",
  // baseURL: "http://127.0.0.1:8070/api/",
  // baseURL: process.env.VUE_APP_BASE_API_DATA + "/api/",
  // timeout: 50000, // request timeout
});

// request interceptor
service2.interceptors.request.use(
  (config) => {
    if (config.method === "post") {
      config.data = {
        ...config.data,
      };
    } else if (config.method === "get") {
      config.params = {
        ...config.params,
      };
    }

    if (store.getters.token) {
      config.headers["X-Token"] = getToken();
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service2.interceptors.response.use(
  (response) => {
    const filterApiList = ["/api1/api/media/downloadAll"];
    //如果请求url在数组里则不走拦截器
    if (filterApiList.includes(response.config.url)) {
      const result = response.data;
      return result;
    }
    const res = response.data;
    // || !res.success
    if (res.status !== 200) {
      Message({
        message: res.msg || "请求失败,请稍后再试",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(res.msg || "请求失败,请稍后再试"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default { service, service2 };
