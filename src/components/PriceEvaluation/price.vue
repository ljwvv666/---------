<template>
          <!-- 粒子背景组件 -->
   <vue-particles id="tsparticles" @particles-loaded="particlesLoaded" url="http://foo.bar/particles.json" />

    <vue-particles
    id="tsparticles"
    @particles-loaded="particlesLoaded"
    :options="{
      background: {
        color: {
          value: '#f2f2f2',
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40,
          },
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#D3D3D3',
        },
        links: {
          color: '#D3D3D3',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: 'bounce',
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 60,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }"
/>
  <div class="bg-white min-h-screen w-screen relative">
    <!-- 搜索区域 -->
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        /* margin-bottom: 1.5rem; */
        margin-top: 20px;
      "
    >
      <el-input
        v-model="searchTerm"
        placeholder="请输入项目 ID 搜索"
        style="width: 50%; max-width: 500px; transition: all 0.3s ease"
        size="large"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #append>
          <div style="display: flex; align-items: center; gap: 0.5rem">
            <el-button
              v-if="!isSearching"
              type="primary"
              @click="handleSearch"
              style="
                padding: 0.5rem 1.25rem;
                border-radius: 0.375rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.25rem;
              "
            >
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button
              @click="resetSearch"
              v-if="isSearching"
              style="
                padding: 0.5rem 1.25rem;
                border-radius: 0.375rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.25rem;
              "
            >
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </div>
        </template>
      </el-input>
    </div>

    <!-- 主要内容区域 -->
    <el-main
      class="w-full px-[20%] py-8 pt-20 relative z-10"
      :loading="loading"
      element-loading-text="加载中..."
    >
      <!-- 项目列表 -->
      <el-row
        v-if="!loading"
        :gutter="20"
        class="grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px-[20%] py-[1%]"
      >
        <el-col
          v-for="project in projects"
          :key="project.projid"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <el-card
            class="shadow-md hover:shadow-lg transition-shadow"
            :body-style="{ padding: '20px' }"
            style="margin-top: 25px; margin-bottom: 30px"
          >
            <!-- 项目头部 -->
            <div class="flex justify-between items-center mb-4">
              <!-- 左侧部分 -->
              <div class="flex items-center space-x-3">
                <h3 class="text-xl font-semibold text-gray-800">
                  {{ project.projName }}
                </h3>

                <!-- 项目 ID 与状态和按钮保持一行 -->
                <div
                  class="flex items-center space-x-2"
                  style="display: flex; align-items: center; gap: 10px"
                >
                  <p class="text-gray-500 text-sm" style="margin: 0">
                    项目 ID: {{ project.projid }}
                  </p>

                  <!-- 条件渲染状态标签 -->
                  <el-tag
                    v-if="project.ae !== 0 || project.esdc !== 0"
                    type="success"
                    size="small"
                    style="flex-shrink: 0; margin-left: 100px"
                  >
                    进行中
                  </el-tag>
                  <el-tag
                    v-else
                    type="info"
                    size="small"
                    style="flex-shrink: 0; margin-left: 100px"
                  >
                    未开始
                  </el-tag>

                  <!-- 下载项目说明按钮 -->
                  <el-button
                    type="text"
                    icon="Download"
                    @click="downloadProject(project.url)"
                    size="small"
                    style="flex-shrink: 0"
                  >
                    下载说明
                  </el-button>
                </div>
              </div>
            </div>

            <el-row :gutter="10" class="mb-4">
              <el-col :span="12">
                <el-card
                  class="bg-gray-100"
                  style="margin-bottom: 15px; margin-top: 10px"
                >
                  <p class="text-gray-500 text-sm mb-1">预估工作量</p>
                  <p class="text-xl font-semibold text-gray-800">
                    {{ project.ae === 0 ? "--" : project.ae + " 人时" }}
                  </p>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card
                  class="bg-gray-100"
                  style="margin-bottom: 15px; margin-top: 10px"
                >
                  <p class="text-gray-500 text-sm mb-1">预估成本</p>
                  <p class="text-xl font-semibold text-gray-800">
                    ¥{{ formatNumber(project.esdc) }}
                  </p>
                </el-card>
              </el-col>
            </el-row>

            <!-- 操作按钮 -->
            <el-row :gutter="10">
              <el-col :span="8">
                <el-button
                  type="primary"
                  plain
                  @click="showWorkloadDialog(project)"
                  size="mini"
                  block
                >
                  工作量评估
                </el-button>
              </el-col>
              <el-col :span="8">
                <el-button
                  type="warning"
                  plain
                  @click="showCostDialog(project)"
                  size="mini"
                  block
                >
                  造价评估
                </el-button>
              </el-col>
              <el-col :span="8">
                <el-button
                  type="success"
                  @click="showHistoryDialog(project)"
                  size="mini"
                  round
                  block
                >
                  历史查看
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页控制 -->
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1.5rem;
        "
      >
        <el-button
          @click="prevPage"
          :disabled="pageNum === 1"
          type="primary"
          plain
          size="mini"
        >
          上一页
        </el-button>
        <span class="text-lg font-semibold" style="margin: 0 1rem"
          >第 {{ pageNum }} 页</span
        >
        <el-button
          @click="nextPage"
          type="primary"
          plain
          size="mini"
          :disabled="pageNum === maxPage"
        >
          下一页
        </el-button>
      </div>
    </el-main>

    <!-- 工作量评估弹窗 -->
    <el-dialog
      :title="`${selectedProject?.projName || ''} - 工作量评估`"
      v-model="showWorkload"
      class="workload-assessment-dialog"
      :modal-class="'custom-modal-class'"
      width="450px"
    >
      <el-form
        :model="workloadForm"
        label-width="200px"
        class="workload-form"
        label-position="left"
      >
        <div class="form-grid">
          <el-form-item label="功能点数 (S)" prop="s">
            <el-input-number
              v-model="workloadForm.s"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="功能点数"
            />
          </el-form-item>

          <el-form-item label="规模调整因子 (SF)" prop="sf">
            <el-input-number
              v-model="workloadForm.sf"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="规模因子"
            />
          </el-form-item>

          <el-form-item label="业务领域调整因子 (BD)" prop="bd">
            <el-input-number
              v-model="workloadForm.bd"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="业务因子"
            />
          </el-form-item>

          <el-form-item label="应用类型调整因子 (AT)" prop="at">
            <el-input-number
              v-model="workloadForm.at"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="应用因子"
            />
          </el-form-item>

          <el-form-item label="质量特性调整因子 (QR)" prop="qr">
            <el-input-number
              v-model="workloadForm.qr"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="质量因子"
            />
          </el-form-item>

          <el-form-item label="开发语言调整因子 (SL)" prop="sl">
            <el-input-number
              v-model="workloadForm.sl"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="语言因子"
            />
          </el-form-item>

          <el-form-item label="开发团队背景因子 (DT)" prop="dt">
            <el-input-number
              v-model="workloadForm.dt"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="背景因子"
            />
          </el-form-item>

          <el-form-item label="PDR" prop="pdr">
            <el-input-number
              v-model="workloadForm.pdr"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="PDR"
            />
          </el-form-item>
        </div>

        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitWorkloadForm"
            class="submit-btn"
          >
            提交评估
          </el-button>
          <el-button @click="showWorkload = false" class="cancel-btn">
            取消
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 造价评估弹窗 -->
    <el-dialog
      :title="`${selectedProject?.projName || ''} - 造价评估`"
      v-model="showCost"
      class="cost-assessment-dialog"
      :modal-class="'custom-modal-class'"
      width="600px"
      :append-to-body="true"
    >
      <el-form
        :model="costForm"
        label-width="150px"
        class="cost-form"
        label-position="left"
      >
        <div class="form-grid">
          <el-form-item label="非人力成本 (DNC)" prop="dnc">
            <el-input-number
              v-model="costForm.dnc"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="请输入非人力成本"
              class="full-width-input"
            >
              <template #prepend>¥</template>
            </el-input-number>
          </el-form-item>

          <el-form-item label="质量等级 (Q)" prop="q">
            <el-select
              v-model="costForm.q"
              placeholder="请选择质量等级"
              class="full-width-select"
            >
              <el-option-group label="质量等级">
                <el-option
                  v-for="level in qualityLevels"
                  :key="level.value"
                  :label="level.label"
                  :value="level.value"
                >
                  <div class="select-option">
                    <span>{{ level.label }}</span>
                    <small>{{ level.description }}</small>
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="城市名称 (cityname)" prop="cityname">
            <el-select
              v-model="costForm.cityname"
              placeholder="请选择城市"
              filterable
              class="full-width-select"
            >
              <el-option-group label="城市列表">
                <el-option
                  v-for="city in citiesList"
                  :key="city.cityname"
                  :label="city.cityname"
                  :value="city.cityname"
                >
                  <div class="select-option">
                    <span>{{ city.cityname }}</span>
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="风险等级 (rsklevel)" prop="rsklevel">
            <el-select
              v-model="costForm.rsklevel"
              placeholder="请选择风险等级"
              class="full-width-select"
            >
              <el-option-group label="风险等级">
                <el-option
                  v-for="level in riskLevels"
                  :key="level.value"
                  :label="level.label"
                  :value="level.value"
                >
                  <div class="select-option">
                    <span>{{ level.label }}</span>
                    <small>{{ level.description }}</small>
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </div>

        <div class="dialog-footer">
          <el-button type="primary" @click="submitCostForm" class="submit-btn">
            提交评估
          </el-button>
          <el-button @click="showCost = false" class="cancel-btn">
            取消
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 历史查看弹窗 -->
    <el-dialog
      :title="`${selectedProject?.projName || ''} - 历史查看`"
      v-model="showHistory"
      class="history-view-dialog"
      :modal-class="'custom-modal-class'"
      width="1400px"
    >
      <el-tabs v-model="activeTab" type="card" class="history-tabs">
        <el-tab-pane name="workload" label="工作量历史">
          <div class="content-container">
            <div class="table-scroll-container">
              <el-table
                :data="historyWorkloads"
                stripe
                highlight-current-row
                height="400"
                class="history-table"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="projName"
                  label="项目名称"
                  min-width="120"
                  fixed
                >
                  <template #default="{ row }">
                    <div class="project-name-cell">
                      <i class="el-icon-document"></i>
                      {{ row.projName }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ae"
                  label="工作量/人时"
                  sortable
                  align="right"
                  width="150"
                >
                  <template #default="{ row }">
                    <span class="workload-cell">
                      {{ row.ae.toLocaleString() }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="记录ID"
                  width="120"
                  align="center"
                >
                  <template #default="{ row }">
                    {{ row.id || "-" }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              id="workloadChart"
              style="width: 100%; height: 400px; margin-top: 20px"
            ></div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="cost" label="造价历史">
          <div class="content-container">
            <div class="table-scroll-container">
              <el-table
                :data="historyCosts"
                stripe
                highlight-current-row
                height="400"
                class="history-table"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="projname"
                  label="项目名称"
                  min-width="180"
                  fixed
                >
                  <template #default="{ row }">
                    <div class="project-name-cell">
                      <i class="el-icon-coin"></i>
                      {{ row.projname }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="esdc"
                  label="综合造价 (¥)"
                  sortable
                  align="right"
                  width="150"
                >
                  <template #default="{ row }">
                    <span class="cost-cell">
                      ¥ {{ row.esdc.toLocaleString() }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="记录ID"
                  width="120"
                  align="center"
                >
                  <template #default="{ row }">
                    {{ row.id || "-" }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              id="costChart"
              style="width: 100%; height: 400px; margin-top: 20px"
            ></div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template v-slot:footer>
        <div class="dialog-footer">
          <el-tag>总条数 : {{ historyWorkloads.length }}</el-tag>
          <el-button @click="showHistory = false" class="close-btn">
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  ElMain,
  ElRow,
  ElCol,
  ElCard,
  ElTag,
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTabPane,
} from "element-plus";
import "element-plus/dist/index.css";
import * as echarts from "echarts";
export default {
  watch: {
    activeTab(newTab) {
      if (newTab === "cost") {
        this.$nextTick(() => {
          this.renderCostChart(); // 切换到造价历史时重新渲染图表
        });
      } else if (newTab === "workload") {
        this.$nextTick(() => {
          this.renderWorkloadChart(); // 确保工作量历史的图表正常显示
        });
      }
    },
  },
  name: "PriceEvaluation",
  components: {
    ElMain,
    ElRow,
    ElCol,
    ElCard,
    ElTag,
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInputNumber,
    ElSelect,
    ElOption,
    ElTable,
    ElTableColumn,
    ElTabs,
    ElTabPane,
  },
  data() {
    return {
      projects: [],
      loading: true,
      isSearching: false,
      searchTerm: "",
      showWorkload: false,
      showCost: false,
      showHistory: false,
      selectedProject: null,
      workloadForm: {
        s: "",
        sf: "",
        bd: "",
        at: "",
        qr: "",
        sl: "",
        dt: "",
        pdr: "",
      },
      costForm: {
        dnc: "",
        q: "",
        cityname: "",
        rsklevel: "",
      },
      citiesList: [],
      historyWorkloads: [],
      historyCosts: [],
      activeTab: "workload", // 'workload' or 'cost'
      pageNum: 1,
      pageSize: 6,
      maxPage: 1, // 最大页数
      name: "HistoryModal",
      qualityLevels: [
        {
          value: "高",
          label: "高",
          description: "最高质量标准，严格质量控制",
        },
        {
          value: "中",
          label: "中",
          description: "标准质量要求，平衡成本和质量",
        },
        {
          value: "低",
          label: "低",
          description: "基本质量要求，成本优先",
        },
      ],
      riskLevels: [
        {
          value: "高",
          label: "高",
          description: "风险较大，需要特别关注",
        },
        {
          value: "中",
          label: "中",
          description: "一般风险水平，需要适度管控",
        },
        {
          value: "低",
          label: "低",
          description: "风险较小，管理难度低",
        },
      ],
    };
  },
  methods: {
    async fetchMaxPage() {
      try {
        const response = await fetch("http://118.202.10.11:8080/maxpage");
        const data = await response.json();
        if (data.isok) {
          this.maxPage = data.num;
        } else {
          this.maxPage = 1;
        }
      } catch (error) {
        console.error("Error fetching maxPage:", error);
        this.maxPage = 1;
      }
    },
    async fetchProjects() {
      this.loading = true;
      try {
        const response = await fetch(
          `http://118.202.10.11:8080/list?pageNum=${this.pageNum}&pageSize=${this.pageSize}`
        );
        const data = await response.json();
        if (data.isok) {
          this.projects = data.lists;
          this.maxPage = data.maxpage;
        } else {
          this.projects = [];
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        this.projects = [];
        this.maxPage = 1;
      } finally {
        this.loading = false;
      }
    },
    async searchProjects(id) {
      this.loading = true;
      try {
        const response = await fetch(
          `http://118.202.10.11:8080/listbyid?id=${encodeURIComponent(id)}`
        );
        const data = await response.json();
        if (data.isok) {
          if (data.proj) {
            this.projects = [data.proj];
            this.maxPage = 1;
          } else {
            this.projects = [];
            this.maxPage = 1;
          }
        } else {
          this.projects = [];
          this.maxPage = 1;
        }
      } catch (error) {
        console.error("Error searching projects:", error);
        this.projects = [];
        this.maxPage = 1;
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      if (this.searchTerm.trim()) {
        this.searchProjects(this.searchTerm.trim());
        this.isSearching = true;
      } else {
        this.resetSearch();
      }
    },
    particlesLoaded(){
    console.log("Particles container loaded", container);
    },
    resetSearch() {
      this.searchTerm = "";
      this.pageNum = 1;
      this.fetchProjects();
      this.fetchMaxPage();
      this.isSearching = false;
    },
    showWorkloadDialog(project) {
      this.selectedProject = project;
      this.showWorkload = true;
      console.log("selectedProject:", project);

      // 初始化表单
      this.workloadForm = {
        s: project.s || "",
        sf: project.sf || "",
        bd: project.bd || "",
        at: project.at || "",
        qr: project.qr || "",
        sl: project.sl || "",
        dt: project.dt || "",
        pdr: project.pdr || "",
      };
    },
    showCostDialog(project) {
      this.selectedProject = project;
      this.showCost = true;

      // 初始化表单
      this.costForm = {
        dnc: "",
        q: "",
        cityname: "",
        rsklevel: "",
      };

      // 获取城市列表
      this.fetchCities();
    },
    async fetchCities() {
      try {
        const response = await fetch("http://118.202.10.11:8080/listcity");
        const data = await response.json();
        if (data.isok) {
          this.citiesList = data.lists;
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    },
    async submitWorkloadForm() {
      // 将表单数据中的所有字段转换为数字
      const formData = {};
      for (const key in this.workloadForm) {
        formData[key] = parseFloat(this.workloadForm[key]) || 0;
      }

      // 构建请求体，包括选中项目和表单数据
      const payload = {
        ...this.selectedProject,
        ...formData,
        id: this.selectedProject.projid,
      };

      try {
        const url = `http://118.202.10.11:8080/calae?id=${this.selectedProject.projid}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.isok) {
          alert("工作量评估提交成功");
          // 更新项目的工作量
          this.selectedProject.ae = data.ae;
          this.showWorkload = false;
        } else {
          alert("工作量评估提交失败");
        }
      } catch (error) {
        console.error("Error submitting workload form:", error);
        alert("工作量评估提交失败");
      }
    },
    async submitCostForm() {
      // 获取表单数据
      const id = this.selectedProject.projid;
      const dnc = parseFloat(this.costForm.dnc) || 0;
      const q = this.costForm.q;
      const cityname = this.costForm.cityname;
      const rsklevel = this.costForm.rsklevel;

      try {
        // 构建 URL 查询参数
        const url = `http://118.202.10.11:8080/calesdc?id=${id}&dnc=${dnc}&q=${encodeURIComponent(
          q
        )}&cityname=${encodeURIComponent(
          cityname
        )}&rsklevel=${encodeURIComponent(rsklevel)}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.isok) {
          alert("造价评估提交成功");
          // 更新项目的估算造价
          this.selectedProject.esdc = data.esdc;
          this.showCost = false;
        } else {
          alert("造价评估提交失败");
        }
      } catch (error) {
        console.error("Error submitting cost form:", error);
        alert("造价评估提交失败");
      }
    },
    // 渲染工作量图表
    renderWorkloadChart() {
      this.$nextTick(() => {
        const chartDom = document.getElementById("workloadChart");
        if (chartDom) {
          const myChart = echarts.init(chartDom);
          const option = {
            xAxis: {
              type: "category",
              data: this.historyWorkloads.map((item) => item.id), // 使用 id 作为 x 轴
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                data: this.historyWorkloads.map((item) => item.ae), // 使用 ae 作为 y 轴
                type: "bar",
              },
            ],
          };
          myChart.setOption(option);
        } else {
          console.error("工作量图表的 DOM 元素未找到");
        }
      });
    },

    // 渲染费用图表
    renderCostChart() {
      this.$nextTick(() => {
        const chartDom = document.getElementById("costChart");
        if (chartDom) {
          // 销毁已有实例，避免重复初始化
          const existingInstance = echarts.getInstanceByDom(chartDom);
          if (existingInstance) {
            echarts.dispose(chartDom);
          }
          const myChart = echarts.init(chartDom);
          const option = {
            xAxis: {
              type: "category",
              data: this.historyCosts.map((item) => item.id), // 使用 id 作为 x 轴
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                data: this.historyCosts.map((item) => item.esdc), // 使用 esdc 作为 y 轴
                type: "bar",
              },
            ],
          };
          myChart.setOption(option);
        } else {
          console.error("费用图表的 DOM 元素未找到");
        }
      });
    },
    async fetchHistoryWorkloads(id) {
      try {
        const response = await fetch(
          `http://118.202.10.11:8080/listae?id=${id}`
        );
        const data = await response.json();
        if (data.isok) {
          this.historyWorkloads = data.aes;
          this.renderWorkloadChart(); // 渲染第一个直方图
        }
      } catch (error) {
        console.error("Error fetching history workloads:", error);
      }
    },
    async fetchHistoryCosts(id) {
      try {
        const response = await fetch(
          `http://118.202.10.11:8080/listesdc?id=${id}`
        );
        const data = await response.json();
        if (data.isok) {
          this.historyCosts = data.esdcs;
          this.renderCostChart(); // 渲染第二个直方图
        }
      } catch (error) {
        console.error("Error fetching history costs:", error);
      }
    },
    showHistoryDialog(project) {
      this.selectedProject = project;
      this.showHistory = true;
      this.activeTab = "workload";
      this.fetchHistoryWorkloads(project.projid);
      this.fetchHistoryCosts(project.projid);
    },
    formatNumber(num) {
      return num?.toLocaleString("zh-CN");
    },
    nextPage() {
      this.fetchMaxPage();
      if (this.pageNum < this.maxPage) {
        this.pageNum++;
        this.fetchProjects();
      }
    },
    prevPage() {
      this.fetchMaxPage();
      if (this.pageNum > 1) {
        this.pageNum--;
        this.fetchProjects();
      }
    },
    downloadProject(url) {
      window.open(url, "_blank");
    },
  },
  mounted() {
    this.fetchMaxPage();
    this.fetchProjects();
  },
};
</script>

<style>
.bg-white {
  position: relative;
  z-index: 1;
}

.custom-scrollbar {
  overflow-y: auto;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}

.form-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-item-center {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-item-center .el-form-item__label {
  width: 170px; /* 保持与 label-width 一致 */
  justify-content: flex-end;
  padding-right: 10px;
}

.form-item-center .el-form-item__content {
  flex: none;
}

.workload-assessment-dialog {
  .workload-form {
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }

  .el-form-item {
    margin-bottom: 15px;

    ::v-deep .el-form-item__label {
      color: #333;
      font-weight: 600;
    }

    ::v-deep .el-input-number {
      width: 100%;

      .el-input__inner {
        border-radius: 4px;
        border-color: #d1d5db;
        transition: all 0.3s ease;

        &:focus {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .submit-btn {
    background-color: #409eff;
    border-color: #409eff;
    transition: all 0.3s ease;

    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }

  .cancel-btn {
    color: #606266;
    border-color: #d9d9d9;
    transition: all 0.3s ease;

    &:hover {
      color: #409eff;
      border-color: #409eff;
    }
  }
}

.custom-modal-class {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.cost-assessment-dialog {
  .cost-form {
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }

  .el-form-item {
    margin-bottom: 15px;

    ::v-deep .el-form-item__label {
      color: #333;
      font-weight: 600;
    }

    .full-width-input,
    .full-width-select {
      width: 100%;
    }

    ::v-deep .el-input-number {
      .el-input__inner {
        border-radius: 4px;
        border-color: #d1d5db;
        transition: all 0.3s ease;

        &:focus {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
      }
    }

    ::v-deep .el-select {
      .el-input__inner {
        border-radius: 4px;
        border-color: #d1d5db;
        transition: all 0.3s ease;

        &:focus,
        &:hover {
          border-color: #409eff;
        }
      }
    }
  }

  .select-option {
    display: flex;
    justify-content: space-between;
    align-items: center;

    small {
      color: #888;
      font-size: 12px;
      margin-left: 10px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .submit-btn {
    background-color: #409eff;
    border-color: #409eff;
    transition: all 0.3s ease;

    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }

  .cancel-btn {
    color: #606266;
    border-color: #d9d9d9;
    transition: all 0.3s ease;

    &:hover {
      color: #409eff;
      border-color: #409eff;
    }
  }
}

.custom-modal-class {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.history-view-dialog {
  .history-tabs {
    ::v-deep .el-tabs__header {
      margin-bottom: 20px;
      border-bottom: 1px solid #e4e7ed;
    }

    ::v-deep .el-tabs__nav-wrap {
      background-color: #f5f7fa;
      padding: 10px 15px;
      border-radius: 6px;
    }

    ::v-deep .el-tabs__item {
      height: 40px;
      line-height: 40px;
      color: #606266;
      transition: all 0.3s ease;

      &.is-active {
        color: #409eff;
        font-weight: bold;
      }

      &:hover {
        color: #409eff;
      }
    }
  }

  .table-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 15px;
  }

  .history-table {
    ::v-deep .el-table__header {
      background-color: #f5f7fa;
      color: #303133;
      font-weight: bold;
    }

    .project-name-cell {
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        color: #409eff;
      }
    }

    .workload-cell {
      color: #67c23a;
      font-weight: bold;
    }

    .cost-cell {
      color: #f56c6c;
      font-weight: bold;
    }

    ::v-deep .el-button--text {
      color: #409eff;

      &:hover {
        color: #66b1ff;
        text-decoration: underline;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    padding: 15px 0;
  }

  .close-btn {
    padding: 10px 30px;
    color: #606266;
    border-color: #d9d9d9;
    transition: all 0.3s ease;

    &:hover {
      color: #409eff;
      border-color: #409eff;
    }
  }
}

.custom-modal-class {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.history-view-dialog {
  .table-scroll-container {
    max-height: 450px;
    min-width: 600px;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .history-table {
    width: 100%;

    ::v-deep .el-table__body-wrapper {
      overflow-y: auto;
      max-height: 400px;
    }

    ::v-deep .history-table-row {
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #f5f7fa !important;
      }
    }

    ::v-deep .striped-row {
      background-color: #fafafa;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f5f7fa;
    border-top: 1px solid #e4e7ed;
  }

  .close-btn {
    margin-left: 15px;
  }

  .content-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
