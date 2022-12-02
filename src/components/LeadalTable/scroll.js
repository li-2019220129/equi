export function _scrollBarFixedHandle(el) {
  if (!el) return;
  const tableBodyWrapDom = el.querySelector(".el-table__body-wrapper");
  const tableBodyDom = el.querySelector(".el-table__body");
  let tableBodyFixedDom = null;
  if (el.querySelector(".el-table__fixed")) {
    tableBodyFixedDom = el.querySelector(".el-table__fixed");
  }
  // top为dom上侧距离可视窗口顶部的值
  const { top: tableBodyWrapDomTop } = tableBodyWrapDom.getBoundingClientRect();
  const { bottom: tableBodyDomBottom } = tableBodyDom.getBoundingClientRect();
  if (
    tableBodyWrapDomTop >= window.innerHeight || // 表在视窗下方不可见区域
    (tableBodyDomBottom > 0 && tableBodyDomBottom <= window.innerHeight) || // 视窗内已经可以看到最后一条数据下的滚动条
    tableBodyWrapDom.classList.contains("is-scrolling-none") // 无滚动条
  ) {
    // 不做任何更改
    tableBodyWrapDom.style.height = "unset";
    tableBodyWrapDom.style.marginBottom = "unset";
  } else {
    // 窗口高度 - 列表距顶部值 且 不超过自身实际值
    let wrapHeight = Math.min(
      window.innerHeight - tableBodyWrapDomTop,
      tableBodyDom.offsetHeight
    );
    tableBodyWrapDom.style.height = wrapHeight + "px";

    if (el.querySelector(".el-table__fixed")) {
      tableBodyFixedDom.style.height = wrapHeight + 109 + "px";
    }
    // 需要用marginBottom填充，以保持列表原有高度，避免页面的纵向滚动条变化导致页面滚动的不流畅
    // 可以通过注释这一行代码观察其效果差异
    tableBodyWrapDom.style.marginBottom =
      tableBodyDom.offsetHeight - wrapHeight + "px";
  }
}

export default _scrollBarFixedHandle;
