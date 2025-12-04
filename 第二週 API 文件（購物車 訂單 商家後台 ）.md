# 第二週 API 文件（購物車 / 訂單 / 商家後台 ）

Base URL: `https://delivery-wqwi.onrender.com`

Content-Type: `application/json`

Authentication: **Bearer Token (JWT)**

---

# 5. 購物車 (Cart)

以下 API **需登入**（Header 帶 JWT）。

---

## 5.1 取得購物車內容 (Get Cart)

URL: `/api/cart`

Method: **GET**

Response (200 OK):

```json
{
  "items": [
    {
      "cart_item_id": 12,
      "menu_id": 101,
      "name": "招牌牛肉麵",
      "price": 150,
      "quantity": 2,
      "subtotal": 300,
      "image": "https://..."
    }
  ],
  "delivery_fee": 30,
  "total": 330
}

```

---

## 5.2 加入購物車 (Add to Cart)

URL: `/api/cart/add`

Method: **POST**

Body:

```json
{
  "menu_id": 101,
  "quantity": 1
}

```

Response (200 OK):

```json
{ "message": "商品已加入購物車" }

```

---

## 5.3 更新購物車商品數量 (Update Cart Item)

URL: `/api/cart/update`

Method: **POST**

Body:

```json
{
  "cart_item_id": 12,
  "quantity": 3
}

```

Response (200 OK):

```json
{ "message": "購物車更新成功" }

```

---

## 5.4 移除購物車商品 (Delete Cart Item)

URL: `/api/cart/delete`

Method: **POST**

Body:

```json
{
  "cart_item_id": 12
}

```

Response (200 OK):

```json
{ "message": "商品已刪除" }

```

---

# 6. 訂單 (Order)

---

## 6.1 建立訂單 (Create Order)

URL: `/api/order/create`

Method: **POST**

Body:

```json
{
  "payment_method": "credit_card",
  "remark": "不要香菜"
}

```

Response (200 OK):

```json
{
  "message": "訂單建立成功",
  "order_id": 5001,
  "amount": 330
}

```

---

## 6.2 模擬支付 (Mock Pay)

URL: `/api/pay`

Method: **POST**

Body:

```json
{
  "order_id": 5001
}

```

Response (200 OK):

```json
{
  "message": "付款成功",
  "order_id": 5001,
  "status": "Paid"
}

```

---

## 6.3 取得訂單狀態 (Order Status Tracking)

URL: `/api/order/status/{order_id}`

Method: **GET**

Response (200 OK):

```json
{
  "order_id": 5001,
  "status": "Preparing",
  "steps": [
    "Pending",
    "Paid",
    "Preparing",
    "Delivering",
    "Completed"
  ]
}

```

---

# 7. 商家後台 — 訂單管理 (Merchant Orders)

需帶 JWT，且 JWT 角色需是商家。

---

## 7.1 取得待接訂單 (Get Pending Orders)

URL: `/api/merchant/orders/pending`

Method: **GET**

Response:

```json
{
  "orders": [
    {
      "order_id": 5001,
      "customer_name": "Justus",
      "items": [
        { "name": "牛肉麵", "qty": 1 }
      ],
      "total": 150,
      "remark": "不要蔥"
    }
  ]
}

```

---

## 7.2 接單 (Accept Order)

URL: `/api/merchant/orders/accept`

Method: **POST**

Body:

```json
{
  "order_id": 5001
}

```

Response:

```json
{
  "message": "已接單",
  "status": "Preparing"
}

```

---

## 7.3 拒單 (Reject Order)

URL: `/api/merchant/orders/reject`

Method: **POST**

Body:

```json
{
  "order_id": 5001,
  "reason": "食材不足"
}

```

Response:

```json
{ "message": "已拒單" }

```

---

# 8. 商家後台 — 菜單管理 (Menu Management)

---

## 8.1 取得菜單列表 (Merchant Menu List)

URL: `/api/merchant/menu`

Method: **GET**

Response:

```json
{
  "menu": [
    {
      "menu_id": 101,
      "name": "牛肉麵",
      "price": 150,
      "stock": 30,
      "category": "主食",
      "is_active": true,
      "image": "https://..."
    }
  ]
}

```

---

## 8.2 新增菜品 (Create Menu Item)

URL: `/api/merchant/menu/create`

Method: **POST**

Body:

