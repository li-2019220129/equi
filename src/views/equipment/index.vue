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
    ToApprove,
    ApprovalProcess,
    Menu,
    Role,
    Global,
    ApprovalForm,
  },
  data() {
    return {
      componentsId: "", //???????????????
      componentsName: "EquipmentRegister", //???????????????
    };
  },
  mounted() {
    this.$store.dispatch("login/userTreeData"); //???????????????
    this.$store.dispatch("login/getEquipmentSecret"); //??????????????????
    this.$store.dispatch("login/getEquipmentTab"); //??????????????????
    this.$store.dispatch("login/getRegisterBadge"); //????????????????????????
    this.$store.dispatch("login/getBorrowBadge"); //????????????????????????
    this.$store.dispatch("login/getTransferBadge"); //????????????????????????/
    this.$store.dispatch("login/getDeliverBadge"); //????????????????????????
    this.$store.dispatch("login/getDestoryBadge"); //????????????????????????
    this.$store.dispatch("login/getAuditBadge"); //???????????????????????????
    this.$store.dispatch("login/getDataRegisterBadge"); //????????????????????????
    this.$store.dispatch("login/getDataBorrowBadge"); //????????????????????????
    this.$store.dispatch("login/getDataTransferBadge"); //????????????????????????
    this.$store.dispatch("login/getDataDeliverBadge"); //????????????????????????
    this.$store.dispatch("login/getDataDestoryBadge"); //????????????????????????
    this.$store.dispatch("login/getDataAuditBadge"); //???????????????????????????
  },
  watch: {
    componentsId(val) {
      switch (val) {
        case "????????????":
          this.componentsName = "EquipmentRegister";
          break;
        case "????????????":
          this.componentsName = "EquipmentCategory";
          break;
        case "????????????":
          this.componentsName = "EquipmentBorrow";
          break;
        case "????????????":
          this.componentsName = "EquipmentTransfer";
          break;
        case "????????????":
          this.componentsName = "EquipmentDeliver";
          break;
        case "????????????":
          this.componentsName = "EquipmentDestory";
          break;
        case "????????????":
          this.componentsName = "EquipmentAccount";
          break;
        case "????????????":
          this.componentsName = "DataRegister";
          break;
        case "????????????":
          this.componentsName = "DataCategory";
          break;
        case "????????????":
          this.componentsName = "DataBorrow";
          break;
        case "????????????":
          this.componentsName = "DataTransfer";
          break;
        case "????????????":
          this.componentsName = "DataDeliver";
          break;
        case "????????????":
          this.componentsName = "DataDestory";
          break;
        case "????????????":
          this.componentsName = "DataAccount";
          break;
        case "?????????":
          this.componentsName = "ToApprove";
          break;
        case "?????????":
          this.componentsName = "ToApprove";
          break;
        case "????????????":
          this.componentsName = "Menu";
          break;
        case "????????????":
          this.componentsName = "Role";
          break;
        case "????????????":
          this.componentsName = "ApprovalProcess";
          break;
        case "????????????":
          this.componentsName = "Global";
          break;
        case "???????????????":
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
