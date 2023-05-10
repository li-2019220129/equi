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
      <!-- <el-select
        v-model="applyType"
        placeholder="请选择审批类型"
        clearable
        @change="getData"
        style="margin-left: 24px"
      >
        <el-option
          v-for="item in approveTypeList"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        >
        </el-option>
      </el-select> -->
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
        <add-equipment :treeData="treeData" :formLine="formLine" :isDetail="true" :infoId="infoId" />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import AddEquipment from "./AddEquipment.vue";
import { tableOptions2 } from "./equipmentOption/toApprove.options";
import { pageDeviceWait, pageDeviceAudited } from "@/api/audit";
import { mapState } from "vuex";
import {
  getDeviceKindTree,
  batchDeviceRegistration, // 设备登记批量审批同意
  batchDeviceDisAgree, // 设备登记批量审批不同意
} from "@/api/equipment/index.js";
import { messageLookAudit } from "@/api/common";
export default {
  name: "NewEquipmentAudit",
  components: {
    LeadalTable,
    LeadalDialog,
    AddEquipment,
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
      applyType: "",
      treeData:[],
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
    this.getDeviceKindTreeData();
  },
  methods: {
    async getDeviceKindTreeData() {
      const res = await getDeviceKindTree({ type: 1 });
      this.treeData = res.data;
    },
    filterData(num) {
      return this.selection.filter((item) => item.applyType === num);
    },

    handleAgreeOrTakeBack(isToApproved) {
      if (isToApproved) {
        if (this.selection.length === 0) {
          this.$message.info("请先选中数据");
          return;
        }
        this.deviceApproval = this.filterData(1);
        this.dialogVisible = true;
      }
    },

    setAgreeOrDisAgree(array, obj, arr) {
      array.map((item) => {
        obj["applyId"] = item.id;
        obj["nodeId"] = item.nodeId;
        arr.push(this.$cloneDeep(obj));
      });
      return arr;
    },

    async handleSubmit() {
      // 设备登记
      const approvalObj = {};
      const approvalArray = [];

      const deviceApproval = this.setAgreeOrDisAgree(
        this.deviceApproval,
        approvalObj,
        approvalArray
      );

      const params = {
        reason: this.ruleForm.desc,
        currentUserId: this.$store.state.login.loginData.userId,
        data: deviceApproval, //返回数据
      };

      if (this.ruleForm.agree) {
        if (this.deviceApproval.length > 0) {
          await this.handleEquipment(batchDeviceRegistration(params));
        }
        this.handleCancel();
      } else {
        if (this.deviceApproval.length > 0) {
          this.handleEquipment(batchDeviceDisAgree(params));
        }
        this.handleCancel();
      }
    },

    handleCancel() {
      this.dialogVisible = false;
      this.$message.success("操作成功");
      this.$refs.leadalTable.clearSelection(); //清除选中
      this.$store.dispatch("login/getAuditBadge"); //获取设备待审批角标
      this.$store.dispatch("login/getRegisterBadge"); //获取登记角标
      this.getData();
    },

    async handleEquipment(promise) {
      const res = await promise;
      return res;
    },

    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    getData() {
      const params = {
        userId: this.loginData.userId,
        pageSize: this.tableObj.size,
        currentPage: this.tableObj.page,
      };
      this.$nextTick(() => {
        this.$refs["leadalTable"].clearSelection();
      });
      this.isToApproved
        ? this.getTable(pageDeviceWait(params))
        : this.getTable(pageDeviceAudited(params));
    },

    async getTable(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data.map((item) => {
          item.applyTypes = "设备登记";
          return item;
        });
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    handleRowDblCick(row) {
      this.formLine = row;
      this.infoId = row.id;
      this.detailVisible = true;
      this.messageLookAudit(row.id);
    },

    //消息标记已读
    async messageLookAudit(id) {
      const res = await messageLookAudit({ id });
      this.$store.dispatch("login/getAuditBadge"); //获取设备待审批角标
    },
  },
};
</script>

<style lang="scss " scoped>
/* .el-select {
  margin-left: 24px;
} */
</style>
