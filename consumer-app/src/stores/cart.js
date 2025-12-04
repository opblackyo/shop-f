/**
 * Cart Store
 * 管理購物車狀態
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as cartApi from '@/services/api/cart.js'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const deliveryFee = ref(0)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => sum + item.subtotal, 0)
  })

  const total = computed(() => {
    return subtotal.value + deliveryFee.value
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  async function fetchCart() {
    loading.value = true
    error.value = null
    try {
      const data = await cartApi.getCart()
      items.value = data.items || []
      deliveryFee.value = data.delivery_fee || 0
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addItem(menuId, quantity = 1) {
    loading.value = true
    error.value = null
    try {
      await cartApi.addToCart(menuId, quantity)
      // 重新獲取購物車以保持同步
      await fetchCart()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateItem(cartItemId, quantity) {
    loading.value = true
    error.value = null
    try {
      await cartApi.updateCartItem(cartItemId, quantity)
      await fetchCart()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeItem(cartItemId) {
    loading.value = true
    error.value = null
    try {
      await cartApi.deleteCartItem(cartItemId)
      await fetchCart()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCart() {
    items.value = []
    deliveryFee.value = 0
  }

  return {
    // State
    items,
    deliveryFee,
    loading,
    error,
    // Getters
    itemCount,
    subtotal,
    total,
    isEmpty,
    // Actions
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart
  }
})

