/**
 * 訂單相關 API
 */
import http from '../http.js'
import { USE_MOCK, mockDelay } from './config.js'
import { clearMockCart } from './cart.js'

// Mock 訂單資料
let mockOrders = {}
let mockOrderIdCounter = 1000

// 訂單狀態列表
const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered']

/**
 * 建立訂單
 * @param {string} paymentMethod - 付款方式
 * @param {string} remark - 備註
 * @returns {Promise<object>}
 */
export async function createOrder(paymentMethod, remark = '') {
  if (USE_MOCK) {
    await mockDelay()
    const orderId = mockOrderIdCounter++
    mockOrders[orderId] = {
      order_id: orderId,
      status: 'pending',
      status_index: 0,
      payment_method: paymentMethod,
      remark,
      created_at: new Date().toISOString(),
      total: 150 // 模擬總額
    }
    return {
      success: true,
      order_id: orderId,
      message: '訂單建立成功'
    }
  }
  return http.post('/order/create', {
    payment_method: paymentMethod,
    remark
  })
}

/**
 * 模擬支付
 * @param {number} orderId - 訂單 ID
 * @returns {Promise<object>}
 */
export async function payOrder(orderId) {
  if (USE_MOCK) {
    await mockDelay()
    const order = mockOrders[orderId]
    if (!order) {
      throw new Error('訂單不存在')
    }
    order.status = 'confirmed'
    order.status_index = 1
    order.paid_at = new Date().toISOString()

    // 清空購物車
    clearMockCart()

    // 模擬訂單狀態自動更新（每5秒進一格）
    simulateOrderProgress(orderId)

    return {
      success: true,
      message: '付款成功'
    }
  }
  return http.post('/pay', {
    order_id: orderId
  })
}

/**
 * 模擬訂單進度自動更新
 */
function simulateOrderProgress(orderId) {
  const interval = setInterval(() => {
    const order = mockOrders[orderId]
    if (!order) {
      clearInterval(interval)
      return
    }

    if (order.status_index < ORDER_STATUSES.length - 1) {
      order.status_index++
      order.status = ORDER_STATUSES[order.status_index]
    } else {
      clearInterval(interval)
    }
  }, 5000) // 每5秒更新一次
}

/**
 * 取得訂單狀態
 * @param {number} orderId - 訂單 ID
 * @returns {Promise<object>}
 */
export async function getOrderStatus(orderId) {
  if (USE_MOCK) {
    await mockDelay(100) // 較短延遲，因為會頻繁輪詢
    const order = mockOrders[orderId]
    if (!order) {
      // 如果沒有訂單，返回模擬資料
      return {
        order_id: orderId,
        status: 'confirmed',
        status_text: '訂單已確認',
        steps: [
          { name: '訂單確認', completed: true },
          { name: '備餐中', completed: false },
          { name: '等待取餐', completed: false },
          { name: '外送中', completed: false },
          { name: '已送達', completed: false }
        ]
      }
    }

    const statusTexts = {
      pending: '等待付款',
      confirmed: '訂單已確認',
      preparing: '備餐中',
      ready: '等待取餐',
      delivering: '外送中',
      delivered: '已送達'
    }

    return {
      order_id: orderId,
      status: order.status,
      status_text: statusTexts[order.status],
      steps: [
        { name: '訂單確認', completed: order.status_index >= 1 },
        { name: '備餐中', completed: order.status_index >= 2 },
        { name: '等待取餐', completed: order.status_index >= 3 },
        { name: '外送中', completed: order.status_index >= 4 },
        { name: '已送達', completed: order.status_index >= 5 }
      ]
    }
  }
  return http.get(`/order/status/${orderId}`)
}

/**
 * 查詢訂單更新（輪詢用）
 * @param {number} orderId - 訂單 ID
 * @returns {Promise<object>}
 */
export async function getOrderUpdates(orderId) {
  if (USE_MOCK) {
    return getOrderStatus(orderId)
  }
  return http.get(`/order/updates/${orderId}`)
}

export default {
  createOrder,
  payOrder,
  getOrderStatus,
  getOrderUpdates
}

