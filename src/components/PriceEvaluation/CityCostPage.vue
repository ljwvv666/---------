<template>
  <div>
    <div id="chart" style="width: 100%; height: 600px;"></div>
    <div class="update-form">
      <label for="city-select">选择城市:</label>
      <select v-model="selectedCity" id="city-select">
        <option v-for="city in cities" :key="city.id" :value="city.id">
          {{ city.cityname }}
        </option>
      </select>
      <label for="cost-input">新成本:</label>
      <input v-model="newCost" id="cost-input" type="number" step="0.01" />
      <button @click="updateCityCost">更新成本</button>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      cities: [], // 城市数据
      selectedCity: null, // 当前选中城市ID
      newCost: '', // 新成本值
      chartInstance: null, // 图表实例
    };
  },
  mounted() {
    this.fetchCityData();
    // 移除 this.renderChart(); 以避免在数据未加载前渲染图表
  },
  methods: {
    // 获取城市数据
    async fetchCityData() {
      try {
        const response = await fetch('http://118.202.10.11:8080/listcity');
        const data = await response.json();

        if (data.isok) {
          this.cities = data.lists;
          this.renderChart();
        } else {
          console.error('数据加载失败');
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
    },

    // 渲染图表
    renderChart() {
      if (!this.cities.length) {
        console.error('城市数据为空，无法渲染图表');
        return;
      }

      const chartDom = document.getElementById('chart');
      if (!chartDom) {
        console.error('图表容器不存在');
        return;
      }

      this.chartInstance = echarts.init(chartDom);

      // 数据格式化
      const cityData = this.cities.map(city => ({
        name: city.cityname,
        value: parseFloat(city.cost) || 0, // 确保 cost 为数值
      }));

      console.log('City Data:', cityData);

      // 计算 min 和 max
      const values = cityData.map(d => d.value).filter(v => !isNaN(v));
      const min = Math.min(...values);
      const max = Math.max(...values);

      console.log('Min:', min, 'Max:', max);

      if (isNaN(min) || isNaN(max)) {
        console.error('Min 或 Max 值无效');
        return;
      }

      // 图表配置
      const option = {
        tooltip: {
          trigger: 'item',
        },
        visualMap: {
          left: 'right',
          min: min,
          max: max,
          inRange: {
            color: ['#e0f3f8', '#fee090', '#f46d43', '#a50026'],
          },
          text: ['高', '低'],
          calculable: true,
        },
        series: [
          {
            name: '城市成本',
            type: 'map',
            map: 'china',
            roam: true,
            label: {
              show: true,
            },
            data: cityData,
          },
        ],
      };

      // 加载地理数据并注册地图
      fetch('https://raw.githubusercontent.com/lyhmyd1211/GeoMapData_CN/master/china.json')
        .then(res => res.json())
        .then(geoJson => {
          echarts.registerMap('china', geoJson);
          this.chartInstance.setOption(option);
        })
        .catch(error => {
          console.error('地理JSON加载失败:', error);
        });
    },

    // 更新城市成本
    async updateCityCost() {
      if (!this.selectedCity || !this.newCost) {
        alert('请选择城市并输入新成本！');
        return;
      }

      const city = this.cities.find(c => c.id === this.selectedCity);
      if (!city) {
        alert('城市不存在！');
        return;
      }

      try {
        const response = await fetch('http://118.202.10.11:8080/updateCity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: city.id,
            cityname: city.cityname,
            cost: parseFloat(this.newCost),
          }),
        });

        const result = await response.json();
        if (result.isok) {
          // 更新本地数据
          city.cost = parseFloat(this.newCost);
          this.renderChart(); // 重新渲染图表
          alert('城市成本更新成功！');
        } else {
          alert('更新失败！');
        }
      } catch (error) {
        console.error('更新失败:', error);
      }
    },
  },
};
</script>

<style>
.update-form {
  margin-top: 20px;
}

.update-form label {
  margin-right: 10px;
}

.update-form input,
.update-form select {
  margin-right: 10px;
  padding: 5px;
}

.update-form button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.update-form button:hover {
  background-color: #0056b3;
}
</style>