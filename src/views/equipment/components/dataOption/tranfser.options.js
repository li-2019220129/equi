export const commTableOptions = [
  { type: "slot", name: "radio" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 移交申请
  ...commTableOptions,
  { value: "carrierList", label: "标题" },
  { value: "content", label: "申请内容" },
  { value: "applyOrganName", label: "申请部门" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
];

export const tableOptions2 = [
  // 已审批
  ...commTableOptions,
  { value: "carrierList", label: "标题" },
  { value: "content", label: "申请内容" },
  { value: "applyTime", label: "申请时间" },
  { value: "auditTime", label: "审批时间" },
  { value: "isAudit", label: "审批状态" },
];
