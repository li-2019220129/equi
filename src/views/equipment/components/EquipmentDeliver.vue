<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 0 ? 'selected' : '']"
          @click="handleActiveTab(0)"
          v-has="'xts_takeout'"
        >
          外送申请
        </div>
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
          v-has="'xtsT_auditing'"
        >
          审批中
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handleActiveTab(2)"
          v-has="'xtsT_audited'"
        >
          <el-badge
            :value="auditedNum"
            class="badge-item"
            :hidden="auditedNum === 0"
          >
            已审批</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handleActiveTab(3)"
          v-has="'xts_huiZhi'"
        >
          <el-badge
            :value="receiveNum"
            :hidden="receiveNum === 0"
            class="badge-item"
          >
            待回执</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 4 ? 'selected' : '']"
          @click="handleActiveTab(4)"
          v-has="'xts_huiZhiEd'"
        >
          已回执
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div
            class="equipment-button_btn"
            v-if="activeTab === 0"
            @click="deliverApply"
          >
            <img src="@/assets/icon/外送申请@2x.png" />
            <span>外送申请</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 0"
            @click="send"
          >
            <img src="@/assets/icon/发布排班@2x.png" />
            <span>送审</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 0"
            @click="edit"
          >
            <img src="@/assets/icon/编辑@2x.png" />
            <span>编辑</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 0"
            @click="deleteTakeout"
          >
            <img src="@/assets/icon/icon-delete.png" />
            <span>删除</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 3"
            @click="recive"
          >
            <img src="@/assets/icon/发布排班@2x.png" />
            <span>回执</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
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
      @keyup.enter.native="getData(type)"
    >
      <i
        slot="suffix"
        style="cursor: pointer"
        class="el-input__icon el-icon-search"
        @click="getData(type)"
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

    <leadal-drawer :visible.sync="applyDrawerVisible">
      <template #content>
        <apply-drawer
          :drawerTitle="'设备外送'"
          :formLine="formLine"
          :applyId="applyId"
          @handleParams="handleParams"
          @saveApply="getData(type)"
        />
      </template>
    </leadal-drawer>

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
          @close="handleClose"
          :pArams="pArams"
          :sendType="'deliver'"
        />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer";
import ApplyDrawer from "./ApplyDrawer.vue";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import PersonDialog from "./PersonDialog.vue";
import {
  tableOptions1,
  tableOptions2,
} from "./equipmentOption/deliver.options";
import {
  pageTakeout,
  deleteTakeout,
  recallTakeout,
  receiveTakeout2Device,
} from "@/api/equipment";
import { messageLookTakeouty } from "@/api/common";
import { mapState } from "vuex";
export default {
  name: "EquipmentDeliver",
  components: {
    LeadalTable,
    LeadalDrawer,
    ApplyDrawer,
    LeadalDialog,
    PersonDialog,
  },
  provide() {
    return {
      root: this,
    };
  },
  data() {
    return {
      title: "外送",
      drawerTitle: "设备外送",
      activeTab: 0,
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
      formLine: {}, //表单
      pArams: {},
      applyId: "", //申请id
      content: "", //标题输入框
      type: 0, //0申请 3待接收  4已接收
      radio: "",
      isDetail: false,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState("login", ["loginData", "equipmentDeliverBadge"]),
    auditedNum() {
      return this.equipmentDeliverBadge.countAudited;
    },
    receiveNum() {
      return this.equipmentDeliverBadge.countWaitReceipt;
    },
  },
  watch: {
    activeTab: {
      immediate: true,
      handler(val) {
        val === 2
          ? (this.tableObj.tableOptions = tableOptions2)
          : (this.tableObj.tableOptions = tableOptions1);
      },
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
      if (num === 1) {
        this.type = 7;
      } else if (num === 2) {
        this.type = 8;
      } else if (num === 3) {
        this.type = 2;
      } else {
        this.type = num;
      }
      this.content = "";
      this.num === 0 ? (this.isDetail = false) : (this.isDetail = true);
      this.getData(this.type);
    },

    async getData() {
      try {
        this.tableObj.loading = true;
        const params = {
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
          type: this.type,
          userId: this.$store.state.login.loginData.userId,
          content: this.content,
        };
        if (this.activeTab === 0) params.status = 65;
        if (this.activeTab === 1) params.status = 97;
        const res = await pageTakeout(params);
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
        case 64:
          return "未通过";
        case 4:
          return "通过";
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
      if ([2, 3].includes(this.activeTab)) {
        this.messageLookTakeouty(row.id);
      }
      this.edit();
    },

    //消息标记已读
    async messageLookTakeouty(id) {
      const res = await messageLookTakeouty({ id });
      this.$store.dispatch("login/getDeliverBadge"); //更新设备外送角标
    },

    handleParams(obj) {
      this.pArams = obj;
      this.applyDrawerVisible = false;
      this.visible = true;
    },

    handleClose() {
      this.visible = false;
      this.getData(this.type);
    },

    //申请
    deliverApply() {
      this.formLine = {};
      this.radio = "";
      this.applyId = "";
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

    //编辑
    edit() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.applyDrawerVisible = true;
    },

    //删除
    deleteTakeout() {
      this.$confirm("此操作将永久删除该申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.applyId,
          };
          const res = await deleteTakeout(params);
          this.$message.success(res.msg);
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
          const res = await recallTakeout(params);
          this.$message.success(res.msg);
          this.getData(this.type);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },

    //回执
    recive() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      const params = {
        takeoutId: this.applyId,
      };
      receiveTakeout2Device(params).then((res) => {
        this.$message.success(res.msg);
        this.$store.dispatch("login/getDeliverBadge"); //获取设备外送角标
        this.getData(this.type);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-badge__content {
  height: 20px;
}
</style>
