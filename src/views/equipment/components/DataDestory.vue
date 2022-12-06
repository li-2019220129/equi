<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
        >
          销毁申请
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
            待销毁</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 5 ? 'selected' : '']"
          @click="handleActiveTab(5)"
        >
          已销毁
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="destoryApply"
          >
            <img src="@/assets/icon/外送申请@2x.png" />
            <span>销毁申请</span>
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
            v-if="activeTab === 1 || activeTab === 3"
            @click="edit"
          >
            <img src="@/assets/icon/编辑@2x.png" />
            <span>编辑</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="deleteDestory"
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
            <span>销毁</span>
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
      @keyup.enter.native="getData(status)"
    >
      <i
        slot="suffix"
        style="cursor: pointer"
        class="el-input__icon el-icon-search"
        @click="getData(status)"
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
          @saveApply="getData()"
          :mode="mode"
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
          :sendType="'destory'"
        />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDrawer from "@/components/LeadalDrawer";
import DataApplyDrawer from "./DataApplyDrawer.vue";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import DataPersonDialog from "./DataPersonDialog.vue";
import { tableOptions1, tableOptions2 } from "./dataOption/destory.options";
import {
  pageApplyRecycle,
  pageAllWaitRecycle,
  pageAllAlreadyRecycle,
  recallRecycle,
  recycleRecycle,
  rubbishRecycle,
  messageLookRecycle,
} from "@/api/data";
import { mapState } from "vuex";
export default {
  name: "EquipmentDestory",
  components: {
    LeadalTable,
    LeadalDrawer,
    DataApplyDrawer,
    LeadalDialog,
    DataPersonDialog,
  },
  provide() {
    return {
      root: this,
    };
  },
  data() {
    return {
      title: "销毁",
      mode:null,
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
    activeTab: {
      immediate: true,
      handler(val) {
        val === 3
          ? (this.tableObj.tableOptions = tableOptions2)
          : (this.tableObj.tableOptions = tableOptions1);
      },
    },
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
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    handleActiveTab(num) {
      this.activeTab = num;
      if (num === 1) {
        this.status = 2;
      } else if (num === 2) {
        this.status = 4;
      } else if (num === 3) {
        this.status = 8;
      } else {
        this.status = null;
      }
      this.content = "";
      this.getData();
    },
    changeRadio(row) {
      this.radio = row.id;
      this.applyId = row.id;
      this.formLine = row;
      this.pArams = row;
    },
    getData() {
      const params2 = {
        currentPage: this.tableObj.page,
        pageSize: this.tableObj.size,
        content: this.content,
      };
      if ([1, 2, 3].includes(this.activeTab)) {
        const params1 = {
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
          status: this.status,
          content: this.content,
          currentUserId: this.$store.state.login.loginData.userId,
        };
        this.getDataByType(pageApplyRecycle(params1));
      } else if (this.activeTab === 4) {
        this.getDataByType(pageAllWaitRecycle(params2));
      } else {
        this.getDataByType(pageAllAlreadyRecycle(params2));
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
      this.visible = false;
      this.getData();
    },

    //申请
    destoryApply() {
      this.formLine = {};
      this.radio = "";
      this.applyId = "";
      this.mode= 'add'
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
        this.messageLookDestory(row.id);
      }
      this.edit();
    },

    //消息标记已读
    async messageLookDestory(id) {
      const res = await messageLookRecycle({ id });
      this.$store.dispatch("login/getDataDestoryBadge"); //获取设备销毁角标
    },

    edit() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.mode=''
      this.applyDrawerVisible = true;
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
          const res = await recallRecycle(params);
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

    //销毁
    recive() {
      if (JSON.stringify(this.formLine) === "{}") {
        this.$message.info("请先选中数据");
        return;
      }
      this.$confirm("是否销毁该资料?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.applyId,
          };
          const res = await recycleRecycle(params);
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
    deleteDestory() {
      this.$confirm("是否删除该申请?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.applyId,
          };
          const res = await rubbishRecycle(params);
          this.$message.success(res.msg);
          this.getData(this.status);
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
