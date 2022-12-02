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
            <div class="drawer-form-title">移交设备信息</div>
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
import { loadDeviceModify, findDeviceByModifyId } from "@/api/equipment";
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
      organName: this.$store.state.login.loginData.organName,
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
          { value: "categoryLabel", label: "设备分类" },
          { value: "brand", label: "设备品牌" },
          { value: "model", label: "设备型号" },
          { value: "sn", label: "序列号" },
        ],
        loading: false,
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
      };
      const res = await loadDeviceModify(params);
      const editObj = res.data;
      Object.assign(this.applyForm, editObj);
      const params1 = {
        modifyId: this.root.id,
      };
      this.findDevice(findDeviceByModifyId(params1));
      this.$emit("update:applyForm", this.applyForm);
      this.loading = false;
    },

    //编辑查询已选设备
    async findDevice(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
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
