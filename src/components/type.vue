<template>
    <div class="typed-container">
      <div ref="typedElement" class="typed-content"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref } from "vue";
  import Typed from "typed.js";
  
  const typedElement = ref<HTMLElement | null>(null);
  let typedInstance: Typed | null = null;
  
  onMounted(() => {
    if (typedElement.value) {
      typedInstance = new Typed(typedElement.value, {
        strings: [
          "Welcome to the ",
          "Software Cost Assessment System"
        ],
        typeSpeed: 60, // 打字速度
        backSpeed: 25, // 删除速度
        backDelay: 1000, // 删除前的延迟
        startDelay: 500, // 开始打字前的延迟
        loop: true, // 是否循环
      });
    }
  });
  
  onBeforeUnmount(() => {
    if (typedInstance) {
      typedInstance.destroy();
    }
  });
  </script>
  
  <style scoped>
  .typed-container {
    display: flex; /* 使用 flex 布局 */
    justify-content: flex-start; /* 左对齐 */
    align-items: center; /* 垂直居中 */
    font-family: Arial, Helvetica, sans-serif; /* 字体 */
    font-size: 65px; /* 字号 */
    font-weight: bold; /* 字体加粗 */
    color: #333; /* 字体颜色 */
    line-height: 5; /* 行高 */
    z-index: 100;
  }
  
  .typed-content {
    display: inline-block; /* 保证每一行内容都在一行内显示 */
    white-space: nowrap; /* 防止文本换行 */
  }
  
  </style>
  