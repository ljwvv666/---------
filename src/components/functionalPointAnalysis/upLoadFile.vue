<template>

    <el-button type="primary" style="margin-bottom: 20px;width: 90px;" @click="downloadFile">下载模板</el-button>
    <!-- 注意事项 -->
    <el-card style="max-width: 680px; margin-bottom: 20px;">
        <template #header>
        <div class="card-header">
            <span>Excel模板上传的注意事项</span>
        </div>
        </template>
            <span>
                1. 模板中所有标题含“必填”的列都是必须填的，否则会出现解析失败的问题。
            </span>
            <el-divider></el-divider>
            <span>
                2. 模板中的“功能描述”列的各行必填项，否则无法解析
            </span>
            <el-divider></el-divider>
            <span>
                3. 由于您的身份是软件造价评估师，无权修改功能点文件内容，因此只能在此页面进行文件重传
            </span>
    </el-card>

    <el-upload
      ref="uploadRef"
      class="upload-demo"
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
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          Only Excel files (.xls, .xlsx) with a size less than 500kb
        </div>
      </template>
    </el-upload>
    <el-row :gutter="20">
      <el-col :span="18"><div class="grid-content ep-bg-purple" /></el-col>
      <el-col :span="6">
        <div class="grid-content ep-bg-purple" />
        <el-button type="primary" @click="reload">清空上传文件列表</el-button>
        <el-button type="primary" @click="viewFP">开始分析功能点</el-button>
      </el-col>
    </el-row>

</template>
  


<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";
import { RouterLink,useRouter } from "vue-router";
import axios from 'axios';
import { onMounted, ref, reactive } from "vue";

import { useSystemStore } from '@/stores/systemStore';

const router = useRouter();

// 使用 Pinia Store
const systemStore = useSystemStore();

// 引用 el-upload
const uploadRef = ref(null);

const reload = () => {
  if (uploadRef.value) {
    // 清空上传的文件队列
    uploadRef.value.clearFiles();
  }
};

//同时还要add一个gsc表 传一个sysId
const viewFP = async () => {
  try {
    const response = await axios.get('http://localhost:9000/func/list'); 
    systemStore.setSystemID(response.data.info[0].systemID);
  } catch (error) {
    console.error('获取 System ID 失败:', error);
  }
  try {
    await axios.post('https://92eb484a-22bf-43a3-b3a5-4b112fa53107.mock.pstmn.io/gsc/add',{
      systemID: systemStore.systemID
    }); 
  } catch (error) {
    console.error('添加gsc失败:', error);
  }
  router.push("/index/viewFP");
}


// 上传成功回调
const handleUploadSuccess = (response: any, file: any) => {
  console.log("Upload Success:", response, file);
  ElMessage.success("文件上传成功");
};

// 上传失败回调
const handleUploadError = (error: any, file: any) => {
  console.error("Upload Error:", error, file);
  ElMessage.error("文件上传失败");
};

// 上传前验证文件
const beforeUpload = (file: File) => {
  const isExcel = file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const isLt500kb = file.size / 1024 < 500;

  if (!isExcel) {
    ElMessage.error("只能上传 Excel 文件 (.xls, .xlsx)");
    return false;
  }
  if (!isLt500kb) {
    ElMessage.error("文件大小不能超过 500kb");
    return false;
  }
  return true;
};

// 文件超出限制时的回调
const handleExceed = () => {
  ElMessage.warning("只能上传一个文件，请删除原有文件后再试！");
};

// 下载模板文件
const downloadFile = () => {
  const fileUrl = '/evaluation.xlsx';
  const fileName = 'templateFile.xlsx';

  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

</script>
  
