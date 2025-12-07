/**
 * UGC 短影音 API 模組
 * 包含 Mock 模式用於無後端測試
 */
import http from '../http.js'
import { USE_MOCK, mockDelay } from './config.js'

// Mock 影片資料
const mockVideos = [
  {
    video_id: 1,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: '美食達人Peter',
    likes: 200,
    comments: 32,
    description: '超讚的雞胸便當！健康又美味 🍱'
  },
  {
    video_id: 2,
    url: 'https://www.w3schools.com/html/movie.mp4',
    author: '吃貨小明',
    likes: 158,
    comments: 24,
    description: '這家咖哩飯真的絕了！推薦給大家 🍛'
  },
  {
    video_id: 3,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: '外送小幫手',
    likes: 320,
    comments: 56,
    description: '每日一推薦：味噌湯超濃郁 🍜'
  },
  {
    video_id: 4,
    url: 'https://www.w3schools.com/html/movie.mp4',
    author: '健康飲食家',
    likes: 89,
    comments: 15,
    description: '低卡高蛋白餐點分享 💪'
  },
  {
    video_id: 5,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: '街頭美食獵人',
    likes: 445,
    comments: 78,
    description: '隱藏版小吃大公開！🔥'
  }
]

// Mock 狀態追蹤（用於追蹤按讚狀態）
const likedVideos = new Set()

/**
 * 取得影片 Feed 列表
 * @param {number} cursor - 分頁游標
 * @returns {Promise<{videos: Array, next_cursor: number}>}
 */
export async function getFeed(cursor = 0) {
  if (USE_MOCK) {
    await mockDelay()

    const pageSize = 5
    const startIndex = cursor * pageSize
    const videos = mockVideos.map(v => ({
      ...v,
      isLiked: likedVideos.has(v.video_id)
    }))
    
    return {
      videos: videos.slice(startIndex, startIndex + pageSize),
      next_cursor: startIndex + pageSize < mockVideos.length ? cursor + 1 : null
    }
  }
  
  return http.get(`/ugc/feed?cursor=${cursor}`)
}

/**
 * 對影片按讚/取消按讚
 * @param {number} videoId - 影片 ID
 * @returns {Promise<{success: boolean, liked: boolean, total_likes: number}>}
 */
export async function likeVideo(videoId) {
  if (USE_MOCK) {
    await mockDelay(200)

    const video = mockVideos.find(v => v.video_id === videoId)
    if (!video) {
      throw new Error('影片不存在')
    }
    
    // 切換按讚狀態
    const wasLiked = likedVideos.has(videoId)
    if (wasLiked) {
      likedVideos.delete(videoId)
      video.likes -= 1
    } else {
      likedVideos.add(videoId)
      video.likes += 1
    }
    
    return {
      success: true,
      liked: !wasLiked,
      total_likes: video.likes
    }
  }
  
  return http.post('/ugc/like', { video_id: videoId })
}

/**
 * 檢查影片是否已按讚（Mock 用）
 * @param {number} videoId - 影片 ID
 * @returns {boolean}
 */
export function isVideoLiked(videoId) {
  return likedVideos.has(videoId)
}

export default {
  getFeed,
  likeVideo,
  isVideoLiked
}

