<!-- eslint-disable vue/multi-word-component-names -->
<template>
    欢迎您，{{ userStore.user.role }}{{ userStore.user.userName }}
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :size="50" :src="circleUrl" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="personalInfo"><el-icon><Avatar /></el-icon>个人中心</el-dropdown-item>
          <el-dropdown-item @click="editPassword">
            <el-icon><Lock /></el-icon>修改密码
          </el-dropdown-item>
          <el-dropdown-item @click="logout"><el-icon><SwitchButton /></el-icon>退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import EditPassword from "@/components/editPassword.vue";
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore'; // 导入 userStore

const userStore = useUserStore(); // 获取 userStore 实例
const router = useRouter();
// const store = useStore();


const circleUrl = ref(
  "https://th.bing.com/th/id/OIP.7L4aiaUvQXx4JyRnkwEIbQHaHY?w=180&h=180&c=7&r=0&o=5&dpr=1.8&pid=1.7"
);

function logout(){
    router.push('/')
}

function personalInfo(){
  router.push('/index/editindividual')
}
function editPassword(){
  router.push('/index/editpassword')
}
</script>

<style>

</style>
