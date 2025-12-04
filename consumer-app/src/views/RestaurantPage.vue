<script setup>
/**
 * 餐廳內頁
 */
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import { getRestaurant } from '@/services/api/restaurant.js'
import { getMenu } from '@/services/api/menu.js'
import MenuItemCard from '@/components/MenuItemCard.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
import ToastNotification from '@/components/ToastNotification.vue'

const route = useRoute()
const cartStore = useCartStore()

// 狀態
const restaurant = ref(null)
const menuData = ref(null)
const activeCategory = ref('')
const loading = ref(true)
const error = ref(null)
const toast = ref(null)

// 計算屬性
const categories = computed(() => menuData.value?.categories || [])

const currentItems = computed(() => {
  if (!activeCategory.value || !categories.value.length) {
    return categories.value.flatMap(cat => cat.items)
  }
  const category = categories.value.find(cat => cat.category_name === activeCategory.value)
  return category?.items || []
})

// 載入資料
async function loadData() {
  loading.value = true
  error.value = null
  
  try {
    const restaurantId = route.params.id
    const [restaurantData, menu] = await Promise.all([
      getRestaurant(restaurantId),
      getMenu(restaurantId)
    ])
    
    restaurant.value = restaurantData
    menuData.value = menu
    
    if (menu.categories?.length > 0) {
      activeCategory.value = menu.categories[0].category_name
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 選擇分類
function handleSelectCategory(categoryName) {
  activeCategory.value = categoryName
}

// 加入購物車
async function handleAddToCart(item) {
  try {
    await cartStore.addItem(item.id, 1)
    showToast(`${item.name} 已加入購物車`, 'success')
  } catch (err) {
    showToast(err.message || '加入失敗', 'error')
  }
}

// 顯示 Toast
function showToast(message, type = 'success') {
  toast.value = { message, type, key: Date.now() }
}

function clearToast() {
  toast.value = null
}

onMounted(loadData)
</script>

<template>
  <div class="restaurant-page">
    <!-- Toast 通知 -->
    <ToastNotification
      v-if="toast"
      :key="toast.key"
      :message="toast.message"
      :type="toast.type"
      @close="clearToast"
    />

    <!-- 載入中 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadData">重試</button>
    </div>

    <!-- 內容 -->
    <template v-else>
      <!-- 餐廳資訊 -->
      <header class="restaurant-header">
        <h1>{{ restaurant?.name }}</h1>
        <p class="address">📍 {{ restaurant?.address }}</p>
        <p class="phone">📞 {{ restaurant?.phone }}</p>
      </header>

      <!-- 分類標籤 -->
      <CategoryTabs
        :categories="categories"
        :active-category="activeCategory"
        @select="handleSelectCategory"
      />

      <!-- 菜單列表 -->
      <div class="menu-grid">
        <MenuItemCard
          v-for="item in currentItems"
          :key="item.id"
          :item="item"
          @add-to-cart="handleAddToCart(item)"
        />
      </div>

      <!-- 購物車浮動按鈕 -->
      <router-link 
        v-if="cartStore.itemCount > 0"
        to="/cart" 
        class="cart-fab"
      >
        🛒 {{ cartStore.itemCount }}
      </router-link>
    </template>
  </div>
</template>

<style scoped>
.restaurant-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error button {
  margin-top: 16px;
  padding: 8px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.restaurant-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.restaurant-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.address, .phone {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding-bottom: 80px;
}

.cart-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  background: #e74c3c;
  color: white;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
  transition: transform 0.2s;
}

.cart-fab:hover {
  transform: scale(1.05);
}
</style>

