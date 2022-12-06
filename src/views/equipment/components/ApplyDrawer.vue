<template>
  <div>
    <div class="drawer-header">
      <div class="drawer-header title">{{ drawerTitle }}申请</div>
      <div class="equipment-button" v-show="!isDetail">
        <div class="equipment-button_btn" @click="save">
          <img src="@/assets/icon/保存@2x.png" />
          <span>保存</span>
        </div>
        <div class="equipment-button_btn" @click="send">
          <img src="@/assets/icon/发送@2x.png" />
          <span>发送</span>
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
        <component
          :is="componentName"
          v-bind="$attrs"
          :applyId="applyId"
          :id="id"
          ref="applyMessage"
          :drawerTitle="drawerTitle"
          @saveApply="saveApply"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ApplyMessage from "./ApplyMessage.vue";
import RelativeFile from "./RelativeFile.vue";
import HandleProcess from "./HandleProcess.vue";
import { saveDeviceModify, saveTakeout, saveDestory } from "@/api/equipment";
export default {
  name: "BorrowDrawer",
  components: {
    ApplyMessage,
    RelativeFile,
    HandleProcess,
  },
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
  inject: ["root"],
  created() {},
  data() {
    return {
      preserve: false,
      drawerTitle: this.root.drawerTitle,
      title: this.root.title,
      isDetail: this.root.isDetail,
      activeTab: 1,
      componentName: "ApplyMessage",
      saveStatus: 0, //是否可发送
      applyOrganId: this.$store.state.login.loginData.organId, //申请部门id
      transferParams: {}, //移交参数
      deliverParams: {}, //外送参数
      destoryParams: {}, //销毁参数
      id: "", //编辑id
      secret: "", //设备密级
    };
  },
  watch: {
    activeTab(val) {
      switch (val) {
        case 1:
          this.componentName = "ApplyMessage";
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
    save() {
      console.log("121212121290900");
      this.$refs.applyMessage.saveApply();
    },
    saveApply(p) {
      if (!p.devId) {
        this.$message.error("请选择设备！");
        return;
      }
      this.$refs.applyMessage.applyFlags();
      //设备密级
      this.secret = p.secret;

      const params = {
        applyContent: p.applyContent,
        applyUserId: p.applyUserId,
        applyUserName: p.applyUserName,
        // id: p.id,
        nodeId: p.nodeId,
        // ownerUserId:p.ownerUserId,
        // ownerUserName:p.ownerUserName,
        reason: p.reason,
        toUserId: p.toUserId,
        toUserName: p.toUserName,
        secret: p.secret,
      };
      //如果有申请人id，代表是编辑
      if (this.applyId) {
        this.$set(params, "id", this.applyId);
      }

      if (this.drawerTitle === "设备移交") {
        this.transferParams = {
          ...params,
          devId: p.devId,
          modifyType: p.modifyType,
          modifyUserId: p.modifyUserId,
          modifyUserName: p.modifyUserName,
        };
        this.saveTheApply(saveDeviceModify(this.transferParams));
      } else if (this.drawerTitle === "设备外送") {
        this.deliverParams = {
          ...params,
          deviceIdStr: p.devId,
          receiveUserId: p.modifyUserId,
          receiveUserName: p.modifyUserName,
        };
        this.saveTheApply(saveTakeout(this.deliverParams));
      } else if (this.drawerTitle === "设备销毁") {
        this.destoryParams = {
          ...params,
          deviceIdStr: p.devId,
          receiveUserId: p.modifyUserId,
          receiveUserName: p.modifyUserName,
        };
        this.saveTheApply(saveDestory(this.destoryParams));
      }
    },
    async saveTheApply(promise) {
      const res = await promise;
      if (res.status === 200) {
        this.$message.success("保存成功！");
        this.saveStatus = 1;
        this.preserve  = true
        this.id = res.data;
        this.$emit("saveApply");
      } else {
        this.$message.error(res.msg);
      }
    },
    //发送
    send() {
      if (this.saveStatus === 0) {
        this.$message.error("请先保存再进行送审！");
        return;
      }
      let params = {};
      this.drawerTitle === "设备移交"
        ? (params = this.transferParams)
        : this.drawerTitle === "设备外送"
        ? (params = this.deliverParams)
        : this.drawerTitle === "设备销毁"
        ? (params = this.destoryParams)
        : "";
      this.$set(params, "id", this.id);
      this.$set(params, "secret", this.secret);
      this.$emit("handleParams", params);
    },
  },
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
