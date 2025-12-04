/**
 * 通用 HTTP 請求封裝
 * 自動附加 JWT Token，統一錯誤處理
 */

const BASE_URL = 'http://127.0.0.1:2323/api'

// 獲取 token 的輔助函數（避免循環依賴）
function getToken() {
  // 從 localStorage 獲取 token，auth store 會同步更新
  return localStorage.getItem('auth_token')
}

/**
 * 基礎請求方法
 * @param {string} endpoint - API 路徑
 * @param {object} options - fetch 選項
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // 自動附加 JWT Token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    
    // 處理非 JSON 回應
    const contentType = response.headers.get('content-type')
    let data
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      // 統一錯誤格式
      const error = new Error(data.error || data.message || '請求失敗')
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  } catch (error) {
    // 處理網路錯誤
    if (error.name === 'TypeError') {
      const networkError = new Error('網路連線失敗，請檢查網路狀態')
      networkError.status = 0
      throw networkError
    }
    throw error
  }
}

/**
 * GET 請求
 */
export function get(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'GET' })
}

/**
 * POST 請求
 */
export function post(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body)
  })
}

/**
 * PUT 請求
 */
export function put(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body)
  })
}

/**
 * DELETE 請求
 */
export function del(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'DELETE' })
}

export default {
  get,
  post,
  put,
  del,
  request
}

