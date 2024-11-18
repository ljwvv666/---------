<template>
  <div id="show_FP">

    <!-- 对所有信息的展示 -->
    <div id="allInfo" v-show="isShow == 1">
      <el-table
        :data="tableData"
        row-key="id"
        border
        show-summary
        ref="allInfoRef"
      >
        <el-table-column width="70" label="序号" >
          <template #default="scope">
            <!-- 判断如果当前行和前一行的子系统名称相同，则不显示 -->
            <span >{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="子系统" width="110">
          <template #default="scope">
            <!-- 判断如果当前行和前一行的子系统名称相同，则不显示 -->
            <span v-if="scope.row.isFirstInSubSystem">{{ scope.row.subSystem }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模块" width="110">
          <template #default="scope">
            <!-- 判断如果当前行和前一行的模块名称相同，则不显示 -->
            <span v-if="scope.row.isFirstInModule">{{ scope.row.module }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fpn" label="功能点名称" width="150"></el-table-column>
        <el-table-column prop="fpd" label="功能点描述" width="300"></el-table-column>
        <el-table-column prop="type" label="功能类型" width="100">
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
        <el-table-column prop="complexity" label="复杂度" width="100">
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
        <el-table-column prop="ufp" label="UFP" width="70"></el-table-column>

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

// 复杂度候选项
const complexityOptions = ['低', '中', '高'];

// 功能类型候选项
const functionTypeOptions = ['EI', 'EO', 'EQ', 'ILF', 'EIF'];


// 更新复杂度和功能类型的方法
const updateFTOrComplexity = async (row) => {
  try {
    const res = await axios.post('https://92eb484a-22bf-43a3-b3a5-4b112fa53107.mock.pstmn.io/func/update', {
      systemID: row.systemID,
      subSystem: row.subSystem,
      module: row.module,
      type: row.type,
      complexity: row.complexity,
      fpd: row.fpd,
      ufp: row.ufp,
      fpn: row.fpn
    });

    fetchTableData();

    // 更新成功后的提示
    ElMessage({
      message: res.data.msg,
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

// 获取数据并处理
const fetchTableData = async () => {
  try {
    const response = await axios.get('https://92eb484a-22bf-43a3-b3a5-4b112fa53107.mock.pstmn.io/func/list'); // 替换为实际的接口地址
    const data = response.data.info;
    
    const sum = ref(0);
    data.forEach(item => {
      const type = item.type
      if(type == "EO"){ ufpStore.EO++;}
      if(type == "EI"){ ufpStore.EI++;}
      if(type == "EQ"){ ufpStore.EQ++;}
      if(type == "ILF"){ ufpStore.ILF++;}
      if(type == "EIF"){ ufpStore.EIF++;}
      sum.value += item.ufp;
    });
    ufpStore.UFP = sum.value;
    console.log(ufpStore.UFP)


    let sequenceNumber = 0; // 序号初始化
    let previousSubSystem = ''; // 上一个子系统名称
    let previousModule = '';
    tableData.value = data.map((item, index) => {
      sequenceNumber++; // 更新序号
      // 如果当前子系统名称与上一个子系统名称不同，重新设置序号
      const isFirstInSubSystem = item.subSystem !== previousSubSystem;
      if (isFirstInSubSystem) {
        previousSubSystem = item.subSystem;
      }

      const isFirstInModule = item.module !== previousModule;
      if(isFirstInModule){
        previousModule = item.module;
      }
      return {
        ...item,
        index: sequenceNumber, // 添加序号
        isFirstInSubSystem, // 是否为该子系统名称的第一次出现
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

    // 调用后端接口删除功能点
    const res = await axios.delete("https://92eb484a-22bf-43a3-b3a5-4b112fa53107.mock.pstmn.io/func/delete", {
      params: {
        fpn,
      },
    });

    // 刷新表格数据
    fetchTableData();
    
    // 删除成功后的提示
    ElMessage({
      message: res.data.msg,
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


const isOpen = ref(true);
const allInfoRef = ref(null);


onMounted(() => {
  fetchTableData(); // 调用函数获取数据
});
</script>

<style></style>
