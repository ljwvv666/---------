<template>
  <el-container class="app-wrapper" style="width: 100vw">

      <!-- 实时数据面板和用户画像 -->
      <el-row :gutter="10">
        <!-- 实时数据面板 -->
        <el-col :span="8">
          <el-card class="data-card">
            <div ref="lineChart" style="width: 100%; height: 310px"></div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="data-card">
            <div ref="clusterChart" style="width: 700px; height: 310px"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 用户行为数据展示和实时访客统计、在线用户统计 -->
      <el-row :gutter="3">
        <el-col :span="2">
          <el-card class="data-card">
            <h2>页面浏览</h2>
            <p class="data-number">{{ pageViews }}</p>
          </el-card>
        </el-col>

        <el-col :span="2">
          <el-card class="data-card">
            <h2>点击</h2>
            <p class="data-number">{{ clicks }}</p>
          </el-card>
        </el-col>

        <el-col :span="2">
          <el-card class="data-card">
            <h2>搜索</h2>
            <p class="data-number">{{ searches }}</p>
          </el-card>
        </el-col>

        <el-col :span="2">
          <el-card class="data-card">
            <h2>填写表单</h2>
            <p class="data-number">{{ formSubmissions }}</p>
          </el-card>
        </el-col>

        <!-- 实时访客统计和在线用户统计 -->

        <el-col :span="2">
          <el-card class="data-card">
            <h2>实时访客统计</h2>
            <p class="data-number">{{ realTimeVisitors }}</p>
          </el-card>
        </el-col>

        <el-col :span="2">
          <el-card class="data-card">
            <h2>在线用户统计</h2>
            <p class="data-number">{{ onlineUsers }}</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="data-card">
            <h2>用户画像</h2>
            <div ref="pieChart" style="width: 100%; height: 400px"></div>
          </el-card>
        </el-col>
      </el-row>

  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";

const lineChart = ref(null);
const pieChart = ref(null);
const clusterChart = ref(null);

const pageViews = ref(1000);
const clicks = ref(500);
const searches = ref(300);
const formSubmissions = ref(150);
const realTimeVisitors = ref(50);
const onlineUsers = ref(20);

const refreshData = () => {
  ElMessage.success("数据已刷新");
  // 这里可以添加刷新数据的逻辑
};

const updateData = () => {
  pageViews.value = Math.floor(Math.random() * 2000) + 1000;
  clicks.value = Math.floor(Math.random() * 1000) + 500;
  searches.value = Math.floor(Math.random() * 600) + 300;
  formSubmissions.value = Math.floor(Math.random() * 300) + 150;
  realTimeVisitors.value = Math.floor(Math.random() * 100) + 50;
  onlineUsers.value = Math.floor(Math.random() * 30) + 20;
};

onMounted(() => {
  // 折线图
  const lineChartInstance = echarts.init(lineChart.value);
  const lineChartOption = {
    title: {
      text: "用户访问量",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "line",
      },
    ],
  };
  lineChartInstance.setOption(lineChartOption);

  // 饼图
  const pieChartInstance = echarts.init(pieChart.value);
  const pieChartOption = {
    title: {
      text: "用户年龄分布",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "年龄",
        type: "pie",
        radius: "50%",
        data: [
          { value: 1048, name: "0-18岁" },
          { value: 735, name: "19-25岁" },
          { value: 580, name: "26-35岁" },
          { value: 484, name: "36-45岁" },
          { value: 300, name: "46岁及以上" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  pieChartInstance.setOption(pieChartOption);

  // 柱状图 - 分群分析
  const clusterChartInstance = echarts.init(clusterChart.value);
  const clusterChartOption = {
    title: {
      text: "分群分析",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["活跃用户", "潜在客户"],
      left: "right",
    },
    xAxis: {
      type: "category",
      data: ["群体一", "群体二", "群体三"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "活跃用户",
        type: "bar",
        stack: "总量",
        label: {
          show: true,
          position: "insideRight",
        },
        data: [320, 302, 301, 334, 390],
      },
      {
        name: "潜在客户",
        type: "bar",
        stack: "总量",
        label: {
          show: true,
          position: "insideRight",
        },
        data: [120, 132, 101, 134, 90],
      },
    ],
  };
  clusterChartInstance.setOption(clusterChartOption);

  setInterval(updateData, 5000); // 每隔5秒更新一次数据
});
</script>

<style>
html,
body,
.app-wrapper {
  height: 100%;
  margin: 0;
  padding: 0;
  margin-top: 0;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
   /* 确保占满整个页面高度 */
}

.align-right {
  text-align: right;
}

.el-row {
  margin-bottom: 5px;
}

.data-card {
  margin-bottom: 2px;
  border: 1px solid #dcdfe6; /* 更明显的边框 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  border-radius: 4px; /* 圆角边框 */
  padding: 20px; /* 内边距 */
  text-align: center;
  font-size: smaller
}

.data-number {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}
</style>
