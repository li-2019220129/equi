<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
          v-has="'xts_alone'"
        >
          个人设备
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handleActiveTab(2)"
          v-has="'dev_organ'"
        >
          本部门设备
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handleActiveTab(3)"
          v-has="'dev_zone'"
        >
          本单位设备
        </div>
        <img
          :src="setImg"
          class="equipment-search-icon"
          @click="isMore = !isMore"
        />
      </div>

      <div class="equipment-header-right">
        <div class="equipment-button">
          <div class="equipment-button_btn" @click="downloadExist">
            <img src="@/assets/icon/保存并送审@2x.png" />
            <span>导出</span>
          </div>
        </div>
      </div>
    </div>
    <div class="equipment-account-search" v-show="isMore">
      <el-form
        :model="searchForm"
        inline
        ref="form"
        style="margin-top: 20px; margin-bottom: -10px"
      >
        <el-form-item prop="content">
          <el-input
            placeholder="请输入品牌/型号/序列号关键字"
            v-model="searchForm.content"
            style="width: 300px"
            class="equipment-search"
            @keyup.enter.native="moreSearch"
          >
            <i
              slot="suffix"
              style="cursor: pointer"
              class="el-input__icon el-icon-search"
              @click="moreSearch"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="categoryLabel">
          <el-select
            v-model="searchForm.categoryLabel"
            placeholder="请选择设备分类"
            clearable
            ref="el-select"
            @change="moreSearch('categoryId')"
          >
            <el-option style="height: auto" :value="searchForm.categoryLabel">
              <el-tree
                :props="defaultProps"
                :data="treeData"
                node-key="id"
                ref="treeSearch"
                class="tree-no-background"
                @node-click="handleNodeClick"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <tree-slot :node="node" :data="data"></tree-slot>
                </div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="classify">
          <el-select
            v-model="searchForm.classify"
            placeholder="请选择设备类别"
            clearable
            v-if="activeTab === 1"
            @change="moreSearch"
          >
            <el-option
              v-for="item in classifyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="applyType">
          <el-select
            v-model="searchForm.applyType"
            placeholder="请选择设备状态"
            clearable
            v-if="activeTab === 1"
            @change="moreSearch"
          >
            <el-option
              v-for="item in equipmentStatusList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            placeholder="请输入保密室编号关键字"
            v-model="searchForm.code"
            style="width: 300px; margin-left: 20px"
            class="equipment-search"
            v-if="activeTab === 2 || activeTab === 3"
            @keyup.enter.native="moreSearch"
          >
            <i
              slot="suffix"
              style="cursor: pointer"
              class="el-input__icon el-icon-search"
              @click="getData"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>
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
      :height="setHeight"
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
            <el-button
              v-show="scope.row.classify === 8"
              @click="handleUpdateStatus(scope.row)"
              v-has="'zone_audadmin'"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </template>
    </leadal-table>

    <leadal-drawer :visible.sync="visible">
      <template #content>
        <account-detail-drawer :deviceRecordId="deviceRecordId" />
      </template>
    </leadal-drawer>

    <leadal-dialog
      :visible="dialogVisible"
      title="状态修改"
      width="400px"
      class="dialog"
      :footer="true"
      @submit="handleSubmit"
      @close="dialogVisible = false"
    >
      <template #content>
        <span style="font-size: 16px">状态：</span>
        <el-select
          v-model="updateStatus"
          placeholder="请选择要修改的设备状态"
          clearable
          style="width: 300px"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import TreeSlot from "@/components/TreeSlot/index.vue";
