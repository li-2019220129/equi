<template>
  <div class="person-layout">
    <div class="dialog-btn-layout">
      <div class="handle send" @click="handleSend">确认送审</div>
    </div>
    <hr />
    <div class="person-dialog-layout">
      <div class="layout-box">
        <div class="title">可选人员</div>
        <div class="content">
          <el-tree
            :data="data"
            :props="defaultProps"
            class="trees"
            node-key="id"
            ref="trees"
            v-loading="loading"
            @node-click="handleNodeClick"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <tree-slot :node="node" :data="data"></tree-slot>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="layout-box">
        <div class="title">已选人员</div>
        <div class="content">
          <div
            v-for="(item, index) of arrays"
            :key="index"
            class="content-chosen"
          >
            <div>
              <img
                src="@/assets/icon/人员 在位@2x.png"
                width="20px"
                height="20px"
              />
            </div>
            <div>{{ item.label }}</div>
            <div class="del">
              <img
                src="@/assets/icon/移除@2x.png"
                @click="handleDel(item.id)"
                width="18px"
                height="18px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeSlot from "@/components/TreeSlot/index.vue";
import {
  apply,
  submit,
  applyDeviceModify,
  applyTakeout,
  saveSendDestory,
} from "@/api/equipment/index";
import { findParticipators } from "@/api/system";
export default {
  components: {
    TreeSlot,
  },
  props: {
    pArams: {
      type: Object,
      default: () => {},
    },
    formLine: {
      type: Object,
      default: () => {},
    },
    sendType: {
      type: String,
      default: "register",
    },
  },
  data() {
    return {
      arrays: [],
      checkedNodes: [],
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      nodeId: "", //节点id
      form: {
        caption: "",
        id: "",
      },
      // createId: "",
      loading: false,
      type: 1, //1登记   16移交   32销毁  64借用  256外送
    };
  },
  created() {
    this.switchType(this.sendType);
    this.findParticipators();
  },
  methods: {
    switchType(sendType) {
      switch (sendType) {
        case "register":
          return (this.type = 1);
        case "borrow":
          return (this.type = 64);
        case "transfer":
          return (this.type = 16);
        case "deliver":
          return (this.type = 256);
        case "destory":
          return (this.type = 32);
      }
    },
    findParticipators() {
      try {
        this.loading = true;
        const secret = this.formLine.secret
          ? this.formLine.secret
          : this.pArams.secret;

        const params = {
          type: this.type,
          flag: 1,
          secretLevelStr: secret.toString(),
        };
        findParticipators(params).then((res) => {
          this.loading = false;
          this.data = res.data;
        });
      } catch (error) {
        this.loading = false;
      }
    },

    handleSend() {
      if (this.nodeId === "") {
        this.$message.info("请先选中送审人员");
        return;
      }

      const params = {
        id: this.pArams.id, //任务主键
        reason: this.formLine.reason, //原因用途
        applyUserId: this.$store.state.login.loginData.userId, //申请人主键
        applyUserName: this.$store.state.login.loginData.userName, //申请人名称
        nodeId: this.nodeId, //节点主键
        toUserId: this.form.id, //审批人主键
        toUserName: this.form.caption,
      };
      if (this.sendType === "register") {
        this.applyByType(apply(params));
        this.$store.dispatch("login/getRegisterBadge"); ////获取设备登记角标
      } else if (this.sendType === "borrow") {
        this.applyByType(submit(params));
        this.$store.dispatch("login/getBorrowBadge"); //获取设备借用角标
      } else if (this.sendType === "transfer") {
        this.applyByType(applyDeviceModify(params));
        this.$store.dispatch("login/getTransferBadge"); //获取设备移交角标
      } else if (this.sendType === "deliver") {
        this.applyByType(applyTakeout(params));
        this.$store.dispatch("login/getDeliverBadge"); //获取设备外送角标
      } else if (this.sendType === "destory") {
        this.applyByType(saveSendDestory(params));
        this.$store.dispatch("login/getDestoryBadge"); //获取设备销毁角标
      }
    },
    async applyByType(promise) {
      const res = await promise;
      this.$message.success(res.msg);
      this.$store.dispatch("login/getAuditBadge"); //获取设备待审批角标
      this.arrays = [];
      this.$emit("close");
    },

    handleNodeClick(node) {
      this.arrays = [];
      if (node.ntype === "User") {
        this.nodeId = node.nodeId;
        this.form.caption = node.label;
        this.form.id = node.id;
        this.arrays.push(node);
      }
    },

    handleDel(id) {
      this.arrays = this.arrays.filter((item) => item.id !== id);
    },
  },
};
</script>

<style lang="scss" src="./headerScss.scss" scoped ></style>

<style lang="scss" scoped>
@import "~@/styles/index.scss";

.person-layout {
  margin-bottom: 50px;

  .person-dialog-layout {
    display: flex;
    margin-top: 43px;
    @include center;
    .layout-box {
      width: 310px;
      height: 380px;
      border: 1px solid rgba(181, 184, 188, 1);
      border-radius: 2px;
      position: relative;
      overflow: auto;
      &:nth-child(2) {
        margin-left: 86px;
      }
      .title {
        position: absolute;
        height: 39px;
        width: 100%;
        background: #e7e7e7;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 18px;
        color: #3b3b3b;
        letter-spacing: 0;
        font-weight: 500;
        line-height: 39px;
        padding-left: 15px;
      }
      .content {
        position: absolute;
        top: 39px;
        width: 100%;
        height: 339px;
        .content-chosen {
          display: flex;
          height: 42.3px;
          width: 100%;
          @include left;
          font-size: 16px;
          color: #3b3b3b;
          font-weight: 400;
          position: relative;
          img {
            margin: 0 10px;
          }
          .del {
            position: absolute;
            right: 20px;
            display: none;
            cursor: pointer;
          }
          &:hover {
            background: #dff1ff;
          }
          &:hover .del {
            display: block;
          }
        }
      }
    }
  }
}
</style>
