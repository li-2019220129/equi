<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
        >
          全部
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handleActiveTab(2)"
        >
          已分发
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handleActiveTab(3)"
        >
          <el-badge
            :value="auditedNum"
            :hidden="auditedNum === 0"
            class="badge-item"
            >待接收</el-badge
          >
        </div>

        <div
          :class="['table-menu-item', activeTab === 4 ? 'selected' : '']"
          @click="handleActiveTab(4)"
        >
          已接收
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="handleDistribution"
          >
            <img src="@/assets/icon/外送申请@2x.png" />
            <span>分发</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 3"
            @click="handleSureReceive"
          >
            <img src="@/assets/icon/外送申请@2x.png" />
            <span>确认接收</span>
          </div>
        </div>
      </div>
    </div>

    <!-- <el-input
      placeholder="请输入标题关键字"
      v-model="content"
      style="width: 300px; margin: 20px 0 10px 0"
      class="equipment-search"
      @keyup.enter.native="getData(status)"
    >
      <i
        slot="suffix"
        style="cursor: pointer"
        class="el-input__icon el-icon-search"
        @click="getData(status)"
      ></i>
    </el-input> -->

    <leadal-table
      :data="tableObj.tableData"
      :row-header="tableObj.tableOptions"
      :isPagination="true"
      :total="tableObj.total"
      :page="tableObj.page"
      :size="tableObj.size"
      :key="keyEl"
      v-loading="tableObj.loading"
      @page-change="handleChangePage"
      @handleRowDblCick="handleRowDblCick"
      :height="'calc(70vh - 25px)'"
      ref="leadalTable"
      :selection.sync="selection"
    >
      <template slot="radio">
        <el-table-column label header-align="center" align="center" width="50">
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
      title="数据详情信息"
      @close="applyDrawerVisible = false"
      :visible="applyDrawerVisible"
    >
      <template #content>
        <DistributionDetail :formLine="formLine" />
      </template>
    </leadal-dialog>

    <leadal-dialog
      :visible="visible"
      :title="'分发'"
      width="1280px"
      class="dialog"
      :footer="false"
      @close="visible = false"
    >
      <template #content>
        <DataPersonCheckDialog @close="handleClose" @handleSave="handleSave" />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer";
import DataApplyDrawer from "./DataApplyDrawer.vue";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import DataPersonCheckDialog from "./DataPersonCheckDialog.vue";
import { tableOptions1 } from "./dataOption/distribution";
import {
  pageWaitDistributeApi,
  pageDistributedApi,
  pageReceiveApi,
  pageReceivedApi,
  savePersionApi,
  receiveApi,
} from "@/api/data";
import { mapState } from "vuex";
import DistributionDetail from "./DistributionDetail.vue";
export default {
  name: "EquipmentDestory",
  components: {
    LeadalTable,
    LeadalDrawer,
    DataApplyDrawer,
    LeadalDialog,
    DistributionDetail,
    DataPersonCheckDialog,
  },
  provide() {
    return {
      root: this,
    };
  },
  data() {
    return {
      keyEl: +new Date().getTime(),
      selection: [],
      isDetail: false,
      title: "销毁",
      mode: null,
      drawerTitle: "资料销毁",
      activeTab: 1,
      keyWord: "", //输入框
      tableObj: {
        tableData: [],
        tableOptions: tableOptions1,
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      applyDrawerVisible: false,
      visible: false,
      status: 2, //状态 2草稿 4 待审批  8已审批
      formLine: {}, //选中数据
      radio: "", //单选
      pArams: {}, //保存后送审数据
      applyId: "", //申请id
      content: "", //标题输入框
    };
  },
  created() {
    this.getData();
  },
  watch: {
    // activeTab: {
    //   immediate: true,
    //   handler(val) {
    //     val === 3
    //       ? (this.tableObj.tableOptions = tableOptions2)
    //       : (this.tableObj.tableOptions = tableOptions1);
    //   },
    // },
  },
  computed: {
    ...mapState("login", ["loginData", "dataDestoryBadge"]),
    auditedNum() {
      return this.dataDestoryBadge.countAudit;
    },
    receiveNum() {
      return this.dataDestoryBadge.countRecycle;
    },
  },
  methods: {
    async handleSureReceive() {
      if (this.selection.length === 0) {
        this.$message({
          type: "warning",
          duration: 1000,
          message: "请选择要接收的数据！",
        });
        return;
      }
      this.$confirm(`是否确认接收？`)
        .then(async (_) => {
          const { status, msg } = await receiveApi({
            mediaIdList: this.selection.map((item) => item.copyMediaId),
            receiveUserId:this.$store.state.login.loginData.userId
          });
          if (status === 200) {
            this.$message({
              type: "success",
              duration: 1000,
              message: msg,
            });
            this.keyEl = +new Date().getTime();
            this.getData()
          }
        })
        .catch((_) => {});
    },
    //分发选择人员后向父组件抛出的事件
    async handleSave(params) {
      const { status, msg } = await savePersionApi({
        mediaIdList: this.selection.map((item) => item.id),
        receiveUserIdList: params.map((item) => item.id),
        distributeUserId: this.$store.state.login.loginData.userId,
      });
      if (status === 200) {
        this.$message({
          type: "success",
          message: msg,
        });
        this.visible = false;
        this.keyEl = +new Date().getTime();
        this.getData();
      }
    },
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    handleActiveTab(num) {
      this.activeTab = num;
      this.formLine = {};
      this.keyEl = +new Date().getTime();
      // if (num === 1) {
      //   this.status = 2;
      // } else if (num === 2) {
      //   this.status = 4;
      // } else if (num === 3) {
      //   this.status = 8;
      // } else {
      //   this.status = null;
      // }
      // this.activeTab === 1 ? (this.isDetail = false) : (this.isDetail = true);
      this.content = "";
      this.getData();
    },
    getData() {
      const params = {
        currentPage: this.tableObj.page,
        pageSize: this.tableObj.size,
        content: this.content,
        ownerDeptName: null,
        currentUserId: this.$store.state.login.loginData.userId,
      };
      if (this.activeTab === 1) {
        this.getDataByType(pageWaitDistributeApi(params));
      } else if (this.activeTab === 2) {
        this.getDataByType(pageDistributedApi(params));
      } else if (this.activeTab === 3) {
        this.getDataByType(pageReceiveApi(params));
      } else {
        this.getDataByType(pageReceivedApi(params));
      }
    },
    async getDataByType(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data.map((item) => {
          item.isAudit = this.switchIsAudit(item.status);
          return item;
        });
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },
    switchIsAudit(num) {
      switch (num) {
        case 16:
          return "未通过";
        case 4:
          return "通过";
      }
    },

    handleParams(obj) {
      this.pArams = obj;
      this.applyDrawerVisible = false;
      this.visible = true;
    },

    handleClose() {
      this.keyEl = +new Date().getTime();
      this.visible = false;
      this.getData();
    },

    //申请
    handleDistribution() {
      if (this.selection.length === 0) {
        this.$message({
          type: "warning",
          duration: 1000,
          message: "请选择要分发的数据！",
        });
        return;
      }
      this.visible = true;
    },

    handleRowDblCick(row) {
      if (this.activeTab === 1 || this.activeTab === 2) return;
      this.formLine = row;
      this.applyDrawerVisible = true;
    },

    //消息标记已读
    async messageLookDestory(id) {
      const res = await messageLookRecycle({ id });
      this.$store.dispatch("login/getDataDestoryBadge"); //获取设备销毁角标
    },
  },
};
</script>

<style lang="scss" scoped></style>
