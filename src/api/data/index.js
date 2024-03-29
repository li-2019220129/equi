import { service2 } from "@/utils/request";

const devUrl = process.env.NODE_ENV === "development" ? "/api1/api" : "";
// const devUrl = process.env.NODE_ENV === "development" ? "/api1" : "";
// 公共

//审批人查询
export function findParticipatorsGroundByOrgan(data) {
  return service2({
    url: `${devUrl}/flow/participator/findParticipatorsGroundByOrgan`,
    method: "post",
    data,
  });
}

//载体拥有人的列表展示
export function pageValidMedia(data) {
  return service2({
    url: `${devUrl}/media/media/pageValidMedia`,
    method: "post",
    data,
  });
}

//载体拥有人的列表展示
export function login(data) {
  return service2({
    url: `${devUrl}/login`,
    method: "post",
    data,
  });
}

//获取用户列表
export function dataUserTree(params) {
  return service2({
    url: `${devUrl}/common/newUserTree`,
    method: "post",
    params,
  });
}

//根据用户主键查询机构
export function loadOrganByUserId(params) {
  return service2({
    url: `${devUrl}/common/loadOrganByUserId`,
    method: "post",
    params,
  });
}

//机构树
export function organTree(params) {
  return service2({
    url: `${devUrl}/common/organTree`,
    method: "post",
    params,
  });
}

//==============================================
//资料登记

//查询登记
export function pageCreateDraft(data) {
  return service2({
    url: `${devUrl}/media/media/pageCreateDraft`,
    method: "post",
    data,
  });
}

//待审批
export function pageCreateAuditing(data) {
  return service2({
    url: `${devUrl}/media/media/pageCreateAuditing`,
    method: "post",
    data,
  });
}

//已审批
export function pageCreateAudited(data) {
  return service2({
    url: `${devUrl}/media/media/pageCreateAudited`,
    method: "post",
    data,
  });
}

//添加登记
export function saveDraft(data) {
  return service2({
    url: `${devUrl}/media/media/saveDraft`,
    method: "post",
    data,
  });
}

//删除登记
export function deleteByIdStr(params) {
  return service2({
    url: `${devUrl}/media/media/deleteByIdStr`,
    method: "post",
    params,
  });
}

// 登记送审
export function sendAuditMedia(data) {
  return service2({
    url: `${devUrl}/media/media/sendAudit`,
    method: "post",
    arrType: true,
    data,
  });
}

//===================================================
//资料分类

//种类树
export function treeView(params) {
  return service2({
    url: `${devUrl}/dict/category/newTree`,
    method: "post",
    params,
  });
}

//种类删除接口
export function deleteCategory(data) {
  return service2({
    url: `${devUrl}/dict/category/delete`,
    method: "post",
    data,
  });
}

//种类保存接口
export function saveDataKind(data) {
  return service2({
    url: `${devUrl}/dict/category/save`,
    method: "post",
    data,
  });
}

//种类编辑接口
export function loadDataKind(params) {
  return service2({
    url: `${devUrl}/dict/category/load`,
    method: "post",
    params,
  });
}

//分类查询
export function pageDataCategory(data) {
  return service2({
    url: `${devUrl}/dict/category/page`,
    method: "post",
    data,
  });
}

//================================================
//资料借阅

//查询
export function pageApply(data) {
  return service2({
    url: `${devUrl}/borrow/pageApply`,
    method: "post",
    data,
  });
}

//获取借阅申请主键
export function createBorrowId(params) {
  return service2({
    url: `${devUrl}/borrow/createBorrowId`,
    method: "post",
    params,
  });
}

//获取可添加的借阅资料
export function pageSafeMedia(data) {
  return service2({
    url: `${devUrl}/media/media/pageSafeMedia`,
    method: "post",
    data,
  });
}

//查询已借阅的资料列表
export function pageMediaByBorrowId(data) {
  return service2({
    url: `${devUrl}/borrow/pageMediaByBorrowId`,
    method: "post",
    data,
  });
}
// 借阅保存
export function saveDraftBorrow(data) {
  return service2({
    url: `${devUrl}/borrow/saveDraft`,
    method: "post",
    data,
  });
}

