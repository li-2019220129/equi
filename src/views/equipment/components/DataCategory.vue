<template>
  <div class="equipment-container">
    <div class="equipment-left">
      <div class="equipment-header">
        <div class="table-menu-item selected">资料种类</div>
      </div>
      <div
        class="equipment-button"
        style="margin: 20px 0 20px -50px; justify-content: flex-start"
      >
        <div class="equipment-button_btn" @click="add">
          <img src="@/assets/icon/选择设备@2x.png" />
          <span>添加种类</span>
        </div>
      </div>
      <el-tree
        :props="defaultProps"
        highlight-current
        node-key="id"
        ref="navTree"
        lazy
        :key="keyEl"
        :load="loadNode"
        @node-click="loadCategory"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <tree-slot
            :showIcon="false"
            :node="node"
            :data="data"
            class="tree-span"
          />
          <!-- <span>{{ data }}</span> -->
          <div class="tree-operate">
            <img
              src="@/assets/icon/选择设备@2x.png"
              v-if="data.parentId === ''"
              @click.stop="addDataKind(data)"
            />
            <img src="@/assets/icon/编辑@2x.png" @click.stop="editDataKind(data)" />
            <img
              src="@/assets/icon/icon-delete.png"
              @click.stop="deleteDataKind(data)"
            />
          </div>
        </div>
      </el-tree>
    </div>
    <div class="equipment-right">
      <div class="equipment-header">
        <div class="equipment-header-left">
          <div class="table-menu-item selected">资料分类</div>
        </div>
        <div class="equipment-header-right">
          <div class="equipment-button">
            <div class="equipment-button_btn" @click="addCategory">
              <img src="@/assets/icon/选择设备@2x.png" />
              <span>添加分类</span>
            </div>
            <div
              class="equipment-button_btn"
              v-if="activeTab === 1"
              @click="deleteDataCategory"
            >
              <img src="@/assets/icon/icon-delete.png" />
              <span>删除</span>
            </div>
          </div>
        </div>
      </div>
      <leadal-table
        :data="tableObj.tableData"
        :row-header="tableObj.tableOptions"
        :isPagination="true"
        :total="tableObj.total"
        :page="tableObj.page"
        :size="tableObj.size"
        v-loading="tableObj.loading"
        @page-change="handleChangePage"
        :selection.sync="selectionList"
        :height="'75vh'"
        ref="leadalTable"
      ></leadal-table>

      <leadal-dialog
        :visible="visible"
        :title="title"
        width="50%"
        class="dialog"
        :footer="false"
        @close="visible = false"
      >
        <template #content>
          <data-shift-confirmation
            @closeDialog="closeDialog"
            :deviceKindData="deviceKindData"
            :visible="visible"
            :title="title"
            :parentId="parentId"
          />
        </template>
      </leadal-dialog>
    </div>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import TreeSlot from "@/components/TreeSlot";
