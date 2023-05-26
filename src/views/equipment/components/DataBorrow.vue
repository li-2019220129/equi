<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
        >
          借阅登记
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
            :value="borrowNum"
            :hidden="borrowNum === 0"
            class="badge-item"
          >
            待借出</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 5 ? 'selected' : '']"
          @click="handleActiveTab(5)"
        >
          <el-badge
            :value="revertNum"
            :hidden="revertNum === 0"
            class="badge-item"
          >
            待归还</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 6 ? 'selected' : '']"
          @click="handleActiveTab(6)"
        >
          已归还
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="equipmentBorrow"
          >
            <img src="@/assets/icon/借出@2x.png" />
            <span>资料借阅</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="sendApproval"
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
            @click="deleteBorrow"
          >
            <img src="@/assets/icon/icon-delete.png" />
            <span>删除</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 2"
            @click="recall"
          >
            <img src="@/assets/icon/撤回@2x.png" />
            <span>撤回</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 4"
            @click="borrow"
          >
            <img src="@/assets/icon/借出-确认借出@2x.png" />
            <span>确认借出</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 5"
            @click="back"
          >
            <img src="@/assets/icon/借出-确认借出@2x.png" />
            <span>确认归还</span>
          </div>

          <!-- <div
            class="equipment-button_btn"
            v-if="activeTab === 7"
            @click="back"
          >
            <img src="@/assets/icon/保存并送审@2x.png" />
            <span>导出</span>
          </div> -->
        </div>
      </div>
    </div>
    <el-input
      placeholder="请输入标题"
      v-model="content"
      style="width: 300px; margin: 20px 0 10px 0"
      class="equipment-search"
      @keyup.enter.native="getData()"
    >
      <i
        slot="suffix"
        style="cursor: pointer"
        class="el-input__icon el-icon-search"
        @click="getData"
      ></i>
    </el-input>

    <leadal-table
      :data="tableObj.tableData"
      :row-header="tableObj.tableOptions"
      :isPagination="true"
      :page="tableObj.page"
      :size="tableObj.size"
      :total="tableObj.total"
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

    <LeadalDrawer :visible.sync="borrowDrawer.visible">
      <template #content>
        <data-borrow-drawer
          :applyId="applyId"
          :isDetail="isDetail"
          :drawerTitle="borrowDrawer.title"
          @reloadData="getData"
          @handleParams="handleParams"
          :formLine="formLine"
          :mode="mode"
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
        <data-person-dialog
          :formLine="formLine"
          :sendType="'borrow'"
          @close="handleClose"
          :pArams="pArams"
        />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer";
