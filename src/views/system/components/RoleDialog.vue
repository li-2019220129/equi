<template>
  <div class="person-layout">
    <div class="dialog-btn-layout">
      <div class="handle send" @click="handleSave">确认</div>
    </div>
    <hr />
    <el-form :model="form" label-width="100px" :rules="rules" ref="form">
      <el-form-item prop="name" label="角色名称">
        <el-input
          v-model="form.name"
          size="small"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="person-dialog-layout">
      <div class="layout-box">
        <div class="title">可选人员</div>
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
        <div class="title">已选人员</div>
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
      rules: { name: [{ required: true, message: "请填写角色名称" }] },
      form: { name: "" },
      props: {
        label: "caption",
        isLeaf: "isLeaf",
      },
      menuTreeSelected: [],
    };
  },
  mounted() {
    if (this.mode === "edit") {
      this.form = { name: this.node.name };
    }
    if (this.users) {
      this.menuTreeSelected = [...this.users];
    }
  },
  computed: {
    arrays() {
      return this.menuTreeSelected.filter((r) => r.caption !== "root");
    },
  },
  methods: {
    submitRoles() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const menuIds = this.menuTreeSelected.map((cur) => cur.id).join(",");
        const params = {
          ...this.form,
          enabled: true,
          userIds: menuIds,
        };
        if (this.mode === "edit") {
          params.id = this.node.id;
          params.sequence = this.node.sequence;
          updateXts(params).then((res) => {
            if (res.status === 200) {
              this.$message.success("操作成功");
              this.$emit("refresh", this.mode);
              // this.$emit("closed");
              this.$emit("closed");
            } else {
              this.$message.success("操作失败");
            }
          });
        } else {
          roleSaveApi(params).then((res) => {
            if (res.status === 200) {
              this.$message.success("操作成功");
              this.$emit("refresh", this.mode);
              this.$emit("closed");
            } else {
              this.$message.success("操作失败");
            }
          });
        }
      });
    },
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
      this.submitRoles();

    },
  },
};
</script>

<style lang="scss" src="../../equipment//components/headerScss.scss" scoped ></style>

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
