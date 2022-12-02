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
        <el-form-item label="" prop="serialNum">
          <label slot="label">
            <div
              style="letter-spacing: 30px; position: absolute; margin-left: 5px"
            >
              编号
            </div>
          </label>
          <el-input v-model="applyForm.serialNum"></el-input>
        </el-form-item>
        <el-form-item label="" prop="reason">
          <label slot="label">
            <div
              style="letter-spacing: 30px; position: absolute; margin-left: 5px"
            >
              标题
            </div>
          </label>
          <el-input v-model="applyForm.reason"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="申请部门" prop="organName">
            <el-select
              v-model="organName"
              placeholder="请选择申请部门"
              style="width: 330px"
              disabled
            >
            </el-select>
          </el-form-item>
          <el-form-item label="申请人" prop="borrowUserName">
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
              v-model="applyForm.borrowUserName"
              placeholder="请选择申请人"
              ref="tree"
              style="width: 330px"
              disabled
            >
              <el-option style="height: auto" :value="applyForm.borrowUserName">
                <el-tree
                  :props="defaultProps"
                  :data="treeData"
                  node-key="id"
                  class="tree-no-background"
                  @node-click="handleNodeClick"
                >
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <tree-slot :node="node" :data="data"></tree-slot>
                  </div>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="申请事由" prop="content">
          <el-input type="textarea" v-model="applyForm.content"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="借用时间" prop="borrowStartTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="applyForm.borrowStartTime"
              style="width: 330px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="至" prop="borrowEndTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="applyForm.borrowEndTime"
              style="width: 330px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </div>

        <el-form-item label="保管方式" prop="keepType">
          <el-input
            v-model="applyForm.keepType"
            style="width: 330px"
          ></el-input>
        </el-form-item>

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
          <el-form-item label="联系方式" prop="telephone">
            <el-input
              v-model="applyForm.telephone"
              style="width: 330px"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="equipment-message">
      <div class="equipment-header">
        <div class="equipment-header-left">
          <div class="drawer-form-title">借阅资料信息</div>
        </div>
      </div>
      <leadal-table
        :data="tableObj.tableData"
        :row-header="tableObj.tableOptions"
        ref="leadalTable"
        :height="'calc(30vh - 60px)'"
      ></leadal-table>
    </div>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import moment from "moment";
import { loadBorrow, pageMediaByBorrowId } from "@/api/data";
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
    this.loadDetail();
  },
  methods: {
    async getData() {
      this.loading = true;
      const params = {
        id: this.root.id,
      };
      const res = await loadBorrow(params);
      Object.assign(this.applyForm, res.data);
      this.$emit("update:applyForm", this.applyForm);
      this.loading = false;
    },

    async loadDetail() {
      const params = {
        currentPage: 1, //当前页
        pageSize: 10, //单前每页几条
        id: this.root.id, //记录主键
      };
      const res = await pageMediaByBorrowId(params);
      this.tableObj.tableData = res.data.data;
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
