export const commTableOptions = [
  { type: "selection" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 资料台账
  ...commTableOptions,
  { value: "classifyType", label: "资料类别" },
  { value: "heading", label: "资料名称" },
  { value: "code", label: "资料编号" },
  { value: "secretLevelLabel", label: "资料密级" },
  { value: "keepUserName", label: "申请人" },
  { value: "ownerDeptName", label: "所在机构" },
  { value: "statusLabel", label: "资料状态" },

  // { value: "classifyType", label: "资料类别" },
  // { value: "heading", label: "文件标题" },
  // { value: "code", label: "文件编号",sort: true, custom: true },
  // { value: "ownerDeptName", label: "所在机构" },
  // { value: "keepUserName", label: "责任人" },
  // { value: "secretLevelLabel", label: "资料密级" },
  // { value: "statusLabel", label: "资料状态" },
];
