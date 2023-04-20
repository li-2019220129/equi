/*
 * @Author: li-2019220129 3312202467@qq.com
 * @Date: 2023-04-20 09:35:32
 * @LastEditors: li-2019220129 3312202467@qq.com
 * @LastEditTime: 2023-04-20 16:30:21
 * @FilePath: \equi\src\views\equipment\components\dataOption\distribution.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export const commTableOptions = [
  { type: "selection" },
  { type: "index", label: "序号" },
];

export const tableOptions1 = [
  ...commTableOptions,
  // { value: "classifyType", label: "资料类别" },
  { value: "heading", label: "文件标题" },
  { value: "code", label: "文件编号" },
  { value: "ownerOrganName", label: "所在机构" },
  { value: "ownerUserName", label: "责任人" },
  { value: "secretLevelLabel", label: "资料密级" },
  { value: "statusLabel", label: "资料状态" },
];

