<template>
  <div id="show_FP">

    <!-- 对所有信息的展示 -->
    <div id="allInfo" v-show="isShow == 1" style="margin-bottom: 20px;margin-left: 40px;width: 90%;margin-top: 10px;">
      <el-table
        :data="tableData"
        row-key="id"
        border
        show-summary
        ref="allInfoRef"
        :summary-method="summaryMethod"
      >

        <el-table-column width="70" label="序号" >
          <template #default="scope">
            <!-- 判断如果当前行和前一行的子系统名称相同，则不显示 -->
            <span >{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="子系统" width="115">
          <template #default="scope">
            <!-- 判断如果当前行和前一行的子系统名称相同，则不显示 -->
            <span v-if="scope.row.isFirstInSubSystem">{{ scope.row.subSystem }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模块" width="115">
          <template #default="scope">
            <!-- 判断如果当前行和前一行的模块名称相同，则不显示 -->
            <span v-if="scope.row.isFirstInModule">{{ scope.row.module }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fpn" label="功能点名称" width="150"></el-table-column>
        <el-table-column prop="fpd" label="功能点描述" width="400"></el-table-column>
        <el-table-column prop="type" label="功能类型" width="110">
          <template #default="scope">
            <el-select
              v-model="scope.row.type"
              placeholder="请选择功能类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in functionTypeOptions"
                :key="item"
                :label="item"
                :value="item"
                @click="updateFTOrComplexity(scope.row)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="complexity" label="复杂度" width="110">
          <template #default="scope">
            <el-select
              v-model="scope.row.complexity"
              placeholder="请选择复杂度"
              style="width: 100%"
            >
              <el-option
                v-for="item in complexityOptions"
                :key="item"
                :label="item"
                :value="item"
                @click="updateFTOrComplexity(scope.row)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="ufp" label="UFP" width="80"></el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-link
              icon="Delete"
              type="primary"
              @click.prevent="deleteDtm(scope.row.fpn)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="display: flex;margin-right: 105px; justify-content: flex-end;">
      <el-button type="primary" @click="viewResult">确认无误，查看结果</el-button>
    </div>
    <div v-show="isShow == 0">
      <el-empty description="无符合要求的部门信息" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { List, Menu, Platform, Right, Setting } from "@element-plus/icons-vue";
import type { FormInstance, FormRules, StepInstance } from "element-plus";
import { ElMessage,ElMessageBox } from "element-plus";
import { useUserStore } from '@/stores/userStore'; // 导入 userStore
import { useUfpStore } from "@/stores/ufpClass";

const ufpStore = useUfpStore();

const userStore = useUserStore(); // 获取 userStore 实例

const router = useRouter();

// 复杂度候选项
const complexityOptions = ['低', '中', '高'];

// 功能类型候选项
const functionTypeOptions = ['EI', 'EO', 'EQ', 'ILF', 'EIF'];


// 更新复杂度和功能类型的方法
const updateFTOrComplexity = async (row) => {
  try {
    console.log(row.type);
    let fd = new FormData()
    fd.append("type",row.type)
    fd.append("complexity",row.complexity)
    fd.append("FPN",row.fpn)
    const res = await axios.post('http://localhost:9000/func/update', fd);

    fetchTableData();

    // 更新成功后的提示
    ElMessage({
      message: "数据更新成功！",
      type: "success",
    });
  } catch (error) {
    console.error('更新失败:', error);
  }
};



const dialogFormVisible = ref(false);
const dialogFormVisible1 = ref(false);
const dialogFormVisible2 = ref(false);



const isShow = ref(1);

let tableData = ref([]);
let departments = ref([]);
let firm = ref();

const summaryMethod = ({ columns, data }) => {
  const sums = [];
  
  // 遍历所有列
  columns.forEach((column, index) => {
    // 判断是否为需要计算总和的列 (例如: ufp)
    if (index === 0) {
      sums.push('总和'); // 如果是第一列，可以放一个固定标签
    } else if (index === 1) { 
      sums.push(ufpStore.EO); // 可以使用动态数据，例如 ufps
    } else if (index === 2) {
      sums.push(ufpStore.EI); // 继续根据实际数据处理其他列
    } else if (index === 3) {
      sums.push(ufpStore.EQ);
    } else if (index === 4) {
      sums.push(ufpStore.ILF);
    } else if (index === 5) {
      sums.push(ufpStore.EIF);
    } else {
      sums.push(data.reduce((sum, item) => sum + (item[column.property] || 0), 0));
    }
  });

  return sums;
};

const fetchTableData = async () => {
  try {
    ufpStore.EO = 0;
    ufpStore.EI = 0;
    ufpStore.EQ = 0;
    ufpStore.ILF = 0;
    ufpStore.EIF = 0;
    const response = await axios.get('http://localhost:9000/func/list');
    const data = response.data.info;
    
    const sum = ref(0);
    data.forEach(item => {
      const type = item.type;
      if(type === "EO"){ ufpStore.EO++; }
      if(type === "EI"){ ufpStore.EI++; }
      if(type === "EQ"){ ufpStore.EQ++; }
      if(type === "ILF"){ ufpStore.ILF++; }
      if(type === "EIF"){ ufpStore.EIF++; }
      sum.value += item.ufp;
    });
    ufpStore.UFP = sum.value;
    console.log(ufpStore.UFP);

    let sequenceNumber = 0;
    let previousSubSystem = '';
    let previousModule = '';
    tableData.value = data.map((item, index) => {
      sequenceNumber++;
      const isFirstInSubSystem = item.subSystem !== previousSubSystem;
      if (isFirstInSubSystem) {
        previousSubSystem = item.subSystem;
      }
      const isFirstInModule = item.module !== previousModule;
      if (isFirstInModule) {
        previousModule = item.module;
      }
      return {
        ...item,
        index: sequenceNumber,
        isFirstInSubSystem,
        isFirstInModule,
      };
    });
  } catch (error) {
    console.error('Failed to fetch table data:', error);
  }
};



async function deleteDtm(fpn: string) {
  try {
    // 弹出确认框
    await ElMessageBox.confirm("确认删除该功能点？", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

console.log(fpn)
    // 调用后端接口删除功能点
     axios.get("http://localhost:9000/func/delete", {
      params: {
        fpn
      }
    }).then(res=>{
    alert(res.data.msg);
    });

    // 刷新表格数据
    fetchTableData();
    
    // 删除成功后的提示
    ElMessage({
      message: "111",
      type: "success",
    });

  } catch (error) {
    // 捕获用户取消或者接口错误
    console.error("Error deleting function point:", error);

    // 如果需要，可以显示一条错误消息
    ElMessage({
      message: "删除失败或操作已取消",
      type: "error",
    });
  }
}

const viewResult = () => {
  router.push("/index/datascreen");
}
const isOpen = ref(true);
const allInfoRef = ref(null);


onMounted(() => {
  fetchTableData(); // 调用函数获取数据
});
</script>

<style></style>
