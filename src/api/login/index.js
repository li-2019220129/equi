import { service } from "@/utils/request";

/**
 * 登录
 * @param {} param
 * @returns
 */
export function loginApi(params) {
  return service({
    url: "/device/login",
    method: "post",
    params,
  });
}

/**
 * 登录
 * @param {} param
 * @returns
 */
//  export function loginApi(data) {
//   return service({
//     url: "/login",
//     method: "post",
//     data,
//   });
// }
// system/menu/find
/**
 * 获取系统名称
 */
export function findMenu(params) {
  return service({
    url: "/system/menu/findXts",
    method: "post",
    params,
  });
}

/**
 * 获取系统名称
 */

//  /system/envParam/findAll

// export function getSysName() {
//   return request({
//     url: "/system/envParam/findAll",
//     method: "post",
//   });
// }
