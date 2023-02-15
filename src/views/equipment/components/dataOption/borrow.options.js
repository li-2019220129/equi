export const commTableOptions = [
  { type: "slot", name: "radio" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 借阅登记 和 审批中
  ...commTableOptions,
  // { value: "borrowCode", label: "编号" },
  { value: "reason", label: "标题" },
  { value: "content", label: "申请事由" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
];

export const tableOptions2 = [
  // 已审批
  ...commTableOptions,
  { value: "reason", label: "标题" },
  { value: "content", label: "申请内容" },
  { value: "applyTime", label: "申请时间" },
  { value: "dealTime", label: "审批时间" },
  { value: "isAudit", label: "审批状态" },
];

export const tableOptions3 = [
  // 待借出
  ...commTableOptions,
  { value: "reason", label: "标题" },
  { value: "content", label: "申请内容" },
  { value: "ownerDeptName", label: "申请部门" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
  { value: "dealTime", label: "审批完成时间" },
];

export const tableOptions4 = [
  // 待归还
  ...commTableOptions,
  { value: "reason", label: "标题" },
  { value: "content", label: "申请内容" },
  { value: "ownerDeptName", label: "申请部门" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
  { value: "borrowStartTime", label: "借出时间" },
];

export const tableOptions5 = [
  // 已归还
  ...commTableOptions,
  { value: "reason", label: "标题" },
  { value: "content", label: "申请内容" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
  { value: "borrowStartTime", label: "借出时间" },
  { value: "borrowEndTime", label: "归还时间" },
];

// export const tableOptions6 = [
//   // 设备借用统计表
//   ...commTableOptions,
//   { value: "applyContent", label: "标题" },
//   { value: "reason", label: "申请事由" },
//   { value: "categoryLabel", label: "设备类型" },
//   { value: "applyUserName", label: "申请人" },
//   { value: "applyTime", label: "申请时间" },
//   { value: "toUserName", label: "审批人" },
//   { value: "borrowTime", label: "借用时间" },
//   { value: "realPlainBeginDate", label: "借出时间" },
//   { value: "realPlainGiveDate", label: "归还时间" },
// ];
