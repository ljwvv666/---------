<template>
  <div class="login-container" style="width: 100vw">
    <el-card class="login-card">
      <el-icon class="return" size="20px" @click="goBack">
        <ArrowLeftBold />
      </el-icon>
      <h2>注册新租户</h2>
      <el-form :model="form" :rules="rules">
        <el-form-item label="租户名称" label-width="100px" prop="companyName">
          <el-input
            v-model="form.companyName"
            autocomplete="off"
            placeholder="请输入公司名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" label-width="100px" prop="contactPerson">
          <el-input
            v-model="form.contactPerson"
            autocomplete="off"
            placeholder="请输入联系人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话号码" label-width="100px" prop="phoneNumber">
          <el-input
            v-model="form.phoneNumber"
            autocomplete="off"
            placeholder="请输入电话号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员" label-width="100px" prop="administrator">
          <el-input
            v-model="form.administrator"
            autocomplete="off"
            placeholder="请输入管理员姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司标识" label-width="100px" prop="companyId">
          <el-input
            v-model="form.companyId"
            autocomplete="off"
            placeholder="请输入公司标识"
          ></el-input>
        </el-form-item>
        <el-form-item label="租户图标" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8088/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="file"
          >
            <img
              v-if="imageUrl"
              :src="`http://localhost:8088${imageUrl}`"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="验证码" label-width="100px" prop="captcha">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-input
                v-model="form.captcha"
                autocomplete="off"
                placeholder="请输入验证码"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <img
                :src="captchaUrl"
                alt="captcha"
                @click="refreshCaptcha"
                style="cursor: pointer;"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-dialog v-model="uploadSuccessVisible" title="上传成功">
          <img
            v-if="imageUrl"
            :src="`http://localhost:8088${imageUrl}`"
            style="max-width: 100%"
          />
        </el-dialog>
        <br />
        <el-form-item>
          <el-button class="loginButton" type="primary" @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ElInput,
  ElButton,
  ElCard,
  ElForm,
  ElFormItem,
  ElMessage,
  ElIcon,
  ElRow,
  ElCol,
  ElDialog
} from "element-plus";
import { ArrowLeftBold, Plus } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const imageUrl = ref("");
const uploadSuccessVisible = ref(false);

const form = ref({
  contactPerson: "",
  phoneNumber: "",
  companyName: "",
  administrator: "",
  companyId: "",
  avatar: "",
  captcha: ""
});

const rules = ref({
  contactPerson: [
    { required: true, message: "请输入联系人姓名", trigger: "blur" },
  ],
  phoneNumber: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
  companyName: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
  administrator: [
    { required: true, message: "请输入管理员姓名", trigger: "blur" },
  ],
  companyId: [
    {
      required: true,
      message: "请输入公司标识,该标识将作为管理员初始密码",
      trigger: "blur",
    },
  ],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

const captchaUrl = ref("http://localhost:8088/captcha/generate");

const handleAvatarSuccess = (response: { url: string }, uploadFile: any) => {
  form.value.avatar = response.url;
  imageUrl.value = response.url;
  uploadSuccessVisible.value = true;
};

const beforeAvatarUpload = (rawFile: { type: string; size: number }) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("租户图标必须为 JPG 格式！");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 7) {
    ElMessage.error("租户图标大小不能超过 7MB！");
    return false;
  }
  return true;
};

const handleRegister = async () => {
  const form2 = ref({
    userName: form.value.administrator,
    companyId: form.value.companyId,
    password: form.value.companyId,
    role: "企业管理员"
  });
  console.log("请看看我！", "1", form.value, "2", form2.value);
  try {
    await axios.post("http://localhost:8088/companies", form.value);
    await axios.post("http://localhost:8088/users", form2.value);

    ElMessage.success("租户信息已成功保存");

    router.push("/");
  } catch (error) {
    ElMessage.error("保存失败，请重试");
  }
};

const goBack = () => {
  router.push("/");
};

const refreshCaptcha = () => {
  captchaUrl.value = `http://localhost:8088/captcha/generate?${Date.now()}`;
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("@/assets/image/stardew2.png");
  background-color: rgba(255, 255, 255, 0.3);
  background-blend-mode: overlay;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.return {
  cursor: pointer;
  display: flex;
}

.return:hover {
  cursor: pointer;
}

.login-card h2 {
  margin-bottom: 20px;
}

.login-card {
  width: 500px;
  padding: 20px;
  text-align: center;
}

.loginButton {
  width: 100%;
}

.avatar-uploader {
  display: inline-block;
  width: 148px;
  height: 148px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
</style>
