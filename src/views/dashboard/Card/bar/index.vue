<template>
  <div
    class="charts"
    ref="charts"
    style="width:100%;height:100%"
  ></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'bar',
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: { show: false, type: 'category' },
      yAxis: { show: false },
      toolTip: {},
      series: [
        {
          type: 'bar',
          data: [10, 7, 14, 12, 20, 9, 29, 11, 3, 5, 6, 8, 34],
        },
      ],
      grid: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
    });
  },
};
</script>

<style>
</style>