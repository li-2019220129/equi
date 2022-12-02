import { service } from "@/utils/request";

// 获取设备种类树    type:0二级树    1三级树
export function getDeviceKindTree(params) {
  return service({
    url: "system/deviceKind/kindTree",
    method: "post",
    params,
  });
}

// 添加设备种类
export function onSaveDeviceKind(data) {
  return service({
    url: "system/deviceKind/onSave",
    method: "post",
    data,
  });
}

// 添加设备种类
export function updateDeviceKind(data) {
  return service({
    url: "system/deviceKind/update",
    method: "post",
    data,
  });
}

// 查询对应设备种类
export function loadDeviceKind(params) {
  return service({
    url: "system/deviceKind/load",
    method: "post",
    params,
  });
}

// 删除设备种类
export function deleteDeviceKind(params) {
  return service({
    url: "system/deviceKind/delete",
    method: "post",
    params,
  });
}

// 查询对应设备分类
export function pageDeviceCategory(data) {
  return service({
    url: "system/deviceCategory/page",
    method: "post",
    data,
  });
}

// 新增设备分类
export function onSaveDeviceCategory(data) {
  return service({
    url: "system/deviceCategory/onSave",
    method: "post",
    data,
  });
}

// 删除设备分类
export function deleteDeviceCategory(params) {
  return service({
    url: "system/deviceCategory/delete",
    method: "post",
    params,
  });
}

// 撤回
export function recall(id) {
  return service({
    url: `/record/recall?idStr=${id}`,
    method: "get",
  });
}

// ==========================================
// 设备登记查询
export function pagePerson(data) {
  return service({
    url: "device/register/pagePerson",
    method: "post",
    data,
  });
}

// 保存设备
export function saveDirectly(data) {
  return service({
    url: "stockin/saveDirectly",
    method: "post",
    data,
  });
}

// 通过设备主键查询（编辑的时候查询）
export function loadEditData(data) {
  return service({
    url: "stockin/load",
    method: "post",
    data,
  });
}

// 送审设备
export function apply(data) {
  return service({
    url: "stockin/apply",
    method: "post",
    data,
  });
}

// 删除设备登记
export function deleteRecord(params) {
  return service({
    url: "stockin/deleteByIdStr",
    method: "post",
    params,
  });
}

// 撤回设备登记
export function recallStockin(params) {
  return service({
    url: "stockin/recall",
    method: "post",
    params,
  });
}

//新增设备详情查看
export function loadRecordByInfoId(params) {
  return service({
    url: "deviceInfo/loadRecordByInfoId",
    method: "post",
    params,
  });
}

