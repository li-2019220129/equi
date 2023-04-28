
export const commTableOptions = [
  { type: "selection" },
  { type: "slot", name: "radio" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 资料登记
  ...commTableOptions,
  { value: "classifyType", label: "资料类别" },
  { value: "heading", label: "资料名称" },
  { value: "code", label: "资料编号" },
  { value: "ownerDeptName", label: "所在机构" },
  { value: "keepUserName", label: "责任人" },
  { value: "secretLevelLabel", label: "资料密级" },
];
