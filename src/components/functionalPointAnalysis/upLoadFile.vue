<template>
  <div class="app-container">
    <!-- 下载模板按钮 -->
    <el-button
      type="primary"
      class="download-button"
      @click="downloadFile"
      style="width: 98px;"
    ><el-icon style="margin-right: 4px;"><Download /></el-icon> 
      下载模板
    </el-button>

    <!-- 注意事项卡片 -->
    <el-card class="notice-card">
      <template #header>
        <div class="card-header">
          <span>Excel模板上传的注意事项</span>
        </div>
      </template>
      <div class="notice-content">
        <p>1. 模板中所有标题含“必填”的列都是必须填的，否则会出现解析失败的问题。</p>
        <el-divider></el-divider>
        <p>2. 模板中的“功能描述”列的各行必填项，否则无法解析。</p>
        <el-divider></el-divider>
        <p>3. 由于您的身份是软件造价评估师，无权修改功能点文件内容，因此只能在此页面进行文件重传。</p>
      </div>
    </el-card>

    <!-- 文件上传 -->
    <el-upload
      ref="uploadRef"
      class="upload-area"
      drag
      action="http://localhost:9000/func/trans"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :before-upload="beforeUpload"
      :limit="1"
      :on-exceed="handleExceed"
      accept=".xls,.xlsx"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        <strong>拖拽文件到此处</strong>或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          仅支持 Excel 文件 (.xls, .xlsx)，文件大小不能超过 500kb
        </div>
      </template>
    </el-upload>

    <!-- 操作按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="reload">清空上传文件列表</el-button>
      <el-button type="success" @click="viewFP">开始分析功能点</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import { useSystemStore } from '@/stores/systemStore';

const router = useRouter();
const systemStore = useSystemStore();
const uploadRef = ref(null);

const reload = () => {
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
};

const viewFP = async () => {
  try {
    const response = await axios.get('http://localhost:9000/func/list');
    systemStore.setSystemID(response.data.info[0].systemID);
  } catch (error) {
    console.error('获取 System ID 失败:', error);
  }
  try {
    await axios.post('https://92eb484a-22bf-43a3-b3a5-4b112fa53107.mock.pstmn.io/gsc/add', {
      systemID: systemStore.systemID,
    });
  } catch (error) {
    console.error('添加gsc失败:', error);
  }
  router.push('/index/viewFP');
};

const handleUploadSuccess = (response: any, file: any) => {
  console.log('Upload Success:', response, file);
};

const handleUploadError = (error: any, file: any) => {
  console.error('Upload Error:', error, file);
};

const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const isLt500kb = file.size / 1024 < 500;

  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件 (.xls, .xlsx)');
    return false;
  }
  if (!isLt500kb) {
    ElMessage.error('文件大小不能超过 500kb');
    return false;
  }
  return true;
};

const handleExceed = () => {
  ElMessage.warning('只能上传一个文件，请删除原有文件后再试！');
};

const downloadFile = () => {
  const fileUrl = '/evaluation.xlsx';
  const fileName = 'templateFile.xlsx';

  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
/* 容器 */
.app-container {
  width: 100%;
  padding: 20px;
  background-color: #f9f9f9;
}

/* 下载按钮 */
.download-button {
  margin-bottom: 20px;
  width: 120px;
}

/* 注意事项卡片 */
.notice-card {
  width: 100%;
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.notice-content p {
  margin: 10px 0;
  font-size: 14px;
  color: #555;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  background-color: #fff;
  margin-bottom: 20px;
  width: 100%;
  transition: border-color 0.3s ease;
}

.upload-area:hover {
  border-color: #409eff;
}

.el-upload__text {
  font-size: 16px;
  color: #666;
}

.el-upload__tip {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

/* 按钮组 */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  width: 120px;
}
</style>
