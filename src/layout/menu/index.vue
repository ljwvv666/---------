<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="2"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1" @click="project">
      <template #title>
        <el-icon><location /></el-icon>
        <span>项目管理</span>
      </template>
    </el-sub-menu>
    <el-sub-menu index="2" >
      <template #title >
        <el-icon><location /></el-icon>
        <span>功能点分析</span>
      </template>
      <el-menu-item index="2-1" @click="uploadFile">
        <el-icon><User /></el-icon>上传文件
      </el-menu-item>
      <el-menu-item index="2-2" @click="viewFP">
        <el-icon><House /></el-icon>功能点明细
      </el-menu-item>
      <el-menu-item index="2-3" @click="dataScreen">
        <el-icon><House /></el-icon>结果呈现
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="3" @click="price">
      <template #title>
        <el-icon><location /></el-icon>
        <span>造价综合评估</span>
      </template>

    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <el-icon><location /></el-icon>
        <span>个人信息管理</span>
      </template>
      <el-menu-item index="4-1" >
        <el-icon><User /></el-icon>基本资料
      </el-menu-item>
      <el-menu-item index="4-2" >
        <el-icon><House /></el-icon>密码修改
      </el-menu-item>
    </el-sub-menu>

  </el-menu>
</template>

<script setup>
import { RouterLink,useRouter } from "vue-router";
import { useUserStore } from '@/stores/userStore'; // 导入 userStore

const userStore = useUserStore(); // 获取 userStore 实例
const router = useRouter()

const uploadFile = ()=> {
  router.push('/index/uploadFile')
}

const viewFP = ()=> {
  router.push('/index/viewFP')
}

const dataScreen = ()=> {
  router.push('/index/datascreen')
}

const data = () =>  {
  router.push('/index/data')
}

const price = () => {
  router.push('/index/price');
};

const project = () => {
  router.push('/index/project');
}

</script>

<style></style>
