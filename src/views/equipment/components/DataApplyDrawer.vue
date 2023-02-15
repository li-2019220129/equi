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
            ref="applyMessage"
            @saveApply="saveApply"
            @pdfSrcDelete="pdfSrcDelete"
            @pdfSrcSuccess="pdfSrcSuccess"
            :mediaData.sync="mediaData"
          />
        </keepAlive>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import DataApplyMessage from "./DataApplyMessage.vue";
import RelativeFile from "./RelativeFile.vue";
import HandleProcess from "./HandleProcess.vue";
import pdf from "vue-pdf";
import { cancelHander, saveCancelTakeout, saveDraftRecycle } from "@/api/data";
export default {
  name: "BorrowDrawer",
  components: {
    DataApplyMessage,
    RelativeFile,
    HandleProcess,
    pdf
  },
  props: {
    applyId: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: ""
    }
  },
  inject: ["root"],
  created() {},
  data() {
    return {
      id: true,
      preserve: false,
      drawerTitle: this.root.drawerTitle,
      activeTab: 1,
      isDetail: this.root.isDetail,
      pdfSrc: null,
      componentName: "DataApplyMessage",
      saveStatus: 0, //是否可发送
      applyOrganId: this.$store.state.login.loginData.organId, //申请部门id
      transferParams: {}, //移交参数
      deliverParams: {}, //外送参数
      destoryParams: {}, //销毁参数
      isNeedMeida: false, //是否需要添加资料
      mediaData: 0 //资料信息列表长度
    };
  },
  watch: {
    activeTab(val) {
      switch (val) {
        case 1:
          this.componentName = "DataApplyMessage";
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
      console.log(this.mode, this.preserve, "89898");
      if (!this.preserve && this.mode == "add") {
        this.$message.warning("请先保存后在进行操作！");
        return;
      }
      this.activeTab = 2;
    },
    //保存
    save() {
      this.$refs.applyMessage.saveApply();
    },
    saveApply(p) {
      const params = {
        // id: p.id,
        content: p.content,
        // userId: p.userId,
        // userName: p.userName,
        // receiveUserId: p.receiveUserId,
        // receiveUserName: p.receiveUserName,
        nodeId: p.nodeId,
        reason: p.reason,
        toUserId: p.toUserId,
        toUserName: p.toUserName
      };

      if (this.mediaData === 0) {
        this.$message.error("请选择资料！");
        return;
      }

      // //如果有申请人id，代表是编辑
      // if (this.applyId) {
      //   this.$set(params, "id", this.applyId);
      // }

      if (this.drawerTitle === "资料移交") {
        this.transferParams = {
          ...params,
          id: p.id,
          userId: p.userId,
          userName: p.userName,
          receiveUserId: p.receiveUserId,
          receiveUserName: p.receiveUserName
        };
        this.saveTheApply(cancelHander(this.transferParams));
      } else if (this.drawerTitle === "资料外送") {
        this.deliverParams = {
          ...params,
          id:p.id,
          takeoutId: p.id,
          currentUserId: p.userId,
          currentUserName: p.userName,
          receiveUserId: p.receiveUserId,
          receiveUserName: p.receiveUserName
        };
        this.saveTheApply(saveCancelTakeout(this.deliverParams));
      } else if (this.drawerTitle === "资料销毁") {
        this.destoryParams = {
          ...params,
          id: p.id,
          applyUserId: p.userId,
          applyUserName: p.userName,
          recycleUserId: p.receiveUserId, //回收人主键
          recycleUserName: p.receiveUserName //回收人名称
        };
        this.saveTheApply(saveDraftRecycle(this.destoryParams));
      }
    },
    async saveTheApply(promise) {
      const res = await promise;
      if (res.status === 200) {
        // this.$message.success("保存成功！");
        this.$message({
            duration:1000,
            type:'success',
            message:'保存成功'
          })
        this.saveStatus = 1;
        this.id = res.data.id;
        this.preserve = true;
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
      this.drawerTitle === "资料移交"
        ? (params = this.transferParams)
        : this.drawerTitle === "资料外送"
        ? (params = this.deliverParams)
        : this.drawerTitle === "资料销毁"
        ? (params = this.destoryParams)
        : "";
      console.log(params, 33333333333333333);
      this.$emit("handleParams", params);
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
