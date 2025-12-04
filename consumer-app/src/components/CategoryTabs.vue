<script setup>
/**
 * 菜單分類標籤元件
 */
defineProps({
  categories: {
    type: Array,
    required: true
  },
  activeCategory: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])

function handleSelect(categoryName) {
  emit('select', categoryName)
}
</script>

<template>
  <div class="category-tabs">
    <button
      v-for="category in categories"
      :key="category.category_name"
      :class="['tab', { active: activeCategory === category.category_name }]"
      @click="handleSelect(category.category_name)"
    >
      {{ category.category_name }}
    </button>
  </div>
</template>

<style scoped>
.category-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 8px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab:hover {
  border-color: #3498db;
  color: #3498db;
}

.tab.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
}
</style>

