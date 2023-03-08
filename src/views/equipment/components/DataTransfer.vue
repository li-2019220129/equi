<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
        >
          移交申请
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handleActiveTab(2)"
        >
          审批中
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handleActiveTab(3)"
        >
          <el-badge
            :value="auditedNum"
            :hidden="auditedNum === 0"
            class="badge-item"
          >
            已审批</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 4 ? 'selected' : '']"
          @click="handleActiveTab(4)"
        >
          <el-badge
            :value="receiveNum"
            :hidden="receiveNum === 0"
            class="badge-item"
          >
            待接收</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 5 ? 'selected' : '']"
          @click="handleActiveTab(5)"
        >
          已接收
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="transferApply"
          >
            <img src="@/assets/icon/移交申请@2x.png" />
            <span>移交申请</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="send"
          >
            <img src="@/assets/icon/发布排班@2x.png" />
            <span>送审</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="edit"
          >
            <img src="@/assets/icon/编辑@2x.png" />
            <span>编辑</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="rubbishHander"
          >
            <img src="@/assets/icon/icon-delete.png" />
            <span>删除</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 4"
            @click="recive"
          >
            <img src="@/assets/icon/发布排班@2x.png" />
            <span>接收</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 2"
            @click="recall"
          >
            <img src="@/assets/icon/撤回@2x.png" />
            <span>撤回</span>
          </div>
        </div>
      </div>
    </div>

    <el-input
      placeholder="请输入标题关键字"
      v-model="content"
      style="width: 300px; margin: 20px 0 10px 0"
      class="equipment-search"
      @keyup.enter.native="getData"
    >
      <i
        slot="suffix"
        style="cursor: pointer"
        class="el-input__icon el-icon-search"
        @click="getData()"
      ></i>
    </el-input>

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
      :height="'calc(70vh - 25px)'"
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

    <LeadalDrawer :visible.sync="applyDrawerVisible">
      <template #content>
        <data-apply-drawer
          :visible.sync="applyDrawerVisible"
          :formLine="formLine"
          :applyId="applyId"
          :mode="mode"
          @saveApply="getData()"
          @handleParams="handleParams"
        />
      </template>
    </LeadalDrawer>

    <leadal-dialog
      :visible="visible"
      :title="'人员选择'"
      width="1280px"
      class="dialog"
      :footer="false"
      @close="visible = false"
    >
      <template #content>
        <DataPersonDialog
          :formLine="formLine"
          @close="handleClose"
          :pArams="pArams"
          :sendType="'transfer'"
        />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import DataApplyDrawer from "./DataApplyDrawer.vue";
import DataPersonDialog from "./DataPersonDialog.vue";
import { tableOptions1 } from "./dataOption/tranfser.options";
import {
  pageApplyHander,
  pageWaitHander,
  pageAlreadyHander,
  pageWaitReceiveHander,
  pageAlreadyReceiveHander,
  rubbishHander,
  handerRecallApi,
  receiveHander,
  messageLookHander,
} from "@/api/data";
import { mapState } from "vuex";
export default {
  name: "DataTransfer",
  components: {
    LeadalTable,
    LeadalDrawer,
    LeadalDialog,
    DataApplyDrawer,
    DataPersonDialog,
  },
  provide() {
    return {
      root: this,
    };
  },
  data() {
    return {
      title: "移交",
      drawerTitle: "资料移交",
      activeTab: 1,
      isDetail:false,
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
      type: 1, //   1移交申请and审批中    3已审批and待接收   4已接收
      formLine: {}, //选中数据
      radio: "", //单选
      pArams: {}, //保存后送审数据
      isOnly: false,
      status: 1, //审批状态
      applyId: "", //申请id
      content: "", //标题输入框
      mode:''
    };
  },

  created() {
    this.getData();
  },
  computed: {
    ...mapState("login", ["loginData", "dataTransferBadge"]),
    auditedNum() {
      return this.dataTransferBadge.countAudit;
    },
    receiveNum() {
      return this.dataTransferBadge.countReveiving;
    },
  },
  methods: {
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    handleActiveTab(num) {
      this.activeTab = num;
      this.formLine = {};
      this.radio=null;
      this.getData();
      this.activeTab === 1 ? (this.isDetail = false) : (this.isDetail = true);
    },
    changeRadio(row) {
      this.radio = row.id;
      this.applyId = row.id;
      this.formLine = row;
      this.pArams = row;
    },
    getData() {
      const params = {
        userId: this.loginData.userId,
        pageSize: this.tableObj.size,
        currentPage: this.tableObj.page,
        content: this.content,
      };
      if (this.activeTab === 1 || this.activeTab === 2) {
        params.status = 2 * this.activeTab;
        this.getPageData(pageApplyHander(params));
      } else if (this.activeTab === 3) {
        this.getPageData(pageWaitHander(params));
      } else if (this.activeTab === 4) {
        this.getPageData(pageWaitReceiveHander(params));
      } else if (this.activeTab === 5) {
        this.getPageData(pageAlreadyHander(params));
      } else if (this.activeTab === 6) {
        this.getPageData(pageAlreadyReceiveHander(params));
      }
    },

    async getPageData(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data;
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    handleParams(obj) {
      this.pArams = obj;
      this.applyDrawerVisible = false;
      this.visible = true;
    },

    handleClose() {
      this.visible = false;
      this.getData();
    },
    //申请
    transferApply() {
      console.log('90909009098765543')
      this.formLine = {};
      this.radio = "";
      this.applyId = "";
      this.mode = 'add'
      this.applyDrawerVisible = true;
    },

    //送审
    send() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.visible = true;
    },

    handleRowDblCick(row) {
      this.formLine = row;
      this.applyId = row.id;
      if ([3, 4].includes(this.activeTab)) {
        this.messageLookTransfer(row.id);
      }
      this.edit();
    },

    //消息标记已读
    async messageLookTransfer(id) {
      const res = await messageLookHander({ id });
      this.$store.dispatch("login/getDataTransferBadge"); //获取设备移交角标/
    },

    //编辑
    edit() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.mode = ''
      this.applyDrawerVisible = true;
    },

    //删除
    rubbishHander() {
      this.$confirm("此操作将永久删除该申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.applyId,
          };
          const res = await rubbishHander(params);
          // this.$message.success(res.msg);
          this.$message({
            duration:1000,
            type:'success',
            message:res.msg
          })
          this.getData(this.type);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //撤回
    recall() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.$confirm("是否撤回该申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.applyId,
          };
          const res = await handerRecallApi(params);
          // this.$message.success(res.msg);
          this.$message({
            duration:1000,
            type:'success',
            message:res.msg
          })
          this.getData(this.type);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },

    //接收
    recive() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.$confirm("是否接收该申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.applyId,
          };
          const res = await receiveHander(params);
          // this.$message.success(res.msg);
          this.$message({
            duration:1000,
            type:'success',
            message:res.msg
          })
          this.getData(this.type);
           this.$store.dispatch('login/getDataTransferBadge')
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消接收",
          });
        });
    },

    //退回
    // recive() {
    //   if (JSON.stringify(this.formLine) === "{}") {
    //     this.$message.info("请先选中数据");
    //     return;
    //   }
    //   this.$confirm("是否退回该申请?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       const params = {
    //         idStr: this.applyId,
    //       };
    //       const res = await returnBackHander(params);
    //       this.$message.success(res.msg);
    //       this.getData(this.type);
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消退回",
    //       });
    //     });
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>
