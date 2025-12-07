/**
 * API 設定檔
 * 統一管理 Mock 模式開關
 */

// 全域 Mock 模式開關
// true = 使用 Mock 假資料（無需後端）
// false = 使用真實 API（需要後端）
export const USE_MOCK = true

// 模擬網路延遲時間（毫秒）
export const MOCK_DELAY = 300

/**
 * 模擬網路延遲
 * @param {number} ms - 延遲毫秒數
 */
export function mockDelay(ms = MOCK_DELAY) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

