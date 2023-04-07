import { service } from "@/utils/request";

// 获取涉密设备待审批数据
export function pageDeviceWait(data) {
  return service({
    url: "audit/deviceWork/pageDeviceWait",
    method: "post",
    data,
  });
}

// 获取涉密设备已审批数据
export function pageDeviceAudited(data) {
  return service({
    url: "audit/deviceWork/pageDeviceAudited",
    method: "post",
    data,
  });
}

// 获取新增设备待审批数据
export function pageWait(data) {
  return service({
    url: "audit/deviceWork/pageWait",
    method: "post",
    data,
  });
}

// 获取新增设备已审批数据
export function pageAudited(data) {
  return service({
    url: "audit/deviceWork/pageAudited",
    method: "post",
    data,
  });
}

// 获取办理过程
export function findWorkDataAndUser(params) {
  return service({
    url: "audit/work/findWorkDataAndUser",
    method: "post",
    params,
  });
}

export function organTreeApi() {
  return service({
    url: "/device/common/allOrganTree",
    method: "post",
  });
}

export function findUsersByOrganIdApi(data) {
  return service({
    url: "/device/common/findUsersByOrganId",
    method: "post",
    data,
    arrType:true
  });
}

export function allOrganTreeApi(data) {
  return service({
    url: "/device/common/organTree",
    method: "post",
    params: data,
  });
}
