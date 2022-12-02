<template>
  <div>
    <div class="leader-line"></div>
    <div class="detail-drawer">
      <div class="detail-equipment-message">
        <div class="drawer-title">设备信息</div>
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          style="margin-top: 20px"
          :disabled="true"
          v-loading="loading"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备分类" prop="categoryLabel">
                <el-select
                  v-model="form.categoryLabel"
                  placeholder="请选择"
                  class="form-styles"
                >
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备品牌" porp="brand">
                <el-input v-model="form.brand" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备型号" prop="model">
                <el-input v-model="form.model" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="" prop="sn">
                <template slot="label">
                  <div
                    style="
                      letter-spacing: 8px;
                      position: absolute;
                      margin-left: 45px;
                    "
                  >
                    序列号
                  </div>
                </template>
                <el-input v-model="form.sn" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="购置时间" prop="purchaseDate">
                <el-date-picker
                  v-model="form.purchaseDate"
                  type="date"
                  placeholder="选择日期"
                  class="form-styles"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="启用时间" prop="enabledTime">
                <el-date-picker
                  v-model="form.enabledTime"
                  type="date"
                  placeholder="选择日期"
                  class="form-styles"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备密级" prop="secret">
                <el-select
                  v-model="form.secret"
                  placeholder="请选择"
                  class="form-styles"
                >
                  <el-option
                    v-for="item in secretOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="保密室编号" prop="secretRoomCode">
                <el-input
                  v-model="form.secretRoomCode"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="保密系统编号" prop="code">
                <el-input v-model="form.code" class="form-styles"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="门禁编号" prop="entranceGuardCode">
                <el-input
                  v-model="form.entranceGuardCode"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="存放位置" prop="storagePlace">
                <el-input
                  v-model="form.storagePlace"
                  class="form-styles"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备类型" prop="classify">
                <el-select
                  v-model="form.classify"
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

            <el-col :span="24">
              <el-form-item label="所属部门" prop="organName">
                <el-input
                  v-model="form.organName"
                  style="width: 1030px"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="原因用途" prop="reason">
                <el-input
                  type="textarea"
                  v-model="form.reason"
                  placeholder="请输入内容"
                  :rows="5"
                  style="width: 1030px"
                ></el-input>
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
import { loadDetail, findModifyDetail } from "@/api/equipment";
export default {
  name: "AccountDetailDrawer",
  props: {
    deviceRecordId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      flowData: [], //流转记录
      form: {
        categoryLabel: "", // 设备分类名称
        categoryId: "", // 设备分类
        brand: "", // 设备品牌
        model: "", // 设备型号
        sn: "", // 序号
        purchaseDate: "", // 购置时间
        enabledTime: "", // 启用时间
        secret: "", // 设备密级
        secretRoomCode: "", // 保密室编号
        code: "", // 保密系统编号
        entranceGuardCode: "", // 门禁编号
        storagePlace: "", // 存放位置
        classify: "", // 设备类型
        reason: "", // 原因用途
        organName: this.$store.state.login.loginData.organName, // 部门
      },
      classifyOptions: [
        {
          value: 4,
          label: "个人资产",
        },
        {
          value: 8,
          label: "保密室资产",
        },
      ],
      secretOptions: this.$store.state.login.equipmentSecret,
    };
  },
  created() {
    this.loadDetail();
    this.findModifyDetail();
  },
  methods: {
    async loadDetail() {
      try {
        this.loading = true;
        const params = {
          deviceRecordId: this.deviceRecordId,
        };
        const res = await loadDetail(params);
        Object.assign(this.form, res.data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    async findModifyDetail() {
      const params = {
        devId: this.deviceRecordId,
        systemType: "xts",
      };
      const res = await findModifyDetail(params);
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
.form-styles {
  width: 420px;
  height: 32px;
}
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
