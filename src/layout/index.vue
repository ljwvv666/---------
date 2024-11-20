<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-container class="app-wrapper" style="width: 100vw">
    <el-header class="header" height="150px">
        <Header />
    </el-header>
    <el-container class="container">
      <el-aside
        width="210px"
        style="height: calc(100vh)"
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
  overflow: hidden; /* 禁止页面整体滚动 */
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
  position: fixed; /* 固定 Header */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保在顶部显示 */
}

.container {
  margin-top: 60px; /* 为 Header 腾出空间 */
  height: calc(100vh - 60px); /* 剩余高度 */
  display: flex;
}

.sidebar-container {
  background-color: #545c64;
  color: #fff;
  position: fixed; /* 固定 Sidebar */
  top: 60px; /* 从 Header 下方开始 */
  height: calc(100vh - 60px); /* 修复不正确的高度计算 */
  width: 210px;
  display: flex;
  flex-direction: column; /* 确保菜单内容占满 */
}

.main {
  margin-left: 210px; /* 为固定的 Sidebar 腾出空间 */
  background-color: #f2f2f2;
  padding: 20px;
  height: calc(100vh - 60px); /* 确保占满剩余高度 */
  box-sizing: border-box; /* 确保 padding 不影响布局 */
  display: flex;
  flex-direction: column;
}

.main:empty {
  overflow: hidden; /* 当内容为空时禁用滚动 */
}

</style>
