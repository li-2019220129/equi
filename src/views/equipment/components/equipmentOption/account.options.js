export const commTableOptions = [
  { type: "selection" },
  // { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 移交申请
  ...commTableOptions,
  { value: "classifyLabel", label: "设备类别" },
  { value: "categoryLabel", label: "设备分类" },
  { value: "brand", label: "设备品牌" },
  { value: "model", label: "设备型号" },
  { value: "sn", label: "序列号" },
  { value: "ownerUserName", label: "责任人" },
  { value: "ownerOrganName", label: "所属部门" },
  { value: "statusLabel", label: "设备状态" },
];

export const tableOptions2 = [
  // 移交申请
  ...commTableOptions,
  { value: "categoryLabel", label: "设备分类" },
  { value: "brand", label: "设备品牌" },
  { value: "model", label: "设备型号" },
  { value: "sn", label: "序列号" },
  { value: "code", label: "保密室编号" },
  { value: "storagePlace", label: "存放位置" },
  { value: "secretLabel", label: "设备密级" },
  { value: "ownerUserName", label: "责任人" },
  { value: "ownerOrganName", label: "所属部门" },
  { value: "statusLabel", label: "设备状态" },
];
