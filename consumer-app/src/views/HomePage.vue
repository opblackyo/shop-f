<script setup>
/**
 * 首頁 - 餐廳列表
 * 消費者進入 App 的第一個頁面
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRestaurants } from '@/services/api/restaurant.js'

const router = useRouter()

// 狀態
const restaurants = ref([])
const loading = ref(false)
const error = ref(null)

// 載入餐廳列表
async function loadRestaurants() {
  loading.value = true
  error.value = null
  
  try {
    const response = await getRestaurants()
    restaurants.value = response.restaurants || []
  } catch (err) {
    error.value = err.message || '載入失敗'
  } finally {
    loading.value = false
  }
}

// 前往餐廳頁面
function goToRestaurant(id) {
  router.push(`/restaurant/${id}`)
}

// 前往 UGC 短影音
function goToUGC() {
  router.push('/ugc')
}

// 前往購物車
function goToCart() {
  router.push('/cart')
}

onMounted(() => {
  loadRestaurants()
})
</script>

<template>
  <div class="home-page">
    <!-- 頂部導航 -->
    <header class="header">
      <h1 class="logo">🍱 美食外送</h1>
      <div class="header-actions">
        <button class="icon-btn" @click="goToCart" title="購物車">
          🛒
        </button>
      </div>
    </header>

    <!-- 搜尋區 -->
    <div class="search-section">
      <input 
        type="text" 
        class="search-input" 
        placeholder="搜尋餐廳或美食..."
      />
    </div>

    <!-- 分類快捷 -->
    <div class="category-shortcuts">
      <div class="category-item">🍱 便當</div>
      <div class="category-item">🍛 咖哩</div>
      <div class="category-item">🍜 麵食</div>
      <div class="category-item">🍕 披薩</div>
      <div class="category-item">🥗 沙拉</div>
    </div>

    <!-- 餐廳列表 -->
    <main class="content">
      <h2 class="section-title">附近餐廳</h2>
      
      <!-- 載入中 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>載入中...</p>
      </div>
      
      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadRestaurants">重試</button>
      </div>
      
      <!-- 空狀態 -->
      <div v-else-if="restaurants.length === 0" class="empty-state">
        <p>🏪 目前沒有餐廳</p>
      </div>
      
      <!-- 餐廳卡片列表 -->
      <div v-else class="restaurant-grid">
        <div 
          v-for="restaurant in restaurants" 
          :key="restaurant.id"
          class="restaurant-card"
          @click="goToRestaurant(restaurant.id)"
        >
          <div class="restaurant-image">
            <img 
              :src="restaurant.image" 
              :alt="restaurant.name"
              loading="lazy"
            />
          </div>
          <div class="restaurant-info">
            <h3 class="restaurant-name">{{ restaurant.name }}</h3>
            <p class="restaurant-desc">{{ restaurant.description }}</p>
            <div class="restaurant-meta">
              <span class="rating">⭐ {{ restaurant.rating }}</span>
              <span class="delivery-fee">🚚 ${{ restaurant.delivery_fee }}</span>
              <span class="min-order">最低 ${{ restaurant.min_order }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部導航 -->
    <nav class="bottom-nav">
      <button class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">首頁</span>
      </button>
      <button class="nav-item" @click="goToUGC">
        <span class="nav-icon">🎬</span>
        <span class="nav-label">短影音</span>
      </button>
      <button class="nav-item" @click="goToCart">
        <span class="nav-icon">🛒</span>
        <span class="nav-label">購物車</span>
      </button>
      <button class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-label">我的</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 70px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Search */
.search-section {
  padding: 16px;
  background: white;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

/* Category Shortcuts */
.category-shortcuts {
  display: flex;
  gap: 12px;
  padding: 16px;
  overflow-x: auto;
  background: white;
  border-bottom: 1px solid #eee;
}

.category-shortcuts::-webkit-scrollbar {
  display: none;
}

.category-item {
  flex-shrink: 0;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.category-item:hover {
  background: #ffe5d9;
}

/* Content */
.content {
  padding: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
}

/* Restaurant Grid */
.restaurant-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.restaurant-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.restaurant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.restaurant-image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.restaurant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.restaurant-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.restaurant-desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.restaurant-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #888;
}

.rating {
  color: #f7931e;
  font-weight: 500;
}

/* States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 48px 16px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #ff6b35;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state button {
  margin-top: 12px;
  padding: 8px 24px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: white;
  border-top: 1px solid #eee;
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.nav-item.active {
  color: #ff6b35;
}

.nav-item:hover {
  color: #ff6b35;
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-size: 11px;
}
</style>
