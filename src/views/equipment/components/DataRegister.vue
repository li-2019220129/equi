<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handleActiveTab(1)"
        >
          资料登记
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handleActiveTab(2)"
        >
          待审批
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handleActiveTab(3)"
        >
          <el-badge
            :value="auditedNum"
            :hidden="auditedNum === 0"
            class="badge-item"
            >已审批</el-badge
          >
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div class="equipment-button_btn" v-if="activeTab === 1" @click="add">
            <img src="@/assets/icon/选择设备@2x.png" />
            <span>新增资料</span>
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
            v-if="activeTab === 1 || activeTab === 3"
            @click="edit"
          >
            <img src="@/assets/icon/编辑@2x.png" />
            <span>编辑</span>
          </div>
          <div
            class="equipment-button_btn"
            v-if="activeTab === 1"
            @click="deleteRegister"
          >
            <img src="@/assets/icon/icon-delete.png" />
            <span>删除</span>
          </div>
          <div
            class="equipment-button_btn"
            @click="recall"
            v-if="activeTab === 2"
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
      <el-form-item label="资料类别" prop="classifyType">
        <el-select
          v-model="searchForm.classifyType"
          placeholder="请选择资料类别"
          clearable
          @change="getData"
        >
          <el-option
            v-for="item in classifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资料名称" prop="heading">
        <el-input
          placeholder="请输入资料名称"
          v-model="searchForm.heading"
          class="equipment-search"
          @keyup.enter.native="getData"
        >
          <i
            slot="suffix"
            style="cursor: pointer"
            class="el-input__icon el-icon-search"
            @click="getData"
          ></i>
        </el-input>
      </el-form-item>

      <el-form-item label="保密编号" prop="code">
        <el-input
          placeholder="请输入保密编号"
          v-model="searchForm.code"
          class="equipment-search"
          @keyup.enter.native="getData"
        >
          <i
            slot="suffix"
            style="cursor: pointer"
            class="el-input__icon el-icon-search"
            @click="getData"
          ></i>
        </el-input>
      </el-form-item>

      <el-form-item label="资料密级" prop="secret">
        <el-select
          v-model="searchForm.secret"
          placeholder="请选择资料密级"
          clearable
          @change="getData"
        >
          <el-option
            v-for="item in secretOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

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
      @row-click="changeRadio"
      :height="'66vh'"
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
              :label="scope.row.id"
              v-model="radio"
              @change.stop="changeRadio(scope.row)"
              class="none-radio-label"
              >{{ "" }}</el-radio
            >
          </template>
        </el-table-column>
      </template>-->
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
          :pArams="pArams"
          :selection="selection"
          :sendType="'register'"
          @handleParams="handleParams"
          @close="handleClose"
          :isDetail="isDetail"
        ></component>
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import DataPersonDialog from "./DataPersonDialog.vue";
import AddEquipment from "./AddEquipment.vue";
import AddData from "./AddData.vue";
import moment from "moment";
import { tableOptions1 } from "./dataOption/register.options";
import {
  pageCreateDraft,
  pageCreateAuditing,
  pageCreateAudited,
  deleteByIdStr,
  messageLookMedia,
  recallApi,
  uploadFileMode,
  registerdownloadMode,
} from "@/api/data";
export default {
  name: "EquipmentRegister",
  components: {
    LeadalTable,
    LeadalDialog,
    DataPersonDialog,
    AddEquipment,
    AddData,
  },
  provide() {
    return {
      root: this,
    };
  },
  data() {
    return {
      isDetail: false, //是否已审批状态编辑
      activeTab: 1,
      keyEl: +new Date().getTime(),
      selection: [],
      keyWord: "", //输入框
      tableObj: {
        tableData: [],
        tableOptions: tableOptions1,
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      registerDialog: {
        name: "",
        title: "",
        visible: false,
      }, //弹窗
      radio: "", //单选框
      heading: "", //标题
      formLine: {},
      pArams: {},
      searchForm: {
        classifyType: "", //类别
        heading: "", //标题
        code: "", //编号
        secret: "", //密级
      },
      classifyOptions: [
        {
          value: 1,
          label: "个人资产",
        },
        {
          value: 2,
          label: "保密室资产",
        },
      ],

      secretOptions: [
        {
          value: 1,
          label: "公开",
        },
        {
          value: 2,
          label: "内部",
        },
        {
          value: 4,
          label: "秘密",
        },
        {
          value: 8,
          label: "机密",
        },
        // {
        //   value: 1,
        //   label: "内文"
        // },
        // {
        //   value: 2,
        //   label: "秘密"
        // },
        // {
        //   value: 4,
        //   label: "机密"
        // },
        // {
        //   value: 8,
        //   label: "绝密"
        // },
        // {
        //   value: 16,
        //   label: "核心秘密"
        // }
      ],
    };
  },
  created() {
    this.getData();
  },
  computed: {
    auditedNum() {
      return this.$store.state.login.dataRegisterBadge;
    },
    selectFrom() {
      return Object.keys(this.formLine).length
        ? this.formLine
        : this.selection[0];
    },
  },
  methods: {
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
        a.download = `文件登记入库模板${time}.xlsx`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },
    handleSuccess(file) {
      const formData = new FormData();
      formData.append("uploadFile", file.raw);
      formData.append("userId", this.$store.state.login.loginData.userId);
      uploadFileMode(formData)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.$message.success("导入成功！");
            this.getData();
          } else {
            this.$message.error("导入失败！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
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
          console.log("232323");
          const params = {
            idStr: this.selection.map((item) => item.id).join(","),
          };

          console.log(params);
          const res = await recallApi(params);
          console.log(res);
          this.$message.success(res.msg);
          this.selection = [];
          this.keyEl = +new Date().getTime();
          this.getData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
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
      this.selection = [];
      this.getData();
      if (num === 1) {
        this.isDetail = false;
      }
    },
    changeRadio(row) {
      this.radio = row.id;
      this.formLine = row;
      this.pArams = row;
    },

    handleClose() {
      this.keyEl = +new Date().getTime();
      this.selection = [];
      this.registerDialog.visible = false;
      this.getData();
    },
    handleRowDblCick(row) {
      this.formLine = row;
      if (this.activeTab === 3) {
        this.messageLookRegister(row.id);
      }
      if ([2, 3].includes(this.activeTab)) {
        this.isDetail = true;
      } else {
        this.isDetail = false;
      }
      this.registerDialog = {
        name: "AddData",
        title: "编辑资料",
        visible: true,
      };
    },

    //消息标记已读
    async messageLookRegister(id) {
      const res = await messageLookMedia({ id });
      this.$store.dispatch("login/getDataRegisterBadge"); //获取资料登记角标
    },

    async getData() {
      const params = {
        currentPage: this.tableObj.page,
        pageSize: this.tableObj.size,
        createUserId: this.$store.state.login.loginData.userId, //记录创建人
        keys: {
          ...this.searchForm,
        }, //查询条件集合
      };
      if (this.activeTab === 1) {
        this.pageData(pageCreateDraft(params));
      } else if (this.activeTab === 2) {
        this.pageData(pageCreateAuditing(params));
      } else {
        this.pageData(pageCreateAudited(params));
      }
    },

    async pageData(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data.map((item) => {
          item.classifyType = this.swithClassifyType(item.classifyType);
          return item;
        });
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },
    swithClassifyType(num) {
      switch (num) {
        case 1:
          return "个人资产";
        case 2:
          return "保密室资产";
      }
    },
    handleClose() {
      this.keyEl = +new Date().getTime();
      this.selection = [];
      this.registerDialog.visible = false;
      this.getData();
    },

    handleParams(obj) {
      this.pArams = obj;
      this.registerDialog.visible = false;
      this.handleSendApproval(); // 送审
    },

    //新增
    add() {
      this.formLine = {};
      this.$refs.leadalTable.clearSelection();
      this.registerDialog = {
        name: "AddData",
        title: "新增资料",
        visible: true,
      };
    },

    //送审
    sendApproval() {
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

    handleSendApproval() {
      this.keyEl = +new Date().getTime();
      this.registerDialog = {
        name: "DataPersonDialog",
        title: "人员选择",
        visible: true,
      };
    },

    //编辑
    edit() {
      this.formLine = {};
      if (this.selection.length !== 1) {
        this.$message.info("请选择一条数据进行编辑！");
        return;
      }
      // if (JSON.stringify(this.formLine) === "{}") {
      //   this.$message.info("请先选中数据");
      //   return;
      // }
      this.registerDialog = {
        name: "AddData",
        title: "编辑资料",
        visible: true,
      };
    },

    //删除
    deleteRegister() {
      if (!this.selection.length) {
        this.$message.info("请选择一条数据进行编辑！");
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
          const res = await deleteByIdStr(params);
          this.$message.success(res.msg);
          this.keyEl = +new Date().getTime();
          this.selection = [];
          this.getData();
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

<style lang="scss" scoped></style>