// 借阅编辑
export function loadBorrow(params) {
  return service2({
    url: `${devUrl}/borrow/loadBorrow`,
    method: "post",
    params,
  });
}

// 借阅送审
export function sendAuditBorrow(data) {
  return service2({
    url: `${devUrl}/borrow/sendAudit`,
    method: "post",
    data,
  });
}

//添加借阅资料
export function addMediaBorrow(data) {
  return service2({
    url: `${devUrl}/borrow/addMedia`,
    method: "post",
    data,
  });
}

//回收借阅资料
export function removeMediaBorrow(data) {
  return service2({
    url: `${devUrl}/borrow/removeMedia`,
    method: "post",
    data,
  });
}

//删除借阅申请
export function deleteBorrow(params) {
  return service2({
    url: `${devUrl}/borrow/deleteBorrow`,
    method: "post",
    params,
  });
}

//批量借出
export function batchBorrow(params) {
  return service2({
    url: `${devUrl}/borrow/batchBorrow`,
    method: "post",
    params,
  });
}

//批量归还
export function batchRevert(params) {
  return service2({
    url: `${devUrl}/borrow/batchRevert`,
    method: "post",
    params,
  });
}

//============================================

//资料移交

//草稿and待审批
export function pageApplyHander(data) {
  return service2({
    url: `${devUrl}/hander/pageApply`,
    method: "post",
    data,
  });
}

//已审批
export function pageWaitHander(data) {
  return service2({
    url: `${devUrl}/hander/pageWait`,
    method: "post",
    data,
  });
}

//已移交
export function pageAlreadyHander(data) {
  return service2({
    url: `${devUrl}/hander/pageAlready`,
    method: "post",
    data,
  });
}

//待接收
export function pageWaitReceiveHander(data) {
  return service2({
    url: `${devUrl}/hander/pageWaitReceive`,
    method: "post",
    data,
  });
}

//已接收
export function pageAlreadyReceiveHander(data) {
  return service2({
    url: `${devUrl}/hander/pageAlreadyReceive`,
    method: "post",
    data,
  });
}

//获取添加唯一标识
export function createHanderId(params) {
  return service2({
    url: `${devUrl}/hander/createHanderId`,
    method: "post",
    params,
  });
}

//需要移交的载体列表
export function pageByMediaIds(data) {
  return service2({
    url: `${devUrl}/hander/pageByMediaIds`,
    method: "post",
    data,
  });
}

//添加载体
export function addMediaHander(data) {
  return service2({
    url: `${devUrl}/hander/addMedia`,
    method: "post",
    data,
  });
}
//删除载体
export function removeMediaHander(data) {
  return service2({
    url: `${devUrl}/hander/removeMedia`,
    method: "post",
    data,
  });
}
// 移交送审
export function sendAuditHander(data) {
  return service2({
    url: `${devUrl}/hander/sendAudit`,
    method: "post",
    data,
  });
}

// 移交撤回
export function takeBackHander(params) {
  return service2({
    url: `${devUrl}/hander/sendAudit`,
    method: "post",
    params,
  });
}
// 获取办理过程
export function WorkDataAndUser(params) {
  return service2({
    url: `${devUrl}/audit/work/find`,
    method: "post",
    params,
  });
}

export function handerRecallApi(params) {
  return service2({
    url: `${devUrl}/hander/recall`,
    method: "post",
    params,
  });
}

// 移交接收
export function receiveHander(params) {
  return service2({
    url: `${devUrl}/hander/receive`,
    method: "post",
    params,
  });
}

// 移交退回
export function returnBackHander(data) {
  return service2({
    url: `${devUrl}/hander/returnBack`,
    method: "post",
    data,
  });
}

// 移交保存
export function cancelHander(data) {
  return service2({
    url: `${devUrl}/hander/cancel`,
    method: "post",
    data,
  });
}

