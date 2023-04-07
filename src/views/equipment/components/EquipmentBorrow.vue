<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
          v-has="'xts_borrow'"
        >
          借用登记
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handleActiveTab(2)"
          v-has="'xtsB_auditing'"
        >
          审批中
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handleActiveTab(3)"
          v-has="'xtsB_audited'"
        >
          <el-badge
            :value="auditedNum"
            :hidden="auditedNum === 0"
            class="badge-item"
            >已审批</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 4 ? 'selected' : '']"
          @click="handleActiveTab(4)"
          v-has="'xts_borrowing'"
        >
          <el-badge
            :value="borrowNum"
            :hidden="borrowNum === 0"
            class="badge-item"
            >待借出</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 5 ? 'selected' : '']"
          @click="handleActiveTab(5)"
          v-has="'xts_borrowed'"
        >
          <el-badge
            :value="revertNum"
            :hidden="revertNum === 0"
            class="badge-item"
            >待归还</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 6 ? 'selected' : '']"
          @click="handleActiveTab(6)"
          v-has="'xts_reverted'"
        >
          已归还
        </div>
        <div
          :class="['table-menu-item', activeTab === 7 ? 'selected' : '']"
          @click="handleActiveTab(7)"
          v-has="'xts_total'"
        >
          设备借用统计表
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
            <span>设备借用</span>
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
            <span>借出</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 5"
            @click="back"
          >
            <img src="@/assets/icon/借出-确认借出@2x.png" />
            <span>归还</span>
          </div>

          <!-- <div
            class="equipment-button_btn"
            v-if="activeTab === 7"
            @click="back"
          >
            <img src="@/assets/icon/保存并送审@2x.png" />
            <span>导出</span>
          </div>-->
        </div>
      </div>
    </div>

    <el-form
      :model="searchForm"
      inline
      ref="form"
      style="margin-top: 20px; margin-bottom: -10px"
      v-if="activeTab === 7"
    >
      <el-form-item label="标题" prop="brand">
        <el-input
          placeholder="请输入标题"
          v-model="searchForm.applyContent"
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
      </el-form-item>

      <el-form-item label="申请事由" prop="brand">
        <el-input
          placeholder="请输入申请事由"
          v-model="searchForm.reason"
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
      </el-form-item>

      <el-form-item label="申请人" prop="applyUserName">
        <el-input
          placeholder="请输入申请人"
          v-model="searchForm.applyUserName"
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
      </el-form-item>
      <el-form-item label="借用时间" prop="borrowDate">
        <el-date-picker
          v-model="borrowDate"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getData()"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <el-input
      v-else
      placeholder="请输入标题/编号关键字"
      v-model="content"
      style="width: 300px; margin: 20px 0 10px 0"
      class="equipment-search"
      @keyup.enter.native="getData()"
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
      <template #borrowTimeLabel="{ data }">
        <el-table-column
          label="借用时间"
          :prop="data.value"
          header-align="center"
          align="center"
          width="350"
        >
          <template slot-scope="scope">
            <div :class="{ outTime: scope.row.hasOverTime }">
              <span v-if="scope.row.hasOverTime" style="margin-right: 4px"
                >【超期】</span
              >
              {{ scope.row.borrowTimeLabel }}
            </div>
          </template>
        </el-table-column>
      </template>
    </leadal-table>

    <LeadalDrawer :visible.sync="borrowDrawer.visible">
      <template #content>
        <borrow-drawer
          :drawerTitle="borrowDrawer.title"
          :visible.sync="borrowDrawer.visible"
          :formLine="formLine"
          :applyId="applyId"
          @reloadData="getData"
          @handleParams="handleParams"
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
        <PersonDialog
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
import BorrowDrawer from "./BorrowDrawer.vue";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import PersonDialog from "./PersonDialog.vue";
import {
  pageBorrowData,
  pageBorrowWait,
  pageRevertData,
  pageBorrowed,
  pageBorrowDataTotal,
  revert,
  deleteBorrow,
  recallBorrow,
  hasOverTimeApi,
} from "@/api/equipment";
import {
  tableOptions1,
  tableOptions2,
  tableOptions3,
  tableOptions4,
  tableOptions5,
  tableOptions6,
} from "./equipmentOption/borrow.options";
import { messageLookBorrow } from "@/api/common";
import { mapState } from "vuex";
export default {
  name: "EquipmentBorrow",
  components: {
    LeadalTable,
    LeadalDrawer,
    BorrowDrawer,
    LeadalDialog,
    PersonDialog,
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
      title: "借用",
      drawerTitle: "设备借用",
      activeTab: 1,
      isData: false, //是否为资料
      keyWord: "", //输入框
      tableObj: {
        tableData: [],
        tableOptions: [],
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      searchForm: {
        applyContent: "", //标题
        reason: "", //申请事由
        applyUserName: "", // 申请人
      },
      borrowDate: [], //借用时间
      borrowDrawer: {
        visible: false,
        title: "设备借用",
      }, //借用抽屉
      visible: false, //送审对话框
      formLine: {},
      radio: "",
      pArams: {},
      applyId: "", //办理过程id
      content: "", //搜索内容
      mode: "", //是否编辑模式
      btnTitle: "", //申请 、 确认借出、确认归还
      isDetail: false,
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
          case 7:
            this.tableObj.tableOptions = tableOptions6;
            break;
        }
      },
    },
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState("login", ["loginData", "equipmentBorrowBadge"]),
    auditedNum() {
      return this.equipmentBorrowBadge.countAudited;
    },
    borrowNum() {
      return this.equipmentBorrowBadge.countWaitBorrow;
    },
    revertNum() {
      return this.equipmentBorrowBadge.countWaitRevert;
    },
  },
  methods: {
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },
    changeRadio(row) {
      this.radio = row.id;
      this.applyId = row.id;
      this.formLine = row;
      this.pArams = row;
    },

    handleActiveTab(num) {
      this.activeTab = num;
      this.content = "";
      this.formLine = {};
      this.radio = null;
      this.activeTab === 1 ? (this.isDetail = false) : (this.isDetail = true);
      this.getData();
    },

    getData() {
      const params = {
        currentPage: this.tableObj.page,
        pageSize: this.tableObj.size,
        content: this.content,
        userId: this.loginData.userId,
      };
      if (this.activeTab === 1) {
        params.status = 5;
        this.loadData(pageBorrowData(params));
      } else if (this.activeTab === 2) {
        params.status = 2;
        this.loadData(pageBorrowData(params));
      } else if (this.activeTab === 3) {
        params.status = 8;
        this.loadData(pageBorrowData(params));
      } else if (this.activeTab === 4) {
        this.$delete(params, "userId");
        this.loadData(pageBorrowWait(params));
      } else if (this.activeTab === 5) {
        this.$delete(params, "userId");
        this.loadData(pageRevertData(params));
      } else if (this.activeTab === 6) {
        this.$delete(params, "userId");
        this.loadData(pageBorrowed(params));
      } else {
        this.$delete(params, "userId");
        this.$delete(params, "content");
        const totalParams = {
          ...params,
          ...this.searchForm,
        };
        if (this.borrowDate) {
          this.$set(totalParams, "beginTime", this.borrowDate[0]);
          this.$set(totalParams, "endTime", this.borrowDate[1]);
        }
        this.loadData(pageBorrowDataTotal(totalParams));
      }
    },

    async loadData(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data.map((item) => {
          item.isAudit = this.switchIsAudit(item.isAudit);
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
        case 2:
          return "不通过";
        case 1:
          return "通过";
      }
    },
    //借用
    async equipmentBorrow() {
      let formData = new FormData();
      formData.append("userId", this.$store.state.login.loginData.userId);
      const { status, data } = await hasOverTimeApi(formData);
      if (status === 200) {
        if (data) {
          this.$confirm(`您有设备逾期未归还，请归还设备后再发起借用申请`,{
            showCancelButton: false,
          })
            .then((_) => {})
            .catch((_) => {});
          return;
        }
      }
      this.formLine = {};
      this.radio = "";
      this.applyId = "";
      this.mode = "add";
      this.btnTitle = "借用申请";
      this.borrowDrawer.visible = true;
    },

    handleRowDblCick(row) {
      // console.log('awerweraweaewr')
      this.formLine = row;
      this.applyId = row.id;
      if ([3, 4, 5].includes(this.activeTab)) {
        console.log("1212121212");
        this.messageLookBorrow(row.id);
      }
      if (row.status === 1) {
        this.btnTitle = "借用申请";
      } else if (this.activeTab === 4) {
        this.btnTitle = "确认借出";
      } else if (this.activeTab === 5) {
        this.btnTitle = "待归还";
      } else if (this.activeTab === 6) {
        this.btnTitle = "已归还";
      } else {
        this.btnTitle = "";
      }
      this.edit();
    },

    //消息标记已读
    async messageLookBorrow(id) {
      const res = await messageLookBorrow({ id });
      this.$store.dispatch("login/getBorrowBadge"); //获取设备借用角标
    },

    //送审
    sendApproval() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.visible = true;
    },

    handleParams(obj) {
      this.pArams = obj;
      this.borrowDrawer.visible = false;
      this.visible = true;
    },

    handleClose() {
      this.visible = false;
      this.getData();
    },

    //编辑
    edit() {
      console.log("12121212");
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.mode = "edit";
      this.activeTab === 1 ? (this.isDetail = false) : (this.isDetail = true);
      this.borrowDrawer = {
        title: "设备借用",
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
          // this.$message.success(res.msg);
          this.$message({
            type: "success",
            duration: 1000,
            message: res.msg,
          });
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
          // this.$message.success(res.msg);
          this.$message({
            type: "success",
            duration: 1000,
            message: res.msg,
          });
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
      this.btnTitle = "确认借出";
      this.isDetail = true;
      this.borrowDrawer.visible = true;
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
            borrowId: this.applyId,
          };
          revert(params).then((res) => {
            // this.$message.success(res.msg);
            // this.$message.success(res.msg);
            this.$message({
              type: "success",
              message: res.msg,
              duration: 1000,
            });
            this.$store.dispatch("login/getBorrowBadge"); //获取设备借用角标
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消归还",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.outTime {
  color: red;
}
</style>
