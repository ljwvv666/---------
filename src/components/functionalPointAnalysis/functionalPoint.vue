<template>
  <div id="department-manage">
    <!-- 上面两个按钮（新增和折叠/展开） -->
    <el-row style="padding-bottom: 15px" gutter="20">
      <el-col span="3" offset="3">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click.prevent="openDialogAdd(1)"
          >新增</el-button
        >
      </el-col>
      <el-col span="3" offset="6">
        <el-button type="info" plain @click.prevent="foldOropen()"
          ><el-icon><Switch /></el-icon>折叠/展开</el-button
        >
      </el-col>
    </el-row>

    <el-dialog title="添加功能点"
      v-model="dialogFormVisible"
      width="40%"
      v-if="dialogFormVisible"
    >
      <el-form
        :label-position="Right"
        :model="department"
        :rules="departmentRules"
        ref="newdtmFrom"
        label-width="20%"
        status-icon
      >
        <el-form-item label="上级" prop="pid">
          <el-select
            v-model="department.pid"
            clearable
            placeholder="选择上级功能点/模块/子系统"
          >
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.FPN"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能点名称" prop="FPN">
          <el-input v-model="department.FPN" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能点描述" prop="FPD">
          <el-input v-model="department.FPD" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能点类型" prop="type">
          <el-select
              v-model="department.type"
              placeholder="请选择功能类型"
              style="width: 50%"
            >
              <el-option
                v-for="item in functionTypeOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="复杂度" prop="complexity">
          <el-select
              v-model="department.complexity"
              placeholder="请选择复杂度"
              style="width: 50%"
            >
              <el-option
                v-for="item in complexityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDtm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对所有信息的展示 -->
    <div id="allInfo" v-show="isShow == 1">
      <el-table
        :data="tableData1"
        row-key="id"
        border
        :default-expand-all="isOpen"
        ref="allInfoRef"
      >
        <el-table-column prop="id" width="80" label="序号"></el-table-column>
        <el-table-column prop="subSystem" label="子系统" width="150"></el-table-column>
        <el-table-column prop="module" label="模块" width="150"></el-table-column>
        <el-table-column prop="FPN" label="功能点名称" width="150"></el-table-column>
        <el-table-column prop="FPD" label="功能点描述" width="200"></el-table-column>

        <el-table-column prop="type" label="功能类型" width="100">
          <template #default="scope">
            <el-select
              v-model="scope.row.type"
              placeholder="请选择功能类型"
              style="width: 100%"
              @change="updateFunctionType(scope.row)"
            >
              <el-option
                v-for="item in functionTypeOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="complexity" label="复杂度" width="100">
          <template #default="scope">
            <el-select
              v-model="scope.row.complexity"
              placeholder="请选择复杂度"
              style="width: 100%"
              @change="updateComplexity(scope.row)"
            >
              <el-option
                v-for="item in complexityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="UFP" label="UFP" width="100"></el-table-column>

        <el-table-column label="操作">
          <template #default="{ row }">
            <el-link
              icon="Plus"
              v-if="row.id !== 1"
              type="primary"
              @click.prevent="openDialogAdd(row.id)"
              >新增</el-link
            >
            <el-link
              v-if="row.id !== 1"
              icon="Delete"
              type="primary"
              @click.prevent="deleteDtm(row.id)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-show="isShow == 0">
      <el-empty description="无符合要求的部门信息" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { List, Menu, Platform, Right, Setting } from "@element-plus/icons-vue";
import type { FormInstance, FormRules, StepInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { useUserStore } from '@/stores/userStore'; // 导入 userStore
import { useUfpStore } from "@/stores/ufpClass";

const ufpStore = useUfpStore();

const userStore = useUserStore(); // 获取 userStore 实例


// 复杂度候选项
const complexityOptions = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
];
// 功能类型候选项
const functionTypeOptions = ['EI', 'EO', 'EQ', 'ILF', 'EIF'];

// 更新复杂度
const updateComplexity = async (row) => {
  try {
    const response = await axios.post('https://your-backend-api/update-complexity', {
      id: row.id,
      dtmComp: row.dtmComp, // 新的复杂度值
    });
    console.log('更新成功:', response.data);
  } catch (error) {
    console.error('更新失败:', error);
  }
};

