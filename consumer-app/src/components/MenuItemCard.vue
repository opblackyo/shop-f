<script setup>
/**
 * 菜單商品卡片元件
 */
defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

function handleAddToCart() {
  emit('add-to-cart')
}
</script>

<template>
  <div class="menu-item-card">
    <div class="item-image">
      <img 
        v-if="item.image" 
        :src="item.image" 
        :alt="item.name"
      />
      <div v-else class="placeholder-image">🍽️</div>
    </div>
    <div class="item-info">
      <h3 class="item-name">{{ item.name }}</h3>
      <p class="item-price">${{ item.price }}</p>
      <span 
        v-if="!item.is_available" 
        class="unavailable-badge"
      >
        暫時缺貨
      </span>
    </div>
    <button 
      class="add-btn"
      :disabled="!item.is_available"
      @click="handleAddToCart"
    >
      <span v-if="item.is_available">+ 加入購物車</span>
      <span v-else>無法購買</span>
    </button>
  </div>
</template>

<style scoped>
.menu-item-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.menu-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
  background: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
}

.item-info {
  padding: 12px;
}

.item-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.item-price {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.unavailable-badge {
  display: inline-block;
  margin-top: 8px;
  padding: 2px 8px;
  background: #f0f0f0;
  color: #999;
  font-size: 12px;
  border-radius: 4px;
}

.add-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: #3498db;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover:not(:disabled) {
  background: #2980b9;
}

.add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