import DataBorrowDrawer from "./DataBorrowDrawer.vue";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import DataPersonDialog from "./DataPersonDialog.vue";
import {
  tableOptions1,
  tableOptions2,
  tableOptions3,
  tableOptions4,
  tableOptions5,
} from "./dataOption/borrow.options";
import {
  pageApply,
  deleteBorrow,
  batchBorrow,
  batchRevert,
  recallBorrow,
  messageLookBorrow,
} from "@/api/data";
import { mapState } from "vuex";
export default {
  name: "DataBorrow",
  components: {
    LeadalTable,
    LeadalDrawer,
    DataBorrowDrawer,
    LeadalDialog,
    DataPersonDialog,
  },
  props: {
    componentsId: {
      type: String,
      default: "",
    },
  },
  provide() {
    return {
      root: this,
    };
  },
  data() {
    return {
      mode:'',
      title: "借阅",
      drawerTitle: "资料借阅",
      activeTab: 1,
      isDetail:false,
      keyWord: "", //输入框
      tableObj: {
        tableData: [],
        tableOptions: [],
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      borrowDrawer: {
        visible: false,
        title: "",
      },
      visible: false,
      content: null, //输入框查询
      formLine: {},
      radio: "",
      pArams: {},
      btnTitle:null,
      applyId: "", //当前申请id
      status: 1, //查询
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
            this.tableObj.tableOptions = tableOptions1;
            break;
          case 3:
            this.tableObj.tableOptions = tableOptions2;
            break;
          case 4:
            this.tableObj.tableOptions = tableOptions3;
            break;
          case 5:
            this.tableObj.tableOptions = tableOptions4;
            break;
          case 6:
            this.tableObj.tableOptions = tableOptions5;
            break;
        }
      },
    },
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState("login", ["loginData", "dataBorrowBadge"]),
    auditedNum() {
      return this.dataBorrowBadge.countAudit;
    },
    borrowNum() {
      return this.dataBorrowBadge.countBorrowing;
    },
    revertNum() {
      return this.dataBorrowBadge.countReverting;
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
      this.content = null;
      this.formLine = {};
      this.radio=null;
      this.activeTab === 1 ? (this.isDetail = false) : (this.isDetail = true);
      this.switchStatus(num);
      this.getData();
    },

    switchStatus(num) {
      switch (num) {
        case 1:
          return (this.status = 1);
        case 2:
          return (this.status = 2);
        case 3:
          return (this.status = 4);
        case 4:
          return (this.status = 4);
        case 5:
          return (this.status = 8);
        case 6:
          return (this.status = 32);
      }
    },

    async getData() {
      try {
        this.tableObj.loading = true;
        const params = {
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
          userId: this.$store.state.login.loginData.userId,
          status: this.status, //1  申请中  2  待审批  4 已审批（待借出） 8 待归还    32  已归还
          keys: {
            content: this.content, //内容
          },
        };
        const res = await pageApply(params);
        this.tableObj.tableData = res.data.data;
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
        this.btnTitle = "借用申请";
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    changeRadio(row) {
      this.radio = row.id;
      this.applyId = row.id;
      this.formLine = row;
      this.pArams = row;
    },

    //表格双击
    handleRowDblCick(row) {
      this.formLine = row;
      this.applyId = row.id;
      if ([3, 4, 5].includes(this.activeTab)) {
        this.messageLookBorrow(row.id);
      }
      if (this.activeTab === 1) {
        this.btnTitle = "借用申请";
      } else if (this.activeTab === 4) {
        this.btnTitle = "确认借出";
      }else if(this.activeTab===5){
        this.btnTitle = '待归还'
      }else if(this.activeTab===6){
        this.btnTitle = '已归还'
      }
       else {
        this.btnTitle = "";
      }
      this.edit();
    },
    //消息标记已读
    async messageLookBorrow(id) {
      const res = await messageLookBorrow({ id });
      this.$store.dispatch("login/getDataBorrowBadge"); //获取资料借用角标
    },

    handleClose() {
      this.visible = false;
      this.getData();
    },

    handleParams(obj) {
      this.pArams = obj;
      this.borrowDrawer.visible = false;
      this.visible = true;
    },

    //借阅
    equipmentBorrow() {
      this.formLine = {};
      this.radio = "";
      this.applyId = "";
      this.mode = 'add'
      this.borrowDrawer = {
        title: "资料借阅",
        visible: true,
      };
    },
    //送审
    sendApproval() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.visible = true;
    },
    //编辑
    edit() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.mode= ''
      this.borrowDrawer = {
        title: "资料借阅",
        visible: true,
      };
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
          const res = await recallBorrow(params);
          this.$message.success(res.msg);
          this.getData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },

    //删除
    deleteBorrow() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.$confirm("此操作将永久删除该申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.applyId,
          };
          const res = await deleteBorrow(params);
          this.$message.success(res.msg);
          this.getData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //借出
    borrow() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.$confirm("是否确认借出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            idStr: this.applyId,
          };
          batchBorrow(params).then((res) => {
            // this.$message.success(res.msg);
            this.$message({
              type:'success',
              duration:1000,
              message:res.msg
            })
            this.getData();
            this.$store.dispatch('login/getDataBorrowBadge')
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //确认归还
    back() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.$confirm("是否确认归还?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            idStr: this.applyId,
          };
          batchRevert(params).then((res) => {
            // this.$message.success(res.msg);
            this.$message({
              type:'success',
              duration:1000,
              message:res.msg
            })
            this.getData();
            this.$store.dispatch('login/getDataBorrowBadge')
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
</style>
