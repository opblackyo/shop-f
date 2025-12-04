<script setup>
/**
 * 購物車頁
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import CartItem from '@/components/CartItem.vue'
import ToastNotification from '@/components/ToastNotification.vue'

const router = useRouter()
const cartStore = useCartStore()

const toast = ref(null)

// 載入購物車
onMounted(async () => {
  try {
    await cartStore.fetchCart()
  } catch (err) {
    showToast(err.message, 'error')
  }
})

// 更新數量
async function handleUpdateQuantity(item, delta) {
  const newQuantity = item.quantity + delta
  if (newQuantity < 1) return
  
  try {
    await cartStore.updateItem(item.cart_item_id, newQuantity)
  } catch (err) {
    showToast(err.message, 'error')
  }
}

// 移除商品
async function handleRemove(item) {
  try {
    await cartStore.removeItem(item.cart_item_id)
    showToast(`${item.name} 已移除`, 'info')
  } catch (err) {
    showToast(err.message, 'error')
  }
}

// 前往結帳
function goToCheckout() {
  router.push('/checkout')
}

// 返回餐廳
function goBack() {
  router.back()
}

// Toast
function showToast(message, type = 'success') {
  toast.value = { message, type, key: Date.now() }
}

function clearToast() {
  toast.value = null
}
</script>

<template>
  <div class="cart-page">
    <ToastNotification
      v-if="toast"
      :key="toast.key"
      :message="toast.message"
      :type="toast.type"
      @close="clearToast"
    />

    <header class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>購物車</h1>
    </header>

    <!-- 載入中 -->
    <div v-if="cartStore.loading && cartStore.isEmpty" class="loading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>

    <!-- 空購物車 -->
    <div v-else-if="cartStore.isEmpty" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <p>購物車是空的</p>
      <button @click="goBack">去點餐</button>
    </div>

    <!-- 購物車內容 -->
    <template v-else>
      <div class="cart-items">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.cart_item_id"
          :item="item"
          :loading="cartStore.loading"
          @update-quantity="(delta) => handleUpdateQuantity(item, delta)"
          @remove="handleRemove(item)"
        />
      </div>

      <!-- 價格摘要 -->
      <div class="price-summary">
        <div class="price-row">
          <span>小計</span>
          <span>${{ cartStore.subtotal }}</span>
        </div>
        <div class="price-row">
          <span>運費</span>
          <span>${{ cartStore.deliveryFee }}</span>
        </div>
        <div class="price-row total">
          <span>總計</span>
          <span>${{ cartStore.total }}</span>
        </div>
      </div>

      <!-- 結帳按鈕 -->
      <button 
        class="checkout-btn"
        :disabled="cartStore.loading"
        @click="goToCheckout"
      >
        前往結帳
      </button>
    </template>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  padding: 8px 16px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.loading, .empty-cart {
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

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-cart button {
  margin-top: 16px;
  padding: 12px 32px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.price-summary {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #666;
}

.price-row.total {
  border-top: 1px solid #eee;
  padding-top: 16px;
  margin-top: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background: #c0392b;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

