<template>
  <div class="box">
    <!-- Vanta 动画背景 -->
    <div ref="vantaRef" style="width: 100%; height: 100vh"></div>
    <!-- 登录卡片 -->
    <div class="login-container">
      <el-card class="login-card" style="opacity: 1;">
        <h2 style="text-align: center; margin-bottom: 20px;font-size: 24px;">软件造价评估系统</h2>
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
              <template #prefix>
                <el-icon size="20px"><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="loginButton" type="primary" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <el-link @click="goToRegister">没有账号？立即注册</el-link>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import GLOBE from "vanta/src/vanta.globe";
import HALO from "vanta/src/vanta.halo";
import CLOUDS from "vanta/src/vanta.clouds";
import RINGS from "vanta/src/vanta.rings";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";

export default {
  data() {
    return {
      vantaEffect: null,
      form: reactive({
        userName: "",
        password: "",
      }),
    };
  },
  mounted() {
    // 初始化 Vanta 背景
    this.vantaEffect = RINGS({
      el: this.$refs.vantaRef,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0xffffff,
      backgroundAlpha: 1.0
    });
  },
  beforeDestroy() {
    // 销毁 Vanta 背景
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  },
  methods: {
    handleLogin() {
      ElMessage.success("登录成功");
      this.$router.push("/index");
    },
    goToRegister() {
      this.$router.push("/register");
      console.log("跳转到注册页面");
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  position: relative;
  height: 100vh;
  width: 100vw;
}

.login-container {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  width: 400px;
  z-index: 1;
  padding-top: 100px; /* 向下移动卡片 */
}

.login-card {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 5px 8px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: box-shadow 0.3s ease; /* 增加动态效果 */

}

.login-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); /* 鼠标悬浮时加深阴影 */
}

.input {
  width: 100%;
}

.loginButton {
  width: 100%;
}

.el-button {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
