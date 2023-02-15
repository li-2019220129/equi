<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
          v-has="'xts_modify'"
        >
          移交申请
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handleActiveTab(2)"
          v-has="'xtsM_auditing'"
        >
          审批中
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handleActiveTab(3)"
          v-has="'xtsM_audited'"
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
          v-has="'xts_modifying'"
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
          v-has="'xts_modifyed'"
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
            @click="delModifyId"
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
      v-model="applyContent"
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

    <LeadalDrawer :visible.sync="applyDrawerVisible">
      <template #content>
        <apply-drawer
          :drawerTitle="'设备移交'"
          :visible.sync="applyDrawerVisible"
          :formLine="formLine"
          :applyId="applyId"
          @saveApply="getData(type)"
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
import ApplyDrawer from "./ApplyDrawer.vue";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import PersonDialog from "./PersonDialog.vue";
import {
  tableOptions1,
  tableOptions2,
} from "./equipmentOption/tranfser.options";
import {
  pageDeviceModify,
  pageDeviceWaitModify,
  receiveDeviceModify,
  delModifyId,
  recallModify,
  pageDeviceModifyed,
} from "@/api/equipment";
import { messageLookDeviceModify } from "@/api/common";
import { mapState } from "vuex";
export default {
  name: "EquipmentTransfer",
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
      title: "移交",
      drawerTitle: "设备移交",
      activeTab: 1,
      mode:'',
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
      applyContent: "", //标题输入框
      isDetail: false,
    };
  },
  computed: {
    ...mapState("login", ["loginData", "equipmentTransferBadge"]),
    auditedNum() {
      return this.equipmentTransferBadge.countAudited;
    },
    receiveNum() {
      return this.equipmentTransferBadge.countWaitReceive;
    },
  },
  created() {
    this.getData(this.type);
  },
  watch: {
    activeTab: {
      immediate: true,
      handler(val) {
        val === 3
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
      this.getData(this.type);
    },

    handleActiveTab(num) {
      this.activeTab = num;
      this.formLine = {};
      this.radio=null;
      if (num === 1 || num === 2) {
        this.type = 1;
      } else if (num === 3 || num === 4) {
        this.type = 3;
      } else {
        this.type = 4;
      }
      if(num===3){
        this.active=true
      }
      if(num!==3){
        this.active=false
      }
      this.activeTab === 1 ? (this.isDetail = false) : (this.isDetail = true);
      this.applyContent = "";
      this.getData(this.type);
    },
    changeRadio(row) {
      this.radio = row.id;
      this.applyId = row.id;
      this.formLine = row;
      this.pArams = row;
    },
    getData(type) {
      const params = {
        userId: this.loginData.userId,
        pageSize: this.tableObj.size,
        currentPage: this.tableObj.page,
        type,
        applyContent: this.applyContent,
      };
      if (this.activeTab === 1) params.status = 17;
      if (this.activeTab === 2) params.status = 2;
      if (this.activeTab === 3 || this.activeTab === 4) params.mark = true;
      //待接收
      if (this.activeTab === 4) {
        this.pageDevieMore(pageDeviceWaitModify(params));
      } else if (this.activeTab === 5) {
        this.pageDevieMore(pageDeviceModifyed(params));
      } else {
        this.pageDevieMore(pageDeviceModify(params));
      }
    },

    async pageDevieMore(promise) {
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
      this.visible = false;
      this.getData(this.type);
    },
    //申请
    transferApply() {
      this.formLine = {};
      this.radio = "";
      this.mode= 'add'
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
      const res = await messageLookDeviceModify({ id });
      this.$store.dispatch("login/getTransferBadge"); //获取设备移交角标/
    },

    //编辑
    edit() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.mode= ''
      this.applyDrawerVisible = true;
    },

    //删除
    delModifyId() {
      this.$confirm("此操作将永久删除该申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.applyId,
          };
          const res = await delModifyId(params);
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
          const res = await recallModify(params);
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
      const params = {
        modifyId: this.formLine.modifyId,
      };
      receiveDeviceModify(params).then((res) => {
        // this.$message.success(res.msg);
        this.$message({
          type:'success',
          duration:1000,
          message:res.msg
        })
        this.$store.dispatch("login/getTransferBadge"); //获取设备移交角标/
       
        this.getData(this.type);
        
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
