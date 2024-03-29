export const commTableOptions = [
  { type: "slot", name: "radio" },
  { type: "selection", name: "checkout" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  // 设备登记
  ...commTableOptions,
  { value: "classifyLabel", label: "设备类别" },
  { value: "categoryLabel", label: "设备分类" },
  { value: "brand", label: "设备品牌" },
  { value: "model", label: "设备型号" },
  { value: "sn", label: "序列号" },
  { value: "secretLabel", label: "设备密级" },
  { value: "secretRoomCode", label: "保密编号" },
  { value: "storagePlace", label: "存放位置" },
  { value: "camp", label: "营区",type: "slot", name: "camp" },
  { value: "ownerOrganName", label: "所属部门" },
];

export const tableOptions2 = [
  // 待审批
  ...commTableOptions,
  { value: "classifyLabel", label: "设备类别" },
  { value: "categoryLabel", label: "设备分类" },
  { value: "brand", label: "设备品牌" },
  { value: "model", label: "设备型号" },
  { value: "sn", label: "序列号" },
  { value: "secretLabel", label: "设备密级" },
  { value: "secretRoomCode", label: "保密编号" },
  { value: "storagePlace", label: "存放位置" },
  { value: "camp", label: "营区",type: "slot", name: "camp" },
  { value: "ownerOrganName", label: "所属部门" },
];

export const tableOptions3 = [
  // 已审批
  ...commTableOptions,
  { value: "classifyLabel", label: "设备类别" },
  { value: "categoryLabel", label: "设备分类" },
  { value: "brand", label: "设备品牌" },
  { value: "model", label: "设备型号" },
  { value: "sn", label: "序列号" },
  { value: "secretLabel", label: "设备密级" },
  { value: "secretRoomCode", label: "保密编号" },
  { value: "storagePlace", label: "存放位置" },
  { value: "camp", label: "营区",type: "slot", name: "camp" },
  { value: "ownerOrganName", label: "所属部门" },
  { value: "auditOk", label: "审批状态" },
];
