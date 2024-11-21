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
      </el-aside>
      <el-main class="main">
        <!-- 标签页位置 -->
        <div class="tags-view-wrapper">
          <el-scrollbar class="scroll-container">
            <div class="tags-view">
              <span
                v-for="tag in tags"
                :key="tag.path"
                :class="['tags-view-item', { active: tag.path === $route.path }]"
                @click="handleTagClick(tag)"
              >
                {{ tag.name }}
                <el-icon class="close-icon" @click.stop="removeTag(tag)">
                  <close />
                </el-icon>
              </span>
            </div>
          </el-scrollbar>
        </div>
        <RouterView/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {RouterView,RouterLink} from 'vue-router'
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Close } from "@element-plus/icons-vue";
import Menu from "./menu/index.vue";
import Header from "./header/index.vue"
import Main from "@/components/UserManagement.vue"
// const tabPosition = ref<TabsInstance['tabPosition']>('left')
  const tags = ref<{ name: string; path: string }[]>([]); // 标签数据
  const router = useRouter();
  const route = useRoute();
// 动态添加标签
const addTag = (name: string, path: string) => {
  const exists = tags.value.find((tag) => tag.path === path);
  if (!exists) {
    tags.value.push({ name, path });
  }
};

// 点击标签切换路由
const handleTagClick = (tag: { name: string; path: string }) => {
  router.push(tag.path);
};

// 删除标签
const removeTag = (tag: { name: string; path: string }) => {
  const index = tags.value.findIndex((t) => t.path === tag.path);
  if (index !== -1) {
    tags.value.splice(index, 1);
    if (route.path === tag.path) {
      // 如果移除的是当前页面标签，则切换到上一个标签或首页
      const nextTag = tags.value[index - 1] || tags.value[0];
      router.push(nextTag?.path || "/");
    }
  }
};

// 监听路由变化
onMounted(() => {
  router.beforeEach((to, from, next) => {
    addTag(to.meta.title || to.name || to.path, to.path); // 使用 `meta.title` 或 `name`
    next();
  });
});
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
  padding: 8px;
  height: calc(100vh - 60px); /* 确保占满剩余高度 */
  box-sizing: border-box; /* 确保 padding 不影响布局 */
  display: flex;
  flex-direction: column;
}

.main:empty {
  overflow: hidden; /* 当内容为空时禁用滚动 */
}

.tags-view-wrapper {
  display: flex;
  align-items: center;
  padding: 1px;
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.scroll-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.tags-view {
  display: inline-flex;
  align-items: center;
  margin-bottom: 3px;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  padding: 3px 6px;
  margin: 0 4px;
  font-size: 14px;
  color: #333;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tags-view-item.active {
  color: #fff;
  background: rgb(64, 158, 255);
  border-color: rgb(64, 158, 255);
}

.close-icon {
  font-size: 12px;
  color: #666;
  cursor: pointer;
  margin-left: 8px;
}

.close-icon:hover {
  color: #ff4d4f;
}
</style>
