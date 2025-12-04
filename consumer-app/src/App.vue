<script setup>
/**
 * 根元件
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 判斷是否顯示導航列
const showNav = computed(() => {
  const hideNavRoutes = ['Login', 'Register']
  return !hideNavRoutes.includes(route.name)
})

function goToCart() {
  router.push('/cart')
}
</script>

<template>
  <div id="app">
    <!-- 頂部導航列 -->
    <nav v-if="showNav" class="navbar">
      <router-link to="/" class="logo">
        🍔 美食外送
      </router-link>
      
      <div class="nav-actions">
        <button class="cart-btn" @click="goToCart">
          🛒
          <span v-if="cartStore.itemCount > 0" class="badge">
            {{ cartStore.itemCount }}
          </span>
        </button>
      </div>
    </nav>

    <!-- 主要內容區 -->
    <main :class="{ 'with-nav': showNav }">
      <router-view />
    </main>
  </div>
</template>

<style>
/* 全域樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    'Helvetica Neue', Arial, sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.5;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  font-family: inherit;
}
</style>

<style scoped>
#app {
  min-height: 100vh;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-btn {
  position: relative;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-btn .badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 20px;
  height: 20px;
  background: #e74c3c;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  min-height: 100vh;
}

main.with-nav {
  padding-top: 60px;
}
</style>

