<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
        >
          外送申请
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
            class="badge-item"
            :hidden="auditedNum === 0"
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
            待回执</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 5 ? 'selected' : '']"
          @click="handleActiveTab(5)"
        >
          已回执
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
            <span>外送申请</span>
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
            @click="deleteTakeout"
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
            <span>回执</span>
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

    <LeadalDrawer :visible.sync="applyDrawerVisible">
      <template #content>
        <data-apply-drawer
          :visible.sync="applyDrawerVisible"
          :formLine="formLine"
          :applyId="applyId"
          @saveApply="getData()"
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
        <DataPersonDialog
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
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import DataApplyDrawer from "./DataApplyDrawer.vue";
import DataPersonDialog from "./DataPersonDialog.vue";
import { tableOptions1 } from "./equipmentOption/deliver.options";
import {
  pageTakeout,
  deleteTakeout,
  recallTakeout,
  receiptTakeout,
  messageLookTakeout,
} from "@/api/data";
import { mapState } from "vuex";
export default {
  name: "DataDeliver",
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
      title: "外送",
      drawerTitle: "资料外送",
      mode:'',
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
      formLine: {}, //选中数据
      radio: "", //单选
      pArams: {}, //保存后送审数据
      status: 1, //申请状态
      applyId: "", //申请id
      content: "", //标题输入框
    };
  },
  computed: {
    ...mapState("login", ["loginData", "dataDeliverBadge"]),
    auditedNum() {
      return this.dataDeliverBadge.countAudit;
    },
    receiveNum() {
      return this.dataDeliverBadge.countTakeout;
    },
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

    handleActiveTab(num) {
      this.activeTab = num;
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
          return (this.status = 16);
      }
      console.log(this.status,'status')
    },

    changeRadio(row) {
      this.radio = row.id;
      this.applyId = row.id;
      this.formLine = row;
      this.pArams = row;
    },
    async getData() {
      try {
        this.tableObj.loading = true;
        const params = {
          userId: this.loginData.userId,
          pageSize: this.tableObj.size,
          currentPage: this.tableObj.page,
          type: 0,
          content: this.content,
          status: this.status, //1 草稿 2待审批  2已审批  4  已外送  8已回执
        };
        const res = await pageTakeout(params);
        this.tableObj.tableData = res.data.data.data;
        this.tableObj.total = res.data.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    handleParams(obj) {
      console.log(obj,'handleParams')
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
      this.formLine = {};
      this.radio = "";
      this.applyId = "";
      this.mode='add'
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
      if ([2, 3].includes(this.activeTab)) {
        this.messageLookTakeouty(row.id);
      }
      this.edit();
    },

    //消息标记已读
    async messageLookTakeouty(id) {
      const res = await messageLookTakeout({ id });
      this.$store.dispatch("login/getDataDeliverBadge"); //更新设备外送角标
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

    //接收
    recive() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.$confirm("是否回执该申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            takeoutId: this.applyId,
          };
          const res = await receiptTakeout(params);
          this.$message.success(res.msg);
          this.getData(this.type);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消接收",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
