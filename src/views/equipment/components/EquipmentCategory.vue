<template>
  <div class="equipment-container">
    <div class="equipment-left">
      <div class="equipment-header">
        <div class="table-menu-item selected">设备种类</div>
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
        :data="categoryTree"
        default-expand-all
        :props="defaultProps"
        highlight-current
        node-key="id"
        ref="navTree"
        draggable
        :allow-drop="allowDrop"
        @node-click="loadCategory"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <tree-slot
            :showIcon="false"
            :node="node"
            :data="data"
            class="tree-span"
          />
          <div class="tree-operate">
            <img
              src="@/assets/icon/选择设备@2x.png"
              v-if="data.parentId === ''"
              @click="addDeviceKind(data)"
            />
            <img
              src="@/assets/icon/编辑@2x.png"
              @click="editDeviceKind(data)"
            />
            <img
              src="@/assets/icon/icon-delete.png"
              @click="deleteDeviceKind(data)"
            />
          </div>
        </div>
      </el-tree>
    </div>
    <div class="equipment-right">
      <div class="equipment-header">
        <div class="equipment-header-left">
          <div class="table-menu-item selected">设备分类</div>
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
              @click="deleteCategory"
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
          <shift-confirmation
            @closeDialog="closeDialog"
            :deviceKindData="deviceKindData"
            :visible="visible"
            :title="title"
            :kindId="kindId"
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
import ShiftConfirmation from "./ShiftConfirmation.vue";
import {
  getDeviceKindTree,
  loadDeviceKind,
  deleteDeviceKind,
  pageDeviceCategory,
  deleteDeviceCategory,
} from "@/api/equipment";
export default {
  name: "EquipmentCategory",
  components: {
    LeadalTable,
    TreeSlot,
    LeadalDialog,
    ShiftConfirmation,
  },
  data() {
    return {
      activeTab: 1,
      keyWord: "", //输入框
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
      categoryTree: [],
      defaultProps: {
        label: "caption",
        children: "children",
      },
      title: "新增分类",
      visible: false,
      deviceKindData: {
        name: "",
        sequence: 0,
        id: "",
        enabled: true, //是否启用
      }, //编辑设备数据
      kindId: "", //设备种类id
      selectionList: [], //选中数据
      parentId: "",
    };
  },
  created() {
    this.getDeviceKindTree();
  },
  methods: {
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.level === dropNode.data.level) {
        if (draggingNode.data.parentId === dropNode.data.parentId) {
          return type === "prev" || type === "next";
        } else {
          return false;
        }
      } else {
        // 不同级进行处理
        return false;
      }
    },
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    add() {
      this.title = "新增种类";
      this.parentId = null;
      this.visible = true;
    },
    addDeviceKind(data) {
      this.title = "新增种类";
      this.parentId = data.id;
      this.visible = true;
    },

    //获取设备种类树
    async getDeviceKindTree() {
      const res = await getDeviceKindTree({ type: 0 });
      this.categoryTree = res.data;
    },

    //保存关闭弹窗
    closeDialog(visible) {
      this.visible = visible;
      this.getDeviceKindTree();
      const node = {
        id: this.kindId,
      };
      // this.loadCategory(node);
    },

    //编辑设备种类
    editDeviceKind(data) {
      this.title = "编辑种类";
      this.visible = true;
      loadDeviceKind({ kindId: data.id }).then((res) => {
        const { name, sequence, id } = res.data;
        this.deviceKindData = {
          name,
          sequence,
          id,
          enabled: true,
        };
      });
    },

    //删除设备种类
    deleteDeviceKind(data) {
      this.$confirm("此操作将删除该种类及子种类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDeviceKind({ ids: data.id }).then((res) => {
            this.$message.success(res.msg);
            this.getDeviceKindTree();
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
      try {
        this.tableObj.loading = true;
        this.kindId = node.id;
        const params = {
          kindId: this.kindId,
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
        };
        pageDeviceCategory(params).then((res) => {
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
      if (!this.kindId) {
        this.$message.error("请先选择一个种类！");
        return;
      }
      this.title = "新增分类";
      this.visible = true;
    },

    handleSelect(selection) {
      this.selectionList = selection;
    },

    //删除
    deleteCategory() {
      const parmas = this.selectionList.map((item) => item.id).join(",");
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDeviceCategory({ ids: parmas }).then((res) => {
            this.$message.success(res.msg);
            this.$refs["leadalTable"].clearSelection();
            this.loadCategory({ id: this.kindId });
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
  /* display: none;
  color: rgba(16, 127, 201, 0.438);*/
  font-size: 24px;
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
