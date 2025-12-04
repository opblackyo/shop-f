<script setup>
/**
 * 結帳頁
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import { createOrder, payOrder } from '@/services/api/order.js'
import ToastNotification from '@/components/ToastNotification.vue'

const router = useRouter()
const cartStore = useCartStore()

// 表單狀態
const paymentMethod = ref('credit_card')
const remark = ref('')
const loading = ref(false)
const toast = ref(null)

// 付款方式選項
const paymentOptions = [
  { value: 'credit_card', label: '💳 信用卡' },
  { value: 'cash', label: '💵 現金' },
  { value: 'line_pay', label: '📱 LINE Pay' }
]

// 載入購物車
onMounted(async () => {
  if (cartStore.isEmpty) {
    try {
      await cartStore.fetchCart()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
})

// 提交訂單
async function handleSubmit() {
  if (cartStore.isEmpty) {
    showToast('購物車是空的', 'error')
    return
  }

  loading.value = true
  
  try {
    // 建立訂單
    const orderResult = await createOrder(paymentMethod.value, remark.value)
    const orderId = orderResult.order_id

    // 模擬付款
    await payOrder(orderId)
    
    // 清空購物車
    cartStore.clearCart()
    
    showToast('訂單建立成功！', 'success')
    
    // 導向訂單狀態頁
    setTimeout(() => {
      router.push(`/order/${orderId}`)
    }, 1000)
  } catch (err) {
    showToast(err.message || '訂單建立失敗', 'error')
  } finally {
    loading.value = false
  }
}

// 返回購物車
function goBack() {
  router.push('/cart')
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
  <div class="checkout-page">
    <ToastNotification
      v-if="toast"
      :key="toast.key"
      :message="toast.message"
      :type="toast.type"
      @close="clearToast"
    />

    <header class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>結帳</h1>
    </header>

    <!-- 訂單摘要 -->
    <section class="order-summary">
      <h2>訂單摘要</h2>
      <div class="summary-items">
        <div 
          v-for="item in cartStore.items" 
          :key="item.cart_item_id"
          class="summary-item"
        >
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span>${{ item.subtotal }}</span>
        </div>
      </div>
      <div class="summary-total">
        <div class="row">
          <span>小計</span>
          <span>${{ cartStore.subtotal }}</span>
        </div>
        <div class="row">
          <span>運費</span>
          <span>${{ cartStore.deliveryFee }}</span>
        </div>
        <div class="row total">
          <span>總計</span>
          <span>${{ cartStore.total }}</span>
        </div>
      </div>
    </section>

    <!-- 付款方式 -->
    <section class="payment-section">
      <h2>付款方式</h2>
      <div class="payment-options">
        <label 
          v-for="option in paymentOptions" 
          :key="option.value"
          :class="['payment-option', { selected: paymentMethod === option.value }]"
        >
          <input 
            type="radio" 
            v-model="paymentMethod" 
            :value="option.value"
          />
          {{ option.label }}
        </label>
      </div>
    </section>

    <!-- 備註 -->
    <section class="remark-section">
      <h2>備註</h2>
      <textarea 
        v-model="remark"
        placeholder="有什麼特別需求嗎？例如：不要香菜、少辣..."
        rows="3"
      ></textarea>
    </section>

    <!-- 提交按鈕 -->
    <button 
      class="submit-btn"
      :disabled="loading || cartStore.isEmpty"
      @click="handleSubmit"
    >
      {{ loading ? '處理中...' : `確認付款 $${cartStore.total}` }}
    </button>
  </div>
</template>

<style scoped>
.checkout-page {
  max-width: 600px;
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

section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

section h2 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.summary-items {
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #666;
}

.summary-total .row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #666;
}

.summary-total .row.total {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  border-top: 1px solid #eee;
  padding-top: 12px;
  margin-top: 8px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:hover {
  border-color: #3498db;
}

.payment-option.selected {
  border-color: #3498db;
  background: #f0f7ff;
}

.payment-option input {
  display: none;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
}

textarea:focus {
  outline: none;
  border-color: #3498db;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #219a52;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

