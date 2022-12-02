<template>
  <div :id="'echarts'+key" :style="{width: width,height: height}"></div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'LeadalEcharts',
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
  },
  data () {
    return {
      key: Math.random()
    }
  },
  mounted () {
    this.initChart();
  },
  methods: {
    // 初始化图表
    initChart () {
      let charts = document.getElementById('echarts' + this.key);
      let myChart = echarts.init(charts);
      myChart.setOption(this.option);
    }
  }
}
</script>

