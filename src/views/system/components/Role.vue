<template>
  <div class="equipment-container">
    <div class="equipment-left">
      <div class="equipment-header">
        <div class="table-menu-item selected">角色列表</div>
      </div>
      <div
        class="equipment-button"
        style="margin: 20px 0 20px -50px; justify-content: flex-start"
      >
        <div class="equipment-button_btn" @click="handleAdd">
          <img src="@/assets/icon/选择设备@2x.png" />
          <span>添加</span>
        </div>
        <div class="equipment-button_btn" @click="handleDelete">
          <img src="@/assets/icon/icon-delete.png" />
          <span>删除</span>
        </div>
      </div>
      <el-tree
        v-if="expandedKey"
        :data="data"
        :current-node-key="defaultKey"
        :default-expanded-keys="expandedKey"
        default-expand-all
        :props="defaultProps"
        highlight-current
        node-key="id"
        ref="navTree"
        @node-click="nodeClick"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <!-- <div v-if="node.level === 1" class="tree-header"> -->
          <tree-slot :showIcon="false" :node="node" :data="data" class="tree-span" />
          <div class="tree-operate" v-if="currentNode.id === data.id">
            <img
              src="@/assets/icon/编辑@2x.png"
              @click="(e) => handleEdit(data, e)"
            />
          </div>
          <!-- </div> -->
          <!-- <div v-else class="tree-children">
            {{ data.name
            }}<span style="color: #606266; font-size: 12px">
              {{ data.organName ? ` - ${data.organName}` : "" }}</span
            >
          </div> -->
          <!-- <tree-slot :node="node" :data="data" class="tree-span" /> -->
          <!-- <div class="tree-operate" v-if="currentNode.id === data.id">
            <img
              src="@/assets/icon/编辑@2x.png"
              @click="(e) => handleEdit(data, e)"
            />
          </div> -->
        </div>
      </el-tree>
    </div>
    <div class="equipment-right">
      <MenuRole
        @handleEnbled="handleEnbled"
        mode="component"
        :menuData="menus"
        :currentRow="currentNode"
        @refresh="refresh"
        :isAll="currentNode ? allFlag[currentNode.id] : false"
      ></MenuRole>

      <leadal-dialog
        :visible="visible"
        :title="mode === 'add' ? '角色添加' : '角色编辑'"
        width="50%"
        class="dialog"
        :footer="false"
        @close="visible = false"
      >
        <template #content>
          <role-dialog
            v-if="visible"
            @closed="closed"
            :mode="mode"
            :node="currentNode"
            @refresh="refresh"
            :users="mode === 'add' ? [] : allUsers[currentNode.id]"
          />
        </template>
      </leadal-dialog>
    </div>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable";
