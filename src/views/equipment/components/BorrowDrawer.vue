<template>
  <div>
    <div class="drawer-header">
      <div class="drawer-header title">
        {{ drawerTitle }}{{ btnTitle === "确认借出" ? "借出" : "申请" }}
      </div>
      <div class="equipment-button">
        <div
          class="equipment-button_btn"
          @click="handleSave"
          v-if="btnTitle === '借用申请'"
          v-show="!isDetail"
        >
          <img src="@/assets/icon/保存@2x.png" />
          <span>保存</span>
        </div>
        <div
          class="equipment-button_btn"
          @click="send"
          v-if="btnTitle === '借用申请'"
          v-show="!isDetail"
        >
          <img src="@/assets/icon/发送@2x.png" />
          <span>发送</span>
        </div>

        <div
          class="equipment-button_btn"
          @click="borrow"
          v-if="btnTitle === '确认借出'"
        >
          <img src="@/assets/icon/借出-确认借出@2x.png" />
          <span>借出</span>
        </div>
      </div>
    </div>
    <div class="drawer-container">
      <div class="drawer-left"></div>
      <div class="drawer-right">
        <div class="equipment-header">
          <div class="equipment-header-left">
            <div
              :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
              @click="activeTab = 1"
            >
              基础信息
            </div>
            <div
              :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
              @click="papers"
            >
              相关文件
            </div>
            <div
              :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
              @click="activeTab = 3"
            >
              办理过程
            </div>
          </div>
        </div>
        <keep-alive>
          <component
            :is="componentName"
            v-bind="$attrs"
            :applyId="applyId"
            :id="id"
            ref="borrowMessage"
            @saveBorrow="saveBorrow"
            :devIds.sync="devIds"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowMessage from "./BorrowMessage.vue";
import RelativeFile from "./RelativeFile.vue";
import HandleProcess from "./HandleProcess.vue";
import { applyBorrow, xtsBorrow } from "@/api/equipment";
export default {
  name: "BorrowDrawer",
  components: {
    BorrowMessage,
    RelativeFile,
    HandleProcess,
  },
  inject: ["root"],
  props: {
    applyId: {
      type: String,
      default: "",
    },
    mode:{
     type: String,
     default: "",
    }
  },

  data() {
    return {
      borrowSuccess: false,
      preserve: false,
      drawerTitle: this.root.drawerTitle,
      title: this.root.title,
      isDetail: this.root.isDetail,
      btnTitle: this.root.btnTitle,
      activeTab: 1,
      componentName: "BorrowMessage",
      params: {},
      saveStatus: 0, //是否已保存
      id: "", //申请主键
      devIds: "", //设备id
    };
  },
  watch: {
    activeTab(val) {
      switch (val) {
        case 1:
          this.componentName = "BorrowMessage";
          break;
        case 2:
          this.componentName = "RelativeFile";
          break;
        case 3:
          this.componentName = "HandleProcess";
          break;
      }
    },
  },

  methods: {
    papers(){
        if (!this.preserve&&this.mode=='add') {
        this.$message.warning("请先保存后在进行操作！");
        return;
      }
      this.activeTab = 2
    },
    //保存
    handleSave() {
      if (this.preserve) {
        this.$message.warning("已经保存了无需再次保存！");
        return;
      }
      this.$refs.borrowMessage.saveBorrow();
    },

    saveBorrow(p) {
      const params = {
        applyContent: p.applyContent,
        applyTime: p.applyTime,
        applyUserId: p.applyUserId,
        applyUserName: p.applyUserName,
        borrowCode: p.borrowCode,
        contactWay: p.contactWay,
        // devIds: p.devIds,
        reason: p.reason,
        storageWay: p.storageWay,
        useRange: p.useRange,
        borrowTime: p.borrowTime,
        categoryLabel: p.categoryLabel,
        categoryId: p.categoryId,
        tab: p.tab,
        secret: p.secret,
        devCount: p.devCount,
      };

      //如果有申请人id，代表是编辑
      if (this.applyId) {
        this.$set(params, "id", this.applyId);
      }

      this.params = params;

      applyBorrow(params).then((res) => {
        if (res.status === 200) {
          this.$message.success("保存成功！");
          this.saveStatus = 1;
          this.id = res.data;
          this.preserve = true;
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
      this.$set(this.params, "id", this.id);
      this.$set(this.params, "secret", 1);
      this.$emit("handleParams", this.params);
    },

    //借出
    async borrow() {
      if (this.devIds.length === 0) {
        this.$message.warning("请先选择设备！");
        return;
      }
      if (this.borrowSuccess) {
        this.$message.warning("已经借出，请不要重复借出！");
        return;
      }
      const params = {
        borrowId: this.applyId,
        devIdStr: this.devIds,
      };
      const res = await xtsBorrow(params);
      this.borrowSuccess = true;
      this.$message.success("借出成功！");
      this.$emit("reloadData");
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  display: flex;
  height: calc(90vh - 20px);
  .drawer-left {
    width: 50%;
    height: 100%;
    margin-right: 30px;
    margin-top: 10px;
    overflow-y: scroll;
    border: 1px solid rgba(231, 231, 231, 1);
  }
  .drawer-right {
    width: 48%;
  }
}
</style>
