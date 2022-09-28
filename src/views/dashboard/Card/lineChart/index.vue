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
  name: 'LineChart',
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: { show: false, type: 'category' },
      yAxis: { show: false },
      series: [
        {
          type: 'line',
          smooth: true,
          data: [10, 7, 33, 12, 48, 9, 29],
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            color: 'pink',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'pink', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff', // 100% 处的颜色
                },
              ],
              global: false,
            },
          },
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