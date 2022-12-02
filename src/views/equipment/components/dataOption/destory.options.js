export const commTableOptions = [
  { type: "slot", name: "radio" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 销毁申请
  ...commTableOptions,
  { value: "content", label: "标题" },
  { value: "reason", label: "申请内容" },
  { value: "applyOrganName", label: "申请单位" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
];

export const tableOptions2 = [
  // 已审批
  ...commTableOptions,
  { value: "content", label: "标题" },
  { value: "reason", label: "申请内容" },
  { value: "applyTime", label: "申请时间" },
  { value: "dealTime", label: "审批时间" },
  { value: "isAudit", label: "审批状态" },
];
