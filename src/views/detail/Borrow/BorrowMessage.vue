<template>
  <div>
    <div class="drawer-form">
      <div class="drawer-form-title">申请信息</div>
      <el-form
        :model="applyForm"
        ref="form"
        label-width="80px"
        label-position="right"
        :disabled="true"
        v-loading="loading"
      >
        <el-form-item label="">
          <label slot="label">
            <div
              style="letter-spacing: 30px; position: absolute; margin-left: 5px"
            >
              编号
            </div>
          </label>
          <el-input v-model="applyForm.borrowCode"></el-input>
        </el-form-item>
        <el-form-item label="">
          <label slot="label">
            <div
              style="letter-spacing: 30px; position: absolute; margin-left: 5px"
            >
              标题
            </div>
          </label>
          <el-input v-model="applyForm.applyContent"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="申请部门">
            <el-select
              v-model="organName"
              placeholder="请选择申请部门"
              style="width: 330px"
              disabled
            >
            </el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <template slot="label">
              <div
                style="
                  letter-spacing: 8px;
                  position: absolute;
                  margin-left: 5px;
                "
              >
                申请人
              </div>
            </template>
            <el-select
              v-model="applyForm.applyUserName"
              placeholder="请选择申请人"
              ref="tree"
              style="width: 330px"
              disabled
            >
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="申请事由" prop="reason">
          <el-input type="textarea" v-model="applyForm.reason"></el-input>
        </el-form-item>
        <el-form-item label="借用时间" prop="borrowTime">
          <el-date-picker
            v-model="applyForm.borrowTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="使用范围">
            <el-radio-group v-model="applyForm.useRange" style="width: 330px">
              <el-radio :label="1">所内</el-radio>
              <el-radio :label="2">所外</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="保管方式">
            <el-input
              v-model="applyForm.storageWay"
              style="width: 330px"
            ></el-input>
          </el-form-item>
        </div>

        <div class="flex-item">
          <el-form-item label="申请时间" prop="applyTime">
            <el-date-picker
              v-model="applyForm.applyTime"
              type="date"
              style="width: 330px"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactWay">
            <el-input
              v-model="applyForm.contactWay"
              style="width: 330px"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="equipment-message">
      <div class="equipment-header">
        <div class="equipment-header-left">
          <div class="drawer-form-title">借用设备信息</div>
        </div>
      </div>
      <leadal-table
        :data="tableObj.tableData"
        :row-header="tableObj.tableOptions"
        :isPagination="false"
        ref="leadalTable"
        :height="'calc(30vh - 60px)'"
      ></leadal-table>
    </div>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import moment from "moment";
import { viewDetail } from "@/api/equipment";
export default {
  name: "BorrowMessage",
  components: {
    LeadalTable,
  },
  inject: ["root"],
  data() {
    return {
      loading: false,
      applyForm: {
        id: "", //任务主键
        borrowTime: [],
        borrowCode: "", //编号
        applyContent: "", //标题
        reason: "",
        useRange: 1,
        applyTime: moment(new Date()).format("YYYY-MM-DD"),
        devIds: "", //设备id
        storageWay: "", //保管方式
        contactWay: "", //联系方式
        applyUserId: "", //申请人主键
        applyUserName: "", //申请人名称
      },
      defaultProps: {
        children: "children",
        label: "caption",
      },
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "selection" },
          { type: "index", label: "序号" },
          { value: "categoryLabel", label: "设备分类" },
          { value: "brand", label: "设备品牌" },
          { value: "model", label: "设备型号" },
          { value: "sn", label: "序列号" },
        ],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      const params = {
        id: this.root.id,
        currentUserId: this.root.userId,
      };
      const res = await viewDetail(params);
      const editObj = res.data;
      this.tableObj.tableData = editObj.devInfo;

      Object.assign(this.applyForm, editObj.recordData);

      //借用时间回显
      if (editObj.recordData.borrowTime) {
        const beginTime = editObj.recordData.borrowTime.substr(0, 10);
        const endTime = editObj.recordData.borrowTime.substr(0, 10);
        this.applyForm.borrowTime = [beginTime, endTime];
      }
      this.$emit("update:applyForm", this.applyForm);
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-item {
  display: flex;
  justify-content: space-between;
}
.drawer-form-title {
  font-family: SourceHanSansCN-Medium;
  font-size: 22px;
  margin: 10px 0;
  color: #3d464c;
  letter-spacing: 0;
  font-weight: 500;
}
</style>
