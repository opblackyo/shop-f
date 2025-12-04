/**
 * 購物車相關 API
 */
import http from '../http.js'

/**
 * 取得購物車內容
 * @returns {Promise<object>}
 */
export function getCart() {
  return http.get('/cart')
}

/**
 * 加入購物車
 * @param {number|string} menuId - 菜品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<object>}
 */
export function addToCart(menuId, quantity = 1) {
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
export function updateCartItem(cartItemId, quantity) {
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
export function deleteCartItem(cartItemId) {
  return http.post('/cart/delete', {
    cart_item_id: cartItemId
  })
}

export default {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem
}

