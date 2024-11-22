<template>
  <div class="dashboard-container">
    <!-- 顶部标题栏 -->
    <header class="dashboard-header">
      <h1 class="header-title">省份人月基准单价分析仪表板</h1>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-label">城市总数</span>
          <span class="stat-value">{{ cities.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均人月基准单价</span>
          <span class="stat-value">¥{{ averageCost }}万元</span>
        </div>
      </div>
    </header>

    <div class="dashboard-content">
      <!-- 左侧地图区域 -->
      <div class="map-container">
        <div class="map-header">
          <h2 class="map-title">城市人月基准单价分布图</h2>
          <button @click="toggleView" class="action-button btn-secondary">
            切换视图
          </button>
          <div class="map-actions">
            <button class="action-button" @click="resetZoom">
              <i class="fas fa-compress-arrows-alt"></i> 重置视图
            </button>
          </div>
        </div>
        <div id="chart" class="chart-area"></div>
      </div>

      <!-- 右侧控制面板 -->
      <div class="control-panel">
        <div class="panel-section">
          <h3 class="section-title">数据更新</h3>
          <div class="update-form">
            <div class="form-group">
              <label for="city-select">选择城市</label>
              <select
                v-model="selectedCity"
                id="city-select"
                class="form-select"
              >
                <option value="">请选择城市</option>
                <option v-for="city in cities" :key="city.id" :value="city.id">
                  {{ city.cityname }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="cost-input">基准金额</label>
              <div class="cost-input-wrapper">
                <span class="currency-symbol">¥</span>
                <input
                  v-model="newCost"
                  id="cost-input"
                  type="number"
                  step="0.01"
                  class="form-input"
                  placeholder="输入新基准单价"
                />
              </div>
            </div>

            <button
              @click="updateCityCost"
              class="submit-button"
              :disabled="!selectedCity || !newCost"
            >
              更新基准数据
            </button>
          </div>
        </div>

        <div class="panel-section">
          <h3 class="section-title">当前选中城市信息</h3>
          <div class="city-info" v-if="selectedCityData">
            <div class="info-item">
              <span class="info-label">城市名称</span>
              <span class="info-value">{{ selectedCityData.cityname }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前基准数据</span>
              <span class="info-value"
                >¥{{ selectedCityData.cost }}万元/人月</span
              >
            </div>
          </div>
          <div class="empty-state" v-else>请选择一个城市查看详细信息</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      cities: [],
      selectedCity: null,
      newCost: "",
      chartInstance: null,
      currentOption: "map", // 用来标记当前是显示地图还是直方图
      isMapMode: true, // 默认显示地图模式
    };
  },

  computed: {
    selectedCityData() {
      return this.cities.find((c) => c.id === this.selectedCity);
    },
    averageCost() {
      if (!this.cities.length) return "0.00";
      const total = this.cities.reduce(
        (sum, city) => sum + parseFloat(city.cost || 0),
        0
      );
      return (total / this.cities.length).toFixed(2);
    },
  },

  mounted() {
    this.fetchCityData();
    window.addEventListener("resize", this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },

  methods: {
    // 切换视图
    toggleView() {
      this.isMapMode = !this.isMapMode; // 切换视图模式
      this.renderChart(); // 重新渲染图表
    },

    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },

    async fetchCityData() {
      try {
        const response = await fetch("http://118.202.10.11:8080/listcity");
        const data = await response.json();

        if (data.isok) {
          this.cities = data.lists;
          this.renderChart();
        } else {
          this.showNotification("错误", "数据加载失败", "error");
        }
      } catch (error) {
        this.showNotification("错误", "网络请求失败", "error");
      }
    },

    // 渲染图表
    renderChart() {
      if (!this.cities.length) {
        console.error("城市数据为空，无法渲染图表");
        return;
      }

      const chartDom = document.getElementById("chart");
      if (!chartDom) {
        console.error("图表容器不存在");
        return;
      }

      // 如果已经存在图表实例，销毁它
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      this.chartInstance = echarts.init(chartDom);

      // 数据格式化
      const cityData = this.cities.map((city) => ({
        name: city.cityname,
        value: parseFloat(city.cost) || 0, // 确保 cost 为数值
      }));

      console.log("City Data:", cityData);

      // 计算 min 和 max
      const values = cityData.map((d) => d.value).filter((v) => !isNaN(v));
      const min = Math.min(...values);
      const max = Math.max(...values);

      console.log("Min:", min, "Max:", max);

      if (!values.length || isNaN(min) || isNaN(max)) {
  console.error("有效值为空或 Min/Max 无效");
  return;
}

      // 图表配置
      const option = {
        tooltip: {
          trigger: "item",
        },
        visualMap: {
          left: "right",
          min: min,
          max: max,
          inRange: {
            color: ["#e0f3f8", "#fee090", "#f46d43", "#a50026"],
          },
          text: ["高", "低"],
          calculable: false,
        },
        series: [
        this.isMapMode
    ? {
        name: "城市成本",
        type: "map", // 确保 type 为 'map'
        map: "china",
        roam: true,
        label: { show: true },
        data: cityData, // 确保 data 不为空
      }
    : {
        name: "城市成本",
        type: "bar", // 确保 type 为 'bar'
        data: cityData.map((d) => d.value), // 确保 data 不为空
      },
        ],
      };

      // 检查是否渲染地图，若是则隐藏坐标轴
      if (this.isMapMode) {
        // 地图模式下隐藏坐标轴
        option.xAxis = { show: false };
        option.yAxis = { show: false };
        option.series = [
    {
      name: "城市成本",
      type: "map",
      map: "china",
      roam: true,
      label: { show: true },
      data: cityData,
    },
  ];
  option.visualMap = {
    left: "right",
    min: min,
    max: max,
    inRange: {
      color: ["#e0f3f8", "#fee090", "#f46d43", "#a50026"],
    },
    text: ["高", "低"],
    calculable: false,
  };
      } else {
        // 直方图模式下显示坐标轴
        option.xAxis = {
          type: "category",
          data: cityData.map((d) => d.name), // 用城市名作为坐标轴标签
        };
        option.yAxis = {
          type: "value",
        };
        option.series = [
          {
            name: "城市成本",
            type: "bar", // 使用直方图
            data: cityData.map((d) => d.value),
          },
        ];
      }

      // 加载地理数据并注册地图
      fetch(
        "/china.json"
      )
        .then((res) => res.json())
        .then((geoJson) => {
          echarts.registerMap("china", geoJson);
          this.chartInstance.setOption(option);
        })
        .catch((error) => {
          console.error("地理JSON加载失败:", error);
        });
    },

    async updateCityCost() {
      if (!this.selectedCity || !this.newCost) return;

      const city = this.cities.find((c) => c.id === this.selectedCity);
      if (!city) return;

      try {
        const response = await fetch("http://118.202.10.11:8080/updateCity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: city.id,
            cityname: city.cityname,
            cost: parseFloat(this.newCost),
          }),
        });

        const result = await response.json();
        if (result.isok) {
          city.cost = parseFloat(this.newCost);
          this.renderChart();
          this.showNotification("成功", "城市成本更新成功", "success");
          this.newCost = "";
        } else {
          this.showNotification("错误", "更新失败", "error");
        }
      } catch (error) {
        this.showNotification("错误", "网络请求失败", "error");
      }
    },

    resetZoom() {
      if (this.chartInstance) {
        this.chartInstance.dispatchAction({
          type: "restore",
        });
      }
    },

    showNotification(title, message, type) {
      alert(`${title}: ${message}`);
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24px;
}

.dashboard-header {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.header-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.dashboard-content {
  display: flex;
  gap: 24px;
}

.map-container {
  flex-grow: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.map-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.chart-area {
  width: 100%;
  height: 478px;
  border-radius: 8px;
  background-color: #f9fafb;
}

.control-panel {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  background-color: white;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.cost-input-wrapper {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.form-input {
  width: 100%;
  padding: 8px 12px 8px 28px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.submit-button {
  width: 100%;
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #1d4ed8;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.city-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
}

.info-value {
  font-weight: 500;
  color: #1f2937;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 16px 0;
}

.action-button {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .dashboard-content {
    flex-direction: column;
  }

  .control-panel {
    width: 100%;
  }

  .chart-area {
    height: 400px;
  }
}

@media (max-width: 640px) {
  .dashboard-container {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    text-align: center;
  }

  .header-stats {
    justify-content: center;
  }

  /* 添加切换按钮的样式 */
  .btn-secondary {
    padding: 10px 15px;
    background-color: #8e44ad;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn-secondary:hover {
    background-color: #6c3483;
  }
}
</style>
