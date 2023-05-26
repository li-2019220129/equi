<template>
  <div class="equipment-container">
    <div class="equipment-left">
      <nav-tree :componentsId.sync="componentsId" />
    </div>
    <div class="equipment-right">
      <component
        :is="componentsName"
        :componentsId="componentsId"
        :key="Date.now()"
      />
    </div>
  </div>
</template>

<script>
import NavTree from "./components/NavTree.vue";
import EquipmentRegister from "./components/EquipmentRegister.vue";
import EquipmentCategory from "./components/EquipmentCategory.vue";
import EquipmentBorrow from "./components/EquipmentBorrow.vue";
import EquipmentTransfer from "./components/EquipmentTransfer.vue";
import EquipmentDeliver from "./components/EquipmentDeliver.vue";
import EquipmentDestory from "./components/EquipmentDestory.vue";
import EquipmentAccount from "./components/EquipmentAccount.vue";
import DataRegister from "./components/DataRegister.vue";
import DataCategory from "./components/DataCategory.vue";
import DataBorrow from "./components/DataBorrow.vue";
import DataTransfer from "./components/DataTransfer.vue";
import DataDeliver from "./components/DataDeliver.vue";
import DataDestory from "./components/DataDestory.vue";
import DataAccount from "./components/DataAccount.vue";
import ToApprove from "./components/ToApprove.vue";
import ApprovalProcess from "./components/ApprovalProcess.vue";
import Menu from "../system/components/Menu.vue";
import Role from "../system/components/Role.vue";
import Global from "../system/components/Global.vue";
import ApprovalForm from "../system/components/ApprovalForm.vue";
import DataDistribution from "./components/DataDistribution.vue";
export default {
  name: "Equipment",
  components: {
    NavTree,
    EquipmentRegister,
    EquipmentCategory,
    EquipmentBorrow,
    EquipmentTransfer,
    EquipmentDeliver,
    EquipmentDestory,
    EquipmentAccount,
    DataRegister,
    DataCategory,
    DataBorrow,
    DataTransfer,
    DataDeliver,
    DataDestory,
    DataAccount,
    DataDistribution,
    ToApprove,
    ApprovalProcess,
    Menu,
    Role,
    Global,
    ApprovalForm,
  },
  data() {
    return {
      componentsId: "", //树节点名字
      componentsName: "EquipmentRegister", //组件切换名
    };
  },
  mounted() {
    console.log('999996666666');
    this.$store.dispatch("login/userTreeData"); //获取用户树
    this.$store.dispatch("login/getEquipmentSecret"); //获取设备密级
    this.$store.dispatch("login/getDataTerm"); // 获取设备资料保密期限
    this.$store.dispatch("login/getEquipmentTab"); //获取设备密级
    this.$store.dispatch("login/getRegisterBadge"); //获取设备登记角标
    this.$store.dispatch("login/getBorrowBadge"); //获取设备借用角标
    this.$store.dispatch("login/getTransferBadge"); //获取设备移交角标/
    this.$store.dispatch("login/getDeliverBadge"); //获取设备外送角标
    this.$store.dispatch("login/getDestoryBadge"); //获取设备销毁角标
    this.$store.dispatch("login/getAuditBadge"); //获取设备待审批角标
    this.$store.dispatch("login/getDataRegisterBadge"); //获取资料登记角标
    this.$store.dispatch("login/getDataBorrowBadge"); //获取资料借阅角标
    this.$store.dispatch("login/getDataTransferBadge"); //获取资料移交角标
    this.$store.dispatch("login/getDataDeliverBadge"); //获取资料外送角标
    this.$store.dispatch("login/getDataDestoryBadge"); //获取资料销毁角标
    this.$store.dispatch("login/getDataAuditBadge"); //获取资料待审批角标
  },
  watch: {
    componentsId(val) {
      switch (val) {
        case "设备登记":
          this.componentsName = "EquipmentRegister";
          break;
        case "设备分类":
          this.componentsName = "EquipmentCategory";
          break;
        case "设备借用":
          this.componentsName = "EquipmentBorrow";
          break;
        case "设备移交":
          this.componentsName = "EquipmentTransfer";
          break;
        case "设备外送":
          this.componentsName = "EquipmentDeliver";
          break;
        case "设备销毁":
          this.componentsName = "EquipmentDestory";
          break;
        case "设备台账":
          this.componentsName = "EquipmentAccount";
          break;
        case "资料登记":
          this.componentsName = "DataRegister";
          break;
        case "资料分发":
          this.componentsName = "DataDistribution";
          break;
        case "资料分类":
          this.componentsName = "DataCategory";
          break;
        case "资料借阅":
          this.componentsName = "DataBorrow";
          break;
        case "资料移交":
          this.componentsName = "DataTransfer";
          break;
        case "资料外送":
          this.componentsName = "DataDeliver";
          break;
        case "资料销毁":
          this.componentsName = "DataDestory";
          break;
        case "资料台账":
          this.componentsName = "DataAccount";
          break;
        case "待审批":
          this.componentsName = "ToApprove";
          break;
        case "已审批":
          this.componentsName = "ToApprove";
          break;
        case "菜单权限":
          this.componentsName = "Menu";
          break;
        case "用户角色":
          this.componentsName = "Role";
          break;
        case "流程配置":
          this.componentsName = "ApprovalProcess";
          break;
        case "全局配置":
          this.componentsName = "Global";
          break;
        case "审批单配置":
          this.componentsName = "ApprovalForm";
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.equipment-container {
  display: flex;
  height: 100vh;
  .equipment-left {
    width: 190px;
    margin-right: 20px;
    background: #fff;
  }
  .equipment-right {
    // flex: 1;
    width: calc(100% - 190px);
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
