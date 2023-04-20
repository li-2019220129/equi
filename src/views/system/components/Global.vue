<template>
  <div class="equipment-container">
    <div class="equipment-left">
      <div class="equipment-header">
        <div class="table-menu-item selected">配置类型</div>
      </div>
      <el-tree
        :data="categoryTree"
        default-expand-all
        :props="defaultProps"
        highlight-current
        node-key="id"
        ref="navTree"
        @node-click="loadContent"
        style="margin-top: 20px"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <tree-slot :node="node" :data="data" class="tree-span" />
        </div>
      </el-tree>
    </div>
    <div class="equipment-right">
      <div class="equipment-header">
        <div class="equipment-header-left">
          <div class="table-menu-item selected">配置内容</div>
        </div>
        <div class="equipment-header-right">
          <div class="equipment-button" v-show="kindId">
            <div class="equipment-button_btn" @click="handleAdd">
              <img src="@/assets/icon/选择设备@2x.png" />
              <span>新增</span>
            </div>
            <div class="equipment-button_btn" @click="handleEdit">
              <img src="@/assets/icon/编辑@2x.png" />
              <span>编辑</span>
            </div>
            <div class="equipment-button_btn" @click="handleDelete">
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
        @handleRowDblCick="handleRowDblCick"
        @row-click="changeRadio"
        :height="'75vh'"
        ref="leadalTable"
      >
        <template slot="radio">
          <el-table-column
            label=""
            header-align="center"
            align="center"
            width="50"
          >
            <template slot-scope="scope">
              <el-radio
                :label="scope.row.id"
                v-model="radio"
                @change.stop="changeRadio(scope.row)"
                class="none-radio-label"
                >{{ "" }}</el-radio
              >
            </template>
          </el-table-column>
        </template>
      </leadal-table>

      <leadal-dialog
        :visible="visible"
        :title="title"
        width="50%"
        class="dialog"
        :footer="false"
        @close="visible = false"
      >
        <template #content>
          <global-config
            @closeDialog="closeDialog"
            :kindId="kindId"
            :configId="configId"
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
import GlobalConfig from ".//GlobalConfig";
import {
  findGlobalConfigType,
  loadGlobalConfigType,
  pageGlobalConfigContent,
  saveGlobalConfigContent,
  loadGlobalConfigContent,
  delGlobalConfigContent,
} from "@/api/system";
export default {
  name: "Global",
  components: {
    LeadalTable,
    TreeSlot,
    LeadalDialog,
    GlobalConfig,
  },
  data() {
    return {
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "slot", name: "radio" },
          { type: "index", label: "序号" },
          { value: "name", label: "名称" },
          { value: "sequence", label: "排序" },
          { value: "enable", label: "是否启用" },
        ],
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      categoryTree: [],
      defaultProps: {
        label: "name",
      },
      kindId: "",
      visible: false,
      title: "", //弹窗
      radio: "",
      configId: "", //配置内容单条id
    };
  },
  created() {
    this.findGlobalConfigType();
  },
  methods: {
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.loadContent({ id: this.kindId });
    },
        /**
         * 
         */
    //获取配置类型
    async findGlobalConfigType() {
      const res = await findGlobalConfigType();
      this.categoryTree = res.data;
    },

    //查询配置内容
    loadContent(node) {
      try {
        this.tableObj.loading = true;
        this.kindId = node ? node.id : null;
        const params = {
          parentId: this.kindId,
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
        };
        pageGlobalConfigContent(params).then((res) => {
          this.tableObj.tableData = res.data.data.map((item) => {
            item.enable = item.enabled ? "是" : "否";
            return item;
          });
          this.tableObj.total = res.data.total;
          this.tableObj.loading = false;
        });
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    closeDialog() {
      this.visible = false;
      this.loadContent({ id: this.kindId });
      this.$store.dispatch('login/getEquipmentSecret')
    },

    changeRadio(row) {
      this.radio = row.id;
      this.configId = row.id;
    },
    //添加配置内容
    handleAdd() {
      this.configId = null;
      this.title = "新增配置";
      this.visible = true;
    },
    handleRowDblCick(row) {
      this.configId = row.id;
      this.handleEdit();
    },
    //编辑
    handleEdit() {
      if (!this.configId) {
        return this.$message.error("请选择一条数据");
      }
      this.title = "编辑配置";
      this.visible = true;
    },

    //删除
    handleDelete() {
      if (!this.configId) {
        return this.$message.error("请选择一条数据");
      }
      this.$confirm("是否删除该配置内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delGlobalConfigContent({ id: this.configId }).then((res) => {
            this.$message.success(res.msg);
            this.$refs["leadalTable"].clearSelection();
            this.loadContent({ id: this.kindId });
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
.custom-tree-node{
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
  display: none;
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
  &.treeTriangleSelect{
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