// 移交编辑
export function loadHander(params) {
  return service2({
    url: `${devUrl}/hander/load`,
    method: "post",
    params,
  });
}

// 移交删除
export function rubbishHander(params) {
  return service2({
    url: `${devUrl}/hander/rubbish`,
    method: "post",
    params,
  });
}

//=======================================

//资料外送

//获取添加唯一标识
export function createTakeout(params) {
  return service2({
    url: `${devUrl}/takeout/takeout/create`,
    method: "post",
    params,
  });
}

//需要外带的载体列表
export function pageTakeout2Media(data) {
  return service2({
    url: `${devUrl}/takeout/takeout2Media/page`,
    method: "post",
    data,
  });
}

//添加载体
export function saveTakeout2Media(data) {
  return service2({
    url: `${devUrl}/takeout/takeout2Media/save`,
    method: "post",
    data,
  });
}
//删除载体
export function deleteTakeout2Media(data) {
  return service2({
    url: `${devUrl}/takeout/takeout2Media/delete`,
    method: "post",
    data,
  });
}

// 外送送审
export function sendAuditTakeout(data) {
  return service2({
    url: `${devUrl}/takeout/takeout/sendAudit`,
    method: "post",
    data,
  });
}

// 外送保存
export function saveCancelTakeout(data) {
  return service2({
    url: `${devUrl}/takeout/takeout/saveCancel`,
    method: "post",
    data,
  });
}

// 外送查询
export function pageTakeout(data) {
  return service2({
    url: `${devUrl}/takeout/takeout/page`,
    method: "post",
    data,
  });
}

// 外送编辑
export function loadTakeout(params) {
  return service2({
    url: `${devUrl}/takeout/load`,
    method: "post",
    data: params,
  });
}

// 外送删除
export function deleteTakeout(params) {
  return service2({
    url: `${devUrl}/takeout/takeout/delete`,
    method: "post",
    params,
  });
}

// 外送撤回
export function recallTakeout(params) {
  return service2({
    url: `${devUrl}/takeout/takeout/recall`,
    method: "post",
    params,
  });
}

// 外送撤回
export function receiptTakeout(params) {
  return service2({
    url: `${devUrl}/takeout/takeout/receipt`,
    method: "post",
    params,
  });
}

//============================================
//资料销毁

//获取添加唯一标识
export function createRecycle(params) {
  return service2({
    url: `${devUrl}/recycle/add`,
    method: "post",
    params,
  });
}

//回收申请列表
export function pageApplyRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/pageApply`,
    method: "post",
    data,
  });
}

//所有待回收列表
export function pageAllWaitRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/pageAllWait`,
    method: "post",
    data,
  });
}

//所有已回收列表
export function pageAllAlreadyRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/pageAllAlready`,
    method: "post",
    data,
  });
}

//需要回收的载体列表
export function pageMediaRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/pageMedia`,
    method: "post",
    data,
  });
}

//添加载体列表
export function addMediaRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/addMedia`,
    method: "post",
    data,
  });
}

//删除载体列表
export function removeMediaRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/removeMedia`,
    method: "post",
    data,
  });
}

// 销毁保存
export function saveDraftRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/saveDraft`,
    method: "post",
    data,
  });
}

// 销毁编辑
export function loadRecycle(params) {
  return service2({
    url: `${devUrl}/recycle/load`,
    method: "post",
    params,
  });
}

// 销毁送审
export function sendAuditRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/sendAudit`,
    method: "post",
    data,
  });
}

// 销毁撤回
export function recallRecycle(params) {
  return service2({
    url: `${devUrl}/recycle/recall`,
    method: "post",
    params,
  });
}