import DataShiftConfirmation from "./DataShiftConfirmation.vue";
import {
  treeView,
  deleteCategory,
  loadDataKind,
  pageDataCategory,
} from "@/api/data";
import { cloneDeep } from "lodash";
export default {
  name: "EquipmentCategory",
  components: {
    LeadalTable,
    TreeSlot,
    LeadalDialog,
    DataShiftConfirmation,
  },
  data() {
    return {
      _node: null,
      _resolve: null,
      activeTab: 1,
      keyWord: "", //输入框
      keyEl: +new Date().getTime(),
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "selection" },
          { type: "index", label: "序号" },
          { value: "name", label: "分类名称" },
          { value: "sequence", label: "排序号" },
          { value: "createdTime", label: "创建时间" },
        ],
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      defaultProps: {
        label: "label",
        children: "children",
        isLeaf: "leaf",
      },
      title: "新增分类",
      visible: false,
      deviceKindData: {
        name: "",
        sequence: 0,
        id: "",
        enabled: true, //是否启用
      }, //编辑设备数据
      parentId: "", //设备种类id
      selectionList: [], //选中数据
    };
  },
  created() {},
  methods: {
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    add() {
      this.title = "新增种类";
      this.parentId = null;
      this.deviceKindData = {
        name: "",
        sequence: 0,
        id: "",
        enabled: true, //是否启用
      };
      this.visible = true;
    },

    addDataKind(data) {
      console.log(data, "我是你大爷");
      this.title = "新增种类";
      this.parentId = data.id;
      this.deviceKindData = {
        name: "",
        sequence: 0,
        id: "",
        enabled: true, //是否启用
      };
      this.visible = true;
    },

    //获取资料种类树
    loadNode(node, resolve) {
      //加载用户数据
      treeView({
        id: node.level === 0 ? null : node.data.id,
      }).then((res) => {
        resolve(
          res.data.map((item) => {
            return { ...item, leaf: !item.hasChild };
          })
        );
      });
    },

    //保存关闭弹窗
    closeDialog(visible, params) {
      params.id = +new Date().getTime();
      if (!this.parentId || this.title === "编辑种类") {
        this.keyEl = +new Date().getTime();
        this.visible = visible;
        return;
      }
      if (this.title === "新增种类") {
        const nodes = this.$refs.navTree.store.nodesMap;
        for (let i in nodes) {
          if (nodes[i].data.id === this.parentId) {
            if (nodes[i].childNodes.length === 0) {
              this.keyEl = +new Date().getTime();
            }
            // let node = cloneDeep(nodes[i].childNodes[0]);
            // node.id =
            //   nodes[i].childNodes[nodes[i].childNodes.length - 1].id + 1;
            // node.data = params;
            // node.data.label = params.name;
            // nodes[i].childNodes.push(node);
            // console.log(nodes,node, "我手机哦你妹");
          }
        }
        treeView({
          id: this.parentId,
        }).then((res) => {
          const arr = res.data.map((item) => {
            return { ...item, leaf: !item.hasChild };
          });
          console.log(arr, this.parentId, this.$refs.navTree);
          this.$refs.navTree.updateKeyChildren(this.parentId, arr);
        });
      }
      this.visible = visible;
      // this.keyEl = +new Date().getTime();
      // const node = {
      //   id: this.parentId,
      // };
      // this.loadNode(node);
    },

    //编辑设备种类
    editDataKind(data) {
      this.title = "编辑种类";
      this.visible = true;
      loadDataKind({ id: data.id }).then((res) => {
        Object.assign(this.deviceKindData, res.data);
      });
    },

    //删除资料种类
    deleteDataKind(data) {
      this.$confirm("此操作将删除该种类及子种类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCategory({ idStr: data.id }).then((res) => {
            this.$message.success(res.msg);
            // this.keyEl = +new Date().getTime();
            this.$refs.navTree.remove(data);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //查询设备分类
    loadCategory(node) {
      if (!node.parentId) return;
      try {
        this.tableObj.loading = true;
        this.parentId = node.id;
        const params = {
          id: this.parentId,
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
        };
        pageDataCategory(params).then((res) => {
          this.tableObj.tableData = res.data.data;
          this.tableObj.total = res.data.total;
          this.tableObj.loading = false;
        });
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    //添加设备分类
    addCategory() {
      if (!this.parentId) {
        this.$message.error("请先选择一个种类！");
        return;
      }
      this.title = "新增分类";
      this.deviceKindData = {
        name: "",
        sequence: 0,
        id: "",
        enabled: true, //是否启用
      };
      this.visible = true;
    },

    handleSelect(selection) {
      this.selectionList = selection;
    },

    //删除
    deleteDataCategory() {
      if (this.selectionList.length === 0) {
        this.$message({
          type: "warning",
          duration: 2000,
          message: "请选择需要删除的数据！",
        });
        return;
      }
      const parmas = this.selectionList.map((item) => item.id).join(",");
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCategory({ idStr: parmas }).then((res) => {
            this.$message.success(res.msg);
            this.$refs["leadalTable"].clearSelection();
            // this.loadCategory({ id: this.parentId });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
// 树的样式 修改大集合

::v-deep .el-tree-node__content > label.el-checkbox {
  margin-right: -18px;
  margin-left: 20px;
  margin-top: -3px;
}

// 对树的样式进行修改
::v-deep .el-tree-node__content {
  height: 38px;
  // padding-left: 20px !important;
}

.custom-tree-node {
  width: 100%;
  height: 100%;
}

// 树形控件

.leadal-menu-tree .el-tree {
  color: #3b3b3b;
}
.leadal-menu-tree .el-tree-node__label {
  font-size: 20px;
}
.leadal-menu-tree .el-tree-node__content:hover {
  background-color: #dff1ff;
}
.leadal-menu-tree
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #dff1ff;
}

// 树样式

::v-deep .el-tree-node__expand-icon {
  /* display: none; */
  font-size: 24px;
}

// .el-tree-node__content {
//   margin-left: 20px;
// }

.child-triangle {
  transition: all 0.3s;
  margin-left: -20px;
  &.rodge {
    transform: rotate(90deg);
  }
  &.treeTriangle {
    margin: 0 30px !important;
    margin-left: -50px !important;
  }
  &.treeTriangleSelect {
    margin: 0 30px !important;
    margin-left: -40px !important;
  }
}

::v-deep .el-tree-node__loading-icon {
  /* margin-right: 8px; */
  font-size: 14px;
  margin: 0 0 0 3px;
  color: #c0c4cc;
  position: absolute;
  // left: 0;
}
.equipment-container {
  display: flex;
  height: 100vh;
  .equipment-left {
    width: 290px;
    margin-right: 20px;
    background: #fff;
    border: 1px solid #b4b4b4;
    border-radius: 10px;
    padding: 10px;
    height: 96%;
  }
  .equipment-right {
    flex: 1;
    background: #fff;
    border: 1px solid #b4b4b4;
    border-radius: 10px;
    padding: 10px;
    height: 96%;
  }
}
.custom-tree-node {
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  position: relative;
  .tree-operate {
    position: absolute;
    right: 0;
    top: 10px;
  }
  img {
    width: 20px;
    height: 20px;
    margin-left: 5px;
  }
}
</style>
