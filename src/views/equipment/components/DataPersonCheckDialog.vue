<template>
  <div class="person-layout">
    <div class="dialog-btn-layout">
      <div class="handle send" @click="handleSend">确认送审</div>
    </div>
    <hr />
    <div class="person-dialog-layout">
      <div class="layout-box">
        <div class="title">机关单位</div>
        <div class="content">
          <el-tree
            :data="data"
            :props="defaultProps"
            class="trees"
            node-key="id"
            ref="trees"
            show-checkbox
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
  findParticipatorsGroundByOrgan,
  sendAuditMedia,
  sendAuditBorrow,
  sendAuditHander,
  sendAuditTakeout,
  sendAuditRecycle,
} from "@/api/data";
export default {
  components: {
    TreeSlot,
  },
  props: {
    pArams: {
      type: Object,
      default: () => {},
    },
    selection: {
      type: Array,
      default: () => [],
    },
    sendType: {
      type: String,
      default: "register",
    },
  },
  data() {
    return {
      sendClick: true,
      arrays: [],
      checkedNodes: [],
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      nodeId: "", //节点id
      form: {
        caption: "",
        id: "",
      },
      type: 1, //1登记  4外送  32移交  64销毁  128借用
      loading: false,
    };
  },
  created() {
    this.switchType(this.sendType);
    this.findParticipatorsGroundByOrgan();
  },
  methods: {
    switchType(sendType) {
      switch (sendType) {
        case "register":
          return (this.type = 1);
        case "borrow":
          return (this.type = 128);
        case "transfer":
          return (this.type = 32);
        case "deliver":
          return (this.type = 4);
        case "destory":
          return (this.type = 64);
      }
    },
    findParticipatorsGroundByOrgan() {
      try {
        this.loading = true;
        const params = {
          type: this.type,
          secretLevelStr: "",
          userId: this.$store.state.login.loginData.userId,
        };
        findParticipatorsGroundByOrgan(params).then((res) => {
          this.loading = false;
          // this.data = res.data;
        });
      } catch (error) {
        this.loading = false;
      }
    },

    handleSend() {
      if (!this.sendClick) return;
      this.sendClick = false;
      if (this.nodeId === "") {
        this.$message.info("请先选中送审人员");
        return;
      }

      const common = {
        id: this.pArams.id, //任务主键
        nodeId: this.nodeId, //节点主键
      };
      if (this.sendType === "register") {
        let paramsArray = this.selection?.map((item) => {
          return {
            id: item.id,
            createUserId: this.$store.state.login.loginData.userId, //申请人主键
            createUserName: this.$store.state.login.loginData.userName, //申请人名称
            nodeId: this.nodeId, //节点主键
            auditUserId: this.form.id, //审批人主键
            auditUserName: this.form.caption,
          };
        });
        if (Object.keys(this.pArams).length) {
          paramsArray = [
            {
              id: this.pArams.id,
              createUserId: this.$store.state.login.loginData.userId, //申请人主键
              createUserName: this.$store.state.login.loginData.userName, //申请人名称
              nodeId: this.nodeId, //节点主键
              auditUserId: this.form.id, //审批人主键
              auditUserName: this.form.caption,
            },
          ];
        }
        // const params1 = {
        //   ...common,
        //   createUserId: this.$store.state.login.loginData.userId, //申请人主键
        //   createUserName: this.$store.state.login.loginData.userName, //申请人名称
        //   auditUserId: this.form.id, //审批人主键
        //   auditUserName: this.form.caption,
        // };
        this.applyByType(sendAuditMedia(paramsArray));
      } else if (this.sendType === "borrow") {
        const params2 = {
          ...common,
          userId: this.$store.state.login.loginData.userId, //申请人主键
          userName: this.$store.state.login.loginData.userName, //申请人名称
          auditUserId: this.form.id, //审批人主键
          auditUserName: this.form.caption,
        };
        this.applyByType(sendAuditBorrow(params2));
      } else if (this.sendType === "transfer") {
        const params3 = {
          ...common,
          userId: this.$store.state.login.loginData.userId, //申请人主键
          userName: this.$store.state.login.loginData.userName, //申请人名称
          toUserId: this.form.id, //审批人主键
          toUserName: this.form.caption,
        };
        this.applyByType(sendAuditHander(params3));
      } else if (this.sendType === "deliver") {
        const params4 = {
          ...common,
          toUserId: this.form.id, //审批人主键
          toUserName: this.form.caption,
        };
        this.applyByType(sendAuditTakeout(params4));
      } else if (this.sendType === "destory") {
        const params5 = {
          ...common,
          applyUserId: this.$store.state.login.loginData.userId, //申请人主键
          applyUserName: this.$store.state.login.loginData.userName, //申请人名称
          toUserId: this.form.id, //审批人主键
          toUserName: this.form.caption,
        };
        this.applyByType(sendAuditRecycle(params5));
      }
    },
    async applyByType(promise) {
      const res = await promise;
      // this.$message.success(res.msg);
      this.$message({
        type: "success",
        duration: 1000,
        message: res.msg,
      });
      this.sendClick = true;
      this.$store.dispatch("login/getDataAuditBadge"); //获取资料待审批角标
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

<style lang="scss" src="./headerScss.scss" scoped></style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

::v-deep .el-tree-node__content{
  height: 33px;
}
::v-deep .el-icon-caret-right{
  font-size: 20px;
}
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
