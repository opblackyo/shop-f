# Week 3 — API 規劃文件（前後端使用）

此文件包含四大模組：

1. AI 智能介面（Chat UI + 菜單產生）
2. 商家儀表板（Dashboard）
3. UGC 短影音（TikTok/Reels）
4. 外送員端（Rider）

所有 API 使用 REST 標準格式，除非另有標示支援 Streaming。

---

# 1️⃣ AI 智能介面（Chat + Meal Plan Recommendation）

## 1.1 聊天 API（支援 Streaming）

### **POST /api/ai/chat**

AI 回應可為 **一般 JSON（非串流）** 或 **推薦菜單 JSON**，並支援 Streaming chunk。

### Request

```json
{
  "messages": [
    { "role": "user", "content": "幫我生成一週健康菜單" }
  ],
  "stream": true}

```

### Response（Streaming chunk 範例）

```
data: {"role":"assistant","content":"正在為您生成菜單..."}
data: {"role":"assistant","content":"周一早餐：..." }
data: {"role":"assistant","content":"[DONE]"}

```

---

## 1.2 AI 一週菜單 Schema（前端解析用）

AI 回傳的菜單格式固定如下：

```json
{
  "week_plan": [
    {
      "day": "Mon",
      "meals": [
        {
          "menu_id": 101,
          "name": "雞胸便當",
          "quantity": 1
        },
        {
          "menu_id": 203,
          "name": "味噌湯",
          "quantity": 1
        }
      ]
    },
    {
      "day": "Tue",
      "meals": []
    }
  ]
}

```

---

## 1.3 一鍵下單（批量加入購物車）

### **POST /api/cart/batch-add**

### Request

```json
{
  "items": [
    { "menu_id": 101, "quantity": 1 },
    { "menu_id": 203, "quantity": 1 }
  ]
}

```

### Response

```json
{
  "success": true,
  "count": 2
}

```

---

# 2️⃣ 商家儀表板 Dashboard API

## 2.1 營收趨勢

### **GET /api/dashboard/revenue**

Query Params：

| 參數 | 說明 | 範例 |
| --- | --- | --- |
| range | 查詢範圍 | `7d`, `30d`, `90d` |

### Response

```json
{
  "labels": ["2025-01-01", "2025-01-02"],
  "values": [1200, 900],
  "currency": "TWD"
}

```

---

## 2.2 熱銷商品排名

### **GET /api/dashboard/top-products**

### Response

```json
{
  "items": [
    {
      "menu_id": 10,
      "name": "雞胸便當",
      "count": 122
    },
    {
      "menu_id": 24,
      "name": "咖哩飯",
      "count": 98
    }
  ]
}

```

空狀態例子：

```json
{
  "items": []
}

```

---

# 3️⃣ UGC 短影音播放器（TikTok/Reels 流）

## 3.1 影片流 Feed

### **GET /api/ugc/feed**

Query Params：

| 參數 | 說明 |
| --- | --- |
| cursor | 用於分頁 |

### Response

```json
{
  "videos": [
    {
      "video_id": 1,
      "url": "https://cdn.example/video1.mp4",
      "author": "peter",
      "likes": 200,
      "comments": 32,
      "description": "好吃推薦！"
    }
  ],
  "next_cursor": 1
}

```

---

## 3.2 點擊愛心（Like）

### **POST /api/ugc/like**

### Request

```json
{
  "video_id": 1
}

```

### Response

```json
{
  "success": true,
  "liked": true,
  "total_likes": 201
}

```

---

# 4️⃣ 外送員端 API（Rider App）

## 4.1 訂單池

### **GET /api/rider/orders/pending**

### Response

```json
{
  "orders": [
    {
      "order_id": 88,
      "restaurant": "八方雲集",
      "restaurant_address": "台北市中正區 A 路 88 號",
      "customer_address": "台北市大安區 B 路 101 號",
      "distance_km": 1.8
    }
  ]
}

```

---

## 4.2 搶單

### **POST /api/rider/orders/claim**

### Request

```json
{
  "order_id": 88
}

```

### Response

```json
{
  "success": true,
  "order_id": 88,
  "status": "assigned"
}

```

---

## 4.3 查詢配送座標（地圖用）

### **GET /api/rider/orders/{order_id}/coords**

### Response

```json
{
  "restaurant": { "lat": 25.033, "lng": 121.565 },
  "customer": { "lat": 25.045, "lng": 121.523 }
}

```

---

# 📌 第三週 API 規劃 — 總結表

