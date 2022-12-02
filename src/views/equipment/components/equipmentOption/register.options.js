export const commTableOptions = [
  { type: "slot", name: "radio" },
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
  { value: "secretRoomCode", label: "保密室编号" },
  { value: "secretLabel", label: "设备密级" },
];

export const tableOptions2 = [
  // 待审批
  ...commTableOptions,
  { value: "categoryLabel", label: "设备分类" },
  { value: "brand", label: "设备品牌" },
  { value: "model", label: "设备型号" },
  { value: "sn", label: "序列号" },
  { value: "secretRoomCode", label: "保密室编号" },
  { value: "storagePlace", label: "存放位置" },
  { value: "secretLabel", label: "设备密级" },
];

export const tableOptions3 = [
  // 已审批
  ...commTableOptions,
  { value: "categoryLabel", label: "设备分类" },
  { value: "brand", label: "设备品牌" },
  { value: "model", label: "设备型号" },
  { value: "sn", label: "序列号" },
  { value: "secretRoomCode", label: "保密室编号" },
  { value: "storagePlace", label: "存放位置" },
  { value: "secretLabel", label: "设备密级" },
  { value: "auditOk", label: "审批状态" },
];