export function registeruploadFile(data) {
  return service({
    url: "device/register/uploadSmFile",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function registerdownloadMode(data) {
  return service({
    url: `/device/register/downloadModel`,
    method: "post",
    download: true,
    responseType: "blob",
    params: data,
  });
}

//==============================
//设备借用

//借用登记or审批中 查询
export function pageBorrowData(data) {
  return service({
    url: "borrow/pageBorrowData",
    method: "post",
    data,
  });
}

//已审批or待借出
export function pageBorrowWait(data) {
  return service({
    url: "borrow/pageBorrow",
    method: "post",
    data,
  });
}

//待归还
export function pageRevertData(data) {
  return service({
    url: "borrow/pageRevertData",
    method: "post",
    data,
  });
}

//已归还
export function pageBorrowed(data) {
  return service({
    url: "borrow/pageReverted",
    method: "post",
    data,
  });
}

//借用申请
export function applyBorrow(data) {
  return service({
    url: "borrow/apply",
    method: "post",
    data,
  });
}

//借用设备信息
export function pageAllClassify(data) {
  return service({
    url: "deviceRecord/pageAllClassify",
    method: "post",
    data,
  });
}

//编辑
export function viewDetail(params) {
  return service({
    url: "borrow/viewDetail",
    method: "post",
    params,
  });
}

// 删除设备借用
export function deleteBorrow(params) {
  return service({
    url: "borrow/delete",
    method: "post",
    params,
  });
}

// 删除借用已选择设备
export function removeBorrowDevice(data) {
  return service({
    url: "borrow/remove",
    method: "post",
    data,
  });
}

// 借用送审
export function submit(data) {
  return service({
    url: "borrow/submit",
    method: "post",
    data,
  });
}

// 借用撤回
export function recallBorrow(params) {
  return service({
    url: "borrow/recall",
    method: "post",
    params,
  });
}

//设备借出
export function xtsBorrow(params) {
  return service({
    url: "borrow/xtsBorrow",
    method: "post",
    params,
  });
}

//设备归还
export function revert(params) {
  return service({
    url: "borrow/revert",
    method: "post",
    params,
  });
}

//借用统计表
export function pageBorrowDataTotal(data) {
  return service({
    url: "borrow/pageBorrowDataTotal",
    method: "post",
    data,
  });
}

// ============= 设备移交

// 审批中
export function pageDeviceModify(data) {
  return service({
    url: "deviceModify/pageDeviceModify",
    method: "post",
    data,
  });
}

// 待接收
export function pageDeviceWaitModify(data) {
  return service({
    url: "deviceModify/pageDeviceWaitModify",
    method: "post",
    data,
  });
}

// 已接收
export function pageDeviceModifyed(data) {
  return service({
    url: "deviceModify/pageDeviceModifyed",
    method: "post",
    data,
  });
}

// 个人在使用设备
export function pageMyselfUse(data) {
  return service({
    url: "deviceRecord/pageMyselfUse",
    method: "post",
    data,
  });
}

// 添加移交设备
export function saveDeviceModify(data) {
  return service({
    url: "deviceModify/save",
    method: "post",
    data,
  });
}

//移交编辑
export function loadDeviceModify(params) {
  return service({
    url: "deviceModify/loadDeviceModify",
    method: "post",
    params,
  });
}

//移交送审

export function applyDeviceModify(data) {
  return service({
    url: "deviceModify/apply",
    method: "post",
    data,
  });
}

//获取移交设备

export function findDeviceByModifyId(data) {
  return service({
    url: "modify2Device/findDeviceByModifyId",
    method: "post",
    data,
  });
}

// 删除设备移交
export function delModifyId(params) {
  return service({
    url: "deviceModify/delModifyId",
    method: "post",
    params,
  });
}

//撤回设备移交
export function recallModify(params) {
  return service({
    url: "deviceModify/recallModify",
    method: "post",
    params,
  });
}

//设备移交接收
export function receiveDeviceModify(data) {
  return service({
    url: "deviceModify/modify",
    method: "post",
    data,
  });
}

//====================================================
//设备外送

//外送申请查询
export function pageTakeout(data) {
  return service({
    url: "takeout/takeout/page",
    method: "post",
    data,
  });
}

//外送申请新增
export function saveTakeout(data) {
  return service({
    url: "takeout/takeout/save",
    method: "post",
    data,
  });
}

//获取外送设备
export function findDeviceByTakeoutId(data) {
  return service({
    url: "takeout/takeout2Device/findDeviceByTakeoutId",
    method: "post",
    data,
  });
}

// 删除外送
export function deleteTakeout(params) {
  return service({
    url: `takeout/takeout/delete`,
    method: "post",
    params,
  });
}

//外送送审
export function applyTakeout(data) {
  return service({
    url: "takeout/takeout/apply",
    method: "post",
    data,
  });
}

//外送撤回
export function recallTakeout(params) {
  return service({
    url: "takeout/takeout/recall",
    method: "post",
    params,
  });
}

//外送接收/takeout/takeout/detailAudit
export function receiveTakeout2Device(data) {
  return service({
    url: "takeout/takeout2Device/receive",
    method: "post",
    data,
  });
}

export function detailAuditTakeout(data) {
  return service({
    url: "takeout/takeout/detailAudit",
    method: "post",
    data,
  });
}

//====================================================
//设备销毁

//添加设备销毁
export function saveDestory(data) {
  return service({
    url: "destory/apply",
    method: "post",
    data,
  });
}

//查询销毁
export function pageDestoryOneByUserId(data) {
  return service({
    url: "destory/pageDestoryOneByUserId",
    method: "post",
    data,
  });
}

//待销毁
export function pageWaitDestoryOneByUserId(data) {
  return service({
    url: "destory/pageWaitDestoryOneByUserId",
    method: "post",
    data,
  });
}

//已销毁
export function pageDestoryReadlyOneByUserId(data) {
  return service({
    url: "destory/pageDestoryReadlyOneByUserId",
    method: "post",
    data,
  });
}

//编辑销毁
export function viewDetailDestory(params) {
  return service({
    url: "destory/viewDetail",
    method: "post",
    params,
  });
}

//销毁送审
export function saveSendDestory(data) {
  return service({
    url: "destory/destory/saveSend",
    method: "post",
    data,
  });
}

//撤回销毁
export function recallDestory(params) {
  return service({
    url: "destory/recall",
    method: "post",
    params,
  });
}

//删除销毁
export function deleteDestory(params) {
  return service({
    url: "destory/delete",
    method: "post",
    params,
  });
}

//接收销毁
export function receiveDestory(data) {
  return service({
    url: "destory/receive",
    method: "post",
    data,
  });
}

//====================================================
//设备台账

//个人设备
export function pageMyselfAll(data) {
  return service({
    url: "deviceRecord/pageMyselfAll",
    method: "post",
    data,
  });
}

//本部门设备
export function pageOrganUse(data) {
  return service({
    url: "deviceRecord/pageOrganUse",
    method: "post",
    data,
  });
}

//本单位设备
export function pageZoneUse(data) {
  return service({
    url: "deviceRecord/pageZoneUse",
    method: "post",
    data,
  });
}

//导出
export function downloadExist(data) {
  return service({
    url: "device/ledger/downloadExist",
    method: "post",
    download: true,
    responseType: "blob",
    data,
  });
}

//台账详情
export function loadDetail(data) {
  return service({
    url: "stockin/load",
    method: "post",
    data,
  });
}

//台账流转记录
export function findModifyDetail(data) {
  return service({
    url: "deviceModify/findModifyDetail",
    method: "post",
    data,
  });
}

//台账修改状态
export function updateStatus(data) {
  return service({
    url: "/deviceInfo/updateStatus",
    method: "post",
    data,
  });
}

//=====================================================
// 涉密载体审批：

// 设备登记批量审批同意

export function batchDeviceRegistration(data) {
  return service({
    url: "stockin/batchAgree",
    method: "post",
    data,
  });
}
// 设备登记批量审批不同意
export function batchDeviceDisAgree(data) {
  return service({
    url: "stockin/batchUnAgree",
    method: "post",
    data,
  });
}

// 设备移交批量审批同意

export function batchMoveAgree(data) {
  return service({
    url: "deviceModify/batchAgree",
    method: "post",
    data,
  });
}

// 设备移交批量审批不同意

export function batchMoveDisAgree(data) {
  return service({
    url: "deviceModify/batchUnAgree",
    method: "post",
    data,
  });
}

// 设备借用批量审批同意
export function batchBorrowAgree(data) {
  return service({
    url: "borrow/batchAgree",
    method: "post",
    data,
  });
}

// 设备借用批量审批不同意
export function batchBorrowDisAgree(data) {
  return service({
    url: "borrow/batchUnAgree",
    method: "post",
    data,
  });
}

// 设备外送批量审批同意

export function batchTakeoutAgree(data) {
  return service({
    url: "takeout/takeout/batchAgree",
    method: "post",
    data,
  });
}

// 设备外送批量审批不同意

export function batchTakeoutDisAgree(data) {
  return service({
    url: "takeout/takeout/batchUnAgree",
    method: "post",
    data,
  });
}

// 设备销毁批量审批同意

export function batchDestoryAgree(data) {
  return service({
    url: "destory/batchAgree",
    method: "post",
    data,
  });
}

// 设备销毁批量审批不同意

export function batchDestoryDisAgree(data) {
  return service({
    url: "destory/batchUnAgree",
    method: "post",
    data,
  });
}
