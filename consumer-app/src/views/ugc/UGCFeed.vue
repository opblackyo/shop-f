<script setup>
/**
 * UGC 短影音主頁
 * 全螢幕滑動影片流（類似 TikTok/Reels）
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UGCVideoItem from '@/components/ugc/UGCVideoItem.vue'
import { getFeed, likeVideo } from '@/services/api/ugc.js'

const router = useRouter()

// 狀態
const videos = ref([])
const currentIndex = ref(0)
const loading = ref(false)
const error = ref(null)
const cursor = ref(0)
const hasMore = ref(true)
const containerRef = ref(null)

// 載入影片列表
async function loadVideos() {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await getFeed(cursor.value)
    videos.value = [...videos.value, ...response.videos]
    cursor.value = response.next_cursor
    hasMore.value = response.next_cursor !== null
  } catch (err) {
    error.value = err.message || '載入失敗'
  } finally {
    loading.value = false
  }
}

// 處理按讚
async function handleLike({ videoId, liked, callback }) {
  try {
    const result = await likeVideo(videoId)
    // 更新影片列表中的資料
    const video = videos.value.find(v => v.video_id === videoId)
    if (video) {
      video.likes = result.total_likes
      video.isLiked = result.liked
    }
    callback(result)
  } catch (err) {
    console.error('按讚失敗:', err)
    // 回滾 UI
    callback(null)
  }
}

// 處理滾動事件 - 偵測當前影片
function handleScroll() {
  if (!containerRef.value) return
  
  const container = containerRef.value
  const scrollTop = container.scrollTop
  const itemHeight = container.clientHeight
  const newIndex = Math.round(scrollTop / itemHeight)
  
  if (newIndex !== currentIndex.value) {
    currentIndex.value = newIndex
    
    // 預載更多影片
    if (newIndex >= videos.value.length - 2 && hasMore.value) {
      loadVideos()
    }
  }
}

// 返回上一頁
function goBack() {
  router.back()
}

onMounted(() => {
  loadVideos()
})
</script>

<template>
  <div class="ugc-feed">
    <!-- 返回按鈕 -->
    <button class="back-btn" @click="goBack">
      ← 返回
    </button>
    
    <!-- 影片列表容器 -->
    <div 
      ref="containerRef"
      class="video-container"
      @scroll="handleScroll"
    >
      <div 
        v-for="(video, index) in videos" 
        :key="video.video_id"
        class="video-snap-item"
      >
        <UGCVideoItem
          :video="video"
          :is-active="index === currentIndex"
          @like="handleLike"
        />
      </div>
      
      <!-- 載入中 -->
      <div v-if="loading && videos.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>載入中...</p>
      </div>
      
      <!-- 錯誤狀態 -->
      <div v-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadVideos">重試</button>
      </div>
      
      <!-- 空狀態 -->
      <div v-if="!loading && videos.length === 0 && !error" class="empty-state">
        <p>🎬 目前沒有影片</p>
      </div>
      
      <!-- 底部載入更多 -->
      <div v-if="loading && videos.length > 0" class="load-more">
        <div class="spinner small"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ugc-feed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 1000;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* Scroll Snap 容器 */
.video-container {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* 隱藏滾動條 */
.video-container::-webkit-scrollbar {
  display: none;
}

.video-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 每個影片項目佔滿一個畫面 */
.video-snap-item {
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

/* 載入中狀態 */
.loading-state,
.error-state,
.empty-state {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.small {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

.error-state button:hover {
  background: #c0392b;
}

.load-more {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

