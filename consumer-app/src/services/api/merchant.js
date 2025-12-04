/**
 * 商家後台相關 API（預留）
 */
import http from '../http.js'

/**
 * 取得待接訂單
 * @returns {Promise<object>}
 */
export function getPendingOrders() {
  return http.get('/merchant/orders/pending')
}

/**
 * 接單
 * @param {number} orderId - 訂單 ID
 * @returns {Promise<object>}
 */
export function acceptOrder(orderId) {
  return http.post('/merchant/orders/accept', {
    order_id: orderId
  })
}

/**
 * 拒單
 * @param {number} orderId - 訂單 ID
 * @param {string} reason - 拒絕原因
 * @returns {Promise<object>}
 */
export function rejectOrder(orderId, reason) {
  return http.post('/merchant/orders/reject', {
    order_id: orderId,
    reason
  })
}

/**
 * 取得商家菜單列表
 * @returns {Promise<object>}
 */
export function getMerchantMenu() {
  return http.get('/merchant/menu')
}

/**
 * 新增菜品
 * @param {object} menuItem - 菜品資料
 * @returns {Promise<object>}
 */
export function createMenuItem(menuItem) {
  return http.post('/merchant/menu/create', menuItem)
}

/**
 * 更新菜品
 * @param {object} menuItem - 菜品資料
 * @returns {Promise<object>}
 */
export function updateMenuItem(menuItem) {
  return http.post('/merchant/menu/update', menuItem)
}

/**
 * 刪除菜品
 * @param {number} menuId - 菜品 ID
 * @returns {Promise<object>}
 */
export function deleteMenuItem(menuId) {
  return http.post('/merchant/menu/delete', {
    menu_id: menuId
  })
}

export default {
  getPendingOrders,
  acceptOrder,
  rejectOrder,
  getMerchantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
}

