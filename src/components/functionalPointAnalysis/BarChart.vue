<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref, watch } from "vue";
import { useSystemStore } from "@/stores/systemStore";
import { useUfpStore } from "@/stores/ufpClass";

const chartRef = ref<HTMLDivElement | null>(null);
const systemStore = useSystemStore();
const ufpStore = useUfpStore();

// 保存图表实例
const myChart = ref<echarts.ECharts | null>(null);

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    myChart.value = echarts.init(chartRef.value);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          let res = `${params[0].name}<br/>`;
          params.forEach((param: any) => {
            res += `${param.seriesName}: ${param.value}<br/>`;
          });
          return res;
        },
      },
      legend: {
        data: ["未调整功能点", "已调整功能点"], // 这里显示的是图例名称
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
        data: ["GSC", "规模变更"],  // 纵坐标类别
      },
      series: [
        {
          name: "未调整功能点",  // 这个 name 对应图例的 "未调整功能点"
          type: "bar",
          data: [ufpStore.UFP, ufpStore.UFP],
        },
        {
          name: "已调整功能点",  // 这个 name 对应图例的 "已调整功能点"
          type: "bar",
          data: [systemStore.adjustedFP1, systemStore.adjustedFP2],
        },
      ],
    };

    myChart.value.setOption(option);
  }
};

// 更新图表数据
const updateChart = () => {
  if (myChart.value) {
    myChart.value.setOption({
      series: [
        {
          name: "未调整功能点",  // 保证与图例中的名称一致
          data: [ufpStore.UFP, ufpStore.UFP],
        },
        {
          name: "已调整功能点",  // 保证与图例中的名称一致
          data: [systemStore.adjustedFP1, systemStore.adjustedFP2],
        },
      ],
    });
  }
};

onMounted(() => {
  initChart();
});

// 监听数据变化
watch(
  () => [ufpStore.UFP, systemStore.adjustedFP1, systemStore.adjustedFP2],
  updateChart
);
</script>

<style scoped>
/* 可根据需要调整样式 */
</style>
