export const commTableOptions = [
  { type: "selection" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 审批
  ...commTableOptions,
  { value: "applyTypeLabel", label: "审批类型" },
  { value: "reason", label: "标题" },
  { value: "content", label: "申请内容" },
  { value: "applyDeptName", label: "申请部门" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
];

export const tableOptions2 = [
  // 审批
  ...commTableOptions,
  { value: "applyTypeLabel", label: "审批类型" },
  { value: "heading", label: "标题" },
  { value: "code", label: "文件编号" },
  { value: "applyDeptName", label: "申请部门" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
];
