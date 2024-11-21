<template>
    <div>
      <!-- 搜索模块 -->
      <el-input
        v-model="searchTeamName"
        placeholder="请输入团队名称"
        clearable
        style="width: 300px; margin-bottom: 20px;"
      >
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
  
      <!-- 团队列表 -->
      <el-table :data="teamList" style="width: 100%">
        <el-table-column prop="teamName" label="团队名称" width="180"></el-table-column>
        <el-table-column prop="count" label="项目数量" width="180"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="predictPDR(scope.row.teamName)">
              预测pdr
            </el-button>
            <el-button type="success" size="mini" @click="showPDRHistory(scope.row.teamName)">
              pdr历史
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 预测PDR弹窗 -->
      <el-dialog title="预测PDR结果" v-model="predictDialogVisible">
        <div style="text-align: center;">
          <p style="font-size: 24px; color: #f56c6c;">预测PDR：{{ predictResult.result }}</p>
          <p>最大PDR：{{ predictResult.maxPdr }}</p>
          <p>最小PDR：{{ predictResult.minPdr }}</p>
        </div>
        <template v-slot:footer>
          <span class="dialog-footer">
          </span>
        </template>
      </el-dialog>
  
      <!-- PDR历史弹窗 -->
      <el-dialog title="PDR历史数据" v-model="historyDialogVisible" width="600px">
        <el-chart :option="chartOption" style="height: 400px;"></el-chart>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button @click="historyDialogVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ElChart } from 'vue-echarts';
  
  export default {
    name: 'PriceEvaluationPdrScreen',
    components: {
      ElChart,
    },
    data() {
      return {
        searchTeamName: '',
        teamList: [],
        predictDialogVisible: false,
        historyDialogVisible: false,
        predictResult: {},
        chartOption: {},
      };
    },
    methods: {
      // 获取团队列表
      async fetchAllTeams() {
        try {
          const response = await fetch('http://118.202.10.11:8080/listallteam');
          const data = await response.json();
          if (data.isok) {
            this.teamList = data.lists;
          }
        } catch (error) {
          console.error('获取团队列表失败', error);
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
            this.$message.warning('未找到对应的团队');
            this.teamList = [];
          }
        } catch (error) {
          console.error('搜索团队失败', error);
        }
      },
      // 预测PDR
      async predictPDR(teamName) {
        try {
          const response = await fetch(
            `http://118.202.10.11:8080/listteampdr?teamName=${encodeURIComponent(teamName)}`
          );
          const data = await response.json();
          if (data.isok) {
            this.predictResult = data;
            this.predictDialogVisible = true;
          } else {
            this.$message.error('预测PDR失败');
          }
        } catch (error) {
          console.error('预测PDR失败', error);
        }
      },
      // 显示PDR历史
      async showPDRHistory(teamName) {
        try {
          const response = await fetch(
            `http://118.202.10.11:8080/listAllpdrbyteam?teamName=${encodeURIComponent(teamName)}`
          );
          const data = await response.json();
          if (data.isok) {
            this.chartOption = {
              xAxis: {
                type: 'category',
                data: data.pdrs.map((_, index) => `第${index + 1}次`),
              },
              yAxis: {
                type: 'value',
              },
              series: [
                {
                  data: data.pdrs,
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                    color: '#409EFF',
                  },
                },
              ],
            };
            this.historyDialogVisible = true;
          } else {
            this.$message.error('获取PDR历史数据失败');
          }
        } catch (error) {
          console.error('获取PDR历史数据失败', error);
        }
      },
    },
    mounted() {
      this.fetchAllTeams();
    },
  };
  </script>
  
  <style scoped>
  .dialog-footer {
    text-align: right;
  }
  </style>