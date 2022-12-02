<template>
  <div class="leadal" style="position: relative" :style="{ height: height }">
    <el-table
      :data="data"
      ref="multipleTable"
      class="table-styles"
      :style="'width:' + width"
      :tree-props="treeProps"
      :span-method="arraySpanMethod"
      :stripe="stripe"
      v-bind="$attrs"
      :highlight-current-row="highlightCurrentRow"
      @current-change="highlightCurrentRow ? currentChange : null"
      :row-key="getRowKeys"
      :height="setHeight"
      :max-height="maxHeight"
      :row-class-name="tableRowClassName"
      v-on="$listeners"
      @row-click="rowClick"
      @row-dblclick="rowDblCick"
      @selection-change="handleSelectChange"
    >
      <!-- :header-cell-style="headerCellStyle"
      :row-style="rowStyle" -->rowHeader
      <slot name="prev" />
      <template v-for="(col, index) in tableCloumn">
        <el-table-column
          v-if="col.type === 'index'"
          :key="index"
          type="index"
          :index="indexMethod"
          :label="col.label"
          :align="col.align || 'center'"
          :width="col.width ? col.width : '80'"
          :sortable="Boolean(col.sort) ? true : false"
          :prop="col.value"
        />

        <template v-else-if="col.type === 'selection'">
          <el-table-column
            :key="index"
            type="selection"
            :disabled="true"
            :align="col.align || 'center'"
            :width="col.width"
            :fixed="col.fixed"
            :selectable="selectInit"
            :reserve-selection="true"
          />
        </template>

        <slot v-else-if="col.type === 'slot'" :name="col.name" :data="col" />

        <template v-else>
          <el-table-column
            :key="index"
            :class-name="col.className"
            :value="col.value"
            :label="col.label"
            :min-width="setWidth(col)"
            :width="col.maxWidth || ''"
            :sortable="Boolean(col.sort) ? true : false"
            :fixed="col.fixed"
            :align="col.align || 'center'"
            :render-header="(h, obj) => renderHeader(h, obj, col)"
            show-overflow-tooltip
            :prop="col.value"
          >
            <template
              v-if="col.children !== undefined && col.children.length > 0"
            >
              <my-column
                v-for="(item, index) of col.children"
                :key="index"
                :col="item"
                @cdata="columnClick"
                @openImg="imgsClick"
              />
            </template>

            <template slot-scope="scope">
              <ex-slot
                v-if="col.render"
                :render="col.render"
                :row="scope.row"
                :index="scope.$index"
                :column="col"
              />
              <template v-else>
                <shared-components
                  :scopes="scope"
                  :cols="col"
                  @openImg="imgsClick"
                  @cloumnClick="columnClick"
                  @editIconClick="editIconClick"
                />
              </template>
            </template>
          </el-table-column>
        </template>
      </template>
      <slot name="operate" />
    </el-table>

    <el-pagination
      v-if="isPagination"
      class="pagination"
      :page-sizes="pageSizes"
      :current-page="page"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-image-viewer
      v-if="showViewer"
      class="kyc-image-viewer"
      :on-close="closeViewer"
      :url-list="[curImgUrl]"
    />
  </div>
</template>

<script>
/* eslint-disable */
// 自定义内容的组件
const exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index,
    };
    if (data.props.column) {
      params.column = data.props.column;
    }
    return data.props.render(h, params);
  },
};

import MyColumn from "./components/childTable";
import SharedComponents from "./components/sharedComponents";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { setWidths, renderHeader } from "./tableUtils.js";
import _scrollBarFixedHandle from "./scroll";

