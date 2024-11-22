<template>
  <div class="page-container">
    <!-- 搜索模块 -->
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        /* margin-bottom: 1.5rem; */
      "
    >
      <el-input
        v-model="searchTeamName"
        placeholder="请输入团队名称"
        clearable
        size="large"
        class="search-input"
      >
        <template v-slot:append>
          <el-button
            @click="handleSearch"
            
          >
          <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </template>
      </el-input>
    </div>
    <!-- 团队列表 -->
    <el-table :data="teamList" class="team-table">
  <el-table-column
    prop="teamName"
    label="团队名称"
    width="450"
    align="center"
  >
    <template v-slot="scope">
      <div>
        {{ scope.row.teamName }}
        <!-- 判断团队数量为0时，显示红色的标签 -->
        <el-tag
          v-if="scope.row.count === 0"
          type="danger"
          size="mini"
          style="margin-left: 10px;"
        >
          暂未组建团队
        </el-tag>
      </div>
    </template>
  </el-table-column>
  <el-table-column
    prop="count"
    label="项目数量"
    width="150"
    align="center"
  ></el-table-column>
  <el-table-column label="操作" align="center">
    <template v-slot="scope">
      <el-button
        type="primary"
        size="mini"
        @click="predictPDR(scope.row.teamName)"
        class="action-button"
      >
        预测PDR
      </el-button>
      <el-button
        type="success"
        size="mini"
        @click="showPDRHistory(scope.row.teamName)"
        class="action-button"
      >
        PDR历史
      </el-button>
    </template>
  </el-table-column>
</el-table>

<el-dialog
  title="预测PDR结果"
  v-model="predictDialogVisible"
  :style="{ width: '700px', height: '500px' }"
  :before-close="handleClose"
>
  <!-- 顶部区域 - 标题部分 -->
  <div class="dialog-header">
    <h3>根据团队数据计算得出</h3>
  </div>

  <!-- 中部区域 - 结果显示部分 -->
  <div class="dialog-body">
    <!-- 结果文本 -->
    <p class="result-text">预测PDR：{{ predictResult.result }}</p>
    <p class="detail-text">最大PDR：{{ predictResult.maxPdr }}</p>
    <p class="detail-text">最小PDR：{{ predictResult.minPdr }}</p>

    <!-- 图表选择器 -->
    <el-select v-model="selectedChartType" placeholder="选择图表类型" style="width: 200px; margin-top: 20px;">
      <el-option label="柱状图" value="bar"></el-option>
      <el-option label="折线图" value="line"></el-option>
      <el-option label="饼图" value="pie"></el-option>
    </el-select>

    <!-- ECharts 图表容器 -->
    <div ref="predictChart" class="chart-container" style="width: 100%; height: 400px; margin-top: 20px;"></div>
  </div>

  <!-- 底部区域 - 按钮部分 -->
  <template v-slot:footer>
    <el-button @click="predictDialogVisible = false" class="close-button">
      关闭
    </el-button>
  </template>
