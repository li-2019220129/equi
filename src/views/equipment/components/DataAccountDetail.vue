<template>
  <div>
    <div class="leader-line"></div>
    <div class="detail-drawer">
      <div class="detail-equipment-message">
        <div class="drawer-title">资料信息</div>
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          disabled
          style="margin-top: 20px; margin-left: -20px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="所在机构" prop="ownerDeptName">
                <el-select
                  v-model="form.ownerDeptName"
                  placeholder="请选择申请部门"
                  disabled
                  class="form-styles"
                >
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="申请人" prop="ownerUserName">
                <el-input
                  v-model="form.ownerUserName"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="文件标题" prop="heading">
                <el-input
                  v-model="form.heading"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="文件编号" prop="code">
                <el-input v-model="form.code" ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="文件密级" prop="secretLevel">
                <el-select
                  v-model="form.secretLevelLabel"
                  placeholder="请选择"
                  class="form-styles"
                >
                  <el-option
                    v-for="item in secretOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="产生日期" prop="registerTime">
                <el-date-picker
                  v-model="form.registerTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  class="form-styles"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="来文单位" prop="fromZone">
                <el-input
                  v-model="form.fromZone"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="发往单位" prop="toZone">
                <el-input v-model="form.toZone" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="见证人" prop="witness">
                <el-input v-model="form.witness" class="form-styles"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资料类别" prop="classifyType">
                <el-select
                  v-model="form.classifyType"
                  placeholder="请选择"
                  class="form-styles"
                >
                  <el-option
                    v-for="item in classifyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="detail-flow-record">
        <div class="drawer-title">流转记录</div>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in flowData"
            :key="index"
            :type="item.type"
            :timestamp="item.modifyTime"
            placement="top"
            :class="index % 2 !== 0 ? 'el-timeline-item-live-out' : ''"
          >
            <p class="flow-record-text">
              <span>操作人：</span>{{ item.userName }}
            </p>
            <p class="flow-record-text">
              <span>操作类型：</span>{{ item.info }}
            </p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { loadDetail, lifeCycle } from "@/api/data";
export default {
  name: "AccountDetailDrawer",
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      flowData: [], //流转记录
      form: {
        heading: "", //标题
        secretLevel: "", //密级数值  1为内文，  2为秘密，4为机密，  8为绝密，16为核心机密
        secretLevelLabel: "", //密级中文值
        createUserId: "", //记录创建人主键
        ownerUserId: "", //申请人主键
        ownerUserName: "", //申请人名称
        ownerDeptId: "", //部门主键
        ownerDeptName: "", // 部门名称
        code: "", //文件编号
        registerTime: "", //产生日期
        fromZone: "", //来文单位
        toZone: "", //发往单位
        witness: "", //见证人
        classifyType: "", //归属类型（1是个人资产   2是保密室资产）
      },
      classifyOptions: [
        {
          value: 1,
          label: "个人资产",
        },
        {
          value: 2,
          label: "保密室资产",
        },
      ],
      secretOptions: this.$store.state.login.equipmentSecret,
    };
  },
  created() {
    this.loadDetail();
    this.lifeCycle();
  },
  methods: {
    async loadDetail() {
      try {
        this.loading = true;
        const params = {
          id: this.id,
        };
        const res = await loadDetail(params);
        Object.assign(this.form, res.data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    async lifeCycle() {
      const params = {
        id: this.id,
      };
      const res = await lifeCycle(params);
      this.flowData = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
// 分割线统一样式
.leader-line {
  width: 100%;
  border-top: 1px #b4b4b4 solid;
  margin: 20px 0;
}
.detail-drawer {
  display: flex;
  height: calc(90vh - 10px);
  .drawer-title {
    font-family: SourceHanSansCN-Medium;
    font-size: 22px;
    margin: 10px 0;
    color: #3d464c;
    letter-spacing: 0;
    font-weight: 500;
  }

  .detail-equipment-message {
    width: 65%;
    border-right: 1px #b4b4b4 solid;
  }
  .detail-flow-record {
    flex: 1;
    margin-left: 20px;
  }
}
// .form-styles {
//   width: 200px;
//   height: 32px;
// }
::v-deep .el-timeline {
  padding-left: 50%;
  padding-top: 20px;
  overflow-y: auto;
  height: 800px;
}
::v-deep .el-timeline-item-live-out {
  .el-timeline-item__wrapper {
    left: -100%;
    text-align: right;
    padding-right: 28px;
  }
}
.flow-record-text {
  font-size: 16px;
}
</style>
