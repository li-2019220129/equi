<template>
  <div class="equipment-message">
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div class="drawer-form-title">{{ title }}资料信息</div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div class="equipment-button_btn" @click="visible = true">
            <img src="@/assets/icon/选择设备@2x.png" />
            <span>选择资料</span>
          </div>
          <div class="equipment-button_btn" @click="deleteData">
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
      :max-height="maxHeight"
    ></leadal-table>

    <leadal-dialog
      :visible="visible"
      title="新增资料"
      width="66.7%"
      class="dialog"
      :footer="false"
      @close="visible = false"
    >
      <template #content>
        <data-selection-dialog @selectData="selectData" />
      </template>
    </leadal-dialog>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import DataSelectionDialog from "./DataSelectionDialog.vue";
import {
  pageMediaByBorrowId,
  pageByMediaIds,
  pageTakeout2Media,
  pageMediaRecycle,
  addMediaBorrow,
  removeMediaBorrow,
  addMediaHander,
  removeMediaHander,
  saveTakeout2Media,
  deleteTakeout2Media,
  addMediaRecycle,
  removeMediaRecycle,
} from "@/api/data";
export default {
  name: "DataMessage",
  components: {
    LeadalTable,
    LeadalDialog,
    DataSelectionDialog,
  },
  inject: ["root"],
  props: {
    maxHeight: {
      type: String,
      default: "",
    },
    currentApplyId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title: this.root.title,
      drawerTitle: this.root.drawerTitle,
      applyId: this.root.formLine.id,
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
        page: 1,
        size: 10,
        total: 0,
      },
      visible: false,
      selectList: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const common = {
        currentPage: this.tableObj.page, //当前页
        pageSize: this.tableObj.size, //单前每页几条
      };
      if (this.drawerTitle === "资料借阅") {
        const params1 = {
          ...common,
          id: this.applyId ? this.applyId : this.currentApplyId, //记录主键
        };
        this.getDataByType(pageMediaByBorrowId(params1));
      } else if (this.drawerTitle === "资料移交") {
        const params2 = {
          ...common,
          id: this.applyId ? this.applyId : this.currentApplyId, //记录主键
        };
        this.getDataByType(pageByMediaIds(params2));
      } else if (this.drawerTitle === "资料外送") {
        const params3 = {
          ...common,
          takeoutId: this.applyId ? this.applyId : this.currentApplyId, //记录主键
        };
        this.getDataByType(pageTakeout2Media(params3));
      } else if (this.drawerTitle === "资料销毁") {
        const params4 = {
          ...common,
          id: this.applyId ? this.applyId : this.currentApplyId, //记录主键
        };
        this.getDataByType(pageMediaRecycle(params4));
      }
    },
    async getDataByType(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.tableObj.tableData = res.data.data;
        this.$emit("update:mediaData", this.tableObj.tableData.length);
        this.tableObj.loading = false;
      } catch {
        this.tableObj.loading = false;
      }
    },

    async selectData(selection) {
      const mediaIdStr = selection.map((item) => item.id).join(",");

      if (this.drawerTitle === "资料借阅") {
        const borrowParams = {
          mediaIdStr,
          id: this.currentApplyId,
        };
        this.selectDataByType(addMediaBorrow(borrowParams));
      } else if (this.drawerTitle === "资料移交") {
        const transferParams = {
          mediaIdStr,
          id: this.currentApplyId,
        };
        this.selectDataByType(addMediaHander(transferParams));
      } else if (this.drawerTitle === "资料外送") {
        const borrowParams = {
          mediaStr: mediaIdStr,
          takeoutId: this.currentApplyId,
        };
        this.selectDataByType(saveTakeout2Media(borrowParams));
      } else if (this.drawerTitle === "资料销毁") {
        const borrowParams = {
          mediaIdStr: mediaIdStr,
          id: this.currentApplyId,
        };
        this.selectDataByType(addMediaRecycle(borrowParams));
      }

      // this.$emit(
      //   "update:isNeedMeida",
      //   this.drawerTitle === "资料借阅" ? false : true
      // );
    },

    async selectDataByType(promise) {
      const res = await promise;
      this.$message.success(res.msg);
      this.getData();
      this.visible = false;
    },

    async deleteData() {
      if (this.selectList.length === 1) {
        this.$message.error("无法删除，至少选择一份资料！");
        return;
      }
      const mediaIdStr = this.selectList.map((item) => item.id).join(",");
      if (this.drawerTitle === "资料借阅") {
        const borrowParams = {
          mediaIdStr,
          id: this.currentApplyId,
        };
        this.selectDataByType(removeMediaBorrow(borrowParams));
      } else if (this.drawerTitle === "资料移交") {
        const transferParams = {
          mediaIdStr,
          id: this.currentApplyId,
        };
        this.selectDataByType(removeMediaHander(transferParams));
      } else if (this.drawerTitle === "资料外送") {
        const borrowParams = {
          mediaIdStr,
          takeoutId: this.currentApplyId,
        };
        this.selectDataByType(deleteTakeout2Media(borrowParams));
      } else if (this.drawerTitle === "资料销毁") {
        const borrowParams = {
          mediaIdStr,
          takeoutId: this.currentApplyId,
        };
        this.selectDataByType(removeMediaRecycle(borrowParams));
      }
    },

    async deleteDataByType(promise) {
      const res = await promise;
      this.$message.success(res.msg);
      this.getData();
      this.visible = false;
    },
  },
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