import AccountDetailDrawer from "./AccountDetailDrawer.vue";
import {
  tableOptions1,
  tableOptions2,
} from "./equipmentOption/account.options";
import {
  pageMyselfAll,
  pageOrganUse,
  pageZoneUse,
  getDeviceKindTree,
  downloadExist,
  updateStatus,
} from "@/api/equipment";
import moment from "moment";
import { mapState } from "vuex";
export default {
  name: "EquipmentAccount",
  components: {
    LeadalTable,
    TreeSlot,
    LeadalDrawer,
    LeadalDialog,
    AccountDetailDrawer,
  },
  data() {
    return {
      activeTab: 1,
      nodeCount: 0, //树双击收缩
      isMore: false,
      keyWord: "", //输入框
      selection: [], //选中数据
      visible: false, //详情抽屉
      dialogVisible: false, //弹窗
      tableObj: {
        tableData: [],
        tableOptions: [],
        loading: true,
        page: 1,
        size: 10,
        total: 0,
      },
      searchForm: {
        content: "", //关键字搜索
        code: "", //保密室编号
        categoryLabel: "", //设备分类名称
        categoryId: "", //设备分类
        // classifyLabel: "", // 设备类别名称
        classify: "", // 设备类别
        applyType: "", //设备状态
      },
      updateStatus: "", //修改后的状态
      defaultProps: {
        children: "children",
        label: "caption",
      },
      treeData: [], //设备分类树
      //设备类别
      classifyOptions: [
        {
          value: 4,
          label: "个人资产",
        },
        {
          value: 8,
          label: "保密室资产",
        },
      ],
      //设备状态
      equipmentStatusList: [
        {
          id: 1,
          label: "登记中",
        },
        {
          id: 2,
          label: "已入库",
        },
        {
          id: 4,
          label: "已登记",
        },
        {
          id: 16,
          label: "已报废",
        },
        {
          id: 32,
          label: "已销毁",
        },
        {
          id: 64,
          label: "已借用",
        },
        {
          id: 128,
          label: "已维修",
        },
        {
          id: 256,
          label: "已外送",
        },
        {
          id: 512,
          label: "已回执",
        },
      ],
      //设备类别
      statusOptions: [],
      initStatusOptions: [
        {
          value: 4,
          label: "已登记",
        },
        {
          value: 16,
          label: "已报废",
        },
        {
          value: 128,
          label: "已维修",
        },
      ],
      detailObj: {}, //详情
      deviceRecordId: "", //编辑id
      updateParams: {
        applyUserName: "",
        applyUserId: "",
        devId: "",
      },
    };
  },
  watch: {
    activeTab: {
      immediate: true,
      handler(val) {
        switch (val) {
          case 1:
            this.tableObj.tableOptions = tableOptions1;
            break;
          case 2:
            this.tableObj.tableOptions = tableOptions2;
            break;
        }
      },
    },
  },
  computed: {
    ...mapState("login", ["userAuth"]),
    setHeight() {
      return this.isMore ? "calc(75vh - 73px)" : "75vh";
    },
    setImg() {
      return require(`@/assets/icon/${
        this.isMore ? "icon_system_搜索收起@2x" : "icon_system_搜索展开@2x"
      }.png`);
    },
  },
  created() {
    this.setInitActiveTab();
    this.resetForm();
    this.getData();
    this.getDeviceKindTreeData();
  },
  methods: {
    setInitActiveTab() {
      if (this.userAuth.childMenu.includes("xts_alone")) {
        this.activeTab = 1;
      } else if (this.userAuth.childMenu.includes("dev_organ")) {
        this.activeTab = 2;
      } else if (this.userAuth.childMenu.includes("dev_zone")) {
        this.activeTab = 3;
      }
    },

    resetForm() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        this.$refs['leadalTable'].clearSelection()
      });
    },

    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    handleActiveTab(num) {
      if(this.activeTab===num){
        return
      }
      this.selection = []
      console.log(this.selection)
      this.activeTab = num;
      this.resetForm();
      this.getData();
    },

    //设备分类
    async getDeviceKindTreeData() {
      const res = await getDeviceKindTree({ type: 1 });
      this.treeData = res.data;
    },

    handleNodeClick(node) {
      this.nodeCount++;
      if (this.nodeCount === 2) {
        this.$refs["el-select"].blur();
      }
      this.nodeTimer = setTimeout(() => {
        //300ms内没有第二次点击就把第一次点击的清空
        this.nodeCount = 0;
      }, 300);
      if (node.ntype === "Category") {
        // this.$refs["el-select"].blur();
        this.searchForm.categoryLabel = node.caption;
        this.searchForm.categoryId = node.id;
        this.moreSearch();
      }
    },

    //筛选搜索
    moreSearch(name) {
      if (name) {
        this.$set(this.searchForm, name, "");
      }
      this.getData();
    },

    getData() {
      const params = {
        currentPage: this.tableObj.page,
        pageSize: this.tableObj.size,
        userId: this.$store.state.login.loginData.userId,
        ...this.searchForm,
      };
      if (this.activeTab === 1) {
        this.loadData(pageMyselfAll(params));
      } else if (this.activeTab === 2) {
        this.loadData(pageOrganUse(params));
      } else {
        this.loadData(pageZoneUse(params));
      }
    },

    async loadData(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data.map((item) => {
          item.statusLabel = this.switchStatus(item.status);
          return item;
        });
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    switchStatus(num) {
      switch (num) {
        case 1:
          return "登记中";
        case 2:
          return "已入库";
        case 4:
          return "已登记";
        case 16:
          return "已报废";
        case 32:
          return "已销毁";
        case 64:
          return "已借用";
        case 128:
          return "已维修";
        case 256:
          return "已外送";
        case 512:
          return "已回执";
      }
    },

    //导出
    async downloadExist() {
      if (this.selection.length === 0) {
        this.$message.error(`请选择要导出的数据！`);
        return;
      }
      const ids = this.selection.map((item) => item.id).join(",");
      const res = await downloadExist({ ids });
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = objectUrl;
      const time = moment(new Date()).format("YYYY-MM-DD");
      a.download = `台账${time}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    //详情
    detail(row) {
      this.deviceRecordId = row.id;
      this.visible = true;
    },

    handleUpdateStatus(row) {
      this.updateParams = {
        applyUserName: row.ownerUserName,
        applyUserId: row.ownerUserId,
        devId: row.id,
      };
      this.statusOptions = this.initStatusOptions.filter(
        (item) => item.value !== row.status
      );
      this.dialogVisible = true;
    },

    //修改状态
    async handleSubmit() {
      const params = {
        ...this.updateParams,
        status: this.updateStatus,
      };
      const res = await updateStatus(params);
      this.$message.success(res.msg);
      this.dialogVisible = false;
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  margin-left: 24px;
}
.equipment-search-icon {
  height: 20px;
  width: 20px;
  margin-left: 12px;
  transform: translate(0, 15%);
  cursor: pointer;
}
</style>