```json
{
  "name": "紅油抄手",
  "price": 80,
  "stock": 20,
  "category": "小菜",
  "image": "data:image/png;base64,..."
}

```

Response:

```json
{ "message": "菜品新增成功" }

```

---

## 8.3 更新菜品 (Update Menu Item)

URL: `/api/merchant/menu/update`

Method: **POST**

Body:

```json
{
  "menu_id": 101,
  "name": "大碗牛肉麵",
  "price": 180,
  "stock": 10,
  "is_active": true}

```

Response:

```json
{ "message": "更新成功" }

```

---

## 8.4 刪除菜品 (Delete Menu Item)

URL: `/api/merchant/menu/delete`

Method: **POST**

Body:

```json
{
  "menu_id": 101
}

```

Response:

```json
{ "message": "刪除成功" }

```

---

# 9. AI 模組 — 串接與 Mock (供前端測試用)

---

## 9.1 AI 推薦（Mock Response）

URL: `/api/ai/recommend`

Method: **POST**

Body:

```json
{
  "query": "今天想吃辣的",
  "user_tags": {
    "spicy": true}
}

```

Response (Mock JSON):

```json
{
  "recommendations": [
    {
      "restaurant_id": 10,
      "name": "四川麻辣館",
      "score": 0.92,
      "reason": "你偏好吃辣，為你推薦麻辣風味餐廳"
    }
  ]
}

```

---

## 9.2 語音辨識 STT（前端測試用）

URL: `/api/ai/stt`

Method: **POST**

Body:

```json
{
  "audio_base64": "base64encoded..."
}

```

Response:

```json
{
  "text": "我想吃牛肉麵"
}

```

---

# 10. 訂單通知 / WebSocket (Polling Fallback)

## 10.1 查詢訂單更新（輪詢）

URL: `/api/order/updates/{order_id}`

Method: **GET**

Response:

```json
{
  "order_id": 5001,
  "status": "Delivering",
  "timestamp": 1732764800
}

```

---

# 11. 可能用到的錯誤代碼 (Cart / Order / Merchant)

| Error Code | HTTP | 說明 |
| --- | --- | --- |
| OUT_OF_STOCK | 400 | 該商品庫存不足 |
| MENU_NOT_FOUND | 404 | 找不到菜品 |
| CART_EMPTY | 400 | 購物車為空無法建立訂單 |
| ORDER_NOT_FOUND | 404 | 找不到訂單 |
| NOT_MERCHANT | 403 | 該帳號不是商家 |
| ORDER_ALREADY_PROCESSED | 409 | 訂單已被其他商家處理 |
| PAYMENT_FAILED | 500 | 模擬支付失敗（僅測試用） |

12.餐廳列表 (Restaurant List)

12.1 取得所有餐廳

- **Endpoint**: `GET /restaurants`
- **Description**: 取得所有餐廳清單
- **Response (200 OK)**:

```json
[
  {
    "id": 1,
    "name": "測試餐廳",
    "address": "台北市",
    "phone": "0912345678"
  },
  {
    "id": 2,
    "name": "披薩屋",
    "address": "新北市",
    "phone": "0922333444"
  }
]
```

12.2取得指定餐廳

- **Endpoint**: `GET /restaurants/{id}`
- **Description**: 取得指定餐廳的詳細資訊
- **Response (200 OK)**:

```json
{
  "id": 1,
  "name": "測試餐廳",
  "address": "台北市",
  "phone": "0912345678"
}
```

13.菜單詳情 (Menu Detail)

13.1取得餐廳菜單

- **Endpoint**: `GET /menu/{restaurant_id}`
- **Description**: 取得指定餐廳的完整菜單
- **Response (200 OK)**:

```json
{
  "restaurant_id": "1",
  "categories": [
    {
      "category_name": "Main Courses",
      "items": [
        {
          "id": "D001",
          "name": "牛肉麵",
          "price": 120,
          "is_available": true
        },
        {
          "id": "D002",
          "name": "紅茶",
          "price": 30,
          "is_available": true
        }
      ]
    },
    {
      "category_name": "Drinks",
      "items": [
        {
          "id": "D003",
          "name": "鮮奶茶",
          "price": 45,
          "is_available": true
        }
      ]
    }
  ]
}
```

14.錯誤格式(暫時的，還沒做完)

- **Response (404 Not Found)**:

```json
{ "error": "餐廳 1 的菜單不存在" }
```