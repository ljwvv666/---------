<template>
  <!-- 各种输入 -->
  <el-row :gutter="25" style="margin-top: 30px;">
    <el-col :span="6">
      <el-form-item label="项目名称">
        <el-input
          v-model="searchQuery.userName"
          style="width: 100%"
          placeholder="请输入项目名称"
        />
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item label="状态">
        <el-select v-model="searchQuery.status" placeholder="项目状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchQuery.createTime"
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY/MM/DD hh:mm:ss"
          value-format="x"
        />
      </el-form-item>
    </el-col>
    <!-- 搜索和重置 -->
    <el-col :span="2">
      <el-button type="primary" @click="searchUser">
        <el-icon><Search /></el-icon>搜索
      </el-button>
    </el-col>
    <el-col :span="2">
      <el-button type="default" @click="resetSearch">
        <el-icon><RefreshRight /></el-icon>重置
      </el-button>
    </el-col>
  </el-row>

  <!-- 整个表单 -->
  <el-table :data="tableData" style="width: 100%; margin-top: 20px;margin-bottom: 40px;">
    <el-table-column prop="id" label="编号" width="100"></el-table-column>
    <el-table-column prop="name" label="项目名称" width="250"></el-table-column>
    <el-table-column prop="createdAt" label="创建时间" width="200"></el-table-column>
    <el-table-column prop="status" label="状态" width="150">
      <template #default="scope">
        <el-button :type="scope.row.status === '正常' ? 'success' : 'danger'" size="mini">
          {{ scope.row.status }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column prop="leader" label="负责人" width="150"></el-table-column>
    <el-table-column prop="progress" label="进度" width="150"></el-table-column>
    <el-table-column>
      <el-button type="primary" @click="gotoFP">开始评估</el-button>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    v-model:current-page="queryForm.pagenum"
    v-model:page-size="queryForm.pagesize"
    :page-sizes="[5, 7, 10]"
    :size="size"
    :background="true"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { RouterLink } from "vue-router";
import { Delete, Edit } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/userStore"; // 导入 userStore
import { column } from "element-plus/es/components/table-v2/src/common.mjs";

const userStore = useUserStore(); // 获取 userStore 实例
const router = useRouter();
const value = ref("");
const input = ref("");
const total = ref(0);

const searchQuery = ref({
  userName: "",
  phoneNumber: "",
  status: "",
  createTime: "",
  department: "",
});

const queryForm = ref({
  query: "",
  pagenum: 1,
  pagesize: 5,
});

// 定义表格列的接口
interface TableColumn {
  prop: string;
  label: string;
  width: number;
}

// 初始化时明确指定 tableColumns 的类型
const tableColumns = ref<TableColumn[]>([]);

interface Project {
  id: number;
  name: string;
  createdAt: string;
  status: string;
  leader: string;
  progress: string;
}

const tableData: Project[] = [
  {
    id: 1,
    name: "AI 智能分析系统",
    createdAt: "2024-01-15",
    status: "正常",
    leader: "张三",
    progress: "80%",
  },
  {
    id: 2,
    name: "数据可视化平台",
    createdAt: "2024-03-10",
    status: "延期",
    leader: "李四",
    progress: "50%",
  },
  {
    id: 3,
    name: "自动化测试工具",
    createdAt: "2024-05-20",
    status: "正常",
    leader: "王五",
    progress: "95%",
  },
  {
    id: 4,
    name: "云存储优化",
    createdAt: "2023-12-01",
    status: "正常",
    leader: "赵六",
    progress: "100%",
  },
  {
    id: 5,
    name: "智能客服系统",
    createdAt: "2023-11-18",
    status: "延期",
    leader: "陈七",
    progress: "40%",
  },
  {
    id: 6,
    name: "边缘计算平台",
    createdAt: "2024-01-05",
    status: "正常",
    leader: "刘八",
    progress: "75%",
  },
  {
    id: 7,
    name: "无人驾驶仿真",
    createdAt: "2023-10-20",
    status: "延期",
    leader: "周九",
    progress: "60%",
  },
  {
    id: 8,
    name: "区块链智能合约",
    createdAt: "2024-02-14",
    status: "正常",
    leader: "吴十",
    progress: "90%",
  },
  {
    id: 9,
    name: "图像识别优化",
    createdAt: "2023-09-12",
    status: "正常",
    leader: "郑十一",
    progress: "85%",
  },
  {
    id: 10,
    name: "机器学习算法改进",
    createdAt: "2024-04-22",
    status: "正常",
    leader: "王十二",
    progress: "70%",
  },
];


// 分页处理函数
const handleSizeChange = (pageSize: number) => {
  queryForm.value.pagenum = 1;
  queryForm.value.pagesize = pageSize;
  if (searchQuery.value) {
    searchUser(); // 如果有搜索查询，调用搜索函数
  } else {
    fetchUserData(); // 否则，调用正常数据获取函数
  }
};

const handleCurrentChange = (pageNum: number) => {
  queryForm.value.pagenum = pageNum;
  if (searchQuery.value) {
    searchUser(); // 如果有搜索查询，调用搜索函数
  } else {
    fetchUserData(); // 否则，调用正常数据获取函数
  }
};

const gotoFP = () => {
  router.push('/index/uploadFile')
}

// 根据列的特性动态计算宽度
const getColumnWidth = (prop: string) => {
  // 示例：根据属性名称动态设置宽度
  if (prop === "createTime") {
    return 170; // 例如，如果是 createTime 列，设置宽度为 170px
  } else if (prop === "status") {
    return 100;
  } else if (prop === "id") {
    return 60;
  } else if (prop === "department") {
    return 80;
  } else {
    return 110;
  }
};




// 重置搜索条件
const resetSearch = () => {
  searchQuery.value.userName = "";
  searchQuery.value.phoneNumber = "";
  searchQuery.value.status = "";
  searchQuery.value.createTime = "";
  searchQuery.value.department = "";
  // // 你可能还希望重置页码和页面大小
  // queryForm.value.pagenum = 1;
  // queryForm.value.pagesize = 2;
  // fetchUserData();
};

//【下面的都需要改】
const selectedValue = ref("");
const selectedOption = ref("");
const options = ref([
  { label: "正常", value: "正常" },
  { label: "停用", value: "停用" },
]);

const updateInput = () => {
  selectedValue.value = selectedOption.value;
};

const size = ref<"default" | "large" | "small">("default");

const value1 = ref("");
</script>

<style scoped>
.button-row {
  margin-top: 5px; /* 调整 button-row 与上一行之间的垂直间距 */
  height: 32px; /* 设置 button-row 的高度 */
}
</style>
