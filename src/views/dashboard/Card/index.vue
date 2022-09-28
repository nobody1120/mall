<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <detail
            title="总销售额"
            count="￥126560"
          >
            <!-- 作用域插槽 -->
            <template slot="charts">
              <span>周同比&nbsp;&nbsp;56.67% <svg
                  t="1664163755271"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3499"
                  width="10"
                  height="10"
                >
                  <path
                    d="M960 704L512 256l-448 448z"
                    fill="#1afa29"
                    p-id="3500"
                  ></path>
                </svg></span>
              <span style="margin-left:30px">日同比&nbsp;&nbsp;56.67% <svg
                  t="1664164107904"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4432"
                  width="10"
                  height="10"
                >
                  <path
                    d="M64 320l448 448 448-448z"
                    fill="#d81e06"
                    p-id="4433"
                  ></path>
                </svg></span>
            </template>
            <template slot="footer">
              <span>日销售额￥12423</span>
            </template>
          </detail>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <detail
            title="访问量"
            count="88460"
          >
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <span>日访问 1234</span>
            </template>
          </detail>

        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail
            title="支付笔数"
            count="88460"
          > <template slot="charts">
              <bar></bar>
            </template>
            <template slot="footer">
              <span>转化率 65%</span>
            </template>
          </detail>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <detail
            title="运营活动效果"
            count="78%"
          >
            <template slot="charts">
              <ProgressCharts></ProgressCharts>
            </template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;56.67% <svg
                  t="1664163755271"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3499"
                  width="10"
                  height="10"
                >
                  <path
                    d="M960 704L512 256l-448 448z"
                    fill="#1afa29"
                    p-id="3500"
                  ></path>
                </svg></span>
              <span style="margin-left:30px">日同比&nbsp;&nbsp;56.67% <svg
                  t="1664164107904"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4432"
                  width="10"
                  height="10"
                >
                  <path
                    d="M64 320l448 448 448-448z"
                    fill="#d81e06"
                    p-id="4433"
                  ></path>
                </svg></span>
            </template>
          </detail>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import Detail from './Detail/index.vue';
import LineChart from './lineChart/index.vue';
import Bar from './bar/index.vue';
import ProgressCharts from './progressCharts/index.vue';
export default {
  name: 'Card',
  components: { Detail, LineChart, Bar, ProgressCharts },
};
</script>

<style>
</style>