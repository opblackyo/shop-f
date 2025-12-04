<script setup>
/**
 * 訂單狀態進度條元件
 */
import { computed } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStatus: {
    type: String,
    required: true
  }
})

const currentIndex = computed(() => {
  return props.steps.indexOf(props.currentStatus)
})

// 狀態對應的中文標籤
const statusLabels = {
  'Pending': '待處理',
  'Paid': '已付款',
  'Preparing': '準備中',
  'Delivering': '配送中',
  'Completed': '已完成'
}

function getLabel(status) {
  return statusLabels[status] || status
}

function getStepClass(index) {
  if (index < currentIndex.value) return 'completed'
  if (index === currentIndex.value) return 'active'
  return 'pending'
}
</script>

<template>
  <div class="status-stepper">
    <div 
      v-for="(step, index) in steps" 
      :key="step"
      class="step-wrapper"
    >
      <div :class="['step', getStepClass(index)]">
        <div class="step-circle">
          <span v-if="index < currentIndex">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-label">{{ getLabel(step) }}</div>
      </div>
      <div 
        v-if="index < steps.length - 1"
        :class="['step-line', { filled: index < currentIndex }]"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.status-stepper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 0;
}

.step-wrapper {
  display: flex;
  align-items: flex-start;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.step.pending .step-circle {
  background: #f0f0f0;
  color: #999;
}

.step.active .step-circle {
  background: #3498db;
  color: white;
  animation: pulse 2s infinite;
}

.step.completed .step-circle {
  background: #27ae60;
  color: white;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
  100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
}

.step-label {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

.step.active .step-label {
  color: #3498db;
  font-weight: 600;
}

.step.completed .step-label {
  color: #27ae60;
}

.step-line {
  width: 40px;
  height: 3px;
  background: #e0e0e0;
  margin-top: 18px;
  transition: background 0.3s;
}

.step-line.filled {
  background: #27ae60;
}
</style>