</el-dialog>

    <!-- PDR历史弹窗 -->
    <el-dialog title="PDR历史数据" v-model="historyDialogVisible" width="600px">
      <div ref="chartRef" class="chart-container"></div>
      <template v-slot:footer>
        <el-button @click="historyDialogVisible = false" class="close-button">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  ElButton,
  ElDialog,
  ElTable,
  ElTableColumn,
  ElInput,
  ElIcon, 
} from "element-plus";
import "element-plus/dist/index.css";
import * as echarts from "echarts";
export default {
  name: "PriceEvaluationPdrScreen",
  components: {
    ElButton,
    ElDialog,
    ElTable,
    ElTableColumn,
    ElInput,
    ElIcon,
  },
  data() {
    return {
      searchTeamName: "",
      teamList: [],
      predictDialogVisible: false,
      historyDialogVisible: false,
      predictResult: {},
      chartOption: {},
      // chartInstance: null, // 保存 ECharts 实例
      predictChartInstance: null, // 用于预测 PDR 的图表实例
      historyChartInstance: null, // 用于历史 PDR 的图表实例
      selectedChartType: 'bar', // 默认图表类型
    };
  },
  methods: {
    // 获取团队列表
    async fetchAllTeams() {
      try {
        const response = await fetch("http://118.202.10.11:8080/listallteam");
        const data = await response.json();
        if (data.isok) {
          this.teamList = data.lists;
        }
      } catch (error) {
        console.error("获取团队列表失败", error);
      }
    },
    // 搜索团队
    async handleSearch() {
      if (!this.searchTeamName) {
        this.fetchAllTeams();
        return;
      }
      try {
        const response = await fetch(
          `http://118.202.10.11:8080/searchTeamName?teamName=${encodeURIComponent(
            this.searchTeamName
          )}`
        );
        const data = await response.json();
        if (data.teamName) {
          this.teamList = [data];
        } else {
          this.$message.warning("未找到对应的团队");
          this.teamList = [];
        }
      } catch (error) {
        console.error("搜索团队失败", error);
      }
    },
    // 预测PDR
    async predictPDR(teamName) {
  try {
    const response = await fetch(
      `http://118.202.10.11:8080/listteampdr?teamName=${encodeURIComponent(
        teamName
      )}`
    );
    const data = await response.json();
    if (data.isok) {
      this.predictResult = data;
      this.predictDialogVisible = true;

      // 使用 $nextTick 确保弹窗已渲染，然后初始化图表
      this.$nextTick(() => {
        this.initPredictChart();
      });
    } else {
      this.$message.error("预测PDR失败");
    }
  } catch (error) {
    console.error("预测PDR失败", error);
  }
},
    // 显示PDR历史
    async showPDRHistory(teamName) {
      try {
        const response = await fetch(
          `http://118.202.10.11:8080/listAllpdrbyteam?teamName=${encodeURIComponent(
            teamName
          )}`
        );
        const data = await response.json();
        if (data.isok) {
          this.chartOption = {
            title: {
              text: "PDR 历史数据",
              left: "center",
            },
            tooltip: {},
            xAxis: {
              type: "category",
              data: data.pdrs.map((_, index) => `第${index + 1}次`),
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                name: "PDR",
                type: "line",
                data: data.pdrs,
                smooth: true,
                lineStyle: {
                  color: "#409EFF",
                },
              },
            ],
          };
          this.historyDialogVisible = true;
          this.$nextTick(() => {
            this.initChart();
          });
        } else {
          this.$message.error("获取PDR历史数据失败");
        }
      } catch (error) {
        console.error("获取PDR历史数据失败", error);
      }
    },
    // 初始化 ECharts
  // 初始化历史 PDR 图表
  initChart() {
    if (this.historyChartInstance) {
      this.historyChartInstance.dispose();
    }
    const chartDom = this.$refs.chartRef;
    this.historyChartInstance = echarts.init(chartDom);
    this.historyChartInstance.setOption(this.chartOption);
    window.addEventListener('resize', this.handleHistoryChartResize);
  },
  // 历史 PDR 图表的大小调整处理
  handleHistoryChartResize() {
    if (this.historyChartInstance) {
      this.historyChartInstance.resize();
    }
  },
  // 关闭历史 PDR 弹窗时销毁实例
  closeHistoryDialog() {
    if (this.historyChartInstance) {
      this.historyChartInstance.dispose();
      this.historyChartInstance = null;
      window.removeEventListener('resize', this.handleHistoryChartResize);
    }
    this.historyDialogVisible = false;
  },

  // 初始化或更新预测 PDR 图表
  initPredictChart() {
  if (this.predictChartInstance) {
    this.predictChartInstance.dispose();
  }
  const chartDom = this.$refs.predictChart;
  if (chartDom) {
    this.predictChartInstance = echarts.init(chartDom);
    this.setPredictChartOption();

    // 确保图表根据容器大小正确渲染
    this.predictChartInstance.resize();

    window.addEventListener('resize', this.handlePredictChartResize);
  } else {
    console.error("无法获取图表容器");
  }
},
  // 预测 PDR 图表的大小调整处理
  handlePredictChartResize() {
    if (this.predictChartInstance) {
      this.predictChartInstance.resize();
    }
  },

    // 设置图表配置项
    setPredictChartOption() {
  const type = this.selectedChartType;
  let option = {};

  // 准备数据数组，确保数据有效
  const dataValues = [
    { value: this.predictResult.result || 0, name: '结果' },
    { value: this.predictResult.maxPdr || 0, name: '最大PDR' },
    { value: this.predictResult.minPdr || 0, name: '最小PDR' },
  ];

  switch (type) {
    case 'bar':
      option = {
        title: {
          text: '预测PDR柱状图',
          left: 'center',
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: dataValues.map(item => item.name),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'PDR值',
            data: dataValues.map(item => item.value),
            type: 'bar', // 确保 type 属性存在且正确
          },
        ],
        grid: {
          left: '10%',   // 控制图表左边的空白区域
          right: '10%',  // 控制图表右边的空白区域
          bottom: '15%', // 控制图表下边的空白区域
          top: '20%',    // 控制图表上边的空白区域
        },
        // 可选，调整图表的宽度和高度（图表容器的设置）
        width: '80%',  // 控制图表的宽度，适应父容器
        height: '400px', // 控制图表的高度
      };
      break;
    case 'line':
      option = {
        title: {
          text: '预测PDR折线图',
          left: 'center',
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: dataValues.map(item => item.name),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'PDR值',
            data: dataValues.map(item => item.value),
            type: 'line', // 确保 type 属性存在且正确
            smooth: true,
          },
        ],
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '20%',
        },
      };
      break;
    case 'pie':
      option = {
        title: {
          text: '预测PDR饼图',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'PDR值',
            type: 'pie', // 确保 type 属性存在且正确
            radius: '50%',
            data: dataValues,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      break;
    default:
      console.error('未知的图表类型');
      return;
  }


  // 设置选项并刷新图表
  this.predictChartInstance.setOption(option);
},

    // 监听图表类型变化
    handleChartTypeChange() {
      this.setPredictChartOption();
    },

    // 监听预测结果变化
    watchPredictResult() {
      if (this.predictDialogVisible) {
        this.initPredictChart();
      }
    },

    // 关闭弹窗时销毁图表实例
    handleClose(done) {
      if (this.predictChartInstance) {
        this.predictChartInstance.dispose();
        this.predictChartInstance = null;
      }
      done();
    },
    
  },
  watch: {
  predictDialogVisible(val) {
    if (val) {
      // 弹窗显示，初始化图表
      this.$nextTick(() => {
        this.initPredictChart();
      });
    } else {
      // 弹窗关闭，销毁图表实例
      if (this.predictChartInstance) {
        this.predictChartInstance.dispose();
        this.predictChartInstance = null;
        window.removeEventListener('resize', this.handlePredictChartResize);
      }
    }
  },
  selectedChartType() {
    this.handleChartTypeChange();
  },
},
  mounted() {
    this.fetchAllTeams();
  },
  beforeUnmount() {
    if (this.predictChartInstance) {
    this.predictChartInstance.dispose();
    window.removeEventListener('resize', this.handlePredictChartResize);
  }
  if (this.historyChartInstance) {
    this.historyChartInstance.dispose();
    window.removeEventListener('resize', this.handleHistoryChartResize);
  }
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.el-table {
  margin-top: 20px;
}

.el-input {
  margin-bottom: 20px;
}

.page-container {
  padding: 20px;
  background-color: #f4f6f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 300px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-button {
  background-color: #409eff;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

.search-button:hover {
  background-color: #66b1ff;
  transform: scale(1.05);
}

.team-table {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.el-table {
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-button {
  margin-right: 10px;
  border-radius: 5px;
  transition: transform 0.3s, background-color 0.3s;
}

.action-button:hover {
  background-color: #66b1ff;
  transform: scale(1.05);
}

.dialog-content {
  text-align: center;
}

.result-text {
  font-size: 24px;
  color: #f56c6c;
  margin-bottom: 10px;
}

.detail-text {
  font-size: 16px;
  color: #333;
}

.close-button {
  background-color: #f56c6c;
  color: white;
  border-radius: 8px;
}

.close-button:hover {
  background-color: #e0433a;
}

.chart-container {
  width: 100%;
  height: 400px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.el-dialog {
  animation: fadeIn 0.3s ease-in-out;
}

/* 弹窗的整体容器样式 */
.el-dialog {
  border-radius: 15px; /* 弹窗圆角 */
  overflow: hidden; /* 防止子元素超出 */
}

/* 顶部区域样式 */
.dialog-header {
  background-color: #409EFF; /* 蓝色背景 */
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影 */
}

/* 中部区域样式 - 结果显示区域 */
.dialog-body {
  background-color: #f5f5f5; /* 浅灰背景 */
  padding: 20px;
  border-top: 1px solid #e0e0e0; /* 轻微的上边框 */
  border-bottom: 1px solid #e0e0e0; /* 轻微的下边框 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影 */
  animation: fadeIn 0.5s ease-in-out; /* 渐显动画 */
}

/* 预测PDR文本 */
.result-text {
  font-size: 24px;
  color: #f56c6c; /* 红色文字 */
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  animation: fadeInUp 0.7s ease-out; /* 上升动画 */
}

/* 详情文本 */
.detail-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

/* 底部按钮区域样式 */
.close-button {
  background-color: #409EFF;
  color: white;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  transition: background-color 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.close-button:hover {
  background-color: #66b1ff;
}

/* 动画效果 */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-footer {
  text-align: right;
}

.el-dialog {
  border-radius: 15px; /* 弹窗圆角 */
  overflow: hidden; /* 防止子元素超出 */
}

/* 顶部区域样式 */
.dialog-header {
  background-color: #409EFF; /* 蓝色背景 */
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影 */
}

/* 中部区域样式 - 结果显示区域 */
.dialog-body {
  background-color: #f5f5f5; /* 浅灰背景 */
  padding: 20px;
  border-top: 1px solid #e0e0e0; /* 轻微的上边框 */
  border-bottom: 1px solid #e0e0e0; /* 轻微的下边框 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影 */
  animation: fadeIn 0.5s ease-in-out; /* 渐显动画 */
}

/* 预测PDR文本 */
.result-text {
  font-size: 24px;
  color: #f56c6c; /* 红色文字 */
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  animation: fadeInUp 0.7s ease-out; /* 上升动画 */
}

/* 详情文本 */
.detail-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

/* 底部按钮区域样式 */
.close-button {
  background-color: #409EFF;
  color: white;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  transition: background-color 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.close-button:hover {
  background-color: #66b1ff;
}

/* 图表容器样式 */
.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}

/* 动画效果 */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
