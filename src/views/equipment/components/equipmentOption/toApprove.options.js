export const commTableOptions = [
  { type: "selection" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 涉密设备审批
  ...commTableOptions,
  { value: "applyTypes", label: "审批类型" },
  { value: "applyContent", label: "标题" },
  { value: "reason", label: "申请内容" },
  { value: "applyOrganName", label: "申请单位" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
];

export const tableOptions2 = [
  // 新增设备审批
  ...commTableOptions,
  { value: "applyTypes", label: "审批类型" },
  { value: "model", label: "设备型号" },
  { value: "categoryLabel", label: "设备类型" },
  { value: "applyOrganName", label: "申请单位" },
  { value: "applyUserName", label: "申请人" },
  { value: "applyTime", label: "申请时间" },
];
