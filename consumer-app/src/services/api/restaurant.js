/**
 * 餐廳相關 API
 */
import http from '../http.js'
import { USE_MOCK, mockDelay } from './config.js'

// Mock 餐廳資料
const mockRestaurants = [
  {
    id: 1,
    name: '好味道便當店',
    description: '專營健康便當，新鮮食材每日現做',
    address: '台北市大安區忠孝東路100號',
    phone: '02-1234-5678',
    rating: 4.5,
    delivery_fee: 30,
    min_order: 100,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
  },
  {
    id: 2,
    name: '幸福咖哩屋',
    description: '道地日式咖哩，濃郁香醇',
    address: '台北市信義區松仁路50號',
    phone: '02-2345-6789',
    rating: 4.3,
    delivery_fee: 40,
    min_order: 150,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400'
  }
]

/**
 * 取得所有餐廳列表
 * @returns {Promise<Array>}
 */
export async function getRestaurants() {
  if (USE_MOCK) {
    await mockDelay()
    return { restaurants: mockRestaurants }
  }
  return http.get('/restaurants')
}

/**
 * 取得指定餐廳資訊
 * @param {number|string} id - 餐廳 ID
 * @returns {Promise<object>}
 */
export async function getRestaurant(id) {
  if (USE_MOCK) {
    await mockDelay()
    const restaurant = mockRestaurants.find(r => r.id === Number(id))
    if (!restaurant) {
      throw new Error('餐廳不存在')
    }
    return restaurant
  }
  return http.get(`/restaurants/${id}`)
}

export default {
  getRestaurants,
  getRestaurant
}

