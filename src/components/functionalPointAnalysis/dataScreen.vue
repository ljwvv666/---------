<template>
  <!-- 三个数据展示 -->
    <el-row :gutter="16" style="margin-bottom: 30px;">
      <!-- 未调整功能点数 -->
      <el-col :span="8">
        <div class="statistic-card">
          <!-- gscTableData[0]?.ufp || 0 -->
          <el-statistic :value=ufpStore.total>
            <template #title>
              <div style="display: inline-flex; align-items: center">
                未调整功能点数
                <el-tooltip
                  effect="dark"
                  content="使用快速功能点法计算未调整功能点数"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <!-- GSC已调整功能点数 -->
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="693700">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                调整功能点数v1
                <el-tooltip
                  effect="dark"
                  content="使用GSC法计算已调整功能点数"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <el-button type="primary" @click.prevent = "dialogTable1Visible = true">更改GSC</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 规模因子调整功能点数 -->
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="72000">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                调整功能点数v2
                <el-tooltip
                  effect="dark"
                  content="使用规模因子法法计算已调整功能点数"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <el-button type="primary" @click = "dialogTable2Visible = true">更改规模变更因子</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 功能点表格和饼状图 -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <!-- 功能点表格 -->
      <el-table :data="tableData" border show-summary style="width: 30%;">
        <el-table-column prop="name" label="功能点类型" />
        <el-table-column prop="amount" sortable label="数量" />
      </el-table>
      <!-- 饼状图 -->
      <PieChart />
    </div>
    
  <!-- GSC弹窗 -->
  <el-dialog v-model="dialogTable1Visible" v-if="dialogTable1Visible" title="综合系统特征表" width="800">
    <el-table :data="gscTableData" border style="width: 100%">
      <!-- 表头 -->
      <el-table-column property="GSC" label="GSC" width="200" />
      <!-- 可编辑 DI 列 -->
      <el-table-column label="DI" width="150">
        <template #default="{ row }">
          <el-input-number
            v-model="row.DI"
            :min="0"
            :max="5"
            :step="1"
            placeholder="选择DI"
            size="small"
          />
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
      <el-button type="primary" style="margin-right: 8px;" @click="updateGSC">确定修改</el-button>
      <el-button @click="dialogTable1Visible=false">取消</el-button>
    </div>
  </el-dialog>

   <!-- 规模变更因子弹窗 -->
   <el-dialog v-model="dialogTable2Visible" title="规模变更因子" width="800">
    <el-table >
      <el-table-column property="GSC" label="项目阶段" width="200" />
      <el-table-column property="DI" label="调整因子" width="200" />
    </el-table>

    <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
      <el-button type="primary" style="margin-right: 8px;">确定</el-button>
      <el-button @click="dialogTable2Visible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
  
<script lang="ts" setup>
import {
    ArrowRight,
    CaretBottom,
    CaretTop,
    Warning,
} from '@element-plus/icons-vue'
import { h} from 'vue'   
import type { VNode } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import { onMounted, ref, reactive } from "vue";
import PieChart from "@/components/functionalPointAnalysis/PieChart.vue";
import axios from 'axios';
import { useSystemStore } from '@/stores/systemStore';
import { useUfpStore } from "@/stores/ufpClass";
import { ElMessage } from "element-plus";

const dialogTable1Visible = ref(false);
const dialogTable2Visible = ref(false)
const systemStore = useSystemStore();
const ufpStore = useUfpStore();

console.log(systemStore.systemID);
// 明确指定 gscTableData 的类型
const gscTableData = ref<{
  GSC: string;
  DI: number;
  gscID: number;
  systemID: number | null;
  ufp: number | null;
  cfp: number | null;
  totalDI: number;
  vaf: number;
  dfp: number;
}[]>([]);

//获取gsc数据
const fetchData = async () => {
  try {
    // http://localhost:8088/gsc/get?gscID=${systemStore.systemID}
    const response = await axios.get("https://92eb484a-22bf-43a3-b3a5-4b112fa53107.mock.pstmn.io/gsc/get?gscID=${systemStore.systemID}");
    const rawData = response.data;

    // 定义你的 GSC 映射
    const gscMapping = {
      diDataComm: "数据通信",
      diDistDataProc: "分布式数据处理",
      diPerformance: "性能要求",
      diHeavyConfig: "大量配置",
      diTransRate: "事务速率",
      diOnlineDataEntry: "在线数据输入",
      diUserEfficiency: "用户效率",
      diOnlineUpdate: "在线更新",
      diComplexProc: "复杂处理",
      diReusability: "可复用性",
      diInstallease: "安装方便性",
      diOperEase: "操作方便性",
      diMultipleSites: "多站点支持",
      diFacilitateChange: "便于变更"
    };

    // 填充数据
    gscTableData.value = Object.keys(gscMapping).map((key) => {
      return {
        GSC: gscMapping[key as keyof typeof gscMapping], // 通过映射获取 GSC 值
        DI: rawData[key] || 0, // 填充 DI 值，如果没有数据，默认为 0
        gscID: rawData.gscID || 0, // 填充 gscID
        systemID: rawData.systemID || null, // 填充 systemID
        ufp: rawData.ufp || null, // 填充 ufp
        cfp: rawData.cfp || null, // 填充 cfp
        totalDI: rawData.totalDI || 0, // 填充 totalDI
        vaf: rawData.vaf || 0, // 填充 vaf
        dfp: rawData.dfp || 0, // 填充 dfp
      };
    });

  } catch (error) {
    console.error("数据加载失败：", error);
  }
}

