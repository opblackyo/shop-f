<script setup>
/**
 * Toast 通知元件
 */
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)

onMounted(() => {
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('close'), 300)
  }, props.duration)
})

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠'
}
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" :class="['toast', type]">
      <span class="icon">{{ icons[type] }}</span>
      <span class="message">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.toast.success {
  background: #d4edda;
  color: #155724;
}

.toast.error {
  background: #f8d7da;
  color: #721c24;
}

.toast.info {
  background: #d1ecf1;
  color: #0c5460;
}

.toast.warning {
  background: #fff3cd;
  color: #856404;
}

.icon {
  font-size: 18px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>

