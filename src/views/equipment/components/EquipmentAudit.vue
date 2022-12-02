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
      <el-select
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
      </el-select>
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

    <LeadalDrawer :visible.sync="drawerVisible">
      <template #content>
        <component
          :is="componentId"
          :formLine="formLine"
          :applyId="applyId"
        ></component>
      </template>
    </LeadalDrawer>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import LeadalDrawer from "@/components/LeadalDrawer";
import BorrowDrawer from "./BorrowDrawer.vue";
import ApplyDrawer from "./ApplyDrawer.vue";
import { tableOptions1 } from "./equipmentOption/toApprove.options";
import { pageWait, pageAudited } from "@/api/audit";
import { mapState } from "vuex";
import {
  batchBorrowAgree, // 设备借用批量审批同意
  batchBorrowDisAgree, // 设备借用批量审批不同意
  batchMoveAgree, // 设备移交批量审批同意
  batchMoveDisAgree, // 设备移交批量审批不同意
  batchTakeoutAgree, // 设备外送批量审批同意
  batchTakeoutDisAgree, // 设备外送批量审批不同意
  batchDestoryAgree, // 设备外送批量审批同意
  batchDestoryDisAgree, // 设备外送批量审批不同意
} from "@/api/equipment/index.js";
import { messageLookAudit } from "@/api/common";
export default {
  name: "EquipmentAudit",
  components: {
    LeadalTable,
    LeadalDialog,
    LeadalDrawer,
    BorrowDrawer,
    ApplyDrawer,
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
        tableOptions: tableOptions1,
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
      approveTypeList: [
        {
          id: 64,
          label: "设备借用",
        },
        {
          id: 16,
          label: "设备移交",
        },
        {
          id: 256,
          label: "设备外送",
        },
        {
          id: 32,
          label: "设备销毁",
        },
      ],
      pageWaitList: [],
      pageAuditedList: [],
      deviceBorrow: [], // 设备借用
      deviceMove: [], // 设备移交
      deviceDeliver: [], // 设备外送
      deviceDestory: [], // 设备销毁
      componentId: "",
      isDetail: false, //是否查看详情
      title: "",
      drawerTitle: "",
      drawerVisible: false, //详情抽屉
      formLine: {}, //当前行数据
      applyId: "", //当前行id
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
    filterData(num) {
      return this.selection.filter((item) => item.applyType === num);
    },

    handleAgreeOrTakeBack(isToApproved) {
      if (isToApproved) {
        if (this.selection.length === 0) {
          this.$message.info("请先选中数据");
          return;
        }
        this.deviceMove = this.filterData(16);
        this.deviceBorrow = this.filterData(64);
        this.deviceDeliver = this.filterData(256);
        this.deviceDestory = this.filterData(32);
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

    handleSubmit() {
      // 设备移交
      const moveObj = {};
      const moveArray = [];
      // 设备借用
      const borrowObj = {};
      const borrowArray = [];
      //设备外送
      const deliverObj = {};
      const deliverArray = [];
      //设备销毁
      const destoryObj = {};
      const destoryArray = [];

      const deviceBorrow = this.setAgreeOrDisAgree(
        this.deviceBorrow,
        borrowObj,
        borrowArray
      );

      const deviceMove = this.setAgreeOrDisAgree(
        this.deviceMove,
        moveObj,
        moveArray
      );

      const deviceDeliver = this.setAgreeOrDisAgree(
        this.deviceDeliver,
        deliverObj,
        deliverArray
      );

      const deviceDestory = this.setAgreeOrDisAgree(
        this.deviceDestory,
        destoryObj,
        destoryArray
      );

      const common = {
        reason: this.ruleForm.desc,
        currentUserId: this.$store.state.login.loginData.userId,
      };

      const params2 = {
        ...common,
        data: deviceMove, //返回数据
      };

      const params3 = {
        ...common,
        data: deviceBorrow, //返回数据
      };

      const params4 = {
        ...common,
        data: deviceDeliver, //返回数据
      };

      const params5 = {
        ...common,
        mark: true,
        data: deviceDestory, //返回数据
      };
      if (this.ruleForm.agree) {
        if (this.deviceMove.length > 0) {
          this.handleEquipment(batchMoveAgree(params2));
          this.$store.dispatch("login/getTransferBadge"); //获取设备移交角标/
        }
        if (this.deviceBorrow.length > 0) {
          this.handleEquipment(batchBorrowAgree(params3));
          this.$store.dispatch("login/getBorrowBadge"); //获取设备借用角标
        }
        if (this.deviceDeliver.length > 0) {
          this.handleEquipment(batchTakeoutAgree(params4));
          this.$store.dispatch("login/getDeliverBadge"); //获取设备外送角标
        }
        if (this.deviceDestory.length > 0) {
          this.handleEquipment(batchDestoryAgree(params5));
          this.$store.dispatch("login/getDestoryBadge"); //获取设备销毁角标
        }
        this.handleCancel();
      } else {
        if (this.deviceMove.length > 0) {
          this.handleEquipment(batchMoveDisAgree(params2));
        }
        if (this.deviceBorrow.length > 0) {
          this.handleEquipment(batchBorrowDisAgree(params3));
        }
        if (this.deviceDeliver.length > 0) {
          this.handleEquipment(batchTakeoutDisAgree(params4));
        }
        if (this.deviceDestory.length > 0) {
          this.handleEquipment(batchDestoryDisAgree(params5));
        }
        this.handleCancel();
      }
    },

    handleCancel() {
      this.dialogVisible = false;
      this.$message.success("操作成功");
      this.$store.dispatch("login/getAuditBadge"); //获取设备待审批角标
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
        applyType: this.applyType,
      };
      this.$nextTick(() => {
        this.$refs["leadalTable"].clearSelection();
      });
      this.isToApproved
        ? this.getTable(pageWait(params))
        : this.getTable(pageAudited(params));
    },

    async getTable(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data.map((item) => {
          item.applyTypes = this.switchapplyTypes(item.applyType);
          return item;
        });
        console.log(res)
        this.tableObj.total = res.data.total;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },
    switchapplyTypes(num) {
      switch (num) {
        case 64:
          return "设备借用";
        case 16:
          return "设备移交";
        case 256:
          return "设备外送";
        case 32:
          return "设备销毁";
      }
    },

    //双击查看详情
    handleRowDblCick(row) {
      this.formLine = row;
      this.applyId = row.id;
      this.drawerVisible = true;
      this.isDetail = true;
      if (row.applyType === 64) {
        this.title = "借用";
        this.drawerTitle = "设备借用";
        this.componentId = "BorrowDrawer";
      } else if (row.applyType === 16) {
        this.title = "移交";
        this.drawerTitle = "设备移交";
        this.componentId = "ApplyDrawer";
      } else if (row.applyType === 256) {
        this.title = "外送";
        this.drawerTitle = "设备外送";
        this.componentId = "ApplyDrawer";
      } else if (row.applyType === 32) {
        this.title = "销毁";
        this.drawerTitle = "设备销毁";
        this.componentId = "ApplyDrawer";
      }
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

<style lang="scss "scoped>
/* .el-select {
  margin-left: 24px;
} */
</style>
