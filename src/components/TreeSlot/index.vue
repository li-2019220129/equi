<template>
  <div>
    <template v-if="data.parentId === ''">
      <div @click="triangle(data)" class="tree-slot-node">
        <span v-if="showIcon" :class="{ 'tree-patent': data.flag }">
          <i
            v-if="data.flag"
            class="el-icon-caret-right parent-triangle"
            :class="{
              treeTriangle: checkbox,
              rodge: !data.hasChild,
              treeTriangleSelect: isSelect && checkbox,
            }"
          ></i>
        </span>

        <span
          class="tree-text"
          style="font-size: 20px"
          :class="{
            'terr-margin': !data.flag && showIcon,
            'tree-margin-select': isSelect && !data.flag,
          }"
          >{{ node.label }}</span
        >

        <div class="permission-position">{{ data.permission }}</div>
      </div>
    </template>

    <div
      v-else
      class="tree-text tree-slot-node"
      style="font-size: 16px; padding-left: 25px !important"
    >
      <i
        class="el-icon-arrow-right child-triangle"
        v-if="data.flag"
        :class="{
          treeTriangle: checkbox,
          rodge: !data.hasChild,
          treeTriangleSelect: isSelect && checkbox,
        }"
      ></i>
      <template v-if="isOnLine">
        <img
          :src="iconHeader(data)"
          v-if="data.isOnLine !== undefined"
          width="13px"
          height="13px"
        />
      </template>
      {{ node.label }}
      <div class="tree-child-click" @click="triangle(data)" />
      <div class="permission-position">{{ data.permission }}</div>
      <el-badge
        :value="$store.state.login | filterNumber(node.label)"
        v-if="isNumber"
        style="position: absolute; right: 20px; margin-top: 5px"
      >
        <!-- {{ $store.state.login | filterNumber(node.label) }} -->
      </el-badge>
      <!-- <span style="position: absolute; right: 20px" v-if="isNumber">{{
        $store.state.login | filterNumber(node.label)
      }}</span>-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.parent-triangle {
  color: #3984e8;
  margin-left: -20px;
  transition: all 0.3s;
  font-size: 20px;
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
.tree-slot-node {
  line-height: 100%;
  height: 38px;
  padding-top: 8px;
  // line-height: 38px;
}
.tree-patent {
  padding-left: 20px !important;
}

.tree-text {
  font-family: SourceHanSansCN-Normal;
  color: #3b3b3b;
  letter-spacing: 0;
  font-weight: 400;
  padding-top: 10px;
  &.terr-margin {
    margin-left: 20px;
  }
  &.tree-margin-select {
    margin-left: 25px;
  }
}

.permission-position {
  position: absolute;
  margin-top: -15px;
  right: 50px;
}

.tree-child-click {
  position: absolute;
  left: 5px;
  margin-top: -26px;
  width: calc(100% - 15px);
  height: 39px;
}
</style>

<script>
export default {
  props: {
    showIcon: {
      type: Boolean,
      default: true,
    },
    node: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    isOnLine: {
      type: Boolean,
      default: false,
    },
    isSelect: {
      type: Boolean,
      default: false,
    },
    isNumber: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    countAudtit() {
      return (str) => {
        let store = this.$store.state.login;
        if (str === "设备登记" && store.equipmentRegisterBadge > 0) {
          return store.equipmentRegisterBadge;
        } else if (str === "设备借用" && store.equipmentBorrowBadge.total > 0) {
          return store.equipmentBorrowBadge.total;
        } else if (
          str === "设备移交" &&
          store.equipmentTransferBadge.total > 0
        ) {
          return store.equipmentTransferBadge.total;
        } else if (
          str === "设备外送" &&
          store.equipmentDeliverBadge.total > 0
        ) {
          return store.equipmentDeliverBadge.total;
        } else if (
          str === "设备销毁" &&
          store.equipmentDestoryBadge.total > 0
        ) {
          return store.equipmentDestoryBadge.total;
        } else if (
          str === "待审批" &&
          (store.equipmentAuditBadge.total > 0 ||
            store.dataAuditBadge.total > 0)
        ) {
          return store.equipmentAuditBadge.total + store.dataAuditBadge.total;
        } else if (str === "资料登记" && store.dataRegisterBadge > 0) {
          return store.dataRegisterBadge;
        } else if (str === "资料借阅" && store.dataBorrowBadge.total > 0) {
          return store.dataBorrowBadge.total;
        } else if (str === "资料移交" && store.dataTransferBadge.total > 0) {
          return store.dataTransferBadge.total;
        } else if (str === "资料外送" && store.dataDeliverBadge.total > 0) {
          return store.dataDeliverBadge.total;
        } else if (str === "资料销毁" && store.dataDestoryBadge.total > 0) {
          return store.dataDestoryBadge.total;
        }
      };
    },
  },
  filters: {
    filterNumber(store, str) {
      if (str === "设备登记" && store.equipmentRegisterBadge > 0) {
        return store.equipmentRegisterBadge;
      } else if (str === "设备借用" && store.equipmentBorrowBadge.total > 0) {
        return store.equipmentBorrowBadge.total;
      } else if (str === "设备移交" && store.equipmentTransferBadge.total > 0) {
        return store.equipmentTransferBadge.total;
      } else if (str === "设备外送" && store.equipmentDeliverBadge.total > 0) {
        return store.equipmentDeliverBadge.total;
      } else if (str === "设备销毁" && store.equipmentDestoryBadge.total > 0) {
        return store.equipmentDestoryBadge.total;
      } else if (
        str === "待审批" &&
        (store.equipmentAuditBadge.total > 0 || store.dataAuditBadge.total > 0)
      ) {
        return store.equipmentAuditBadge.total + store.dataAuditBadge.total;
      } else if (str === "资料登记" && store.dataRegisterBadge > 0) {
        return store.dataRegisterBadge;
      } else if (str === "资料借阅" && store.dataBorrowBadge.total > 0) {
        return store.dataBorrowBadge.total;
      } else if (str === "资料移交" && store.dataTransferBadge.total > 0) {
        return store.dataTransferBadge.total;
      } else if (str === "资料外送" && store.dataDeliverBadge.total > 0) {
        return store.dataDeliverBadge.total;
      } else if (str === "资料销毁" && store.dataDestoryBadge.total > 0) {
        return store.dataDestoryBadge.total;
      }
    },
  },
  methods: {
    triangle(data) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (data.children || data.childs) {
            this.$set(data, "hasChild", !data.hasChild);
          }
        }, 0);
      });
    },
  },
};
</script>