//更新gsc数据
const updateGSC = async () => {
  try {
    // 1. 构造 JSON 数据
    const requestData = gscTableData.value.reduce((result, row) => {
      // 根据 GSC 名称映射到数据库字段名
      const keyMapping = {
        "Data Communication": "diDataComm",
        "Distributed Data Processing": "diDistDataProc",
        "Performance": "diPerformance",
        "Heavy Configuration": "diHeavyConfig",
        "Transaction Rate": "diTransRate",
        "Online Data Entry": "diOnlineDataEntry",
        "User Efficiency": "diUserEfficiency",
        "Online Update": "diOnlineUpdate",
        "Complex Processing": "diComplexProc",
        "Reusability": "diReusability",
        "Ease of Installation": "diInstallEase",
        "Ease of Operation": "diOperEase",
        "Multiple Sites": "diMultipleSites",
        "Facilitate Change": "diFacilitateChange",
      };
      // 将 GSC 转换为对应的数据库字段名并赋值
      const key = keyMapping[row.GSC];
      if (key) {
        result[key] = row.DI;
      }
      return result;
    }, {
      // 初始化非 DI 的字段
      gscID: gscTableData.value[0].gscID, // 假设 gscID 对应所有行相同
      systemID: gscTableData.value[0].systemID,
      ufp: gscTableData.value[0].ufp,
      cfp: gscTableData.value[0].cfp,
      totalDI: gscTableData.value[0].totalDI,
      vaf: gscTableData.value[0].vaf,
      dfp: gscTableData.value[0].dfp,
    });

    // 2. 发送 POST 请求
    const response = await axios.post("https://92eb484a-22bf-43a3-b3a5-4b112fa53107.mock.pstmn.io/gsc/update", requestData);
    console.log(response.data);
    // 3. 检查响应结果
    ElMessage({
      message: response.data.msg,
      type: "success",
    });
    dialogTable1Visible.value = false;
  } catch (error) {
    console.error("更新失败：", error);
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  fetchData();
});
interface Product {
    FP: string
    amount: string
}

interface SummaryMethodProps<T = Product> {
columns: TableColumnCtx<T>[]
data: T[]
}

const getSummaries = (param: SummaryMethodProps) => {
const { columns, data } = param
const sums: (string | VNode)[] = []
columns.forEach((column, index) => {
    if (index === 0) {
    sums[index] = h('div', { style: { textDecoration: 'underline' } }, [
        'Total Cost',
    ])
    return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
    sums[index] = `$ ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
        return prev + curr
        } else {
        return prev
        }
    }, 0)}`
    } else {
    sums[index] = 'N/A'
    }
})

return sums
}

const tableData: Product[] = [
{
    name: 'EO',
    amount: ufpStore.EO,
},
{
    name: 'EI',
    amount: ufpStore.EI,
},
{
    name: 'EQ',
    amount: ufpStore.EQ,
},
{
    name: 'ILF',
    amount: ufpStore.ILF,
},
{
    name: 'EIF',
    amount: ufpStore.EIF,
},
]
</script>
  
<style scoped>
  :global(h2#card-usage ~ .example .example-showcase) {
    background-color: var(--el-fill-color) !important;
  }
  
  .el-statistic {
    --el-statistic-content-font-size: 28px;
  }
  
  .statistic-card {
    height: 100%;
    padding: 20px;
    border-radius: 4px;
    background-color: var(--el-bg-color-overlay);
  }
  
  .statistic-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    font-size: 12px;
    color: var(--el-text-color-regular);
    margin-top: 16px;
  }
  
  .statistic-footer .footer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .statistic-footer .footer-item span:last-child {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
  }
  
  .green {
    color: var(--el-color-success);
  }
  .red {
    color: var(--el-color-error);
  }

  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
  