export default {
  name: "LbColumn",
  props: {
    // 表格数据
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 表头数据
    rowHeader: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isPagination: {
      // 是否分页
      type: Boolean,
      default: false,
    },
    page: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    width: {
      type: String,
      default: "100%",
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    chosize: {
      type: String,
      default: "small",
    },
    arraySpanMethod: {
      type: Function,
      default: () => {},
    },
    progress: {
      type: Boolean,
      default: false,
    },
    isScrollX: {
      type: Boolean,
      defalut: false,
    },
    height: {
      default: undefined,
    },
    maxHeight: {
      type: [String, Number],
    },
    treeProps: {
      type: Object,
      default: () => {
        return { children: "children", hasChildren: "hasChildren" };
      },
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 30, 40, 50];
      },
    },
  },

  watch: {
    //显示与隐藏表格栏
    rowHeader: {
      immediate: true,
      handler(val) {
        const array = this.$cloneDeep(val);
        this.tableCloumn = array.filter((item) => !item.hidden);
      },
    },
  },
  //解决动态控制表头抖动问题
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs["multipleTable"].doLayout();
    });
  },
  computed: {
    setWidth() {
      return (col) => {
        return setWidths(col);
      };
    },

    setHeight() {
      if (this.height) {
        return this.height;
      }

      return "calc(100vh - 400px)";
    },
  },

  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      tableWidth: "100%",
      showViewer: false,
      curImgUrl: "",
      proTop: 0,
      time: 0,
      timeOut: 0,
      progressNum: 0,
      proFlag: false,
      tableCloumn: [],
      timeStartDiff: 0, // 开始时间
      timeEndDiff: 0, // 结束时间
      selection: [], //选中的表格数据
    };
  },

  methods: {
    scrollBarFixedHandle() {
      _scrollBarFixedHandle(this.$el);
    },

    getRowKeys(row) {
      if (row.deviceRecordId) {
        return row.deviceRecordId;
      } else if (row.modifyid) {
        return row.modifyid;
      }
    },
    promiseTime(flag) {
      new Promise((resolve, reject) => {
        this.progressNum = 100;
        resolve();
      })
        .then(() => {
          setTimeout(() => {
            this.proFlag = flag;
          }, 1000);
        })
        .catch(() => {
          reject(false);
        });
    },

    selectInit(row) {
      if (
        Object.prototype.toString.call(row.selection) === "[object Function]"
      ) {
        // selection为函数则返回函数执行结果
        return row.selection(row);
      }
      if (row.selection !== undefined) {
        if (row.selection) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },

    toggleRowSelection(row, flag = undefined) {
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(row, flag);
      });
    },

    clearSelection() {
      this.$refs.multipleTable.clearSelection();
    },

    indexMethod(index) {
      return index + this.size * (this.page - 1) + 1;
    },

    columnClick(field, row) {
      this.$emit("columnClick", field, row);
    },

    editIconClick(field, row) {
      this.$emit("editIconClick", field, row);
    },

    renderHeader(h, { column }, col) {
      return renderHeader(h, { column }, col);
    },

    closeViewer() {
      this.showViewer = false;
    },

    imgsClick(url) {
      this.showViewer = true;
      this.curImgUrl = url;
    },

    // 单选行切换
    currentChange(val) {
      this.$emit("current-change", val);
    },

    handleSizeChange: function (size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.$emit("page-change", this.pageNum, this.pageSize);
    },
    handleCurrentChange: function (pageNum) {
      this.pageNum = pageNum;
      this.$emit("page-change", this.pageNum, this.pageSize);
    },

    handleSelectChange(selection) {
      this.$emit("update:selection", selection);
    },
    //表格单击
    rowClick(row) {
      const radios = this.rowHeader.filter((item) => item.name === "radio");
      if (radios.length === 0) {
        this.toggleRowSelection(row);
      }
    },

    //表格双击
    rowDblCick(row) {
      setTimeout(() => {
        this.$emit("handleRowDblCick", row);
      });
    },

    //给row附上index值
    tableRowClassName(row, index) {
      row.row.index = row.rowIndex;
    },
  },

  mounted() {
    if (this.isScrollX) {
      this.$refs.multipleTable.handleFixedMousewheel = function () {}; // 观察源码发现，此方法会使得在right-fixed上滚动同时，wrapper也滚动
      // 监听事件
      window.addEventListener("mousemove", this.scrollBarFixedHandle, true);
      window.addEventListener("scroll", this.scrollBarFixedHandle, true);
      window.addEventListener("resize", this.scrollBarFixedHandle);
    }
  },
  destroyed() {
    if (this.isScrollX) {
      // 在组件销毁时取消监听
      window.removeEventListener("mousemove", this.scrollBarFixedHandle, true);
      window.removeEventListener("scroll", this.scrollBarFixedHandle, true);
      window.removeEventListener("resize", this.scrollBarFixedHandle);
    }
  },
  //自定义组件
  components: {
    "ex-slot": exSlot,
    MyColumn,
    ElImageViewer,
    SharedComponents,
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  text-align: right;
  margin-top: 55px;
}

.table-styles {
  margin-top: 10px;
}

.set-progress {
  position: absolute;
  top: 41px;
  left: 0;
  right: 0;
  z-index: 10;
  width: 100%;
}

.lw-pagination {
  margin: 15px 0;
}

.leadal ::v-deep .el-progress-bar__outer {
  background-color: white;
}
.leadal ::v-deep .el-table__body-wrapper {
  z-index: 1;
}

.leadal ::v-deep .el-table th {
  font-family: SourceHanSansCN-Medium;
  font-size: 20px;
  color: #3d464c;
  font-weight: 500;
  height: 50px;
  background: #e7e7e7;
  // padding: 13px 0;
}

.leadal ::v-deep .el-table td.el-table__cell div {
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.leadal ::v-deep .el-table--enable-row-transition .el-table__body td {
  height: 50px;
  font-size: 18px;
}

// .leadal ::v-deep .el-table th,
// .el-table td {
//   height: 50px;
// }

.img-class {
  width: 100px;
  height: 100px;
  cursor: pointer;
}

.leadal ::v-deep .el-table td div {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.leadal ::v-deep .el-table--enable-row-transition .el-table__body td {
  border: none !important;
}

// .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
//     background: #FAFAFA;
//     border: none;
// }

.leadal ::v-deep .el-table .cell {
  // position: relative;
  // box-sizing: border-box;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: normal;
  // word-break: break-all;
  // line-height: 23px;
  // text-overflow: ellipsis;
  // overflow: hidden;
  // white-space: nowrap;
  // padding-left: 10px;
  // padding-right: 10px;
  // > .cust-header {
  //   padding-right: 14px;
  // }
}
::v-deep .el-table .caret-wrapper {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-45%);
}
</style>
