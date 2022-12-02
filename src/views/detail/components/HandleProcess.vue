<template>
  <div>
    <div
      class="handle-process-timeline"
      v-if="flowList.length !== 0"
      v-loading="loading"
    >
      <el-timeline v-for="(item, index) in flowList" :key="index">
        <el-timeline-item
          :timestamp="item.work.createdTime.substr(0, 10)"
          placement="top"
        >
          <el-card v-if="item.work.toUserName">
            <h4>办理人：{{ item.work.toUserName }}</h4>
            <p>办理时间：{{ item.work.sendTime }}</p>
            <p>完成时间：{{ item.work.dealTime }}</p>
            <P v-if="item.work.nextAudit">接收人：{{ item.work.nextAudit }}</P>
          </el-card>
          <el-card v-else-if="item.work.fromUserName">
            <h4>申请人：{{ item.work.fromUserName }}</h4>
            <p>申请时间：{{ item.work.sendTime }}</p>
          </el-card>
        </el-timeline-item>
        <!-- <el-timeline-item timestamp="2019/4/12" placement="top">
        <el-card>
          <h4>办理人：局长</h4>
          <p>申请时间：2022-08-05 09:00</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2019/4/13" placement="top">
        <el-card>
          <h4>办理人：综合处领导</h4>
          <p>申请时间：2022-08-05 09:00</p>
        </el-card>
      </el-timeline-item> -->
      </el-timeline>
    </div>
    <el-empty description="暂无办理过程" v-else></el-empty>
  </div>
</template>

<script>
import { findWorkDataAndUser } from "@/api/audit";
export default {
  name: "HandleProcess",
  props: {
    applyId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      flowList: [], //办理流程数据
      loading: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      if (this.applyId) {
        try {
          this.loading = true;
          const params = {
            applyId: this.applyId,
            currentUserId: this.$store.state.login.loginData.userId,
          };
          const res = await findWorkDataAndUser(params);
          this.flowList = res.data.flowList;
          this.loading = false;
        } catch (error) {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.handle-process-timeline {
  margin: 50px 50px 30px 0;
}
</style>
