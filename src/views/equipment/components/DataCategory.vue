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
        :load="loadNode"
        @node-click="loadCategory"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <tree-slot :node="node" :data="data" class="tree-span" />
          <div class="tree-operate">
            <img
              src="@/assets/icon/选择设备@2x.png"
              v-if="data.parentId === ''"
              @click="addDataKind(data)"
            />
            <img src="@/assets/icon/编辑@2x.png" @click="editDataKind(data)" />
            <img
              src="@/assets/icon/icon-delete.png"
              @click="deleteDataKind(data)"
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
      defaultProps: {
        label: "label",
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
      this.visible = true;
    },

    addDataKind(data) {
      this.title = "新增种类";
      this.parentId = data.id;
      this.visible = true;
    },

    //获取资料种类树
    loadNode(node, resolve) {
      //加载用户数据
      if (node.level > 1) return;
      treeView({
        id: node.level === 0 ? null : node.data.id,
      }).then((res) => {
        resolve(res.data);
      });
    },

    //保存关闭弹窗
    closeDialog(visible) {
      this.visible = visible;
      const node = {
        id: this.parentId,
      };
      this.loadNode(node);
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
      this.visible = true;
    },

    handleSelect(selection) {
      this.selectionList = selection;
    },

    //删除
    deleteDataCategory() {
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
