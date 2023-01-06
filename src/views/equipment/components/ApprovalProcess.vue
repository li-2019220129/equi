<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handlerActive(1)"
        >
          设备审批流程
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handlerActive(2)"
        >
          资料审批流程
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div class="equipment-button_btn" @click="addFlow">
            <img src="@/assets/icon/选择设备@2x.png" />
            <span>新增流程</span>
          </div>
          <div class="equipment-button_btn" @click="deleteFlow">
            <img src="@/assets/icon/icon-delete.png" />
            <span>删除</span>
          </div>
        </div>
      </div>
    </div>
    <div class="equipment-account-search">
      <el-select
        v-model="categoryValue"
        placeholder="请选择应用模块"
        clearable
        style="margin-top: 10px; margin-left: 0px"
        @change="getData"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <leadal-table
      :data="tableObj.tableData"
      :row-header="tableObj.tableOptions"
      :isPagination="true"
      :total="tableObj.total"
      :page="tableObj.page"
      :size="tableObj.size"
      v-loading="tableObj.loading"
      :selection.sync="selection"
      @page-change="handleChangePage"
      @handleRowDblCick="handleRowDblCick"
      :height="'calc(75vh - 46px)'"
      ref="leadalTable"
    >
      <template slot="opreate">
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)">流程定义</el-button>
          </template>
        </el-table-column>
      </template>
    </leadal-table>

    <leadal-drawer :visible.sync="visible">
      <template #content>
        <component
          :is="componentId"
          @closeDrawer="closeDrawer"
          :title="title"
          :editForm="editForm"
          :editNodes="editNodes"
          ref="flow"
        ></component>
      </template>
    </leadal-drawer>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer";
import FlowEditor from "./FlowEditor";
import DataFlow from "./DataFlow.vue";
import { page, deleteFlow, nodeQuery } from "@/api/system";
import { pageFlow, deleteDataFlow,mucnodeQuery } from "@/api/data";
export default {
  name: "ToApprove",
  components: {
    LeadalTable,
    LeadalDrawer,
    FlowEditor,
    DataFlow,
  },
  data() {
    return {
      activeTab: 1,
      componentId: "FlowEditor",
      keyWord: "", //输入框
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "selection" },
          { type: "index", label: "序号" },
          { value: "name", label: "流程名称" },
          { value: "secretLabel", label: "密级" },
          { value: "categoryValueLabel", label: "应用模块" },
          { value: "enabled", label: "是否启用" },
          { value: "createdTime", label: "创建时间" },
          { type: "slot", name: "opreate" },
        ],
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      categoryValue: "",
      categoryList1: [
        {
          id: 1,
          label: "设备登记",
        },
        {
          id: 16,
          label: "设备移交",
        },
        {
          id: 32,
          label: "设备销毁",
        },
        {
          id: 64,
          label: "设备借用",
        },
        {
          id: 256,
          label: "设备外送",
        },
      ],
      categoryList2: [
        {
          id: 1,
          label: "资料登记",
        },
        {
          id: 32,
          label: "资料移交",
        },
        {
          id: 4,
          label: "资料外送",
        },
        {
          id: 64,
          label: "资料销毁",
        },
        {
          id: 128,
          label: "资料借阅",
        },
      ],
      categoryList: [
        {
          id: 1,
          label: "设备登记",
        },
        {
          id: 16,
          label: "设备移交",
        },
        {
          id: 32,
          label: "设备销毁",
        },
        {
          id: 64,
          label: "设备借用",
        },
        {
          id: 256,
          label: "设备外送",
        },
      ],
      visible: false,
      selection: [],
      title: "",
      editNodes: [],
      editForm: {},
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

    handlerActive(num) {
      this.activeTab = num;
      if (num === 1) {
        this.componentId = "FlowEditor";
        this.categoryList = this.categoryList1;
        this.getData();
      } else {
        this.componentId = "DataFlow";
        this.categoryList = this.categoryList2;
        this.getOtherData();
      }
    },

    getData() {
      try {
        this.tableObj.loading = true;

        const parmas = {
          categoryValue: this.categoryValue,
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
        };
        page(parmas).then((res) => {
          this.tableObj.tableData = res.data.data.map((item) => {
            item.categoryValueLabel = this.switchCategoryValue(
              item.categoryValue
            );
            item.enabled = item.enable ? "是" : "否";
            return item;
          });
          this.tableObj.total = res.data.total;
          this.tableObj.loading = false;
        });
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    switchCategoryValue(num) {
      switch (num) {
        case 1:
          return "设备登记";
        case 64:
          return "设备借用";
        case 16:
          return "设备移交";
        case 256:
          return "设备外送";
        case 32:
          return "设备销毁";
      }
    },

    getOtherData() {
      try {
        this.tableObj.loading = true;

        const parmas = {
          categoryValue: this.categoryValue,
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
        };
        pageFlow(parmas).then((res) => {
          this.tableObj.tableData = res.data.data.map((item) => {
            item.categoryValueLabel = this.switchDataCategoryValue(
              item.categoryValue
            );
            item.enabled = item.enable ? "是" : "否";
            return item;
          });
          this.tableObj.total = res.data.total;
          this.tableObj.loading = false;
        });
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    switchDataCategoryValue(num) {
      switch (num) {
        case 1:
          return "资料登记";
        case 32:
          return "资料移交";
        case 4:
          return "资料外送";
        case 64:
          return "资料销毁";
        case 128:
          return "资料借阅";
      }
    },

    //新增
    addFlow() {
      this.title = "新增";
      this.visible = true;
      this.editForm = {};
      this.editNodes = [];
    },

    //编辑
    handleDetail(row) {
      this.title = "编辑";
      this.visible = true;
      this.editForm = row;
      let fn =(this.activeTab ==1?nodeQuery:mucnodeQuery)
      console.log(fn,'343434')
      fn(row.id).then((res) => {
        const { data } = res;

        const array = data.map((r) => {
          const userName = r.participatorList
            .map((item) => item.userName)
            .join(",");
          const userId = r.participatorList
            .map((item) => item.userId)
            .join(",");
          const id = r.participatorList.map((item) => item.userId);
          return {
            userId: userId,
            id: id,
            participatorId: r.participatorId,
            nodeId: r.nodeId,
            name: userName,
            userName: userName,
            title: userName,
            participatorList:r.participatorList,
            key: `${data.length}o${Math.random() % 10009}`,
          };
        });
        this.editNodes = array;
        console.log(this.editNodes,'7777777')
      });
    },

    //删除流程
    deleteFlow() {
      const flowIds = this.selection.map((item) => item.id).join(",");
      this.$confirm("此操作将永久删除流程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const parmas = {
            flowIds,
          };
          this.activeTab === 1
            ? this.deleteDeviceOrData(deleteFlow(parmas))
            : this.deleteDeviceOrData(deleteDataFlow({ flowIdStr: flowIds }));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async deleteDeviceOrData(promise) {
      const res = await promise;
      this.$message.success(res.msg);
      this.activeTab === 1 ? this.getData() : this.getOtherData();
    },
    //关闭
    closeDrawer() {
      this.visible = false;
      if (this.activeTab === 1) {
        this.getData();
      } else {
        this.getOtherData();
      }
      this.$refs.leadalTable.clearSelection(); //清除选中
    },

    handleRowDblCick(row) {
      this.handleDetail(row);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  margin-left: 24px;
}
</style>
