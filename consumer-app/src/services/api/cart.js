/**
 * 購物車相關 API
 */
import http from '../http.js'
import { USE_MOCK, mockDelay } from './config.js'

// Mock 購物車資料（模擬記憶體中的購物車）
let mockCartItems = []
let mockCartItemIdCounter = 1

// Mock 菜品資料（用於加入購物車時取得價格等資訊）
const mockMenuItemsMap = {
  101: { id: 101, name: '雞胸便當', price: 85 },
  102: { id: 102, name: '排骨便當', price: 90 },
  103: { id: 103, name: '雞腿便當', price: 95 },
  201: { id: 201, name: '味噌湯', price: 25 },
  202: { id: 202, name: '玉米濃湯', price: 30 },
  301: { id: 301, name: '紅茶', price: 20 },
  302: { id: 302, name: '綠茶', price: 20 },
  401: { id: 401, name: '日式咖哩飯', price: 120 },
  402: { id: 402, name: '豬排咖哩飯', price: 150 },
  501: { id: 501, name: '炸蝦', price: 60 }
}

/**
 * 計算購物車總額
 */
function calculateCartTotal() {
  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const delivery_fee = mockCartItems.length > 0 ? 30 : 0
  return {
    subtotal,
    delivery_fee,
    total: subtotal + delivery_fee
  }
}

/**
 * 取得購物車內容
 * @returns {Promise<object>}
 */
export async function getCart() {
  if (USE_MOCK) {
    await mockDelay()
    const totals = calculateCartTotal()
    return {
      items: mockCartItems,
      ...totals
    }
  }
  return http.get('/cart')
}

/**
 * 加入購物車
 * @param {number|string} menuId - 菜品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<object>}
 */
export async function addToCart(menuId, quantity = 1) {
  if (USE_MOCK) {
    await mockDelay()
    const menuItem = mockMenuItemsMap[menuId]
    if (!menuItem) {
      throw new Error('商品不存在')
    }

    // 檢查是否已在購物車中
    const existingItem = mockCartItems.find(item => item.menu_id === Number(menuId))
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      mockCartItems.push({
        cart_item_id: mockCartItemIdCounter++,
        menu_id: Number(menuId),
        name: menuItem.name,
        price: menuItem.price,
        quantity
      })
    }

    return { success: true, message: '已加入購物車' }
  }
  return http.post('/cart/add', {
    menu_id: menuId,
    quantity
  })
}

/**
 * 更新購物車商品數量
 * @param {number} cartItemId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<object>}
 */
export async function updateCartItem(cartItemId, quantity) {
  if (USE_MOCK) {
    await mockDelay()
    const item = mockCartItems.find(item => item.cart_item_id === cartItemId)
    if (!item) {
      throw new Error('購物車項目不存在')
    }
    item.quantity = quantity
    return { success: true }
  }
  return http.post('/cart/update', {
    cart_item_id: cartItemId,
    quantity
  })
}

/**
 * 移除購物車商品
 * @param {number} cartItemId - 購物車項目 ID
 * @returns {Promise<object>}
 */
export async function deleteCartItem(cartItemId) {
  if (USE_MOCK) {
    await mockDelay()
    const index = mockCartItems.findIndex(item => item.cart_item_id === cartItemId)
    if (index === -1) {
      throw new Error('購物車項目不存在')
    }
    mockCartItems.splice(index, 1)
    return { success: true }
  }
  return http.post('/cart/delete', {
    cart_item_id: cartItemId
  })
}

/**
 * 清空購物車（Mock 用）
 */
export function clearMockCart() {
  mockCartItems = []
}

export default {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearMockCart
}

