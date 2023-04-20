<template>
  <div class="person-layout">
    <div class="dialog-btn-layout">
      <div class="handle send" @click="handleSave">确认分发</div>
    </div>
    <hr />
    <div class="person-dialog-layout">
      <div class="layout-box">
        <div class="title">机关单位</div>
        <div class="content">
          <el-tree
            ref="tree"
            node-key="id"
            @check="menusTreeCheck"
            :props="props"
            :load="fetchUserTree"
            lazy
            show-checkbox
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <tree-slot :node="node" :data="data"></tree-slot>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="layout-box">
        <div class="title">接收人</div>
        <div class="content">
          <div v-for="user of arrays" :key="user.id" class="content-chosen">
            <div>
              <img
                src="@/assets/icon/人员 在位@2x.png"
                width="20px"
                height="20px"
              />
            </div>
            <div>{{ user.caption }}</div>
            <div class="del">
              <img
                src="@/assets/icon/移除@2x.png"
                @click="handleRemove(user)"
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
import { roleSaveApi, userTree, updateXts } from "@/api/system";
export default {
  components: {
    TreeSlot,
  },
  props: {
    mode: String,
    node: Object,
    users: Array,
  },
  data() {
    return {
      props: {
        label: "caption",
        isLeaf: "isLeaf",
      },
      menuTreeSelected: [],
    };
  },
  computed: {
    arrays() {
      return this.menuTreeSelected.filter((r) => r.caption !== "root");
    },
  },
  methods: {
    handleRemove(user) {
      const index = this.menuTreeSelected.indexOf(user);
      if (index !== -1) {
        this.menuTreeSelected.splice(index, 1);
        this.$refs.tree.setCheckedKeys(
          this.menuTreeSelected.map((r) => {
            return r.id;
          })
        );
      }
    },
    menusTreeCheck(cur, all) {
      this.menuTreeSelected = all.checkedNodes.filter((r) => !r.hasChild);
    },
    async fetchUserTree(node, resolve) {
      let id = null;
      if (node.level !== 0) {
        id = node.data.id;
      }
      userTree(id).then((res) => {
        if (res.status == 200) {
          this.$refs.tree.setCheckedKeys(
            this.menuTreeSelected.map((r) => {
              return r.id;
            })
          );
          resolve(
            res.data.map((r) => {
              return { ...r, isLeaf: !r.hasChild };
            })
          );
        }
      });
    },
    handleSave() {
      if (this.menuTreeSelected.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择接收人！",
        });
        return
      }
      this.$emit("handleSave", this.menuTreeSelected);
    },
  },
};
</script>

<style
  lang="scss"
  src="../../equipment//components/headerScss.scss"
  scoped
></style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
::v-deep .el-tree-node__content > label.el-checkbox {
  margin-right: 0px;
  margin-left: 10px;
}
::v-deep .el-tree-node__expand-icon {
  font-size: 22px;
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
