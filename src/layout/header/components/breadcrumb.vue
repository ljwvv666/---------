<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="index"
      @click="navigateTo(breadcrumb.path)"
      :class="{ 'is-active': index === breadcrumbs.length - 1 }"
    >
      {{ breadcrumb.text }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
  const pathArray = route.path.split("/").filter(Boolean);
  return pathArray.map((path, index) => {
    const fullPath = "/" + pathArray.slice(0, index + 1).join("/");
    // 在这里根据自定义中文名称来设置显示的文字
    let text = "";
    switch (path) {
      case "index":
        text = "首页";
        break;
      case "user":
        text = "用户管理";
        break;
      case "viewFP":
        text = "功能点明细";
        break;
      case "editindividual":
        text = "个人中心";
        break;
      case "editpassword":
        text = "修改密码";
        break;
      case "uploadFile":
        text = "上传文件";
        break;
      case "datascreen":
        text = "结果呈现";
        break;
      case "price":
        text = "造价综合评估";
        break;
      case "project":
        text = "项目管理";
        break;
      // 添加其他路由的自定义中文名称
      default:
        text = path;
        break;
    }
    return {
      text: text,
      path: fullPath,
    };
  });
});

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.el-breadcrumb-item {
  cursor: pointer;
  font-weight: bold; /* 设置字体加粗 */
  color: white; /* 设置初始颜色为白色 */
}

.el-breadcrumb-item.is-active {
  color: blue; /* 点击后变蓝效果 */
}
</style>