| 模組 | API | 說明 |
| --- | --- | --- |
| AI | POST /api/ai/chat | AI 聊天 + Streaming |
| AI | POST /api/cart/batch-add | 批量加入購物車 |
| Dashboard | GET /api/dashboard/revenue | 營收折線圖 |
| Dashboard | GET /api/dashboard/top-products | 熱銷占比圖 |
| UGC | GET /api/ugc/feed | 短影音流 |
| UGC | POST /api/ugc/like | 點讚 |
| Rider | GET /api/rider/orders/pending | 訂單池 |
| Rider | POST /api/rider/orders/claim | 搶單 |
| Rider | GET /api/rider/orders/{id}/coords | 配送地圖座標 |

以下四大模組，每個都拆成：

1. **前端需求（Vue）**
2. **後端 API 規劃**
3. **JSON 樣式（前端串接必用）**

---

# 🧠 1. AI 智能介面（Chat UI + Meal Plan）

## **前端需求（Vue）**

- 實作流式回應（打字機效果）
- 預留 SSE / Websocket / chunk fetch 的 Streaming UI
- 解析 AI 回傳的菜單 JSON
- 動態渲染「一鍵下單」「檢視菜單」按鈕
- 一鍵下單 = 批量呼叫 `/api/cart/add`

## **後端 API**

### **(1) 聊天請求 API（支援 streaming）**

```
POST /api/ai/chat
body:
{
  "messages": [
    { "role": "user", "content": "幫我產生一週健康菜單" }
  ],
  "stream": true
}

```

### **(2) AI 菜單 Schema（前端解析用）**

AI 回傳需遵守：

```json
{
  "week_plan": [
    {
      "day": "Mon",
      "meals": [
        { "menu_id": 101, "name": "雞胸便當" },
        { "menu_id": 204, "name": "牛肉湯" }
      ]
    }
  ]
}

```

---

# 📊 2. 商家數據儀表板（Dashboard）

## **前端需求（Vue）**

- 兩張圖（Recharts / Chart.js）
    - 營收折線圖
    - 商品熱銷占比
- 設計「空狀態」畫面
    - 例如顯示「尚無資料」

## **後端 API**

# Week 3 — API 規劃文件（前後端使用）

此文件包含四大模組：

1. AI 智能介面（Chat UI + 菜單產生）
2. 商家儀表板（Dashboard）
3. UGC 短影音（TikTok/Reels）
4. 外送員端（Rider）

所有 API 使用 REST 標準格式，除非另有標示支援 Streaming。

---

# 1️⃣ AI 智能介面（Chat + Meal Plan Recommendation）

## 1.1 聊天 API（支援 Streaming）

### **POST /api/ai/chat**

AI 回應可為 **一般 JSON（非串流）** 或 **推薦菜單 JSON**，並支援 Streaming chunk。

### Request

```json
{
  "messages": [
    { "role": "user", "content": "幫我生成一週健康菜單" }
  ],
  "stream": true}

```

### Response（Streaming chunk 範例）

```
data: {"role":"assistant","content":"正在為您生成菜單..."}
data: {"role":"assistant","content":"周一早餐：..." }
data: {"role":"assistant","content":"[DONE]"}

```

---

## 1.2 AI 一週菜單 Schema（前端解析用）

AI 回傳的菜單格式固定如下：

```json
{
  "week_plan": [
    {
      "day": "Mon",
      "meals": [
        {
          "menu_id": 101,
          "name": "雞胸便當",
          "quantity": 1
        },
        {
          "menu_id": 203,
          "name": "味噌湯",
          "quantity": 1
        }
      ]
    },
    {
      "day": "Tue",
      "meals": []
    }
  ]
}

```

---

## 1.3 一鍵下單（批量加入購物車）

### **POST /api/cart/batch-add**

### Request

```json
{
  "items": [
    { "menu_id": 101, "quantity": 1 },
    { "menu_id": 203, "quantity": 1 }
  ]
}

```

### Response

```json
{
  "success": true,
  "count": 2
}

```

---

# 2️⃣ 商家儀表板 Dashboard API

## 2.1 營收趨勢

### **GET /api/dashboard/revenue**

Query Params：

| 參數 | 說明 | 範例 |
| --- | --- | --- |
| range | 查詢範圍 | `7d`, `30d`, `90d` |

### Response

```json
{
  "labels": ["2025-01-01", "2025-01-02"],
  "values": [1200, 900],
  "currency": "TWD"
}

```

---

## 2.2 熱銷商品排名

### **GET /api/dashboard/top-products**

### Response

```json
{
  "items": [
    {
      "menu_id": 10,
      "name": "雞胸便當",
      "count": 122
    },
    {
      "menu_id": 24,
      "name": "咖哩飯",
      "count": 98
    }
  ]
}

```

空狀態例子：

```json
{
  "items": []
}

```

---

# 3️⃣ UGC 短影音播放器（TikTok/Reels 流）

## 3.1 影片流 Feed

### **GET /api/ugc/feed**

Query Params：

| 參數 | 說明 |
| --- | --- |
| cursor | 用於分頁 |

