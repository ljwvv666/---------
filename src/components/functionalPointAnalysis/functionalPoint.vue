<template>
  <div id="department-manage">

    <!-- 对所有信息的展示 -->
    <div id="allInfo" v-show="isShow == 1">
      <el-table
        :data="tableData"
        row-key="id"
        border
        show-summary
        :default-expand-all="isOpen"
        ref="allInfoRef"
      >
        <el-table-column width="70" label="序号" >
          <template #default="scope">
          <!-- 只显示第一个子系统的序号 -->
            <span v-if="scope.row.isFirstInSubSystem">{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="子系统" width="150">
          <template #default="scope">
            <!-- 判断如果当前行和前一行的子系统名称相同，则不显示 -->
            <span v-if="scope.row.isFirstInSubSystem">{{ scope.row.subSystem }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="150"></el-table-column>
        <el-table-column prop="fpn" label="功能点名称" width="150"></el-table-column>
        <el-table-column prop="fpd" label="功能点描述" width="250"></el-table-column>
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
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="ufp" label="UFP" width="70"></el-table-column>

        <el-table-column label="操作">
          <template #default="{ row }">
            <el-link
              v-if="row.id !== 1"
              icon="Delete"
              type="primary"
              @click.prevent="deleteDtm(row.id)"
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
import { ElMessage } from "element-plus";
import { useUserStore } from '@/stores/userStore'; // 导入 userStore
import { useUfpStore } from "@/stores/ufpClass";

const ufpStore = useUfpStore();

const userStore = useUserStore(); // 获取 userStore 实例


// 复杂度候选项
const complexityOptions = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
];
// 功能类型候选项
const functionTypeOptions = ['EI', 'EO', 'EQ', 'ILF', 'EIF'];

// 更新复杂度
const updateComplexity = async (row) => {
  try {
    const response = await axios.post('https://your-backend-api/update-complexity', {
      id: row.id,
      dtmComp: row.dtmComp, // 新的复杂度值
    });
    console.log('更新成功:', response.data);
  } catch (error) {
    console.error('更新失败:', error);
  }
};

// 更新功能类型的方法
const updateFunctionType = async (row) => {
  try {
    await axios.post('https://your-backend-api/update-function-type', {
      id: row.id,
      dtmFT: row.dtmFT,
    });
    console.log('功能类型更新成功');
  } catch (error) {
    console.error('功能类型更新失败:', error);
  }
};

//表单验证规则
const departmentRules = reactive({
  pid: [
    {
      required: true,
      message: "上级功能点不能为空",
      trigger: "blur",
    },
  ],
  subSystem: [
    {
      required: true,
      message: "子系统不能为空",
      trigger: "blur",
    },
  ],
  module: [
    {
      required: true,
      message: "模块不能为空",
      trigger: "blur",
    },
  ],
  FPN: [
    {
      required: true,
      message: "功能点名称不能为空",
      trigger: "blur",
    },
  ],
  FPD: [
    {
      required: true,
      message: "功能点描述不能为空",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "类型不能为空",
      trigger: "blur",
    },
  ],
  complexity: [
    {
      required: true,
      message: "复杂度不能为空",
      trigger: "blur",
    },
  ],
});

const dialogFormVisible = ref(false);
const dialogFormVisible1 = ref(false);
const dialogFormVisible2 = ref(false);

interface Department {
  pid: string;
  id: string;
  subSystem: string;
  module: string; // 可以根据实际情况定义更精确的类型
  FPN: string;
  FPD: string;
  type: string;
  complexity: string;
  UFP: string;
}

const department = reactive<Department>({
  pid: "",
  id: "",
  subSystem: "",
  module: "",
  FPN: "",
  FPD: "",
  type: "",
  complexity: "",
  UFP: ""
});

const isShow = ref(1);

let tableData = ref([]);
let departments = ref([]);
let firm = ref();

// 获取数据并处理
const fetchTableData = async () => {
  try {
    const response = await axios.get('https://92eb484a-22bf-43a3-b3a5-4b112fa53107.mock.pstmn.io/func/list'); // 替换为实际的接口地址
    const data = response.data.info;
    
    data.forEach(item => {
      const type = item.type
      if(type == "EO"){ ufpStore.EO++;}
      if(type == "EI"){ ufpStore.EI++;}
      if(type == "EQ"){ ufpStore.EQ++;}
      if(type == "ILF"){ ufpStore.ILF++;}
      if(type == "EIF"){ ufpStore.EIF++;}
    });

    let sequenceNumber = 0; // 序号初始化
    let previousSubSystem = ''; // 上一个子系统名称
    tableData.value = data.map((item, index) => {
      // 如果当前子系统名称与上一个子系统名称不同，重新设置序号
      const isFirstInSubSystem = item.subSystem !== previousSubSystem;
      if (isFirstInSubSystem) {
        previousSubSystem = item.subSystem;
        sequenceNumber++; // 更新序号
      }

      return {
        ...item,
        index: sequenceNumber, // 添加序号
        isFirstInSubSystem, // 是否为该子系统名称的第一次出现
      };
    });

  } catch (error) {
    console.error('Failed to fetch table data:', error);
  }
};

let tableData2 = ref([]);
let list = ref([]);



function openDialogAdd(id) {
  dialogFormVisible.value = true;
}


function deleteDtm(id: number) {
  if (!confirm("是否删除")) {
    return;
  }
  axios
    .get("/api/index/delete", {
      params: {
        id,
      },
    })
    .then((res) => {
      ElMessage({
        message: res.data.msg,
        type: "success",
      });
      showList();
    });
}

const isOpen = ref(true);
const allInfoRef = ref(null);


onMounted(() => {
  fetchTableData(); // 调用函数获取数据
});
</script>

<style></style>
