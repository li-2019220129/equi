<template>
  <div>
    <div class="equipment-header">
      <div class="equipment-header-left">
        <div
          :class="['table-menu-item', activeTab === 1 ? 'selected' : '']"
          @click="handlerActiveTab(1)"
        >
          <el-badge
            :value="auditNum"
            :hidden="auditNum === 0"
            class="badge-item"
          >
            涉密设备审批</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 2 ? 'selected' : '']"
          @click="handlerActiveTab(2)"
        >
          <el-badge
            :value="dataAuditNum"
            :hidden="dataAuditNum === 0"
            class="badge-item"
          >
            涉密资料审批</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 3 ? 'selected' : '']"
          @click="handlerActiveTab(3)"
        >
          <el-badge
            :value="registerNum"
            :hidden="registerNum === 0"
            class="badge-item"
          >
            新增设备审批</el-badge
          >
        </div>
        <div
          :class="['table-menu-item', activeTab === 4 ? 'selected' : '']"
          @click="handlerActiveTab(4)"
        >
          <el-badge
            :value="dataRegisterNum"
            :hidden="dataRegisterNum === 0"
            class="badge-item"
          >
            新增资料审批</el-badge
          >
        </div>
      </div>
      <div class="equipment-header-right">
        <div class="equipment-button">
          <div
            class="equipment-button_btn"
            @click="handleAgreeOrTakeBack"
            v-show="isToApproved"
          >
            <img src="@/assets/icon/审批@2x.png" />
            <span>审批</span>
            <!-- <img :src="operateIcon" />
            <span>{{ isToApproved ? "审批" : "收回" }}</span> -->
          </div>
        </div>
      </div>
    </div>

    <component
      ref="audit"
      :is="componentId"
      :isToApproved="isToApproved"
    ></component>
  </div>
</template>

<script>
import EquipmentAudit from "./EquipmentAudit";
import DataAudit from "./DataAudit.vue";
import NewEquipmentAudit from "./NewEquipmentAudit.vue";
import NewDataAudit from "./NewDataAudit.vue";
export default {
  name: "ToApprove",
  components: {
    EquipmentAudit,
    DataAudit,
    NewEquipmentAudit,
    NewDataAudit,
  },
  props: {
    componentsId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeTab: 1,
      componentId: "EquipmentAudit",
      isToApproved: false,
    };
  },
  computed: {
    operateIcon() {
      return require(`@/assets/icon/${
        this.componentsId === "3-1" ? "审批@2x" : "还原@2x"
      }.png`);
    },
    auditNum() {
      return this.$store.state.login.equipmentAuditBadge.audit;
    },
    registerNum() {
      return this.$store.state.login.equipmentAuditBadge.register;
    },
    dataAuditNum() {
      return this.$store.state.login.dataAuditBadge.countOtherMedia;
    },
    dataRegisterNum() {
      return this.$store.state.login.dataAuditBadge.countRegisterMedia;
    },
  },
  watch: {
    componentsId: {
      immediate: true,
      handler(val) {
        val === "待审批"
          ? (this.isToApproved = true)
          : (this.isToApproved = false);
      },
    },
  },

  methods: {
    handlerActiveTab(num) {
      this.activeTab = num;
      num === 1
        ? (this.componentId = "EquipmentAudit")
        : num === 2
        ? (this.componentId = "DataAudit")
        : num === 3
        ? (this.componentId = "NewEquipmentAudit")
        : (this.componentId = "NewDataAudit");
    },

    handleAgreeOrTakeBack() {
      this.$refs.audit.handleAgreeOrTakeBack(this.isToApproved);
    },
    // switchApplyTypes(num) {
    //   switch (num) {
    //     case 1:
    //       return "资料登记";
    //     case 4:
    //       return "资料移交";
    //     case 32:
    //       return "资料外送";
    //     case 64:
    //       return "资料销毁";
    //     case 128:
    //       return "资料借阅";
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>
