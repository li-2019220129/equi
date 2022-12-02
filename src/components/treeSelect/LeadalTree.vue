<template>
  <div class="leadal-tree-css">
    <!-- 多选 -->
    <template v-if="mode == 'multiple'">
      <el-select
        style="width: 100%"
        v-model="names"
        multiple
        @change="changePerson"
        @clear="clear"
        @visible-change="clearText"
      >
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="width: 90%; margin-left: 15px"
        >
        </el-input>
        <el-option style="height: auto" :value="selectRow">
          <el-tree
            :props="defaultProps"
            :data="data"
            node-key="id"
            :default-checked-keys="defaultArray"
            show-checkbox
            ref="treeSearch"
            class="tree-no-background"
            :filter-node-method="filterNode"
            @check="checkedList"
            :lazy="lazy"
            :load="lazy ? loadNode : null"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <tree-slot :node="node" :data="data" :checkbox="true"></tree-slot>
            </div>
          </el-tree>
        </el-option>
      </el-select>
    </template>
    <!-- 单选 -->
    <template v-else>
      <el-select
        v-model="user"
        style="width: 100%"
        clearable
        @change="changeData"
      >
        <el-option
          style="height: auto"
          :value="user"
          @visible-change="clearText"
        >
          <el-tree
            :highlight-current="true"
            :props="defaultProps"
            node-key="id"
            :data="data"
            class="tree-no-background"
            ref="treeSearch"
            :current-node-key="nodeId"
            @node-click="handleNodeClick"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <tree-slot :node="node" :data="data"></tree-slot>
            </div>
          </el-tree>
        </el-option>
      </el-select>
    </template>
  </div>
</template>
<script>
// import {
//   unAuthedUsersAllTrue,
//   getOrganUserTree,
//   getOrganTree,
// } from "@/api/config/common";
import TreeSlot from "@/components/TreeSlot/index.vue";

import { setTimeout } from "timers";

import { date } from "jszip/lib/defaults";
export default {
  name: "LeadalTree",
  components: { TreeSlot },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "label",
        };
      },
    },
    mode: {
      type: String,
      default: () => "multiple",
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "",
    },
    isCheck: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 多选
      ids: "",
      names: [], // 协办人员
      selectRow: [],
      filterText: "",
      defaultArray: [],
      // 单选
      user: "",
      nodeId: "",
      nodeItem: {},
      keys: "",
    };
  },
  watch: {
    filterText(val) {
      this.$emit("clear");
      this.$refs.treeSearch.filter(val);
    },
  },
  destroyed() {},
  methods: {
    clearText(val) {
      if (!val) {
        this.filterText = "";
      }
    },
    clear() {
      this.$emit("clear");
    },
    setUserNameFun(array) {
      this.names = [];
      array.forEach((item) => {
        if (typeof item[this.defaultProps.label] !== "undefined") {
          this.names.push(item[this.defaultProps.label]);
        }
      });

      this.names = [...new Set(this.names)];
      this.selectRow = array;
    },
    changePerson(event) {
      // 这个event数组只有label
      // 这里主要处理框内选中项的取消选中
      var ids = "";

      const arrNew = [];
      this.selectRow.forEach((item) => {
        event.forEach((eventItem) => {
          if (
            typeof item[this.defaultProps.label] !== "undefined" &&
            eventItem == item[this.defaultProps.label]
          ) {
            arrNew.push(item);
          }
        });
      });
      this.$refs.treeSearch.setCheckedNodes(arrNew);
      this.setUserNameFun(arrNew);
      const res = this.$refs.treeSearch.getCheckedNodes(true, true);
      for (var i in res) {
        if (i == 0) {
          ids = res[i].id;
        } else {
          ids += "," + res[i].id;
        }
      }
      this.ids = ids;
    },
    filterNode(value, data) {
      if (!value) return true;
      if (typeof data[this.defaultProps.label] === "undefined") {
        return true;
      }
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 复选框勾选节点
    checkedList() {
      setTimeout(() => {
        const list = this.$refs.treeSearch.getCheckedNodes();
        const filterList = list.filter((item) => {
          return item.ntype == this.type;
        });
        const res = !this.type ? list : filterList;
        this.setUserNameFun(res);
        this.ids = res
          .map((item) => {
            return item.id;
          })
          .join(",");
        // 切换勾选状态，同步数据（防止校验报错）
        this.$emit("change-option", {
          names: this.names,
          ids: this.ids,
          selectRow: this.selectRow,
        });
      }, 100);
    },
    // -------------单选-------------------
    loadNode(node, resolve) {
      // this.$emit('load-node', {node, resolve})
      let id = null;
      if (node.level === 0) {
        id = null;
      } else {
        id = node.data.id;
      }
      getOrganTree(id).then((res) => {
        const treeArray = res.value.tree.map((item) => {
          if (!item.hasChild) {
            this.$set(item, "leaf", true);
          }
          return item;
        });
        resolve(treeArray);
      });
    },
    // 设置回显
    setValue(ids) {
      if (this.mode != "multiple") {
        if (!ids) {
          this.nodeId = "";
          this.user = "";
          this.nodeItem = {};
        } else {
          this.$refs.treeSearch.setCurrentKey(ids);
          this.handleNodeClick();
        }
      } else {
        this.$refs.treeSearch.setCheckedKeys(ids);
        this.checkedList();
      }
    },
    // 获取节点
    getValue() {
      if (this.mode != "multiple") {
        return {
          data: this.nodeItem,
        };
      } else {
        return {
          names: this.names, // 名称数组
          ids: this.ids, // id拼接字符串
          data: this.selectRow, // 勾选行数据
        };
      }
    },

    changeData(data) {
      this.$emit("changeClear", data);
    },

    // 单选点击
    handleNodeClick(data) {
      // console.log(data,1111111);

      if (!data) {
        data = this.$refs.treeSearch.getCurrentNode();
      }
      if (!data || typeof data[this.defaultProps.label] === "undefined") {
        return;
      }

      if (this.type) {
        if (data.ntype == this.type) {
          this.nodeItem = data;
          this.user = data[this.defaultProps.label];
          // 切换勾选状态，同步数据（防止校验报错）
          this.$emit("change-option", {
            data,
          });
        }
      } else {
        this.nodeItem = data;
        this.user = data[this.defaultProps.label];
        // 切换勾选状态，同步数据（防止校验报错）
        this.$emit("change-option", {
          data,
        });
      }
    },

    //树过滤
    recursiveFilter(arr, id) {
      let data = arr
        .filter((item) => item.id == id)
        .map((item) => {
          item = Object.assign({}, item);
          if (item.children) {
            //递归循环
            item.children = this.recursiveFilter(item.children, id);
          }
          return item;
        });
      return data;
    },
  },
};
</script>
<style scoped>
::v-deep .el-tree-node__label {
  font-size: 16px;
  font-weight: normal;
}
/* ::v-deep .el-select-dropdown__item{
  padding: 0;
} */
</style>

