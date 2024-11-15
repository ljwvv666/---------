<template>
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  </template>
  
  <script setup lang="ts">
  import * as echarts from "echarts";
  import { onMounted, ref } from "vue";
  
  // 引用图表 DOM
  const chartRef = ref<HTMLDivElement | null>(null);
  
  onMounted(() => {
    if (chartRef.value) {
      const myChart = echarts.init(chartRef.value);
  
      const option = {
        title: {
          text: "饼状图示例",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "5%",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "搜索引擎" },
              { value: 735, name: "直接访问" },
              { value: 580, name: "邮件营销" },
              { value: 484, name: "联盟广告" },
              { value: 300, name: "视频广告" },
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
  
      myChart.setOption(option);
    }
  });
  </script>
  
  <style scoped>
  /* 可根据需要调整样式 */
  </style>
  