<script setup>
/**
 * 購物車項目元件
 */
defineProps({
  item: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-quantity', 'remove'])

function handleIncrease() {
  emit('update-quantity', 1)
}

function handleDecrease() {
  emit('update-quantity', -1)
}

function handleRemove() {
  emit('remove')
}
</script>

<template>
  <div class="cart-item" :class="{ loading }">
    <div class="item-image">
      <img v-if="item.image" :src="item.image" :alt="item.name" />
      <div v-else class="placeholder">🍽️</div>
    </div>
    
    <div class="item-details">
      <h4 class="item-name">{{ item.name }}</h4>
      <p class="item-price">${{ item.price }} / 份</p>
    </div>
    
    <div class="quantity-controls">
      <button 
        class="qty-btn"
        :disabled="loading || item.quantity <= 1"
        @click="handleDecrease"
      >
        −
      </button>
      <span class="quantity">{{ item.quantity }}</span>
      <button 
        class="qty-btn"
        :disabled="loading"
        @click="handleIncrease"
      >
        +
      </button>
    </div>
    
    <div class="item-subtotal">
      ${{ item.subtotal }}
    </div>
    
    <button 
      class="remove-btn"
      :disabled="loading"
      @click="handleRemove"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: opacity 0.2s;
}

.cart-item.loading {
  opacity: 0.6;
  pointer-events: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  font-size: 32px;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.item-price {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  border-color: #3498db;
  color: #3498db;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
}

.item-subtotal {
  min-width: 80px;
  text-align: right;
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #fee;
  color: #e74c3c;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-btn:hover:not(:disabled) {
  background: #fcc;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

