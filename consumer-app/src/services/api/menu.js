/**
 * 菜單相關 API
 */
import http from '../http.js'
import { USE_MOCK, mockDelay } from './config.js'

// Mock 菜單資料（符合 RestaurantPage 期望的結構：categories[].category_name, categories[].items）
const mockMenus = {
  1: {
    restaurant_id: 1,
    categories: [
      {
        category_name: '便當類',
        items: [
          { id: 101, name: '雞胸便當', description: '低脂高蛋白，健身首選', price: 85, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
          { id: 102, name: '排骨便當', description: '香酥排骨，配菜豐富', price: 90, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200' },
          { id: 103, name: '雞腿便當', description: '多汁雞腿，外酥內嫩', price: 95, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200' }
        ]
      },
      {
        category_name: '湯品',
        items: [
          { id: 201, name: '味噌湯', description: '日式風味，溫暖身心', price: 25, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200' },
          { id: 202, name: '玉米濃湯', description: '香甜濃郁', price: 30, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=200' }
        ]
      },
      {
        category_name: '飲料',
        items: [
          { id: 301, name: '紅茶', description: '古早味紅茶', price: 20, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200' },
          { id: 302, name: '綠茶', description: '清香解膩', price: 20, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=200' }
        ]
      }
    ]
  },
  2: {
    restaurant_id: 2,
    categories: [
      {
        category_name: '咖哩飯',
        items: [
          { id: 401, name: '日式咖哩飯', description: '濃郁咖哩醬，配白飯', price: 120, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=200' },
          { id: 402, name: '豬排咖哩飯', description: '酥脆豬排搭配咖哩', price: 150, image: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=200' }
        ]
      },
      {
        category_name: '配菜',
        items: [
          { id: 501, name: '炸蝦', description: '酥脆炸蝦兩尾', price: 60, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200' }
        ]
      }
    ]
  }
}

/**
 * 取得餐廳菜單
 * @param {number|string} restaurantId - 餐廳 ID
 * @returns {Promise<object>}
 */
export async function getMenu(restaurantId) {
  if (USE_MOCK) {
    await mockDelay()
    const menu = mockMenus[restaurantId]
    if (!menu) {
      // 如果沒有該餐廳的菜單，返回空的預設結構
      return {
        restaurant_id: restaurantId,
        categories: [],
        items: []
      }
    }
    return menu
  }
  return http.get(`/menu/${restaurantId}`)
}

export default {
  getMenu
}

