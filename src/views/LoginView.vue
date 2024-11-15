<template>
  <div class="login-container" style="width: 100vw">
    <el-card class="login-card">
      <h2>测盟汇管理系统</h2>
      <el-form :model="form" ref="loginForm" :rules="rules">
        <el-form-item prop="userName">
          <el-input class="input" v-model="form.userName">
            <template #prefix>
              <el-icon size="20px"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="input"
            type="password"
            show-password
            v-model="form.password"
            :style="{ color: '#000' }"
          >
            <template #prefix
              ><el-icon size="20px"><Lock /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="loginButton" type="primary" @click="handleLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <el-link @click="goToRegister">没有企业账号？立即注册</el-link>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElForm, ElMessage, ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from '@/stores/userStore'; // 导入 userStore

const userStore = useUserStore(); // 获取 userStore 实例

const router = useRouter();

interface Form {
    userName: string;
    password: string;
}

const form = reactive<Form>({
    userName: "",
    password: "",
});

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: "http://localhost:8088", // 后端 API 基础 URL
    timeout: 10000, // 请求超时时间
});

// 登录函数，发送账号密码数据来获取会话
const login = async (userName: string, password: string) => {
  try {
    const response = await axiosInstance.post("/login", { userName, password });
    if (response.data.success) {
      const user = response.data.user;
      console.log("User data from session:", user);
      
      userStore.setUser(user); // 存储用户信息到 Pinia 中
      
      ElNotification({
        title: "Success",
        message: "登录成功",
        type: "success",
        duration: 1000,
      });
      router.push("/index");
    } else {
      ElMessage.error(response.data.message || "登录失败");
    }
  } catch (error) {
    console.error("登录错误:", error);
    ElMessage.error("登录失败，请检查账号和密码");
  }
};

// 处理登录按钮点击事件
const handleLogin = () => {
    login(form.userName, form.password);
};

// 跳转到注册页面的逻辑
const goToRegister = () => {
    router.push("/register");
    console.log("跳转到注册页面");
};
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 确保内容在视口中间 */
  width: 100vw;
  background-image: url("@/assets/image/stardew2.png"); /* 替换为你的背景图片路径 */
  background-color: rgba(255, 255, 255, 0.3); /* 黑色背景，并设置透明度为 0.5 */
  background-blend-mode: overlay; /* 叠加模式，让背景图和颜色混合 */
  background-size: cover; /* 背景图片铺满整个容器 */
  background-position: center; /* 居中对齐 */
  background-repeat: no-repeat; /* 不重复 */
}

.login-card h2 {
  margin-bottom: 20px; /* 调整 <h2> 元素底部的间距 */
}

.login-card {
  width: 400px; /* 或者适当的宽度 */
  padding: 20px;
  text-align: center; /* 内容居中 */
}

.loginButton {
  width: 100%; /* 让按钮宽度充满父容器 */
}

.input {
  display: flex;
  width: 100%;
  height: 35px;
}

.prefix-icon {
  color: black;
}
</style>