### Response

```json
{
  "videos": [
    {
      "video_id": 1,
      "url": "https://cdn.example/video1.mp4",
      "author": "peter",
      "likes": 200,
      "comments": 32,
      "description": "好吃推薦！"
    }
  ],
  "next_cursor": 1
}

```

---

## 3.2 點擊愛心（Like）

### **POST /api/ugc/like**

### Request

```json
{
  "video_id": 1
}

```

### Response

```json
{
  "success": true,
  "liked": true,
  "total_likes": 201
}

```

---

# 4️⃣ 外送員端 API（Rider App）

## 4.1 訂單池

### **GET /api/rider/orders/pending**

### Response

```json
{
  "orders": [
    {
      "order_id": 88,
      "restaurant": "八方雲集",
      "restaurant_address": "台北市中正區 A 路 88 號",
      "customer_address": "台北市大安區 B 路 101 號",
      "distance_km": 1.8
    }
  ]
}

```

---

## 4.2 搶單

### **POST /api/rider/orders/claim**

### Request

```json
{
  "order_id": 88
}

```

### Response

```json
{
  "success": true,
  "order_id": 88,
  "status": "assigned"
}

```

---

## 4.3 查詢配送座標（地圖用）

### **GET /api/rider/orders/{order_id}/coords**

### Response

```json
{
  "restaurant": { "lat": 25.033, "lng": 121.565 },
  "customer": { "lat": 25.045, "lng": 121.523 }
}

```

---

# 📌 第三週 API 規劃 — 總結表

| 模組 | API | 說明 |
| --- | --- | --- |
| AI | POST /api/ai/chat | AI 聊天 + Streaming |
| AI | POST /api/cart/batch-add | 批量加入購物車 |
| Dashboard | GET /api/dashboard/revenue | 營收折線圖 |
| Dashboard | GET /api/dashboard/top-products | 熱銷占比圖 |
| UGC | GET /api/ugc/feed | 短影音流 |
| UGC | POST /api/ugc/like | 點讚 |
| Rider | GET /api/rider/orders/pending | 訂單池 |
| Rider | POST /api/rider/orders/claim | 搶單 |
| Rider | GET /api/rider/orders/{id}/coords | 配送地圖座標 |

### **(1) 營收趨勢**

```
GET /api/dashboard/revenue?range=30d
response:
{
  "labels": ["2025-01-01", "2025-01-02"],
  "values": [1200, 900]
}

```

### **(2) 熱銷品項排名**

```
GET /api/dashboard/top-products
response:
{
  "items": [
    { "menu_id": 10, "name": "雞胸便當", "count": 122 },
    { "menu_id": 24, "name": "咖哩飯", "count": 98 }
  ]
}

```

---

# 🎬 3. UGC 短影音播放器（TikTok/Reels）

## **前端需求（Vue）**

- Scroll Snap 全螢幕影片流
- 一次只顯示一支影片
- Overlay（作者、愛心、評論數）
- 點擊愛心 → 心型動畫（加分項）

## **後端 API**

### **(1) 影片清單**

```
GET /api/ugc/feed?cursor=0
response:
{
  "videos": [
    {
      "video_id": 1,
      "url": "https://cdn.xxx/video1.mp4",
      "author": "peter",
      "likes": 200,
      "comments": 32
    }
  ]
}

```

### **(2) 點讚**

```
POST /api/ugc/like
body:
{
  "video_id": 1
}

```

---

# 🛵 4. 外送員端功能（Rider App）

## **前端需求（Vue）**

- 訂單池：卡片式列表
- 點「搶單」→ 改變後端狀態 → 重新渲染
- 配送地圖：
    - Google Maps iframe 或 Leaflet
    - 顯示餐廳/客戶兩點
    - 顯示直線連接（polyline 選配）

## **後端 API**

### **(1) 訂單池**

```
GET /api/rider/orders/pending
response:
{
  "orders": [
    {
      "order_id": 88,
      "restaurant": "八方雲集",
      "address": "台北市中正區...",
      "customer": "王小明"
    }
  ]
}

```

### **(2) 搶單**

```
POST /api/rider/orders/claim
body:
{
  "order_id": 88
}

```

### **(3) 查詢配送座標**

（你的後端可以返回假資料）

```
GET /api/rider/orders/88/coords
response:
{
  "restaurant": { "lat": 25.03, "lng": 121.56 },
  "customer": { "lat": 25.04, "lng": 121.52 }
}

```

# Week 3 — API 規劃文件（前後端使用）

此文件包含四大模組：

1. AI 智能介面（Chat UI + 菜單產生）
2. 商家儀表板（Dashboard）
3. UGC 短影音（TikTok/Reels）
4. 外送員端（Rider）

所有 API 使用 REST 標準格式，除非另有標示支援 Streaming。

---

