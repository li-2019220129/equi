<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
          v-has="'xts_register'"
        >
          <el-badge
            :value="auditedNum"
            :hidden="auditedNum === 0"
            class="badge-item"
          >
            设备登记
          </el-badge>
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handleActiveTab(2)"
          v-has="'xts_auditing'"
        >
          待审批
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handleActiveTab(3)"
          v-has="'xts_audited'"
        >
          已审批
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div class="equipment-button_btn" v-if="activeTab === 1" @click="add">
            <img src="@/assets/icon/选择设备@2x.png" />
            <span>新增设备</span>
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
            @click="handleEdit"
          >
            <img src="@/assets/icon/编辑@2x.png" />
            <span>编辑</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="deleteRecord"
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
            v-if="activeTab === 1"
            @click="handleDownload"
          >
            <img src="@/assets/icon/撤回@2x.png" />
            <span>下载模板</span>
          </div>
          <div class="equipment-button_btn" v-if="activeTab === 1">
            <el-upload
              style="display: inline-block"
              action="#"
              :show-file-list="false"
              :http-request="() => {}"
              accept=".xlsx"
              :on-change="handleSuccess"
            >
              <img src="@/assets/icon/撤回@2x.png" />
              <span>导入</span>
            </el-upload>
          </div>
        </div>
      </div>
    </div>

    <el-form
      :model="searchForm"
      inline
      ref="form"
      style="margin-top: 20px; margin-bottom: -10px"
    >
      <el-form-item label="设备类别" prop="classify">
        <el-select
          v-model="searchForm.classify"
          placeholder="请选择设备类别"
          clearable
          @change="pagePersonData"
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

      <el-form-item label="设备品牌" prop="brand">
        <el-input
          placeholder="请输入品牌"
          v-model="searchForm.brand"
          class="equipment-search"
          @keyup.enter.native="pagePersonData()"
        >
          <i
            slot="suffix"
            style="cursor: pointer"
            class="el-input__icon el-icon-search"
            @click="pagePersonData"
          ></i>
        </el-input>
      </el-form-item>

      <el-form-item label="序列号" prop="sn">
        <el-input
          placeholder="请输入序列号"
          v-model="searchForm.sn"
          class="equipment-search"
          @keyup.enter.native="pagePersonData()"
        >
          <i
            slot="suffix"
            style="cursor: pointer"
            class="el-input__icon el-icon-search"
            @click="pagePersonData"
          ></i>
        </el-input>
      </el-form-item>

      <el-form-item label="设备密级" prop="secret">
        <el-select
          v-model="searchForm.secret"
          placeholder="请选择设备密级"
          clearable
          @change="pagePersonData"
        >
          <el-option
            v-for="item in secretOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- @row-click="changeRadio" -->

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
      <!-- <template slot="radio">
        <el-table-column
          label=""
          header-align="center"
          align="center"
          width="50"
        >
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.deviceRecordId"
              v-model="radio"
              @change.stop="changeRadio(scope.row)"
              class="none-radio-label"
              >{{ "" }}</el-radio
            >
          </template>
        </el-table-column>
      </template> -->
    </leadal-table>

    <leadal-dialog
      :visible="registerDialog.visible"
      :title="registerDialog.title"
      width="1280px"
      class="dialog"
      :footer="false"
      @close="registerDialog.visible = false"
    >
      <template #content>
        <component
          :is="registerDialog.name"
          :formLine="selectFrom"
          :treeData="treeData"
          @handleParams="handleParams"
          @close="handleClose"
          :selection="selection"
          :pArams="pArams"
          :type="type"
          :key="keys"
          :isDetail="isDetail"
        ></component>
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import PersonDialog from "./PersonDialog.vue";
import AddEquipment from "./AddEquipment.vue";
import AddData from "./AddData.vue";
import {
  tableOptions1,
  tableOptions2,
  tableOptions3,
} from "./equipmentOption/register.options";
import {
  pagePerson,
  getDeviceKindTree,
  deleteRecord,
  recallStockin,
  registerdownloadMode,
} from "@/api/equipment/index.js";
import { uploadLoad } from "@/api/upload";
import axios from "axios";
import { messageLookRegister } from "@/api/common";
import moment from "moment";
export default {
  name: "EquipmentRegister",
  components: {
    LeadalTable,
    LeadalDialog,
    PersonDialog,
    AddEquipment,
    AddData,
  },
  props: {
    componentsId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      keyEl: +new Date().getTime(),
      activeTab: 1,
      isDetail: false, //是否已审批状态编辑
      keyWord: "", //输入框
      treeData: [],
      selection: [],
      tableObj: {
        tableData: [],
        tableOptions: [],
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      pArams: {},
      type: "add",
      //弹窗
      registerDialog: {
        name: "",
        title: "",
        visible: false,
      },
      formLine: {},
      keys: "",
      radio: "",
      searchForm: {
        brand: "", //设备品牌
        sn: "", //序列号
        classify: "", // 设备类别
        secret: "", //设备密级
      },
      //设备分类
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
      //设备密级
      secretOptions: this.$store.state.login.equipmentSecret,
    };
  },
  created() {
    this.pagePersonData();
    this.getDeviceKindTreeData();
  },
  watch: {
    selection(val) {
      console.log(val, "watch");
    },
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
          case 3:
            this.tableObj.tableOptions = tableOptions3;
            break;
        }
      },
    },
  },
  computed: {
    auditedNum() {
      return this.$store.state.login.equipmentRegisterBadge;
    },
    selectFrom() {
      return Object.keys(this.formLine).length
        ? this.formLine
        : this.selection[0];
    },
  },
  methods: {
    // changeRadio(row) {
    //   this.radio = row.deviceRecordId;
    //   this.formLine = row;
    //   this.pArams = row;
    // },

    handleActiveTab(num) {
      this.activeTab = num;
      if (num === 3) {
      }
      this.pagePersonData();
    },

    handleClose() {
      this.keyEl = +new Date().getTime()
      this.selection = []
      this.registerDialog.visible = false;
      this.pagePersonData();
    },

    handleRowDblCick(row) {
      this.formLine = row;
      if (this.activeTab === 3) {
        this.messageLookRegister(row.id);
      }
      if ([2, 3].includes(this.activeTab)) {
        this.isDetail = true;
      }
      this.type = "edit";
      this.registerDialog = {
        name: "AddEquipment",
        title: "编辑设备",
        visible: true,
      };
    },

    //消息标记已读
    async messageLookRegister(id) {
      const res = await messageLookRegister({ id });
      this.$store.dispatch("login/getRegisterBadge"); //获取设备登记角标
    },

    async pagePersonData() {
      try {
        this.tableObj.loading = true;
        console.log(this.$store.state.login.loginData, 8888);
        setTimeout(() => {
          console.log(this.$store.state.login.loginData, 9999);
        }, 1000);
        const params = {
          ...this.searchForm,
          currentPage: this.tableObj.page,
          pageSize: this.tableObj.size,
          stockinUserId: this.$store.state.login.loginData.userId, //入库人主键
          // isAudit: false, //是否审批
        };

        this.activeTab === 2
          ? (params.isAudit = false) // 待审批
          : this.activeTab === 3
          ? ((params.isAudit = true), (this.isAuditEdit = true))
          : ""; // 已审批
        const res = await pagePerson(params);
        this.tableObj.tableData = res.data.data.map((item) => {
          item.auditOk = item.auditOk ? "已通过" : "未通过";
          item.categoryLabel = item.categoryLabel
            ? item.categoryLabel
            : item.kindLabel;
          return item;
        });
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    async getDeviceKindTreeData() {
      const res = await getDeviceKindTree({ type: 1 });
      this.treeData = res.data;
    },

    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.pagePersonData();
    },

    //新增
    add() {
      this.formLine = {};
      this.$refs.leadalTable.clearSelection();
      this.keys = Date.now();
      this.type = "add";
      this.radio = "";
      this.registerDialog = {
        name: "AddEquipment",
        title: "新增设备",
        visible: true,
      };
    },

    handleSendApproval() {
      // this.keys = Date.now();
      this.keyEl = +new Date().getTime();
      this.registerDialog = {
        name: "PersonDialog",
        title: "人员选择",
        visible: true,
      };
    },

    //送审
    sendApproval() {
      // console.log(this.formLine, "line");
      if (!this.selection.length) {
        this.$message.info("请先选中数据");
        return;
      }
      // if (JSON.stringify(this.formLine) === "{}") {
      //   this.$message.info("请先选中数据");
      //   return;
      // }
      this.handleSendApproval();
    },

    handleParams(obj) {
      this.pArams = obj;
      this.registerDialog.visible = false;
      this.handleSendApproval(); // 送审
    },

    handleEdit() {
      this.formLine = {};
      if (this.selection.length !== 1) {
        this.$message.info("请选择一条数据进行编辑！");
        return;
      }
      // if (JSON.stringify(this.formLine) === "{}") {
      //   this.$message.info("请先选中数据");
      //   return;
      // }
      this.type = "edit";
      this.registerDialog = {
        name: "AddEquipment",
        title: "编辑设备",
        visible: true,
      };
    },

    //删除
   deleteRecord() {

      if (!this.selection.length) {
        this.$message.warning("请选择一条数据进行删除!");
        return;
      }
      this.$confirm("此操作将永久删除该申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr: this.selection.map((item) => item.id).join(","),
          };
          const res = await deleteRecord(params);
          this.$message.success(res.msg);
          this.selection = []
          this.keyEl = +new Date().getTime()
          this.pagePersonData();
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
      if (!this.selection.length) {
        this.$message.warning("请选择一条数据进行删除!");
        return;
      }
      // if (JSON.stringify(this.formLine) === "{}") {
      //   this.$message.info("请先选中数据");
      //   return;
      // }
      this.$confirm("是否撤回该审批?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            idStr:  this.selection.map((item) => item.id).join(","),
          };
          const res = await recallStockin(params);
          this.$message.success(res.msg);
          this.selection = []
          this.keyEl = +new Date().getTime()
          this.pagePersonData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },

    //导入
    handleSuccess(file) {
      const formData = new FormData();
      formData.append("uploadFile", file.raw);
      formData.append("userId", this.$store.state.login.loginData.userId);

      const headers = {
        "Content-Type": "multipart/form-data",
      };
      // uploadLoad(formData,headers).then((res)=>{
      //   if (res.data.status === 200) {
      //       this.$message.success("导入成功！");
      //       this.pagePersonData();
      //     } else {
      //       this.$message.error("导入失败！");
      //     }
      // }).catch(err=>{
      //     this.$message.error(err);
      // })
      // "http://32.20.33.23:80/device/api/device/register/uploadSmFile",
      axios
        .post(
          `http://32.20.33.84/dev/api/device/register/uploadSmFile`,
          // `http://151.9.130.157/dev/api/device/register/uploadSmFile`,
          // "https://8dc1-240e-467-f78-ae3-24c1-dd67-ad8c-eaef.jp.ngrok.io/api/device/register/uploadSmFile",
          // "http://32.20.33.23:80/device/api/device/register/uploadSmFile",
          formData,
          headers
        )
        .then((res) => {
          if (res.data.status === 200) {
            this.$message.success("导入成功！");
            this.pagePersonData();
          } else {
            this.$message.error("导入失败！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },

    handleDownload() {
      const params = {
        categoryId: null,
        type: "xlsx",
      };
      registerdownloadMode(params).then((res) => {
        let blob = new Blob([res], {
          type: "application/vnd.ms-excel",
        });
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = objectUrl;
        const time = moment(new Date()).format("YYYY-MM-DD");
        a.download = `设备登记入库模板${time}.xlsx`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
