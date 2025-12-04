/**
 * 訂單相關 API
 */
import http from '../http.js'

/**
 * 建立訂單
 * @param {string} paymentMethod - 付款方式
 * @param {string} remark - 備註
 * @returns {Promise<object>}
 */
export function createOrder(paymentMethod, remark = '') {
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
export function payOrder(orderId) {
  return http.post('/pay', {
    order_id: orderId
  })
}

/**
 * 取得訂單狀態
 * @param {number} orderId - 訂單 ID
 * @returns {Promise<object>}
 */
export function getOrderStatus(orderId) {
  return http.get(`/order/status/${orderId}`)
}

/**
 * 查詢訂單更新（輪詢用）
 * @param {number} orderId - 訂單 ID
 * @returns {Promise<object>}
 */
export function getOrderUpdates(orderId) {
  return http.get(`/order/updates/${orderId}`)
}

export default {
  createOrder,
  payOrder,
  getOrderStatus,
  getOrderUpdates
}

