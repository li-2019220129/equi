<template>
  <div>
    <div class="equipment-account-search">
      <el-input
        placeholder="请输入关键字"
        v-model="content"
        style="width: 300px; margin-top: 10px"
        class="equipment-search"
      >
        <i
          slot="suffix"
          style="cursor: pointer"
          class="el-input__icon el-icon-search"
        ></i>
      </el-input>
    </div>
    <leadal-table
      :data="tableObj.tableData"
      :row-header="tableObj.tableOptions"
      :isPagination="true"
      :total="tableObj.total"
      :page="tableObj.page"
      :size="tableObj.size"
      v-loading="tableObj.loading"
      :selection.sync="selection"
      @page-change="handleChangePage"
      @handleRowDblCick="handleRowDblCick"
      :height="'calc(75vh - 46px)'"
      ref="leadalTable"
    >
    </leadal-table>

    <leadal-dialog
      :visible="dialogVisible"
      title="批量操作"
      width="800px"
      class="dialog"
      :footer="true"
      @submit="handleSubmit"
      @close="dialogVisible = false"
    >
      <template #content>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="审批意见" prop="resource">
            <el-radio-group v-model="ruleForm.agree">
              <el-radio :label="true">同意</el-radio>
              <el-radio :label="false">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审批意见" prop="desc">
            <el-input
              type="textarea"
              v-model="ruleForm.desc"
              :rows="7"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </leadal-dialog>

    <leadal-dialog
      :visible="detailVisible"
      :title="'申请详情'"
      width="1280px"
      class="dialog"
      :footer="false"
      @close="detailVisible = false"
    >
      <template #content>
        <add-data :formLine="formLine" :isDetail="true" />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import AddData from "./AddData.vue";
import { tableOptions2 } from "./dataOption/toApprove.options";
import {
  pageAudit,
  auditAgree,
  auditDisAgree,
  messageLookAudit,
} from "@/api/data";
import { mapState } from "vuex";
export default {
  name: "NewEquipmentAudit",
  components: {
    LeadalTable,
    LeadalDialog,
    AddData,
  },
  props: {
    isToApproved: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      root: this,
    };
  },
  data() {
    return {
      content: "", //输入框
      tableObj: {
        tableData: [],
        tableOptions: tableOptions2,
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      dialogVisible: false,
      selection: [],
      ruleForm: {
        agree: true,
        desc: "",
      },

      pageWaitList: [],
      pageAuditedList: [],
      deviceApproval: [], // 设备审批
      deviceBorrow: [], // 设备借用
      deviceMove: [], // 设备移交
      deviceDeliver: [], // 设备外送
      deviceDestory: [], // 设备销毁
      detailVisible: false, //详情抽屉
      formLine: {}, //当前行数据
      isDetail: true,
      type: "edit",
      infoId: "", //详情id
    };
  },
  computed: {
    ...mapState("login", ["loginData"]),
    operateIcon() {
      return require(`@/assets/icon/${
        this.componentsId === "3-1" ? "审批@2x" : "还原@2x"
      }.png`);
    },
  },
  created() {
    this.getData();
  },
  methods: {
    handleAgreeOrTakeBack(isToApproved) {
      if (isToApproved) {
        if (this.selection.length === 0) {
          this.$message.info("请先选中数据");
          return;
        }
        this.dialogVisible = true;
      }
    },
    handleSubmit() {
      const id = this.selection.map((item) => item.applyId).join(",");
      const nodeId = this.selection.map((item) => item.nodeId).join(",");
      const params = {
        id, //申请ID
        nodeId, //审批节点id
        reason: this.ruleForm.desc, //原因
        currentUserId: this.$store.state.login.loginData.userId, //当前用户主键
      };
      this.ruleForm.agree
        ? this.agreeOrDisAgree(auditAgree(params))
        : this.agreeOrDisAgree(auditDisAgree(params));
    },

    async agreeOrDisAgree(promise) {
      promise.then((res) => {
        this.dialogVisible = false;
        this.$message.success(res.msg);
        this.$refs.leadalTable.clearSelection();
        this.getData();
        this.$store.dispatch("login/getRegisterBadge"); //刷新资料登记角标
        this.$store.dispatch("login/getAuditBadge");
      });
      // const res = await promise;
      // this.dialogVisible = false;
      // this.$message.success(res.msg);
      // this.$refs.leadalTable.clearSelection(); //清除选中
      // await this.getData();
      // this.$store.dispatch("login/getRegisterBadge"); //刷新资料登记角标
      // this.$store.dispatch("login/getAuditBadge"); //刷新资料登记角标
    },

    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    async getData() {
      try {
        this.tableObj.loading = true;
        const params = {
          currentPage: this.tableObj.page, //当前页码
          pageSize: this.tableObj.size, //每页记录数
          status: this.isToApproved ? 1 : 2, //审批状态待审批1 已审批2
          currentUserId: this.$store.state.login.loginData.userId, //当前用户主键
          applyType: 1, //申请类型
          content: this.content, //搜索条件
        };
        console.log('343434344343',params)
        const res = await pageAudit(params);
        this.tableObj.tableData = res.data.data;
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    handleRowDblCick(row) {
      this.formLine = row;
      this.detailVisible = true;
      this.messageLookAudit(row.id);
    },

    //消息标记已读
    async messageLookAudit(id) {
      const res = await messageLookAudit({ id });
      this.$store.dispatch("login/getDataAuditBadge"); //获取设备待审批角标
    },
  },
};
</script>

<style lang="scss " scoped>
/* .el-select {
  margin-left: 24px;
} */
</style>
