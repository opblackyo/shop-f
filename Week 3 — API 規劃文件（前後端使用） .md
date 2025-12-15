# Week 3 — API 規劃文件（前後端使用）

---

此文件包含四大模組：

1. **AI 智能介面**（Chat UI + 菜單產生）
2. **商家儀表板**（Dashboard）
3. **UGC 短影音**（Upload, Comments, Likes）
4. **外送員端**（Rider）

所有 API 使用 REST 標準格式。

---

# 1️⃣ AI 智能介面（Chat + Meal Plan Recommendation）

## 1.1 聊天 API（支援 Streaming）

### **POST /api/ai/chat**

AI 回應可為 **一般 JSON（非串流）** 或 **推薦菜單 JSON**，並支援 Streaming chunk。

### Request

JSON

`{
  "messages": [
    { "role": "user", "content": "幫我生成一週健康菜單" }
  ],
  "stream": true
}`

### Response（Streaming chunk 範例）

Plaintext

`data: {"role":"assistant","content":"正在為您生成菜單..."}
data: {"role":"assistant","content":"周一早餐：..." }
data: {"role":"assistant","content":"[DONE]"}`

---

## 1.2 AI 一週菜單 Schema（前端解析用）

AI 回傳的菜單格式固定如下：

JSON

`{
  "week_plan": [
    {
      "day": "Mon",
      "meals": [
        { "menu_id": 101, "name": "雞胸便當", "quantity": 1 },
        { "menu_id": 203, "name": "味噌湯", "quantity": 1 }
      ]
    },
    {
      "day": "Tue",
      "meals": []
    }
  ]
}`

---

## 1.3 一鍵下單（批量加入購物車）

### **POST /api/cart/batch-add**

### Request

JSON

`{
  "items": [
    { "menu_id": 101, "quantity": 1 },
    { "menu_id": 203, "quantity": 1 }
  ]
}`

### Response

JSON

`{
  "success": true,
  "count": 2
}`

---

# 2️⃣ 商家儀表板 Dashboard API

## 2.1 營收趨勢

### **GET /api/dashboard/revenue**

Query Params：

| **參數** | **說明** | **範例** |
| --- | --- | --- |
| range | 查詢範圍 | `7d`, `30d`, `90d` |

### Response

JSON

`{
  "labels": ["2025-01-01", "2025-01-02"],
  "values": [1200, 900],
  "currency": "TWD"
}`

---

## 2.2 熱銷商品排名

### **GET /api/dashboard/top-products**

### Response

JSON

`{
  "items": [
    { "menu_id": 10, "name": "雞胸便當", "count": 122 },
    { "menu_id": 24, "name": "咖哩飯", "count": 98 }
  ]
}`

空狀態例子：

JSON

`{ "items": [] }`

---

# 3️⃣ UGC 短影音服務 API

**基本資訊**

- **Base URL:** `http://127.0.0.1:2323/api`
- **Content-Type:** `multipart/form-data` (影片上傳) / `application/json` (其他 API)
- **Authentication:** Bearer Token (JWT)（評論與互動需登入）

## 3.1 影片上傳 (Video Upload)

### **POST /videos/upload**

**Description:** 上傳短影音檔案，驗證格式與大小。若未接 S3，則存入本地 `/static/videos/`。

### Request (multipart/form-data)

- `file`: 影片檔案（僅支援 .mp4）

### Response (200 OK)

JSON

`{
  "message": "影片上傳成功",
  "video_url": "http://127.0.0.1:2323/static/videos/abc123.mp4"
}`

### Error

JSON

`{ "error": "檔案格式錯誤，僅支援 mp4" }`

JSON

`{ "error": "檔案大小超過限制" }`

---

## 3.2 評論 (Comments)

### **(1) 取得影片評論**

### **GET /videos/{video_id}/comments**

### Response (200 OK)

JSON

`{
  "video_id": 101,
  "comments": [
    {
      "comment_id": 1,
      "user": "Alice",
      "content": "好讚的影片！",
      "created_at": "2025-12-09T15:40:00"
    }
  ]
}`

### **(2) 新增評論**

### **POST /videos/{video_id}/comments**

### Request (JSON)

JSON

`{ "content": "這部影片超好笑！" }`

### Response (200 OK)

JSON

`{ "message": "評論新增成功", "comment_id": 3 }`

