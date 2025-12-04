/**
 * 餐廳相關 API
 */
import http from '../http.js'

/**
 * 取得所有餐廳列表
 * @returns {Promise<Array>}
 */
export function getRestaurants() {
  return http.get('/restaurants')
}

/**
 * 取得指定餐廳資訊
 * @param {number|string} id - 餐廳 ID
 * @returns {Promise<object>}
 */
export function getRestaurant(id) {
  return http.get(`/restaurants/${id}`)
}

export default {
  getRestaurants,
  getRestaurant
}

