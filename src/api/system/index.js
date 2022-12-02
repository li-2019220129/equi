import { service } from "@/utils/request";

// 获取审批流程
export function page(data) {
  return service({
    url: "flow/flow/page",
    method: "post",
    data,
  });
}

// 添加审批流程
export function saveFlow(data) {
  return service({
    url: "flow/flow/save",
    method: "post",
    data,
  });
}

// 删除审批流程
export function deleteFlow(params) {
  return service({
    url: "flow/flow/delete",
    method: "post",
    params,
  });
}

//流程单条
export function nodeQuery(flowId) {
  return service({
    url: `/flow/node/find?flowId=${flowId}`,
    method: "post",
  });
}

//流程更新
export function flowUpdate(data) {
  return service({
    url: "/flow/flow/update",
    method: "post",
    data,
  });
}

//接收人
export function findParticipator(data) {
  return service({
    url: "/flow/participator/find",
    method: "post",
    data,
  });
}

//审批人
export function findParticipators(data) {
  return service({
    url: "/flow/participator/findParticipators",
    method: "post",
    data,
  });
}

// /system/menu/allEnable
/**
 * 全部启用菜单接口
 */
export function allEnableApi(data) {
  return service({
    url: "/system/menu/allEnable",
    method: "post",
    params: data,
  });
}

// /system/role/allEnable
/**
 * 全部启用角色菜单接口
 */
export function allEnableRoleApi(data) {
  return service({
    url: "/system/role/allEnable",
    method: "post",
    data,
  });
}

/**
 * 菜单禁用与启用
 */

//  /system/menu/onUse
export function menuOnUseApi(data) {
  return service({
    url: "/system/menu/onUse",
    method: "post",
    data,
  });
}

export function menuPage(id) {
  return service({
    url: `/system/menu/pageXts`,
    method: "post",
  });
}

///
export function roleFindAll(id) {
  return service({
    url: `/system/role/findAll`,
    method: "post",
  });
}

export function roleFind(roleId, data) {
  return service({
    url: `/system/role/findXts?roleId=${roleId}`,
    method: "post",
    data,
  });
}

/**
 * 角色权限启用禁用
 */
//  /system/role/onUse
export function roleOnUseApi(data) {
  return service({
    url: "/system/role/onUse",
    method: "post",
    data,
  });
}

/**
 * 删除角色
 */
//  /system/role/delete
export function deleteRoleApi(data) {
  return service({
    url: `/system/role/delete`,
    method: "post",
    params: data,
  });
}

// 接收人
export function userTree(id) {
  return service({
    url: `/device/common/userTree?id=${id}`,
    method: "post",
  });
}
/**
 * 保存修改角色信息
 * @param {*} data
 * @returns
 */
export function roleSaveApi(data) {
  return service({
    url: `/system/role/save`,
    method: "post",
    data,
  });
}

/**
 * 查找配置类型
 */
export function findGlobalConfigType() {
  return service({
    url: `/system/findGlobalConfigType`,
    method: "post",
  });
}

// /**
//  * 保存配置类型
//  */
// // /system/saveGlobalConfigType
// export function saveGlobalConfigType(data) {
//   return service({
//     url: `/system/saveGlobalConfigType`,
//     method: "post",
//     data,
//   });
// }
// /**
//  * 删除配置类型
//  */
// // /system/delGlobalConfigType
// export function delGlobalConfigType(params) {
//   return service({
//     url: `/system/delGlobalConfigType`,
//     method: "post",
//     params,
//   });
// }
// /**
//  * 查找单个配置类型详情
//  */
// // /system/loadGlobalConfigType
// export function loadGlobalConfigType(params) {
//   return service({
//     url: `/system/loadGlobalConfigType`,
//     method: "post",
//     params,
//   });
// }

/**
 * 查找配置内容
 */
// /system/pageGlobalConfigContent
export function pageGlobalConfigContent(data) {
  return service({
    url: `/system/pageGlobalConfigContent`,
    method: "post",
    data,
  });
}
/**
 * 保存配置内容
 */
// /system/saveGlobalConfigContent
export function saveGlobalConfigContent(data) {
  return service({
    url: `/system/saveGlobalConfigContent`,
    method: "post",
    data,
  });
}
/**
 * 查找单个配置内容详情
 */
// /system/loadGlobalConfigContent
export function loadGlobalConfigContent(params) {
  return service({
    url: `/system/loadGlobalConfigContent`,
    method: "post",
    params,
  });
}
/**
 * 删除配置内容
 */
// /system/delGlobalConfigContent
export function delGlobalConfigContent(params) {
  return service({
    url: `/system/delGlobalConfigContent`,
    method: "post",
    params,
  });
}
/**
 * 修改角色名称
 */
export function updateXts(data) {
  return service({
    url: `/system/role/updateXts `,
    method: "post",
    data,
  });
}
