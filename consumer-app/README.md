# 消費者介面前端 (Consumer App)

基於 Vue 3 + Vite 的外送平台消費者端前端應用。

## 技術棧

- **Vue 3** - 使用 Composition API 與 `<script setup>` 語法
- **Vue Router** - 前端路由管理
- **Pinia** - 狀態管理
- **Vite** - 開發與建置工具

## 專案結構

```
src/
├── main.js                 # 應用入口
├── App.vue                 # 根元件
├── router/
│   ├── index.js            # 路由配置
│   └── modules/
│       └── ugc.js          # UGC 短影音路由模組
├── stores/
│   ├── auth.js             # 認證狀態（預留）
│   └── cart.js             # 購物車狀態
├── services/
│   ├── http.js             # HTTP 請求封裝
│   └── api/                # API 模組
│       ├── config.js       # API 設定（Mock 開關）
│       ├── restaurant.js   # 餐廳 API
│       ├── menu.js         # 菜單 API
│       ├── cart.js         # 購物車 API
│       ├── order.js        # 訂單 API
│       ├── ugc.js          # UGC 短影音 API
│       └── merchant.js     # 商家 API
├── views/                  # 頁面元件
│   ├── RestaurantPage.vue
│   ├── CartPage.vue
│   ├── CheckoutPage.vue
│   ├── OrderStatusPage.vue
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   └── ugc/
│       └── UGCFeed.vue     # UGC 短影音頁面
└── components/             # 通用元件
    ├── MenuItemCard.vue
    ├── CategoryTabs.vue
    ├── CartItem.vue
    ├── StatusStepper.vue
    ├── ToastNotification.vue
    └── ugc/
        └── UGCVideoItem.vue # UGC 影片元件
```

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## Mock 模式（無後端測試）

所有 API 模組支援 Mock 模式，可在無後端的情況下進行前端開發與測試。

### 切換方式

編輯 `src/services/api/config.js`：

```javascript
// 無後端測試時（使用假資料）
export const USE_MOCK = true

// 連接後端時（使用真實 API）
export const USE_MOCK = false
```

### Mock 模式功能

- **餐廳列表**：2 間模擬餐廳資料
- **菜單**：完整分類與商品資料
- **購物車**：完整 CRUD 操作（記憶體儲存）
- **訂單**：建立、付款、狀態追蹤（自動進度模擬）
- **UGC 短影音**：5 支模擬影片、按讚功能

## API 配置

API 基礎路徑設定於 `src/services/http.js`：

```javascript
const BASE_URL = 'http://127.0.0.1:2323/api'
```

## 路由

| 路徑 | 頁面 | 說明 |
|------|------|------|
| `/` | - | 重導向至 `/restaurant/1` |
| `/restaurant/:id` | RestaurantPage | 餐廳內頁 |
| `/cart` | CartPage | 購物車 |
| `/checkout` | CheckoutPage | 結帳 |
| `/order/:id` | OrderStatusPage | 訂單狀態 |
| `/login` | LoginPage | 登入（預留）|
| `/register` | RegisterPage | 註冊（預留）|
| `/ugc` | UGCFeed | UGC 短影音（全螢幕）|

## 主要功能

### 餐廳內頁
- 顯示餐廳資訊
- 菜單分類切換
- 加入購物車

### 購物車
- 商品數量調整
- 刪除商品
- 小計/運費/總額計算

### 結帳
- 訂單摘要
- 付款方式選擇
- 備註輸入

### 訂單狀態
- 進度條顯示
- 自動輪詢更新（3秒）

### UGC 短影音
- 全螢幕沉浸式播放
- Scroll Snap 滑動切換
- 自動播放/暫停
- 按讚互動（心型動畫）
- 作者資訊顯示

## JWT 認證

Token 管理於 `localStorage`，透過 `http.js` 自動注入至請求標頭：

```javascript
Authorization: Bearer <token>
```

