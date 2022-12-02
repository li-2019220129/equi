<template>
  <div class="equipment-container">
    <div class="equipment-left">
      <div class="equipment-header">
        <div class="table-menu-item selected">组织机构</div>
      </div>
      <el-tree
        :data="categoryTree"
        default-expand-all
        :props="defaultProps"
        highlight-current
        node-key="id"
        ref="navTree"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <tree-slot :node="node" :data="data" class="tree-span" />
        </div>
      </el-tree>
    </div>
    <div class="equipment-right">
      <div class="equipment-header">
        <div class="equipment-header-left">
          <div class="table-menu-item selected">审批单</div>
        </div>
        <div class="equipment-header-right">
          <div class="equipment-button">
            <div class="equipment-button_btn" @click="addCategory">
              <img src="@/assets/icon/选择设备@2x.png" />
              <span>新增</span>
            </div>
            <div class="equipment-button_btn">
              <img src="@/assets/icon/编辑@2x.png" />
              <span>编辑</span>
            </div>
            <div class="equipment-button_btn" @click="deleteCategory">
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
        :height="'75vh'"
        ref="leadalTable"
      ></leadal-table>

      <leadal-drawer :visible.sync="drawerVisible">
        <template #content>
          <new-approval-form />
        </template>
      </leadal-drawer>
    </div>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer/index.vue";
import TreeSlot from "@/components/TreeSlot";
import NewApprovalForm from "./NewApprovalForm.vue";
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
    LeadalDrawer,
    NewApprovalForm,
  },
  data() {
    return {
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "selection" },
          { type: "index", label: "序号" },
          { value: "name", label: "审批单名称" },
          { value: "sequence", label: "排序" },
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
      drawerVisible: false,
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

    //添加设备分类
    addCategory() {
      this.drawerVisible = true;
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
