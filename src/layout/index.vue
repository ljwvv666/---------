<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-container class="app-wrapper" style="width: 100vw">
    <el-header class="header" height="150px">
        <Header />
    </el-header>
    <el-container class="container">
      <el-aside
        width="210px"
        style="height: calc(100vh - 100px)"
        class="sidebar-container"
      >
        <Menu />
        <!-- <RouterView name="aside"></RouterView> -->
      </el-aside>
      <el-main class="main">
        <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="上传文件" name="first"></el-tab-pane>
          <el-tab-pane label="功能点明细" name="second"></el-tab-pane>
          <el-tab-pane label="结果呈现" name="third"></el-tab-pane>
        </el-tabs> -->
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {RouterView,RouterLink} from 'vue-router'

import Menu from "./menu/index.vue";
import Header from "./header/index.vue"
import Main from "@/components/UserManagement.vue"
// const tabPosition = ref<TabsInstance['tabPosition']>('left')
</script>

<style scoped>
/* 使容器和子元素扩展到整个页面 */
html, body, .app-wrapper {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 确保占满整个页面高度 */
}

.header {
  background-color: #409eff;
  color: #fff;
  line-height: 60px;
  text-align: center;
  height: 60px;
}

.container {
  display: flex;
  flex: 1;
  height: 100%; /* 确保占满剩余高度 */
}

.sidebar-container {
  background-color: #545c64;
  color: #fff;
  padding: 20px;
}

.main {
  background-color: #f2f2f2;
  padding: 20px;
  flex: 1;
}



</style>
