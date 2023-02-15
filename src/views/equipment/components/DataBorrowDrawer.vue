<template>
  <div>
    <div class="drawer-header">
      <div class="drawer-header title">{{ drawerTitle }}申请</div>
      <div class="equipment-button">
        <div v-show="!isDetail" class="equipment-button_btn" @click="handleSave">
          <img src="@/assets/icon/保存@2x.png" />
          <span>保存</span>
        </div>
        <div v-show="!isDetail" class="equipment-button_btn" @click="send">
          <img src="@/assets/icon/发送@2x.png" />
          <span>发送</span>
        </div>
      </div>
    </div>
    <div class="drawer-container">
      <div class="drawer-left">
        <pdf :src="pdfSrc" style="width:100%;height:100%"></pdf>
      </div>
      <el-scrollbar class="drawer-right">
        <div class="equipment-header">
          <div class="equipment-header-left">
            <div
              :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
              @click="activeTab = 1"
            >基础信息</div>
            <div
              :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
              @click="papers"
            >相关文件</div>
            <div
              :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
              @click="activeTab = 3"
            >办理过程</div>
          </div>
        </div>
        <keepAlive>
          <component
          :is="componentName"
          v-bind="$attrs"
          :applyId="applyId"
          :id="id"
          ref="borrowMessage"
          @saveBorrow="saveBorrow"
          @pdfSrcDelete="pdfSrcDelete"
          @pdfSrcSuccess="pdfSrcSuccess"
        />
        </keepAlive>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import DataBorrowMessage from "./DataBorrowMessage.vue";
import RelativeFile from "./RelativeFile.vue";
import HandleProcess from "./HandleProcess.vue";
import pdf from "vue-pdf";
import { saveDraftBorrow } from "@/api/data";
export default {
  name: "BorrowDrawer",
  components: {
    DataBorrowMessage,
    RelativeFile,
    HandleProcess,
    pdf
  },
  inject: ["root"],
  props: {
    // drawerTitle: {
    //   type: String,
    //   default: ""
    // },
    applyId: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: ""
    }
  },
  created() {},
  data() {
    return {
      preserve: false,
      id: null,
      drawerTitle: this.root.drawerTitle,
      title: this.root.title,
      isDetail: this.root.isDetail,
      btnTitle: this.root.btnTitle,
      activeTab: 1,
      componentName: "DataBorrowMessage",
      params: {},
      saveStatus: 0,
      pdfSrc: null
    };
  },
  watch: {
    activeTab(val) {
      switch (val) {
        case 1:
          this.componentName = "DataBorrowMessage";
          break;
        case 2:
          this.componentName = "RelativeFile";
          break;
        case 3:
          this.componentName = "HandleProcess";
          break;
      }
    }
  },

  methods: {
    pdfSrcDelete() {
      this.pdfSrc = null;
    },
    pdfSrcSuccess(src) {
      console.log(src, "6654553");
      this.pdfSrc = src;
    },
    papers() {
      if (!this.preserve && this.mode == "add") {
        this.$message.warning("请先保存后在进行操作！");
        return;
      }
      this.activeTab = 2;
    },
    //保存
    handleSave() {
      this.$refs.borrowMessage.saveBorrow();
    },

    saveBorrow(params) {
      this.params = params;
      console.log(params);
      saveDraftBorrow(params).then(res => {
        if (res.status === 200) {
          this.$message.success(res.msg);
          this.saveStatus = 1;
          this.preserve = true;
          this.id = res.data.id;
          this.$emit("reloadData");
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //发送
    send() {
      if (this.saveStatus === 0) {
        this.$message.error("请先保存再进行送审！");
        return;
      }
      this.$emit("handleParams", this.params);
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  display: flex;
  height: calc(90vh - 20px);
  .drawer-left {
    width: 52%;
    height: 100%;
    margin-right: 30px;
    margin-top: 10px;
    overflow-y: scroll;
    border: 1px solid rgba(231, 231, 231, 1);
  }
  .drawer-right {
    margin-top: 10px;
    width: 48%;
  }
}
</style>
