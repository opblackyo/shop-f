<script setup>
/**
 * UGC 單支影片元件
 * 包含影片播放、Overlay 資訊、按讚功能、評論面板
 */
import { ref, watch, onMounted, onUnmounted } from 'vue'
import CommentPanel from './CommentPanel.vue'

const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['like'])

const videoRef = ref(null)
const isLiked = ref(props.video.isLiked || false)
const likeCount = ref(props.video.likes)
const commentCount = ref(props.video.comments)
const showHeartAnimation = ref(false)
const showComments = ref(false)

// 監聽 isActive 狀態控制播放/暫停
watch(() => props.isActive, (active) => {
  if (videoRef.value) {
    if (active) {
      videoRef.value.play().catch(() => {
        // 自動播放可能被瀏覽器阻止，靜默處理
      })
    } else {
      videoRef.value.pause()
    }
  }
})

// 處理按讚
async function handleLike() {
  // 觸發心型動畫
  showHeartAnimation.value = true
  setTimeout(() => {
    showHeartAnimation.value = false
  }, 800)
  
  // 樂觀更新 UI
  const wasLiked = isLiked.value
  isLiked.value = !wasLiked
  likeCount.value += wasLiked ? -1 : 1
  
  // 發送事件給父元件處理 API
  emit('like', {
    videoId: props.video.video_id,
    liked: isLiked.value,
    callback: (result) => {
      // 如果 API 回傳不同結果，更新 UI
      if (result) {
        isLiked.value = result.liked
        likeCount.value = result.total_likes
      }
    }
  })
}

// 格式化數字
function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '萬'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 打開評論面板
function openComments() {
  showComments.value = true
}

// 關閉評論面板
function closeComments() {
  showComments.value = false
}

// 評論新增後更新計數
function onCommentAdded() {
  commentCount.value += 1
}

// 元件掛載時若為 active 則播放
onMounted(() => {
  if (props.isActive && videoRef.value) {
    videoRef.value.play().catch(() => {})
  }
})

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
})
</script>

<template>
  <div class="ugc-video-item">
    <!-- 影片區域 -->
    <video
      ref="videoRef"
      :src="video.url"
      class="video-player"
      loop
      muted
      playsinline
      @click="handleLike"
    />
    
    <!-- 心型放大動畫 -->
    <Transition name="heart-pop">
      <div v-if="showHeartAnimation" class="heart-animation">
        ❤️
      </div>
    </Transition>
    
    <!-- 右側操作列 -->
    <div class="action-bar">
      <!-- 按讚按鈕 -->
      <button class="action-btn" :class="{ liked: isLiked }" @click.stop="handleLike">
        <span class="icon">{{ isLiked ? '❤️' : '🤍' }}</span>
        <span class="count">{{ formatNumber(likeCount) }}</span>
      </button>
      
      <!-- 評論按鈕 -->
      <button class="action-btn" @click.stop="openComments">
        <span class="icon">💬</span>
        <span class="count">{{ formatNumber(commentCount) }}</span>
      </button>
      
      <!-- 分享按鈕 -->
      <button class="action-btn">
        <span class="icon">↗️</span>
        <span class="count">分享</span>
      </button>
    </div>
    
    <!-- 底部資訊區 -->
    <div class="info-overlay">
      <div class="author">@{{ video.author }}</div>
      <div class="description">{{ video.description }}</div>
    </div>
    
    <!-- 評論面板 -->
    <CommentPanel
      :video-id="video.video_id"
      :visible="showComments"
      @close="closeComments"
      @comment-added="onCommentAdded"
    />
  </div>
</template>

<style scoped>
.ugc-video-item {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

/* 心型放大動畫 */
.heart-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 120px;
  pointer-events: none;
  z-index: 10;
}

.heart-pop-enter-active {
  animation: heart-pop 0.8s ease-out forwards;
}

.heart-pop-leave-active {
  animation: heart-fade 0.3s ease-out forwards;
}

@keyframes heart-pop {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

@keyframes heart-fade {
  to {
    opacity: 0;
  }
}

/* 右側操作列 */
.action-bar {
  position: absolute;
  right: 12px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 5;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s;
}

.action-btn:active {
  transform: scale(0.9);
}

.action-btn .icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.action-btn .count {
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.action-btn.liked .icon {
  animation: like-bounce 0.3s ease;
}

@keyframes like-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

/* 底部資訊區 */
.info-overlay {
  position: absolute;
  left: 0;
  right: 70px;
  bottom: 0;
  padding: 20px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: white;
  z-index: 4;
}

.author {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.description {
  font-size: 14px;
  line-height: 1.4;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