// 更新功能类型的方法
const updateFunctionType = async (row) => {
  try {
    await axios.post('https://your-backend-api/update-function-type', {
      id: row.id,
      dtmFT: row.dtmFT,
    });
    console.log('功能类型更新成功');
  } catch (error) {
    console.error('功能类型更新失败:', error);
  }
};

//表单验证规则
const departmentRules = reactive({
  pid: [
    {
      required: true,
      message: "上级功能点不能为空",
      trigger: "blur",
    },
  ],
  subSystem: [
    {
      required: true,
      message: "子系统不能为空",
      trigger: "blur",
    },
  ],
  module: [
    {
      required: true,
      message: "模块不能为空",
      trigger: "blur",
    },
  ],
  FPN: [
    {
      required: true,
      message: "功能点名称不能为空",
      trigger: "blur",
    },
  ],
  FPD: [
    {
      required: true,
      message: "功能点描述不能为空",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "类型不能为空",
      trigger: "blur",
    },
  ],
  complexity: [
    {
      required: true,
      message: "复杂度不能为空",
      trigger: "blur",
    },
  ],
});

const dialogFormVisible = ref(false);
const dialogFormVisible1 = ref(false);
const dialogFormVisible2 = ref(false);

interface Department {
  pid: string;
  id: string;
  subSystem: string;
  module: string; // 可以根据实际情况定义更精确的类型
  FPN: string;
  FPD: string;
  type: string;
  complexity: string;
  UFP: string;
}

const department = reactive<Department>({
  pid: "",
  id: "",
  subSystem: "",
  module: "",
  FPN: "",
  FPD: "",
  type: "",
  complexity: "",
  UFP: ""
});

const isShow = ref(1);

let tableData1 = ref([]);
let departments = ref([]);
let firm = ref();

async function showList() {
  try {
    console.log(userStore.user.department1)
    const response = await axios.get("/api/index/tree");
    departments.value = response.data.klist;
    tableData1.value = response.data.tlist;
    firm.value = response.data.department;
    console.info("Str", tableData1.value);
  } catch (error) {
    console.error("Error:", Error);
  }
}

let tableData2 = ref([]);
let list = ref([]);



function openDialogAdd(id) {
  dialogFormVisible.value = true;
}

const newdtmFrom = ref(null);

function addDtm() {
  // 验证表单
  newdtmFrom.value.validate((valid: any) => {
    if (valid) {
      let fd = new FormData();

      // 将新的字段添加到 FormData 中
      fd.append("pid", department.pid); // 上级功能点/模块/子系统
      fd.append("FPN", department.FPN); // 功能点名称
      fd.append("FPD", department.FPD); // 功能点描述
      fd.append("type", department.type); // 功能点类型
      fd.append("complexity", department.complexity); // 复杂度

      // 发送 POST 请求
      axios.post("/api/index/add", fd).then((res) => {
        if (res.data.isOk) {
          ElMessage({
            message: res.data.msg,
            type: "success",
          });
          dialogFormVisible.value = false; // 关闭对话框
        } else {
          ElMessage.error("新增失败，功能点名称已存在");
          department.FPN = ""; // 清空功能点名称字段
        }
        showList(); // 更新表格或列表数据
      });
    } else {
      ElMessage.error("请按要求输入");
    }
  });
}



const editdtmForm = ref(null);

function deleteDtm(id: number) {
  if (!confirm("是否删除")) {
    return;
  }
  axios
    .get("/api/index/delete", {
      params: {
        id,
      },
    })
    .then((res) => {
      ElMessage({
        message: res.data.msg,
        type: "success",
      });
      showList();
    });
}

const isOpen = ref(true);
const allInfoRef = ref(null);

function foldOropen() {
  isOpen.value = !isOpen.value;
  console.info("isOpen", isOpen.value);
  console.info("REF", allInfoRef.value);
  if (allInfoRef.value) {
    console.info("W", "YES");
  }
}

onMounted(() => {
  showList();
});
</script>

<style></style>
