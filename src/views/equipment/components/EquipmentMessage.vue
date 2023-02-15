<template>
  <div class="equipment-message">
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div class="drawer-form-title">{{ title }}设备信息</div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button" v-show="!isDetail || btnTitle === '确认借出'">
          <div class="equipment-button_btn" @click="visible = true">
            <img src="@/assets/icon/选择设备@2x.png" />
            <span>选择设备</span>
          </div>
          <div class="equipment-button_btn" @click="deteleDevice">
            <img src="@/assets/icon/icon-delete.png" />
            <span>删除</span>
          </div>
        </div>
      </div>
    </div>
    <leadal-table
      :data="tableObj.tableData"
      :row-header="tableObj.tableOptions"
      :selection.sync="selectList"
      :isPagination="false"
      ref="leadalTable"
      :height="maxHeight"
    ></leadal-table>

    <leadal-dialog
      :visible="visible"
      title="新增设备"
      width="66.7%"
      class="dialog"
      :footer="false"
      @close="visible = false"
    >
      <template #content>
        <device-selection-dialog @selectDevice="selectDevice" v-bind="$attrs" />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import DeviceSelectionDialog from "./DeviceSelectionDialog.vue";
import { removeBorrowDevice, findBorrowedDev } from "@/api/equipment";
export default {
  name: "EquipmentMessage",
  components: {
    LeadalTable,
    LeadalDialog,
    DeviceSelectionDialog
  },
  inject: ["root"],
  props: {
    maxHeight: {
      type: String,
      default: ""
    },
    editDevTable: {
      type: Array,
      default: () => []
    },
    editId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // config:{
      //   pageSize:10,
      //   currentPage:1,
      //   total:0
      // },
      title: this.root.title,
      isDetail: this.root.isDetail,
      btnTitle: this.root.btnTitle,
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "selection" },
          { type: "index", label: "序号" },
          { value: "kindLabel", label: "设备分类" },
          { value: "brand", label: "设备品牌" },
          { value: "model", label: "设备型号" },
          { value: "sn", label: "序列号" }
        ]
      },
      visible: false,
      selectList: [] //勾选设备
    };
  },
  created() {
    if (this.btnTitle === "待归还") {
      console.log('reerrer',this.editId)
      this.loadPageData()
    }else if(this.btnTitle === '已归还'){
       this.loadPageData()
    }
  },
  watch: {
    editDevTable(val) {
      console.log(val, "99999999");
      this.tableObj.tableData = val;
    }
  },
  methods: {
    async loadPageData() {
      const res = await findBorrowedDev({
        borrowId:this.editId,
      });
      // this.config.total = res.data.total
      // this.config.pageSize = res.data.pageSize
      // this.config.currentPage = res.data.currentPage
      // this.config = res.data.config
      this.tableObj.tableData = res.data
    },
    selectDevice(selection) {
      this.tableObj.tableData = selection;
      const devIds = selection.map(item => item.id).join(",");
      const secret = selection
        .map(item => item.secret)
        .sort()
        .reverse()[0];
      this.$emit("update:devIds", devIds);
      this.$emit("update:secret", secret);
      this.visible = false;
    },

    deteleDevice() {
      if (this.selectList.length === 0) {
        this.$message.info("至少选择一个设备!");
        return;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //定义一个存放选中数组索引的数组
          const selectionItemIndexes = [];
          this.selectList.forEach(item => {
            selectionItemIndexes.push(item.index);
          });
          //过滤存在选中数组索引的数据
          this.tableObj.tableData = this.tableObj.tableData.filter(
            (item, index) => {
              return !selectionItemIndexes.includes(index);
            }
          );
          //更新已选择设备
          const devIds = this.tableObj.tableData.map(item => item.id).join(",");
          this.$emit("update:devIds", devIds);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.equipment-message {
  width: 99%;
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
