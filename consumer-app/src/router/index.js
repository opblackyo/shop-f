/**
 * Vue Router 配置
 */
import { createRouter, createWebHistory } from 'vue-router'

// 頁面組件
import RestaurantPage from '@/views/RestaurantPage.vue'
import CartPage from '@/views/CartPage.vue'
import CheckoutPage from '@/views/CheckoutPage.vue'
import OrderStatusPage from '@/views/OrderStatusPage.vue'

// 路由模組
import ugcRoutes from './modules/ugc.js'

const routes = [
  {
    path: '/',
    redirect: '/restaurant/1'
  },
  {
    path: '/restaurant/:id',
    name: 'Restaurant',
    component: RestaurantPage,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/order/:id',
    name: 'OrderStatus',
    component: OrderStatusPage,
    props: true,
    meta: { requiresAuth: true }
  },
  // 預留：登入頁面
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue')
  },
  // 預留：註冊頁面
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue')
  },
  // UGC 短影音路由
  ...ugcRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 預留：路由守衛（登入功能實作後啟用）
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()
//   if (to.meta.requiresAuth && !authStore.isLoggedIn) {
//     return next('/login')
//   }
//   next()
// })

export default router

