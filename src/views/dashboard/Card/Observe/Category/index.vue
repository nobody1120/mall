<template>
  <el-card>
    <div
      slot="header"
      class="header"
    >
      <div class="search-header">
        <span>销售额类占比</span>
        <div>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div>
      <div
        class="charts"
        ref="charts"
      ></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts';
export default {
  data() {
    return {
      value: '全部渠道',
    };
  },
  mounted() {
    let barCharts = echarts.init(this.$refs.charts);
    barCharts.setOption({
      title: {
        text: 'biao',
        subtext: '1048',
        left: 'center',
        top: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
        },
      ],
    });
    barCharts.on('mouseover', (params) => {
      const { name, value } = params.data;
      barCharts.setOption({
        title: {
          text: value,
          subtext: name,
        },
      });
    });
  },
};
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eee;
  padding: 5px 0;
}
.search-header {
  display: flex;
  justify-content: space-between;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>