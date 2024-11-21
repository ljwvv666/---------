import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path:'/index',
      name:'index',
      component: () => import('@/layout/index.vue'),
      children:[
        {
          path:'uploadFile',
          name:'上传文件',
          component: () => import('@/components/functionalPointAnalysis/upLoadFile.vue'),
        },
        {
          path:'viewFP',
          name:'功能点明细',
          component: () => import('@/components/functionalPointAnalysis/functionalPoint.vue'),
        },
        {
          path:'datascreen',
          name:'结果呈现',
          component: () => import('@/components/functionalPointAnalysis/dataScreen.vue'),
        },
        {
          path:'price',
          name:'造价综合评估',
          component: () => import('@/components/PriceEvaluation/price.vue'),
        },
        {
          path:'pdrscreen',
          name:'团队PDR分析',
          component: () => import('@/components/PriceEvaluation/pdrscreen.vue'),
        },
        {
          path:'project',
          name:'项目管理',
          component: () => import('@/components/Management/ProjectManagement.vue'),
        }
      ]
    },
    {
      path:'/test',
      component: () => import('@/test.vue')
    }
  ]
})

export default router
