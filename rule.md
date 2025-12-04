你是本專案的前端工程師，請依指示建立可擴充的 Vue 架構並完成第二週所有頁面。

技術要求：

Vue 3 (script setup)

Vue Router

Pinia（預留 auth store 與 user store，先保留架構但不用實作登入）

API 分層：services → modules

乾淨、可擴充、可維護

Base API：http://127.0.0.1:2323/api
Authorization（部分 API 需 JWT）：
Authorization: Bearer <token> （token 由 Pinia auth store 管理）

📌 一、請建立可擴充的前端專案架構

以下為必須建立的檔案結構：

src/
 ├── router/
 │    └── index.js
 ├── stores/
 │    ├── auth.js   ← 預留（維持 JWT / 使用者狀態）
 │    └── cart.js   ← 可用 Pinia 管理購物車
 ├── services/
 │    ├── http.js   ← 通用 fetch wrapper（含自動附加 JWT）
 │    └── api/
 │         ├── restaurant.js
 │         ├── menu.js
 │         ├── cart.js
 │         ├── order.js
 │         └── merchant.js（預留）
 ├── views/
 │    ├── RestaurantPage.vue
 │    ├── CartPage.vue
 │    ├── CheckoutPage.vue
 │    └── OrderStatusPage.vue
 ├── components/
 │    ├── MenuItemCard.vue
 │    ├── CategoryTabs.vue
 │    ├── CartItem.vue
 │    └── StatusStepper.vue

📌 二、API 分層規範（強制）

你必須使用以下三層架構：

✔ 1. http.js（基底 Fetch 包裝）

自動帶上 JWT（從 auth store）

錯誤統一處理

支援擴充 Token Refresh（預留）

✔ 2. api modules（單一責任制）

例：restaurant.js

export function getRestaurant(id) {
  return http.get(`/restaurants/${id}`);
}


這樣之後加入登入功能也不會碰到頁面邏輯。

📌 三、前端路由規範（必做）

請在 router/index.js 建立：

/restaurant/:id
/cart
/checkout
/order/:id


並預留：

/login
/register


再保留這段（先註解掉）：

// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth && !authStore.isLoggedIn) {
//      return next('/login');
//   }
//   next();
// });


之後你加登入就能一鍵打開。

📌 四、實作第二週的四個頁面
⭐ 1. 餐廳內頁 RestaurantPage.vue

API：

GET /restaurants/{id}

GET /menu/{restaurant_id}

POST /api/cart/add

功能：

餐廳資訊

菜單分類切換

菜單商品卡片

點擊加入購物車（顯示 toast）

⭐ 2. 購物車頁 CartPage.vue

API：

GET /api/cart

POST /api/cart/update

POST /api/cart/delete

功能：

商品調整數量

刪除商品

顯示小計 / 運費 / 總額

按鈕導向 /checkout

⭐ 3. 結帳頁 CheckoutPage.vue

API：

POST /api/order/create

POST /api/pay

功能：

顯示購物車內容（從 store 或重新 call）

選擇付款方式

可輸入備註

成功後導向：/order/{order_id}

⭐ 4. 訂單狀態頁 OrderStatusPage.vue

API：

GET /api/order/status/{order_id}

功能：

顯示訂單進度

使用 setInterval（3s）定期刷新

狀態 stepper 元件

📌 五、程式品質規範

必須模組化

不允許把 API 寫在頁面中

不允許寫死 token

需使用元件化（MenuItemCard、CartItem、StatusStepper）

必須保持擴充性，可直接加入登入頁面而不重構

📌 六、請輸出以下內容（由 Augment Code 自動完成）

src/router/index.js

src/stores/auth.js（預留，僅維持 token 狀態）

src/stores/cart.js

src/services/http.js

src/services/api/*.js（5 個 module）

RestaurantPage.vue

CartPage.vue

CheckoutPage.vue

OrderStatusPage.vue

所有需要的元件 .vue

✅ 這組指令可保證：

之後加入登入 / 註冊時只需補 auth API

Token 注入在 http.js，不會散落在程式

Router 已預留 Auth guard

Store 已預留擴充

前端維護性、擴充性都到位

第二週功能一次完成