<template>
  <div>
    <div class="drawer-form">
      <div class="drawer-form title">申请信息</div>
      <el-form
        :model="applyForm"
        ref="form"
        label-width="80px"
        label-position="right"
        :disabled="isDetail"
        v-loading="loading"
      >
        <el-form-item label="标题" label-width="80px">
          <template slot="label">
            <div style="letter-spacing: 15px;  margin-left: 5px">标题</div>
          </template>
          <el-input v-model="applyForm.applyContent"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="申请部门">
            <el-select v-model="organName" placeholder="请选择申请部门" style="width: 330px" disabled></el-select>
          </el-form-item>
          <el-form-item label="申请人" label-width="100px">
            <template slot="label">
              <div
                style="
                  letter-spacing: 8px;
                  margin-left: 5px;
                "
              >申请人</div>
            </template>
            <el-select
              v-model="applyForm.applyUserName"
              placeholder="请选择申请人"
              style="width: 330px"
              disabled
            ></el-select>
          </el-form-item>
        </div>
        <el-form-item label="接收人" label-width="80px">
          <template slot="label">
            <div style="letter-spacing: 4px; margin-left: 5px">接收人</div>
          </template>
          <el-input
            v-model="applyForm.modifyUserName"
            placeholder="请输入接收人"
            v-if="drawerTitle === '设备外送'"
          ></el-input>
          <el-select
            v-else
            v-model="applyForm.modifyUserName"
            placeholder="请选择接收人"
            ref="tree"
            style="width: 330px"
          >
            <el-option style="height: auto" :value="applyForm.modifyUserName">
              <el-tree
                class="tree-no-background"
                :data="modifyUserList"
                :props="defaultProps"
                highlight-current
                @node-click="nodeClick"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <tree-slot :node="node" :data="data"></tree-slot>
                </div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <label slot="label" style="font-weight: 400">{{ title }}事由</label>
          <el-input type="textarea" v-model="applyForm.reason"></el-input>
        </el-form-item>
        <!-- <el-form-item v-if="active">
          <label slot="label"  style="font-weight: 400">审批意见</label>
          <el-input type="textarea" v-model="applyForm.option"></el-input>
        </el-form-item>-->
      </el-form>
    </div>
    <div>
      <equipment-message
        :maxHeight="'calc(50vh - 50px)'"
        :editDevTable="editDevTable"
        :devIds.sync="applyForm.devId"
        :secret.sync="secret"
      />
    </div>
  </div>
</template>

<script>
import EquipmentMessage from "./EquipmentMessage.vue";
import TreeSlot from "@/components/TreeSlot/index.vue";
import { createId } from "@/api/common/index";
import {
  findDeviceByModifyId,
  findDeviceByTakeoutId,
  viewDetailDestory,
  loadDeviceModify,
  detailAudit
} from "@/api/equipment";
import Vue from "vue";
export default {
  name: "ApplyMessage",
  components: {
    EquipmentMessage,
    TreeSlot
  },
  props: {
    formLine: {
      type: Object,
      default: () => {}
    }
  },
  inject: ["root"],
  data() {
    return {
      active: this.root.active,
      applySuccess: false,
      loading: false,
      title: this.root.title,
      drawerTitle: this.root.drawerTitle,
      isDetail: this.root.isDetail,
      organName: this.$store.state.login.loginData.organName,
      applyForm: {
        id: "", //申请id
        applyContent: "", //标题
        applyUserId: this.$store.state.login.loginData.userId, //申请人主键
        applyUserName: this.$store.state.login.loginData.userName, //申请人名称
        devId: "", //设备主键逗号隔开
        modifyType: "1", //固定填1
        nodeId: "", //节点主键
        modifyUserId: "", //移交人主键
        modifyUserName: "", //移交人名称
        reason: "", //事由
        toUserId: "", //审批人主键
        toUserName: "", //审批人名称
        option: null
      },
      secret: "", //设备密级
      modifyUserList: this.$store.state.login.userTreeData,
      componentId: "DataMessage",
      editDevTable: [],
      // devIds: "", //设备id
      defaultProps: {
        children: "children",
        label: "caption",
        isLeaf: "leaf"
      }
    };
  },
  created() {
    this.createIdData();
    this.filterOwnerUserList();
  },
  watch: {
    formLine: {
      immediate: true,
      handler() {
        if (JSON.stringify(this.formLine) !== "{}") {
          this.loading = true;
          if (this.drawerTitle === "设备移交") {
            const params1 = {
              modifyId: this.formLine.id
            };
            this.findDevice(findDeviceByModifyId(params1));
            if(!this.formLine.modifyUserName){
             loadDeviceModify({
              id:this.formLine.id
             }).then((res)=>{
              this.applyForm.modifyUserName = res.data.modifyUserName
             })
            }
          } else if (this.drawerTitle === "设备外送") {
            const params2 = {
              id: this.formLine.id
            };
            this.findDevice(findDeviceByTakeoutId(params2));
            if(!this.formLine.modifyUserName){
             detailAudit({
              id:this.formLine.id
             }).then((res)=>{
              this.applyForm.modifyUserName = res.data.takeoutView.receiveUserName
             })
            }
          } else if (this.drawerTitle === "设备销毁") {
            const params3 = {
              id: this.formLine.id,
              currentUserId: this.$store.state.login.loginData.userId
            };
            viewDetailDestory(params3).then(res => {
              const editObj = res.data;
              this.applyForm.modifyUserId = editObj.destoryData.receiveUserId;
              this.applyForm.modifyUserName =
                editObj.destoryData.receiveUserName;
              this.editDevTable = editObj.devInfo.data;
              this.applyForm.devId = editObj.devInfo.data
                .map(item => item.id)
                .join(",");
            });
          }
          Object.assign(this.applyForm, this.formLine);
          this.loading = false;
        } else {
          this.$nextTick(() => {
            this.$refs.form.resetFields();
          });
        }
      },
      deep: true
    }
  },
  methods: {
    //获取创建人id
    createIdData() {
      createId().then(res => {
        this.applyForm.id = res.data;
      });
    },
    filterOwnerUserList() {
      const id = this.applyForm.applyUserId;
      Vue.prototype.$Util.removeTreeDataById(this.modifyUserList, id);
    },

    nodeClick(data) {
      if (data.ntype === "User") {
        this.applyForm.modifyUserId = data.id;
        this.applyForm.modifyUserName = data.caption;
        this.$refs.tree.blur();
      }
    },

    //申请
    saveApply() {
      console.log("外卖少儿阿瓦我");
      if (this.applySuccess) {
        // this.$message.warning("已经保存了无需再次保存！");
        this.$message({
          type: "warning",
          duration: 1000,
          message: "已经保存了无需再次保存！"
        });
        return;
      }
      this.$set(this.applyForm, "organName", this.organName);
      this.$set(this.applyForm, "secret", this.secret);
      this.$emit("saveApply", this.applyForm);
    },
    applyFlags() {
      this.applyccess = true;
    },
    //编辑查询已选设备
    async findDevice(promise) {
      const res = await promise;
      this.editDevTable = res.data.data;
      if (this.drawerTitle === "设备移交") {
        this.applyForm.devId = res.data.data.map(item => item.deviceId).join(",");
      }else if(this.drawerTitle==='设备外送'){
          this.applyForm.devId = res.data.data.map(item => item.id).join(",");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-form {
  .title {
    font-family: SourceHanSansCN-Medium;
    font-size: 22px;
    margin: 10px 0;
    color: #3d464c;
    letter-spacing: 0;
    font-weight: 500;
  }
  .flex-item {
    display: flex;
    justify-content: space-between;
  }
}
</style>
