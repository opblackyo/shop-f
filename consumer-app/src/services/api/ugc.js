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
      message: !wasLiked ? '已按讚' : '已取消按讚',
      likes_count: video.likes
    }
  }
  
  // API: POST /videos/{video_id}/like
  return http.post(`/videos/${videoId}/like`)
}

/**
 * 取得影片評論列表
 * @param {number} videoId - 影片 ID
 * @returns {Promise<{video_id: number, comments: Array}>}
 */
export async function getComments(videoId) {
  if (USE_MOCK) {
    await mockDelay()
    
    // Mock 評論資料
    const mockComments = [
      { comment_id: 1, user: 'Alice', content: '好讚的影片！', created_at: '2025-12-09T15:40:00' },
      { comment_id: 2, user: 'Bob', content: '看起來超好吃', created_at: '2025-12-10T10:20:00' },
      { comment_id: 3, user: 'Cindy', content: '下次也要去試試', created_at: '2025-12-11T08:15:00' }
    ]
    
    return {
      video_id: videoId,
      comments: mockComments
    }
  }
  
  // API: GET /videos/{video_id}/comments
  return http.get(`/videos/${videoId}/comments`)
}

/**
 * 新增評論
 * @param {number} videoId - 影片 ID
 * @param {string} content - 評論內容
 * @returns {Promise<{message: string, comment_id: number}>}
 */
export async function addComment(videoId, content) {
  if (USE_MOCK) {
    await mockDelay(300)
    
    if (!content || content.trim() === '') {
      throw new Error('評論內容不可為空')
    }
    
    return {
      message: '評論新增成功',
      comment_id: Math.floor(Math.random() * 1000) + 10
    }
  }
  
  // API: POST /videos/{video_id}/comments
  return http.post(`/videos/${videoId}/comments`, { content })
}

/**
 * 上傳影片
 * @param {File} file - 影片檔案（僅支援 .mp4）
 * @param {function} onProgress - 上傳進度回調
 * @returns {Promise<{message: string, video_url: string}>}
 */
export async function uploadVideo(file, onProgress = null) {
  if (USE_MOCK) {
    // 驗證檔案類型
    if (!file.name.endsWith('.mp4')) {
      throw new Error('檔案格式錯誤，僅支援 mp4')
    }
    
    // 驗證檔案大小（假設限制 100MB）
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('檔案大小超過限制')
    }
    
    // 模擬上傳進度
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await mockDelay(100)
        onProgress(i)
      }
    } else {
      await mockDelay(1000)
    }
    
    return {
      message: '影片上傳成功',
      video_url: `http://127.0.0.1:2323/static/videos/mock_${Date.now()}.mp4`
    }
  }
  
  // API: POST /videos/upload (multipart/form-data)
  const formData = new FormData()
  formData.append('file', file)
  
  return http.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgress ? (e) => {
      const percent = Math.round((e.loaded / e.total) * 100)
      onProgress(percent)
    } : undefined
  })
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
  getComments,
  addComment,
  uploadVideo,
  isVideoLiked
}

