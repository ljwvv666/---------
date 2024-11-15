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
          name:'upload-file',
          component: () => import('@/components/functionalPointAnalysis/upLoadFile.vue'),
        },
        {
          path:'viewFP',
          name:'view-FP',
          component: () => import('@/components/functionalPointAnalysis/functionalPoint.vue'),
        },
        {
          path:'datascreen',
          component: () => import('@/components/functionalPointAnalysis/dataScreen.vue'),
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