// 资料销毁操作
export function recycleRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/recycle`,
    method: "post",
    data,
  });
}

// 销毁删除
export function rubbishRecycle(params) {
  return service2({
    url: `${devUrl}/recycle/rubbish`,
    method: "post",
    params,
  });
}

//=======================================

//资料台账

//台账列表
export function pageAll(data) {
  return service2({
    url: `${devUrl}/media/media/pageXtsAll`,
    method: "post",
    data,
  });
}

//台账导出
export function downloadAllMedia(data) {
  return service2({
    url: `${devUrl}/media/downloadAll`,
    method: "post",
    download: true,
    responseType: "blob",
    data,
  });
}

//台账流转记录
export function lifeCycle(params) {
  return service2({
    url: `${devUrl}/media/media/lifeCycle`,
    method: "post",
    params,
  });
}

//台账详情
export function loadDetail(params) {
  return service2({
    url: `${devUrl}/media/media/load`,
    method: "post",
    params,
  });
}

//=====================================
//审批流程添加
// 添加审批流程
export function saveFlow(data) {
  return service2({
    url: `${devUrl}/flow/flow/save`,
    method: "post",
    data,
  });
}

//流程更新
export function flowUpdate(data) {
  return service2({
    url: `${devUrl}/flow/flow/update`,
    method: "post",
    data,
  });
}

//流程查询
export function pageFlow(data) {
  return service2({
    url: `${devUrl}/flow/flow/page`,
    method: "post",
    data,
  });
}

//流程删除
export function deleteDataFlow(params) {
  return service2({
    url: `${devUrl}/flow/flow/deleteFlowByIdStr`,
    method: "post",
    params,
  });
}

//======================================
// 审批

//新增资料审批查询
export function pageAudit(data) {
  return service2({
    url: `${devUrl}/audit/work/pageAudit`,
    method: "post",
    data,
  });
}

//资料审批查询
export function pageOtherAudit(data) {
  return service2({
    url: `${devUrl}/audit/work/pageOtherAudit`,
    method: "post",
    data,
  });
}

//消息ss审批同意
export function auditAgree(data) {
  return service2({
    url: `${devUrl}/integration/auditAgree`,
    method: "post",
    data,
  });
}
//
//审批不同意
export function auditDisAgree(data) {
  return service2({
    url: `${devUrl}/integration/auditDisAgree`,
    method: "post",
    data,
  });
}

//消息ss审批同意
export function auditAgreeBatch(data) {
  return service2({
    url: `${devUrl}/integration/auditAgreeBatch`,
    method: "post",
    data,
    arrType: true,
  });
}
//
//审批不同意
export function auditDisAgreeBatch(data) {
  return service2({
    url: `${devUrl}/integration/auditDisAgreeBatch`,
    method: "post",
    data,
    arrType: true,
  });
}

//===========================
//资料消息角标
/**
 * 登记已审批消息角标
 */
//  /media/countAudited
export function countAuditedMedia(data) {
  return service2({
    url: `${devUrl}/media/countAudited`,
    method: "post",
    data,
  });
}
/**
 *标记消息已查看
 */
export function messageLookMedia(params) {
  return service2({
    url: `${devUrl}/media/messageLook`,
    method: "post",
    params,
  });
}
/**
 *
 * 借用角标
 * @param borrowView
 * @return
 */
export function countDataBorrow(data) {
  return service2({
    url: `${devUrl}/borrow/countBorrow`,
    method: "post",
    data,
  });
}

export function messageLookBorrow(params) {
  return service2({
    url: `${devUrl}/borrow/messageLook`,
    method: "post",
    params,
  });
}
//移交
export function countDataHander(data) {
  return service2({
    url: `${devUrl}/hander/countHander`,
    method: "post",
    data,
  });
}

export function messageLookHander(params) {
  return service2({
    url: `${devUrl}/hander/messageLook`,
    method: "post",
    params,
  });
}

//外送
export function countDataTakeout(data) {
  return service2({
    url: `${devUrl}/takeout/countTakeout`,
    method: "post",
    data,
  });
}
export function messageLookTakeout(params) {
  return service2({
    url: `${devUrl}/takeout/messageLook`,
    method: "post",
    params,
  });
}

//销毁
export function countDataRecycle(data) {
  return service2({
    url: `${devUrl}/recycle/countRecycle`,
    method: "post",
    data,
  });
}

export function messageLookRecycle(params) {
  return service2({
    url: `${devUrl}/recycle/messageLook`,
    method: "post",
    params,
  });
}

//资料待审批
export function mediaCount(data) {
  return service2({
    url: `${devUrl}/media/media/mediaCount`,
    method: "post",
    data,
  });
}
export function messageLookAudit(params) {
  return service2({
    url: `${devUrl}/media/media/messageLook`,
    method: "post",
    params,
  });
}
// 资料撤回

export function recallApi(data) {
  return service2({
    url: `${devUrl}/media/media/recall`,
    method: "post",
    params: data,
  });
}
// 设备借用上传
export function muctemplateApi(id) {
  return service2({
    url: `${devUrl}/muc/template?id=${id}`,
    method: "post",
  });
}

// 设备借用下栽
export function mucdownLoadApi(id) {
  return service2({
    url: `${devUrl}/muc/downLoad?id=${id}`,
    method: "post",
    download: true,
    responseType: "blob",
  });
}

// 设备借用上传
export function mucdeleteFileApi(id) {
  return service2({
    url: `${devUrl}/muc/deleteFile?id=${id}`,
    method: "post",
  });
}
// 设备借用上传
export function mucuploadApi(id, type, data) {
  return service2({
    url: `${devUrl}/muc/upload?id=${id}&type=${type}`,
    method: "post",
    data,
    arrType: true,
  });
}
//流程单条
export function mucnodeQuery(flowId) {
  return service2({
    url: `${devUrl}/flow/node/find?flowId=${flowId}`,
    method: "post",
  });
}
//资料登记模板下载
export function registerdownloadMode(data) {
  return service2({
    url: `${devUrl}/media/register/downloadModel`,
    method: "post",
    download: true,
    responseType: "blob",
    params: data,
  });
}

//资料登记上传模板
export function uploadFileMode(data) {
  return service2({
    url: `${devUrl}/media/register/uploadFile`,
    method: "post",
    data,
    arrType: true,
  });
}

// 借用撤回
export function recallBorrow(params) {
  return service2({
    url: `${devUrl}/borrow/recall`,
    method: "post",
    params,
  });
}
//待分发列表
export function pageWaitDistributeApi(data) {
  return service2({
    url: `${devUrl}/distribute/pageWaitDistribute`,
    method: "post",
    data,
  });
}
//已分发列表
export function pageDistributedApi(data) {
  return service2({
    url: `${devUrl}/distribute/pageDistributed`,
    method: "post",
    data,
  });
}

//待接收列表
export function pageReceiveApi(data) {
  return service2({
    url: `${devUrl}/distribute/pageReceive`,
    method: "post",
    data,
  });
}

//已接收列表
export function pageReceivedApi(data) {
  return service2({
    url: `${devUrl}/distribute/pageReceived`,
    method: "post",
    data,
  });
}
//已接收列表
export function savePersionApi(data) {
  return service2({
    url: `${devUrl}/distribute/save`,
    method: "post",
    data,
  });
}

//查询分数据详情
export function distributeDetailApi(data) {
  return service2({
    url: `${devUrl}/distribute/detail`,
    method: "post",
    params: data,
    arrType: true,
  });
}

//确认接收
export function receiveApi(data) {
  return service2({
    url: `${devUrl}/distribute/receive`,
    method: "post",
    data,
    arrType: true,
  });
}


//资料分类树
export function categoryAllTreeApi() {
  return service2({
    url: `${devUrl}/dict/category/categoryAllTree`,
    method: "post",
  });
}

//个人资料查询
export function pagePersonApi(data) {
  return service2({
    url: `${devUrl}/media/media/pagePerson`,
    method: "post",
    data
  });
}

//本部门资料查询
export function pageOrganApi(data) {
  return service2({
    url: `${devUrl}/media/media/pageOrgan`,
    method: "post",
    data
  });
}

//本单位资料查询
export function pageZoneApi(data) {
  return service2({
    url: `${devUrl}/media/media/pageZone`,
    method: "post",
    data
  });
}
