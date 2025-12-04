/**
 * 菜單相關 API
 */
import http from '../http.js'

/**
 * 取得餐廳菜單
 * @param {number|string} restaurantId - 餐廳 ID
 * @returns {Promise<object>}
 */
export function getMenu(restaurantId) {
  return http.get(`/menu/${restaurantId}`)
}

export default {
  getMenu
}