import LeadalDialog from "@/components/LeadalDialog/Dialog.vue";
import TreeSlot from "@/components/TreeSlot";
import MenuRole from "./Menu.vue";
import RoleDialog from "./RoleDialog.vue";
import {
  roleFind,
  roleFindAll,
  roleOnUseApi,
  deleteRoleApi,
} from "@/api/system";
export default {
  name: "EquipmentCategory",
  components: {
    LeadalTable,
    TreeSlot,
    LeadalDialog,
    MenuRole,
    RoleDialog,
  },
  data() {
    return {
      defaultProps: {
        label: "name",
        isLeaf: "leaf",
        children: "children",
      },
      data: [],
      currentNode: null,
      menus: [],
      allMenus: {},
      allUsers: {},
      defaultKey: "",
      expandedKey: [],
      allFlag: {},
      visible: false,
      editVisible: false,
      mode: "add",
    };
  },
  created() {
    this.loadBaseData();
  },
  methods: {
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },

    loadBaseData() {
      roleFindAll().then((res) => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            const data = res.data
              .filter((item) =>
                ["sysadmin", "dept_audadmin", "zone_audadmin"].includes(
                  item.code
                )
              )
              .map((r, index) => {
                return { ...r, leaf: false, children: [] };
              });
            this.expandedKey = [data[0].id];
            this.data = data;
            this.currentNode = data[0];
            this.loadNode(data[0], "first");
          }
        }
      });
    },
    refresh(mode) {
      roleFindAll().then((res) => {
        if (res.status === 200) {
          if (mode === "edit") {
            this.data.forEach((r, index) => {
              r.name = res.data[index].name;
            });
            this.loadNode(this.currentNode, "refresh");
          } else {
            const array = this.data.map((r) => {
              return r.id;
            });
            res.data.forEach((r) => {
              if (array.indexOf(r.id) === -1) {
                this.data.push({ ...r, leaf: false, children: [] });
              }
            });
          }
        }
      });
    },
    closed() {
      this.visible = false;
    },
    handleEnbled(array) {
      roleOnUseApi({ roleId: this.currentNode.id, childMenus: array }).then(
        (res) => {
          this.$message.success(res.msg);
        }
      );
    },
    enabled(row) {
      return row.childMenus
        .filter((r) => r.enabled)
        .map((r) => {
          return r.id;
        });
    },
    nodeClick(data, node) {
      if (node.level === 1) {
        this.currentNode = data;
        const array = this.allMenus[data.id];
        if (array) {
          this.menus = array;
        } else {
          this.loadNode(node.data, "first");
        }
      } else {
        this.currentNode = node.parent.data;
        const array = this.allMenus[node.parent.data.id];
        if (array) {
          this.menus = array;
        }
        if(this.$refs.tree)this.$refs.tree.setCurrentKey(node.parent.data.id);
      }
    },
    loadNode(data, type) {
      roleFind(data.id)
        .then((res) => {
          if (res.status === 200) {
            const flag = res.data.flag;
            this.allFlag[data.id] = flag;
            const array = res.data.menuViews.map((r) => {
              const enabledArray = this.enabled(r);
              return {
                ...r,
                enabledArray,
                isAll: enabledArray.length === r.childMenus.length,
              };
            });
            const users = res.data.users?.map((r) => {
              return {
                ...r,
                caption: r.userName,
                id: r.userId,
                leaf: true,
                name: r.userName,
                disabled: true,
              };
            });
            this.allUsers[data.id] = users;
            if (!users || users.length === 0) {
              const newData = [];
              this.data.forEach((r) => {
                if (r === data) {
                  newData.push({ ...r, leaf: true, children: [] });
                } else {
                  newData.push(r);
                }
              });
              this.data = [...newData];
            } else {
              if (type === "refresh") {
                if (data.leaf) {
                  const newData = { ...data };
                  if (users.length > 0) {
                    newData.leaf = false;
                    newData.children = users;
                  }
                  const newArray = this.data.map((r) => {
                    if (r === data) {
                      return newData;
                    }
                    return r;
                  });
                  this.data = newArray;
                } else {
                  this.$refs.tree.updateKeyChildren(data.id, users);
                }
              } else {
                data.children = users;
              }
            }
            setTimeout(() => {
              if (this.$refs.tree) {
                this.$refs.tree.setCurrentKey(data.id);
              }
            }, 10);
            this.allMenus[data.id] = array;
            this.menus = array;
          }
        })
        .catch((_) => {});
    },
    handleAdd() {
      this.mode = "add";
      this.node = {};
      this.users = [];
      this.visible = true;
    },
    handleEdit(data, e) {
      e.stopPropagation();
      this.mode = "edit";
      this.visible = true;
    },
    handleDelete() {
      this.$confirm(`确认要删除${this.currentNode.name}吗？`, "角色删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除授权用户
          deleteRoleApi({ idStr: this.currentNode.id }).then((res) => {
            if (res.status === 200) {
              this.$message.success("删除成功！");
              this.$refs.tree.remove(this.currentNode);
              if (this.$refs.tree.root.childNodes.length > 0) {
                const data = this.$refs.tree.root.childNodes[0].data;
                this.currentNode = data;
                const array = this.allMenus[data.id];
                if (array) {
                  this.menus = array;
                }
                this.$refs.tree.setCurrentKey(data.id);
                this.refresh();
              }
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>

::v-deep .el-tree-node__content > label.el-checkbox {
  margin-right: -18px;
  margin-left: 20px;
  margin-top: -3px;
}

// 对树的样式进行修改
::v-deep .el-tree-node__content {
  height: 38px;
  // padding-left: 20px !important;
}

.custom-tree-node {
  width: 100%;
  height: 100%;
}

// 树形控件

.leadal-menu-tree .el-tree {
  color: #3b3b3b;
}
.leadal-menu-tree .el-tree-node__label {
  font-size: 20px;
}
.leadal-menu-tree .el-tree-node__content:hover {
  background-color: #dff1ff;
}
.leadal-menu-tree
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #dff1ff;
}

// 树样式

::v-deep .el-tree-node__expand-icon {
  /* display: none;
  color: rgba(16, 127, 201, 0.438);*/
  font-size: 24px;
}

// .el-tree-node__content {
//   margin-left: 20px;
// }

.child-triangle {
  transition: all 0.3s;
  margin-left: -20px;
  &.rodge {
    transform: rotate(90deg);
  }
  &.treeTriangle {
    margin: 0 30px !important;
    margin-left: -50px !important;
  }
  &.treeTriangleSelect {
    margin: 0 30px !important;
    margin-left: -40px !important;
  }
}

::v-deep .el-tree-node__loading-icon {
  /* margin-right: 8px; */
  font-size: 14px;
  margin: 0 0 0 3px;
  color: #c0c4cc;
  position: absolute;
  // left: 0;
}
.equipment-container {
  display: flex;
  height: 100vh;
  .equipment-left {
    width: 290px;
    margin-right: 20px;
    background: #fff;
    border: 1px solid #b4b4b4;
    border-radius: 10px;
    padding: 10px;
    height: 96%;
  }
  .equipment-right {
    flex: 1;
    background: #fff;
    border: 1px solid #b4b4b4;
    border-radius: 10px;
    padding: 10px;
    height: 96%;
  }
}
.custom-tree-node {
  position: relative;
  .tree-operate {
    position: absolute;
    right: 0;
    top: 10px;
  }
  img {
    width: 20px;
    height: 20px;
    margin-left: 5px;
  }
}
</style>
