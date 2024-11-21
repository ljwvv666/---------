<template>
    <div ref="chartRef" style="width: 382px; height: 400px; "></div>
  </template>
  
  <script setup lang="ts">
  import * as echarts from "echarts";
  import { onMounted, ref } from "vue";
  import { useUfpStore } from "@/stores/ufpClass";

  const ufpStore = useUfpStore();
  
  // 引用图表 DOM
  const chartRef = ref<HTMLDivElement | null>(null);
  
  onMounted(() => {
    if (chartRef.value) {
      const myChart = echarts.init(chartRef.value);
  
      const option = {
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
              { value: ufpStore.EO, name: "EO" },
              { value: ufpStore.EI, name: "EI" },
              { value: ufpStore.EQ, name: "EQ" },
              { value: ufpStore.ILF, name: "ILF" },
              { value: ufpStore.EIF, name: "EIF" },
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
  