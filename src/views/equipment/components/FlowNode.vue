<template>
  <div class="full-node">
    <div class="arrow-box">
      <div
        class="el-badge__content el-badge__content is-fixed"
        @click="removeClick"
      >
        一
      </div>
      <el-popover
        placement="bottom"
        width="250"
        trigger="click"
        v-model="visible"
      >
        <el-input
          size="small"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
        >
        </el-input>

        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          :default-checked-keys="defaultArray"
          :filter-node-method="filterNode"
          show-checkbox
          ref="tree"
          highlight-current
          node-key="id"
          @check="handleCheck"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <tree-slot
              :showIcon="false"
              :node="node"
              :data="data"
              :isSelect="true"
              :checkbox="true"
            ></tree-slot>
          </div>
        </el-tree>
        <div class="node-title" :title="title" slot="reference">
          {{ title }}
        </div>
      </el-popover>
      <div
        class="el-icon-arrow-right"
        style="margin-top: 2px; cursor: pointer"
      ></div>
    </div>
    <div class="node-out" @click="addClick">
      <div class="node">+</div>
    </div>
  </div>
</template>

<script>
import { userTree } from "@/api/common";
import TreeSlot from "@/components/TreeSlot/index.vue";
export default {
  name: "flow-node",
  props: {
    title: String,
    id: String,
    index: { type: Number, require: true },
    nodes: {
      type: Array,
      default: () => [],
    },
    defaultArray: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TreeSlot,
  },
  data() {
    return {
      visible: false,
      userId: "",
      userName: "",
      filterText: "", //过滤文字
      data: [], //树的数据
      defaultProps: {
        children: "children",
        label: "caption",
        isLeaf: "leaf",
      },
      participatorList: [],
    };
  },
  created() {
    this.getData();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    //处理复选框选中
    handleCheck(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      const cNode = checkedKeys.checkedNodes;
      cNode.forEach((item) => {
        if (item.ntype === "User") {
          this.userId = item.id;
          this.userName = item.caption;
        }
      });
      const arr = cNode.filter((item) => item.ntype === "User");
      this.participatorList = arr.map((item) => {
        return {
          userId: item.id,
          userName: item.caption,
        };
      });
      this.$emit(
        "change",
        {
          userId: this.userId,
          userName: this.userName,
          participatorList: this.participatorList,
        },
        this.index
      );
      this.visible = false;
    },

    getData() {
      userTree().then((res) => {
        this.data = res.data;
      });
    },

    addClick() {
      this.$emit("addNode", {
        id: this.id,
        title: this.title,
        participatorList: this.participatorList,
        index: this.index,
      });
    },
    removeClick() {
      this.$emit("removeNode", {
        id: this.id,
        title: this.title,
        participatorList: this.participatorList,
        index: this.index,
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.caption.indexOf(value) !== -1;
    },
  },
};
</script>

<style lang="scss" scoped>
/* ::v-deep .el-tree-node__content > label.el-checkbox {
  margin-right: -18px;
  margin-left: 20px;
  margin-top: -3px;
} */
::v-deep .el-icon-arrow-right {
  display: none;
}

// 对树的样式进行修改
::v-deep .el-tree-node__content {
  height: 38px;
  // padding-left: 20px !important;
}
.custom-tree-node{
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
  /* display: none; */
  font-size:20px;
}




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
  &.treeTriangleSelect{
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
.full-node {
  text-align: center;
  width: 100px;
  font-size: 14px;

  animation: showNode 0.4s 1;
  // animation-direction: .3s;
}

@keyframes showNode {
  from {
    margin-right: 0px;
  }
  to {
    margin-right: 64px;
  }
}
.node {
  width: 16px;
  height: 16px;
  color: white;
  background: #00a0f0;
  border-radius: 50%;
  //   margin: 5px 0 0 5px;
  cursor: pointer;
}
.node-out {
  width: 26px;
  height: 26px;
  text-align: center;
  border-radius: 50%;
  background: #00a0f030;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 37px;
  margin-top: 16px;
}
.node-out:hover {
  background: #00a0f060;
}
.arrow-box {
  display: flex;
  justify-content: flex-end;
  color: white;
  padding: 12px 12px 12px 12px;
  height: 40px;
  position: relative;
  background: #00a0f0;
  border-radius: 2px;
  // border: 4px solid #c2e1f5;
}
// .arrow-box:hover {
//   color: rgba(255, 255, 255, 0.692);
// }
.arrow-box:after,
.arrow-box:before {
  top: 100%;
  left: 70%;
  border: solid transparent;
  content: " ";
  position: absolute;
  pointer-events: none;
}

.arrow-box:after {
  border-color: rgba(136, 183, 213, 0);
  border-top-color: #00a0f0;
  border-width: 10px;
  margin-left: -30px;
}

::v-deep .el-badge__content {
  background-color: #f56c6c;
  border-radius: 50%;
  color: #ffffff;
  display: inline-block;
  font-size: 10px;
  height: 18px;
  line-height: 18px;
  padding: 0 3px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #ffffff;
  cursor: pointer;
}
::v-deep.el-badge__content:hover {
  background-color: #f05252fb;
}

.ld-badge__content {
  background-color: #f56c6c;
  border-radius: 50%;
  color: #ffffff;
  display: inline-block;
  font-size: 10px;
  height: 18px;
  line-height: 18px;
  padding: 0 3px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #ffffff;
  cursor: pointer;
}
.ld-badge__content.is-fixed {
  position: absolute;
  top: 0;
  right: 10px;
  transform: translateY(-50%) translateX(100%);
}
.filter-tree {
  max-height: 420px;
  overflow: auto;
  margin-top: 12px;
  //   min-height: 60px;
}
.node-title {
  width: 78px;
  cursor: pointer;
  height: 30px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