### Error

JSON

`{ "error": "影片不存在" }`

JSON

`{ "error": "評論內容不可為空" }`

---

## 3.3 按讚 (Likes)

### **POST /videos/{video_id}/like**

**Description:** 切換按讚狀態 (Toggle Like)

### Response (200 OK)

JSON

`{ "message": "已按讚", "likes_count": 12 }`

### Error

JSON

`{ "error": "影片不存在" }`

JSON

`{ "error": "使用者未登入" }`

---

## 3.4 錯誤類型 (通用)

所有 API 錯誤統一回傳：

JSON

`{ "error": "錯誤訊息" }`

---

# 4️⃣ 外送員端 API（Rider App）

## 4.1 訂單池

### **GET /api/rider/orders/pending**

### Response

JSON

`{
  "orders": [
    {
      "order_id": 88,
      "restaurant": "八方雲集",
      "restaurant_address": "台北市中正區 A 路 88 號",
      "customer_address": "台北市大安區 B 路 101 號",
      "distance_km": 1.8
    }
  ]
}`

---

## 4.2 搶單

### **POST /api/rider/orders/claim**

### Request

JSON

`{ "order_id": 88 }`

### Response

JSON

`{
  "success": true,
  "order_id": 88,
  "status": "assigned"
}`

---

## 4.3 查詢配送座標（地圖用）

### **GET /api/rider/orders/{order_id}/coords**

### Response

JSON

`{
  "restaurant": { "lat": 25.033, "lng": 121.565 },
  "customer": { "lat": 25.045, "lng": 121.523 }
}`

---

# 📌 第三週 API 規劃 — 總結表 (Updated)

| **模組** | **API Method** | **Path** | **說明** |
| --- | --- | --- | --- |
| AI | POST | `/api/ai/chat` | AI 聊天 + Streaming |
| AI | POST | `/api/cart/batch-add` | 批量加入購物車 |
| Dashboard | GET | `/api/dashboard/revenue` | 營收折線圖 |
| Dashboard | GET | `/api/dashboard/top-products` | 熱銷占比圖 |
| **UGC** | **POST** | `/api/videos/upload` | **影片上傳 (Multipart)** |
| **UGC** | **GET** | `/api/videos/{id}/comments` | **取得評論** |
| **UGC** | **POST** | `/api/videos/{id}/comments` | **新增評論** |
| **UGC** | **POST** | `/api/videos/{id}/like` | **按讚 (Toggle)** |
| Rider | GET | `/api/rider/orders/pending` | 訂單池 |
| Rider | POST | `/api/rider/orders/claim` | 搶單 |
| Rider | GET | `/api/rider/orders/{id}/coords` | 配送地圖座標 |

*(註：UGC 模組 Base URL 為 `http://127.0.0.1:2323/api`，表單路徑省略 Base URL)*

---

# 📝 前後端實作細節補充

## **1. AI 智能介面**

- **前端 (Vue):** 需實作流式回應（打字機效果），預留 SSE 或 chunk fetch 機制。解析 AI 回傳的 `week_plan` JSON，動態渲染「一鍵下單」按鈕。
- **後端:** 串接 LLM，需設定 Stream response。

## **2. 商家數據儀表板**

- **前端 (Vue):** 使用 Recharts 或 Chart.js 繪製營收折線圖與熱銷圓餅圖/長條圖。需處理「空狀態」(Empty State)。
- **後端:** 聚合 SQL 查詢 (`GROUP BY date`, `GROUP BY product_id`)。

## **3. UGC 短影音**

- **前端 (Vue):**
    - **上傳頁面:** 實作檔案選取與 `FormData` 上傳，需顯示上傳進度條。
    - **播放器:** 需顯示影片、愛心按鈕（前端 Optimistic UI 預先亮燈）、評論列表區塊。
- **後端:**
    - 需處理 `multipart/form-data` 檔案接收。
    - 驗證檔案類型 (.mp4) 與大小限制。
    - 實作 JWT Middleware 驗證 `POST` 請求（評論與按讚）。

## **4. 外送員端**

- **前端 (Vue):** 訂單池採卡片式列表。地圖區塊使用 Google Maps iframe 或 Leaflet，繪製餐廳到客戶的路徑。
- **後端:** 需處理訂單狀態鎖定 (Locking)，避免多人同時搶同一張單。