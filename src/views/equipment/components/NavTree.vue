<template>
  <el-scrollbar style="height: 100%">
    <el-tree
      :data="navTreeList"
      default-expand-all
      :current-node-key="currentLivingId"
      :props="defaultProps"
      highlight-current
      node-key="id"
      ref="navTree"
      @node-click="changeComponents"
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <tree-slot :node="node" :data="data" :isNumber="true" />
      </div>
    </el-tree>
  </el-scrollbar>
</template>
<script>
import TreeSlot from "@/components/TreeSlot";
export default {
  name: "NavTree",
  components: {
    TreeSlot,
  },
  data() {
    return {
      registerNum: 1,
      cloneNavTreeList: [],
      navTreeList: [
        {
          id: "1",
          label: "涉密设备",
          hasChild: true,
          flag: true,
          parentId: "",
          children: [
            {
              id: "1-1",
              label: "设备登记",
              parentId: "1",
            },
            {
              id: "1-2",
              label: "设备分类",
              parentId: "1",
              code: "xtsType",
            },
            {
              id: "1-3",
              label: "设备借用",
              parentId: "1",
            },
            {
              id: "1-5",
              label: "设备外送",
              parentId: "1",
            },
            {
              id: "1-4",
              label: "设备移交",
              parentId: "1",
            },
            {
              id: "1-6",
              label: "设备销毁",
              parentId: "1",
            },
            {
              id: "1-7",
              label: "设备台账",
              parentId: "1",
            },
          ],
        },

        {
          id: "2",
          label: "涉密资料",
          hasChild: true,
          flag: true,
          parentId: "",
          children: [
            {
              id: "2-1",
              label: "资料登记",
              parentId: "2",
            },
            {
              id: "2-2",
              label: "资料分发",
              parentId: "2",
            },
            {
              id: "2-3",
              label: "资料分类",
              parentId: "2",
            },
            {
              id: "2-4",
              label: "资料借阅",
              parentId: "2",
            },
             {
              id: "2-5",
              label: "资料外送",
              parentId: "2",
            },
            {
              id: "2-6",
              label: "资料移交",
              parentId: "2",
            },
            // {
            //   id: "2-6",
            //   label: "资料外送",
            //   parentId: "2",
            // },
            {
              id: "2-7",
              label: "资料销毁",
              parentId: "2",
            },
            {
              id: "2-8",
              label: "资料台账",
              parentId: "2",
            },
          ],
        },

        {
          id: "3",
          label: "涉密载体审批",
          hasChild: true,
          flag: true,
          parentId: "",
          code: "smaudit",
          children: [
            {
              id: "3-1",
              label: "待审批",
              parentId: "3",
              code: "smauditing",
            },
            {
              id: "3-2",
              label: "已审批",
              parentId: "3",
              code: "smaudited",
            },
          ],
        },
        {
          id: "4",
          label: "系统设置",
          hasChild: true,
          flag: true,
          parentId: "",
          code: "systemSet",
          children: [
            {
              id: "4-1",
              label: "菜单权限",
              parentId: "4",
              code: "xtsMenu",
            },
            {
              id: "4-2",
              label: "用户角色",
              parentId: "4",
              code: "xtsRole",
            },
            {
              id: "4-3",
              label: "流程配置",
              parentId: "4",
              code: "xtsFlow",
            },
            {
              id: "4-4",
              label: "全局配置",
              parentId: "4",
              code: "xtsGlobal",
            },
            {
              id: "4-5",
              label: "审批单配置",
              parentId: "4",
              code: "xtsAudit",
            },
          ],
        },
      ],
      defaultProps: {
        label: "label",
        children: "children",
      },
      currentLivingId: "1-1",
    };
  },
  created() {
    this.filterArr();
  },
  mounted() {},
  methods: {
    changeComponents(node) {
      this.$emit("update:componentsId", node.label);
    },
    filterArr() {
      this.$store.dispatch("login/userAuth");
      //隐藏涉密设备没有权限的子菜单
      const authArray = this.$store.state.login.userAuth;
      this.navTreeList.map((item) => {
        if (item.label === "涉密设备") {
          const arr = item.children.filter((ele) =>
            authArray.menu.includes(ele.label)
          );
          item.children = arr;
        } else if (item.code === "smaudit") {
          const arr = item.children.filter((ele) =>
            authArray.childMenu.includes(ele.code)
          );
          item.children = arr;
        } else if (item.code === "systemSet") {
          const arr = item.children.filter((ele) =>
            authArray.childMenu.includes(ele.code)
          );
          item.children = arr;
        }
      });

      this.cloneNavTreeList = this.$cloneDeep(this.navTreeList);

      //过滤不是系统管理员和保密员
      const managerArray = ["sysadmin", "zone_audadmin"];
      const filterArray = authArray.childMenu.filter((item) =>
        managerArray.some((it) => item === it)
      );
      if (Array.isArray(filterArray) && filterArray.length === 0) {
        this.navTreeList = this.cloneNavTreeList.filter(
          (item) => item.label !== "系统设置"
        );
      }

      //过滤没有子级的菜单
      this.navTreeList = this.navTreeList.filter(
        (item) => item.children.length !== 0
      );
    },
  },
};
</script>

<style lang="scss" scoped>
// 树的样式 修改大集合

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
  display: none;
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
</style>
