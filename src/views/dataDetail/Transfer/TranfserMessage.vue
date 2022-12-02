<template>
  <div>
    <div class="drawer-form">
      <div class="drawer-form-title">申请信息</div>
      <el-form
        :model="applyForm"
        ref="form"
        label-width="80px"
        label-position="right"
        v-loading="loading"
        :disabled="true"
      >
        <el-form-item label="标题">
          <template slot="label">
            <div
              style="letter-spacing: 30px; position: absolute; margin-left: 5px"
            >
              标题
            </div>
          </template>
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
              style="width: 330px"
              disabled
            >
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="接收人">
          <template slot="label">
            <div
              style="letter-spacing: 8px; position: absolute; margin-left: 5px"
            >
              接收人
            </div>
          </template>
          <el-select
            v-model="applyForm.modifyUserName"
            placeholder="请选择接收人"
            ref="tree"
            style="width: 330px"
          >
          </el-select>
        </el-form-item>

        <el-form-item>
          <label slot="label" style="font-weight: 400">移交事由</label>
          <el-input type="textarea" v-model="applyForm.reason"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="equipment-message">
        <div class="equipment-header">
          <div class="equipment-header-left">
            <div class="drawer-form-title">移交资料信息</div>
          </div>
        </div>
        <leadal-table
          :data="tableObj.tableData"
          :row-header="tableObj.tableOptions"
          :isPagination="false"
          v-loading="tableObj.loading"
          ref="leadalTable"
          :height="'calc(50vh - 50px)'"
        ></leadal-table>
      </div>
    </div>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import { loadHander, pageByMediaIds } from "@/api/data";
export default {
  name: "TransferMessage",
  inject: ["root"],
  components: {
    LeadalTable,
  },
  data() {
    return {
      loading: false,
      isAudit: this.root.isAudit,
      applyForm: {
        id: "", //申请id
        applyContent: "", //标题
        applyUserId: "", //申请人主键
        applyUserName: "", //申请人名称
        devId: "", //设备主键逗号隔开
        modifyType: "1", //固定填1
        nodeId: "", //节点主键
        modifyUserId: "", //移交人主键
        modifyUserName: "", //移交人名称
        reason: "", //事由
        toUserId: "", //审批人主键
        toUserName: "", //审批人名称
      },
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "selection" },
          { type: "index", label: "序号" },
          { value: "heading", label: "文件标题" },
          { value: "code", label: "文件编号" },
          { value: "senderName", label: "所在机构" },
          { value: "secretLevelLabel", label: "资料密级" },
        ],
        loading: false,
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
      const res = await loadHander(params);
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
      const res = await pageByMediaIds(params);
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
