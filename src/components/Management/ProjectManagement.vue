<template>
  <!-- 搜索区域 -->
  <div class="search-container">
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-form-item label="项目名称">
          <el-input
            v-model="searchQuery.userName"
            style="width: 90%;"
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
      <el-col :span="7">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchQuery.createTime"
            type="datetime"
            placeholder="选择创建时间"
            format="YYYY/MM/DD hh:mm:ss"
            value-format="x"
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
      <!-- 搜索和重置按钮 -->
      <el-col :span="1">
        <el-button type="primary" @click="searchUser">
          <el-icon><Search /></el-icon>搜索
        </el-button>
      </el-col>
      <el-col :span="1">
        <el-button
          @click="resetSearch"
          icon="Refresh"
          type="default"
          style="margin-left: 30px;"
        >
          重置
        </el-button>
      </el-col>
    </el-row>
  </div>

  <!-- 表格区域 -->
  <el-table
    :data="filteredData"
    style="width: 1260px; margin-left: 20px; background-color: white;"
    border
  >
    <el-table-column prop="id" label="编号" width="80" align="center" />
    <el-table-column prop="name" label="项目名称" width="250" />
    <el-table-column prop="createdAt" label="创建时间" width="200" align="center" />
    <el-table-column prop="status" label="状态" width="150" align="center">
      <template #default="scope">
        <el-tag
          :type="scope.row.status === '正常' ? 'success' : 'danger'"
          effect="light"
        >
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="leader" label="负责人" width="150" align="center" />
    <el-table-column prop="progress" label="进度" width="250" align="center">
      <template #default="scope">
        <el-progress :percentage="scope.row.progress.replace('%', '')" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="gotoFP">开始评估</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页区域 -->
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="queryForm.pagenum"
      v-model:page-size="queryForm.pagesize"
      :page-sizes="[10]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-right: 550px; margin-top: 130px;"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// 搜索条件
const searchQuery = ref({
  userName: "",
  status: "",
  createTime: "",
});

// 表单状态
const queryForm = ref({
  pagenum: 1,
  pagesize: 10,
});

// 原始数据
const originalTableData = ref([
  { id: 1, name: "AI 智能分析系统", createdAt: "2024-01-15", status: "正常", leader: "张三", progress: "80%" },
  { id: 2, name: "数据可视化平台", createdAt: "2024-03-10", status: "延期", leader: "李四", progress: "50%" },
  { id: 3, name: "自动化测试工具", createdAt: "2024-05-20", status: "正常", leader: "王五", progress: "95%" },
  { id: 4, name: "云存储优化", createdAt: "2023-12-01", status: "正常", leader: "赵六", progress: "100%" },
  { id: 5, name: "智能客服系统", createdAt: "2023-11-18", status: "延期", leader: "陈七", progress: "40%" },
  { id: 6, name: "边缘计算平台", createdAt: "2024-01-05", status: "正常", leader: "刘八", progress: "75%" },
  { id: 7, name: "无人驾驶仿真", createdAt: "2023-10-20", status: "延期", leader: "周九", progress: "60%" },
  { id: 8, name: "区块链智能合约", createdAt: "2024-02-14", status: "正常", leader: "吴十", progress: "90%" },
  { id: 9, name: "图像识别优化", createdAt: "2023-09-12", status: "正常", leader: "郑十一", progress: "85%" },
  { id: 10, name: "机器学习算法改进", createdAt: "2024-04-22", status: "正常", leader: "王十二", progress: "70%" },
]);

// 搜索后的数据
const filteredData = ref([...originalTableData.value]);

// 状态选项
const options = [
  { label: "正常", value: "正常" },
  { label: "延期", value: "延期" },
];

const total = ref(filteredData.value.length);

// 搜索功能
const searchUser = () => {
  filteredData.value = originalTableData.value.filter((item) => {
    const matchesName =
      !searchQuery.value.userName ||
      item.name.toLowerCase().includes(searchQuery.value.userName.toLowerCase());
    const matchesStatus =
      !searchQuery.value.status || item.status === searchQuery.value.status;
    return matchesName && matchesStatus;
  });
  total.value = filteredData.value.length; // 更新总数
};

// 重置功能
const resetSearch = () => {
  searchQuery.value.userName = "";
  searchQuery.value.status = "";
  searchQuery.value.createTime = "";
  filteredData.value = [...originalTableData.value]; // 恢复原始数据
  total.value = filteredData.value.length; // 更新总数
};

// 跳转功能
const gotoFP = () => {
  router.push("/index/uploadFile");
};
</script>

<style scoped>
/* 搜索区域样式 */
.search-container {
  margin-top: 20px;
  margin-left: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
 margin-right: 30px;
}

/* 表格样式 */
.el-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
}

.el-table tr:hover {
  background-color: #f0f9ff;
}
.el-table th {
  font-weight: bold; /* 加粗 */
  font-family: 'PingFang SC'; /* 可选：更改字, 'Roboto', 'Arial', sans-serif体 */
  color: #333; /* 可选：更改表头文字颜色 */
  background-color: #f8f8f8; /* 可选：给表头添加背景色 */
  text-align: center; /* 可选：文字居中 */
}
/* 分页区域 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 搜索按钮和重置按钮 */
.el-button {
  border-radius: 4px;
}

.el-button:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 状态标签 */
.el-tag {
  border-radius: 4px;
}

/* 表格进度条 */
.el-progress {
  margin: 0 auto;
}
</style>
