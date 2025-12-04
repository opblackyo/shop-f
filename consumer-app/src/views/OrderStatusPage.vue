<script setup>
/**
 * 訂單狀態頁
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderStatus } from '@/services/api/order.js'
import StatusStepper from '@/components/StatusStepper.vue'

const route = useRoute()
const router = useRouter()

// 狀態
const orderData = ref(null)
const loading = ref(true)
const error = ref(null)
let pollingTimer = null

// 狀態對應的訊息
const statusMessages = {
  'Pending': '訂單已送出，等待商家確認...',
  'Paid': '付款成功，等待商家接單...',
  'Preparing': '商家正在準備您的餐點...',
  'Delivering': '外送員正在配送中...',
  'Completed': '訂單已完成，感謝您的訂購！'
}

// 載入訂單狀態
async function loadOrderStatus() {
  try {
    const orderId = route.params.id
    const data = await getOrderStatus(orderId)
    orderData.value = data
    
    // 如果訂單已完成，停止輪詢
    if (data.status === 'Completed') {
      stopPolling()
    }
  } catch (err) {
    error.value = err.message
    stopPolling()
  } finally {
    loading.value = false
  }
}

// 開始輪詢
function startPolling() {
  pollingTimer = setInterval(loadOrderStatus, 3000)
}

// 停止輪詢
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

// 返回首頁
function goHome() {
  router.push('/restaurant/1')
}

onMounted(() => {
  loadOrderStatus()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="order-status-page">
    <header class="page-header">
      <h1>訂單追蹤</h1>
      <button class="home-btn" @click="goHome">返回首頁</button>
    </header>

    <!-- 載入中 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadOrderStatus">重試</button>
    </div>

    <!-- 訂單狀態 -->
    <template v-else-if="orderData">
      <div class="order-card">
        <div class="order-id">
          訂單編號：#{{ orderData.order_id }}
        </div>

        <!-- 進度條 -->
        <StatusStepper 
          :steps="orderData.steps"
          :current-status="orderData.status"
        />

        <!-- 狀態訊息 -->
        <div class="status-message">
          <div class="status-icon" :class="orderData.status.toLowerCase()">
            <span v-if="orderData.status === 'Completed'">✓</span>
            <span v-else class="pulse-dot"></span>
          </div>
          <p>{{ statusMessages[orderData.status] }}</p>
        </div>

        <!-- 已完成提示 -->
        <div v-if="orderData.status === 'Completed'" class="completed-actions">
          <p>期待再次為您服務！</p>
          <button class="primary-btn" @click="goHome">
            繼續點餐
          </button>
        </div>
      </div>

      <!-- 輪詢指示 -->
      <p v-if="orderData.status !== 'Completed'" class="polling-hint">
        自動更新中...
      </p>
    </template>
  </div>
</template>

<style scoped>
.order-status-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.home-btn {
  padding: 8px 16px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
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

.order-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-id {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
}

.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 16px;
}

.status-icon.pending,
.status-icon.paid {
  background: #fff3cd;
  color: #856404;
}

.status-icon.preparing {
  background: #d1ecf1;
  color: #0c5460;
}

.status-icon.delivering {
  background: #cce5ff;
  color: #004085;
}

.status-icon.completed {
  background: #d4edda;
  color: #155724;
}

.pulse-dot {
  width: 16px;
  height: 16px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

.status-message p {
  color: #333;
  font-size: 16px;
  text-align: center;
}

.completed-actions {
  text-align: center;
  margin-top: 20px;
}

.completed-actions p {
  color: #666;
  margin-bottom: 16px;
}

.primary-btn {
  padding: 12px 32px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #2980b9;
}

.polling-hint {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 16px;
}
</style>

