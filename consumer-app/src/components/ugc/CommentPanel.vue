<script setup>
/**
 * UGC 評論面板元件
 * 從底部滑入的評論列表
 */
import { ref, watch, onMounted } from 'vue'
import { getComments, addComment } from '@/services/api/ugc.js'

const props = defineProps({
  videoId: {
    type: Number,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'comment-added'])

// 狀態
const comments = ref([])
const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const newComment = ref('')
const inputRef = ref(null)

// 載入評論
async function loadComments() {
  if (!props.videoId) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await getComments(props.videoId)
    comments.value = response.comments || []
  } catch (err) {
    error.value = err.message || '載入評論失敗'
  } finally {
    loading.value = false
  }
}

// 新增評論
async function submitComment() {
  if (!newComment.value.trim() || submitting.value) return
  
  submitting.value = true
  
  try {
    const result = await addComment(props.videoId, newComment.value.trim())
    
    // 新增到評論列表最前面
    comments.value.unshift({
      comment_id: result.comment_id,
      user: '我',
      content: newComment.value.trim(),
      created_at: new Date().toISOString()
    })
    
    newComment.value = ''
    emit('comment-added')
  } catch (err) {
    alert(err.message || '評論失敗')
  } finally {
    submitting.value = false
  }
}

// 格式化時間
function formatTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '剛剛'
  if (minutes < 60) return `${minutes} 分鐘前`
  if (hours < 24) return `${hours} 小時前`
  if (days < 7) return `${days} 天前`
  
  return date.toLocaleDateString('zh-TW')
}

// 關閉面板
function close() {
  emit('close')
}

// 阻止點擊事件冒泡（避免關閉面板）
function stopPropagation(e) {
  e.stopPropagation()
}

// 監聽 visible 變化
watch(() => props.visible, (visible) => {
  if (visible) {
    loadComments()
  }
})

// 如果一開始就是 visible，載入評論
onMounted(() => {
  if (props.visible) {
    loadComments()
  }
})
</script>

<template>
  <Transition name="slide-up">
    <div v-if="visible" class="comment-overlay" @click="close">
      <div class="comment-panel" @click="stopPropagation">
        <!-- 頭部 -->
        <div class="panel-header">
          <span class="comment-count">{{ comments.length }} 則評論</span>
          <button class="close-btn" @click="close">✕</button>
        </div>
        
        <!-- 評論列表 -->
        <div class="comment-list">
          <!-- 載入中 -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
          </div>
          
          <!-- 錯誤 -->
          <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button @click="loadComments">重試</button>
          </div>
          
          <!-- 空狀態 -->
          <div v-else-if="comments.length === 0" class="empty-state">
            <p>🗨️ 還沒有評論</p>
            <p class="sub">成為第一個留言的人！</p>
          </div>
          
          <!-- 評論項目 -->
          <div 
            v-else
            v-for="comment in comments" 
            :key="comment.comment_id"
            class="comment-item"
          >
            <div class="avatar">{{ comment.user.charAt(0) }}</div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="username">{{ comment.user }}</span>
                <span class="time">{{ formatTime(comment.created_at) }}</span>
              </div>
              <p class="text">{{ comment.content }}</p>
            </div>
          </div>
        </div>
        
        <!-- 輸入區 -->
        <div class="input-area">
          <input
            ref="inputRef"
            v-model="newComment"
            type="text"
            placeholder="寫下你的評論..."
            class="comment-input"
            :disabled="submitting"
            @keyup.enter="submitComment"
          />
          <button 
            class="send-btn" 
            :disabled="!newComment.trim() || submitting"
            @click="submitComment"
          >
            {{ submitting ? '...' : '發送' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.comment-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.comment-panel {
  width: 100%;
  max-height: 70vh;
  background: white;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 頭部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.comment-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
}

/* 評論列表 */
.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  min-height: 200px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.text {
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

/* 狀態 */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 32px;
  color: #666;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #ff6b35;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state .sub {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.error-state button {
  margin-top: 8px;
  padding: 6px 16px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
}

/* 輸入區 */
.input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #eee;
  background: #fafafa;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}

.comment-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.comment-input:focus {
  border-color: #ff6b35;
}

.send-btn {
  padding: 10px 20px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 動畫 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-active .comment-panel,
.slide-up-leave-active .comment-panel {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .comment-panel,
.slide-up-leave-to .comment-panel {
  transform: translateY(100%);
}
</style>
