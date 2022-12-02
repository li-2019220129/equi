import { service } from "@/utils/request";

// 获取设备种类树
export function createId() {
  return service({
    url: "device/common/createId",
    method: "post",
  });
}

//获取用户树
export function userTree() {
  return service({
    url: `/device/common/userOrganTree`,
    method: "post",
  });
}

//获取部门树
export function organTree() {
  return service({
    url: "/device/common/organTree",
    method: "post",
  });
}

//获取登录用户
export function ssoLogin() {
  return service({
    url: "/device/common/ssoLogin",
    method: "post",
  });
}

// 获取设备密级、标签
export function findSecretOrTab(params) {
  return service({
    url: "/system/findSecret",
    method: "post",
    params,
  });
}

//======================================
//角标接口

//设备登记角标
export function countRegisterDisagree(data) {
  return service({
    url: "/device/register/countRegisterDisagree",
    method: "post",
    data,
  });
}

// 登记已审批消息查看
export function messageLookRegister(params) {
  return service({
    url: "/device/register/messageLook",
    method: "post",
    params,
  });
}

//设备借用角标
export function countBorrow(data) {
  return service({
    url: "/borrow/countBorrow",
    method: "post",
    data,
  });
}

// 借用消息查看
export function messageLookBorrow(params) {
  return service({
    url: "/borrow/messageLook",
    method: "post",
    params,
  });
}

//设备移交角标
export function countModify(data) {
  return service({
    url: "/deviceModify/countModify",
    method: "post",
    data,
  });
}

// 移交消息查看
export function messageLookDeviceModify(params) {
  return service({
    url: "/deviceModify/messageLook",
    method: "post",
    params,
  });
}

//设备外送角标
export function countTakeout(data) {
  return service({
    url: "/takeout/countTakeout",
    method: "post",
    data,
  });
}

// 外送消息查看
export function messageLookTakeouty(params) {
  return service({
    url: "/takeout/messageLook",
    method: "post",
    params,
  });
}

//设备销毁角标
export function countDestory(data) {
  return service({
    url: "/destory/countDestory",
    method: "post",
    data,
  });
}

// 销毁消息查看
export function messageLookDestory(params) {
  return service({
    url: "/destory/messageLook",
    method: "post",
    params,
  });
}

//设备待审批角标
export function countAudit(data) {
  return service({
    url: "/audit/work/countAudit",
    method: "post",
    data,
  });
}

// 待审批消息查看
export function messageLookAudit(params) {
  return service({
    url: "/audit/work/messageLook",
    method: "post",
    params,
  });
}
