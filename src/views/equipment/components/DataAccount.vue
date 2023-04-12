<template>
  <div>
    <div class="equipment-account-header">
      <div class="equipment-account-search">
        <el-form
          :model="searchForm"
          inline
          ref="form"
          style="margin-bottom: -10px"
        >
          <el-form-item prop="content">
            <el-input
              placeholder="请输入文件标题/编号关键字"
              v-model="searchForm.content"
              style="width: 300px"
              class="equipment-search"
              @keyup.enter.native="getData"
            >
              <i
                slot="suffix"
                style="cursor: pointer"
                class="el-input__icon el-icon-search"
                @click="getData"
              ></i>
            </el-input>
          </el-form-item>

          <el-form-item prop="secret">
            <el-select
              v-model="searchForm.secret"
              placeholder="请选择资料密级"
              clearable
              @change="getData"
            >
              <el-option
                v-for="item in secretList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="ownerDeptName">
            <el-select
              v-model="searchForm.ownerDeptName"
              placeholder="请选择所在机构"
              clearable
              @change="getData"
            >
              <el-option style="height: auto" :value="searchForm.ownerDeptName">
                <el-tree
                  :props="defaultProps"
                  node-key="id"
                  ref="treeSearch"
                  class="tree-no-background"
                  lazy
                  :load="loadNode"
                  @node-click="handleNodeClick"
                >
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <tree-slot :node="node" :data="data"></tree-slot>
                  </div>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="searchForm.status"
              placeholder="请选择资料状态"
              clearable
              @change="getData"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="equipment-button_btn" @click="downloadExist">
        <img src="@/assets/icon/保存并送审@2x.png" />
        <span style="font-size: 22px">全部导出</span>
      </div>
    </div>

    <leadal-table
      :data="tableObj.tableData"
      :row-header="tableObj.tableOptions"
      :isPagination="true"
      :total="tableObj.total"
      :page="tableObj.page"
      :size="tableObj.size"
      :selection.sync="selection"
      v-loading="tableObj.loading"
      @page-change="handleChangePage"
      :height="'75vh'"
      ref="leadalTable"
    >
      <template slot="operate">
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </template>
    </leadal-table>

    <leadal-drawer :visible.sync="drawerVisible">
      <template #content>
        <data-account-detail :id="id" />
      </template>
    </leadal-drawer>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer";
import DataAccountDetail from "./DataAccountDetail.vue";
import TreeSlot from "@/components/TreeSlot/index.vue";
import { tableOptions1 } from "./dataOption/account.options";
import { pageAll, downloadAllMedia, organTree } from "@/api/data";
import moment from "moment";
export default {
  name: "DataAccount",
  components: {
    LeadalTable,
    LeadalDrawer,
    TreeSlot,
    DataAccountDetail,
  },
  data() {
    return {
      activeTab: 1,
      selection: [], //选中数据
      tableObj: {
        tableData: [],
        tableOptions: tableOptions1,
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      searchForm: {
        content: "", //标题、编号
        secret: "", //密级
        ownerDeptName: "", //所在机构
        status: "", //状态
      },
      defaultProps: {
        children: "children",
        label: "caption",
      },
      secretList: [
        {
          label: "公开", //中文值
          value: 1, //对应数值值
        },
        {
          label: "内部", //中文值
          value: 2, //对应数值值
        },
        {
          label: "秘密", //中文值
          value: 4, //对应数值值
        },
        {
          label: "机密", //中文值
          value: 8, //对应数值值
        },
        {
          label: "绝密", //中文值
          value: 16, //对应数值值
        },
        {
          label: "核心秘密", //中文值
          value: 32, //对应数值值
        },
      ],
      //设备类别
      equipmentTypeValue: "",
      equipmentTypeList: [
        {
          id: "1",
          label: "设备类别1",
        },
        {
          id: "2",
          label: "设备类别2",
        },
      ],
      //设备状态
      statusList: [
        {
          label: "在用中", //中文值
          value: 1, //对应数值值
        },
        {
          label: "留用中", //中文值
          value: 2, //对应数值值
        },
        {
          label: "已统管", //中文值
          value: 4, //对应数值值
        },
        {
          label: "已归档", //中文值
          value: 8, //对应数值值
        },
        {
          label: "部分回收", //中文值
          value: 16, //对应数值值
        },
        {
          label: "全部回收", //中文值
          value: 32, //对应数值值
        },
        {
          label: "已外送", //中文值
          value: 64, //对应数值值
        },
        {
          label: "已回执", //中文值
          value: 128, //对应数值值
        },
        {
          label: "被借阅", //中文值
          value: 256, //对应数值值
        },
      ],
      drawerVisible: false, //详情
      id: "", //资料id
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    async getData() {
      try {
        this.tableObj.loading = true;
        const params = {
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
          ...this.searchForm,
        };
        const res = await pageAll(params);
        this.tableObj.tableData = res.data.data;
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    async loadNode(node, resolve) {
      const params = {
        id: node.level === 0 ? null : node.data.id,
      };
      const res = await organTree(params);
      resolve(res.data);
    },

    handleNodeClick(node) {
      if (node.ntype === "Organization") {
        this.searchForm.ownerDeptName = node.caption;
        this.getData();
      }
    },

    //导出
    async downloadExist() {
      if (this.selection.length === 0) {
        this.$message.error(`请选择要导出的数据！`);
        return;
      }
      const ids = this.selection.map((item) => item.id).join(",");
      const res = await downloadAllMedia({ ids });
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = objectUrl;
      const time = moment(new Date()).format("YYYY-MM-DD");
      a.download = `资料台账${time}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    //详情
    detail(row) {
      this.id = row.id;
      this.drawerVisible = true;
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
::v-deep .el-icon-arrow-right {
  display: none;
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
  /* display: none; */
  font-size:20px;
}




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
.el-select {
  margin-left: 24px;
}
.equipment-account-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.equipment-search-icon {
  height: 20px;
  width: 20px;
  margin-left: 12px;
  transform: translate(0, 15%);
  cursor: pointer;
}
</style>