# 1️⃣ AI 智能介面（Chat + Meal Plan Recommendation）

## 1.1 聊天 API（支援 Streaming）

### **POST /api/ai/chat**

AI 回應可為 **一般 JSON（非串流）** 或 **推薦菜單 JSON**，並支援 Streaming chunk。

### Request

```json
{
  "messages": [
    { "role": "user", "content": "幫我生成一週健康菜單" }
  ],
  "stream": true}

```

### Response（Streaming chunk 範例）

```
data: {"role":"assistant","content":"正在為您生成菜單..."}
data: {"role":"assistant","content":"周一早餐：..." }
data: {"role":"assistant","content":"[DONE]"}

```

---

## 1.2 AI 一週菜單 Schema（前端解析用）

AI 回傳的菜單格式固定如下：

```json
{
  "week_plan": [
    {
      "day": "Mon",
      "meals": [
        {
          "menu_id": 101,
          "name": "雞胸便當",
          "quantity": 1
        },
        {
          "menu_id": 203,
          "name": "味噌湯",
          "quantity": 1
        }
      ]
    },
    {
      "day": "Tue",
      "meals": []
    }
  ]
}

```

---

## 1.3 一鍵下單（批量加入購物車）

### **POST /api/cart/batch-add**

### Request

```json
{
  "items": [
    { "menu_id": 101, "quantity": 1 },
    { "menu_id": 203, "quantity": 1 }
  ]
}

```

### Response

```json
{
  "success": true,
  "count": 2
}

```

---

# 2️⃣ 商家儀表板 Dashboard API

## 2.1 營收趨勢

### **GET /api/dashboard/revenue**

Query Params：

| 參數 | 說明 | 範例 |
| --- | --- | --- |
| range | 查詢範圍 | `7d`, `30d`, `90d` |

### Response

```json
{
  "labels": ["2025-01-01", "2025-01-02"],
  "values": [1200, 900],
  "currency": "TWD"
}

```

---

## 2.2 熱銷商品排名

### **GET /api/dashboard/top-products**

### Response

```json
{
  "items": [
    {
      "menu_id": 10,
      "name": "雞胸便當",
      "count": 122
    },
    {
      "menu_id": 24,
      "name": "咖哩飯",
      "count": 98
    }
  ]
}

```

空狀態例子：

```json
{
  "items": []
}

```

---

# 3️⃣ UGC 短影音播放器（TikTok/Reels 流）

## 3.1 影片流 Feed

### **GET /api/ugc/feed**

Query Params：

| 參數 | 說明 |
| --- | --- |
| cursor | 用於分頁 |

### Response

```json
{
  "videos": [
    {
      "video_id": 1,
      "url": "https://cdn.example/video1.mp4",
      "author": "peter",
      "likes": 200,
      "comments": 32,
      "description": "好吃推薦！"
    }
  ],
  "next_cursor": 1
}

```

---

## 3.2 點擊愛心（Like）

### **POST /api/ugc/like**

### Request

```json
{
  "video_id": 1
}

```

### Response

```json
{
  "success": true,
  "liked": true,
  "total_likes": 201
}

```

---

# 4️⃣ 外送員端 API（Rider App）

## 4.1 訂單池

### **GET /api/rider/orders/pending**

### Response

```json
{
  "orders": [
    {
      "order_id": 88,
      "restaurant": "八方雲集",
      "restaurant_address": "台北市中正區 A 路 88 號",
      "customer_address": "台北市大安區 B 路 101 號",
      "distance_km": 1.8
    }
  ]
}

```

---

## 4.2 搶單

### **POST /api/rider/orders/claim**

### Request

```json
{
  "order_id": 88
}

```

### Response

```json
{
  "success": true,
  "order_id": 88,
  "status": "assigned"
}

```

---

## 4.3 查詢配送座標（地圖用）

### **GET /api/rider/orders/{order_id}/coords**

### Response

```json
{
  "restaurant": { "lat": 25.033, "lng": 121.565 },
  "customer": { "lat": 25.045, "lng": 121.523 }
}

```

---

# 📌 第三週 API 規劃 — 總結表

| 模組 | API | 說明 |
| --- | --- | --- |
| AI | POST /api/ai/chat | AI 聊天 + Streaming |
| AI | POST /api/cart/batch-add | 批量加入購物車 |
| Dashboard | GET /api/dashboard/revenue | 營收折線圖 |
| Dashboard | GET /api/dashboard/top-products | 熱銷占比圖 |
| UGC | GET /api/ugc/feed | 短影音流 |
| UGC | POST /api/ugc/like | 點讚 |
| Rider | GET /api/rider/orders/pending | 訂單池 |
| Rider | POST /api/rider/orders/claim | 搶單 |
| Rider | GET /api/rider/orders/{id}/coords | 配送地圖座標 |