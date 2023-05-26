/*
 * @Author: li-2019220129 3312202467@qq.com
 * @Date: 2023-04-03 10:40:32
 * @LastEditors: li-2019220129 3312202467@qq.com
 * @LastEditTime: 2023-05-26 19:35:38
 * @FilePath: \equi\src\views\equipment\components\equipmentOption\account.options.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

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
  { value: "storagePlace", label: "存放位置" },
  { value: "code", label: "保密编号", sort: true, custom: true },
  { value: "secretLabels", label: "设备密级" },
  { value: "ownerUserName", label: "责任人" },
  { value: "ownerOrganName", label: "所属部门" },
  { value: "statusLabel", label: "设备状态" },
];

export const tableOptions2 = [
  // 移交申请
  ...commTableOptions,
  { value: "classifyLabel", label: "设备类别" },
  { value: "categoryLabel", label: "设备分类" },
  { value: "brand", label: "设备品牌" },
  { value: "model", label: "设备型号" },
  { value: "sn", label: "序列号" },
  { value: "storagePlace", label: "存放位置" },
  { value: "code", label: "保密编号", sort: true, custom: true },
  { value: "secretLabels", label: "设备密级" },
  { value: "ownerUserName", label: "责任人" },
  { value: "ownerOrganName", label: "所属部门" },
  { value: "statusLabel", label: "设备状态" },
];
