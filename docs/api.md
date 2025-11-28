# API 参考文档

本文档列出 Timeless 的所有 API 端点及其用法。

## 基础信息

- **Base URL**: `/api`
- **认证方式**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## 认证机制

除 `/api/auth` 外，其他端点根据 `AUTHENTICATION_REQUIRED` 配置决定是否需要认证：

- **严格模式** (`true`): 所有请求需要认证
- **宽松模式** (`false`): GET 请求公开，其他请求需要认证

### 认证头

```http
Authorization: Bearer <your_jwt_token>
```

---

## 认证 API

### POST /api/auth

**描述**: 用户登录，获取 JWT token

**请求体**:
```json
{
  "username": "alex",
  "password": "password123"
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "alex",
      "real_name": "Alex",
      "birthday": "1995-03-15",
      "description": "热爱生活的人"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应** (401):
```json
{
  "success": false,
  "error": "用户名或密码错误"
}
```

### GET /api/auth

**描述**: 验证 token 有效性

**认证**: 必需

**响应** (200):
```json
{
  "success": true,
  "data": {
    "username": "alex",
    "userId": 1,
    "valid": true
  }
}
```

**错误响应** (401):
```json
{
  "success": false,
  "error": "无效的令牌"
}
```

---

## 回忆 API

### GET /api/memories

**描述**: 获取所有回忆

**认证**: 根据配置

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "第一次约会",
      "content": "今天天气很好...",
      "date": "2025-01-15",
      "mood": "Romantic",
      "location": "城市公园",
      "imageUrl": "/api/file/uploads/xxx.jpg"
    }
  ]
}
```

### POST /api/memories

**描述**: 创建新回忆

**认证**: 必需

**请求体**:
```json
{
  "title": "美好的一天",
  "content": "今天我们一起...",
  "date": "2025-01-20",
  "mood": "Happy",
  "location": "海边",
  "imageUrl": "/api/file/uploads/xxx.jpg"
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "id": 5
  }
}
```

### PUT /api/memories

**描述**: 更新回忆

**认证**: 必需

**请求体**:
```json
{
  "id": "5",
  "title": "更新的标题",
  "content": "更新的内容..."
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "changes": 1
  }
}
```

### DELETE /api/memories

**描述**: 删除回忆（实际使用 POST 方法）

**认证**: 必需

**请求体**:
```json
{
  "id": "5",
  "delete": true
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "changes": 1
  }
}
```

---

## 里程碑 API

### GET /api/milestones

**描述**: 获取所有里程碑

**认证**: 根据配置

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "第一次约会纪念日",
      "date": "01-15",
      "type": "Anniversary"
    }
  ]
}
```

### POST /api/milestones

**描述**: 创建新里程碑

**认证**: 必需

**请求体**:
```json
{
  "title": "纪念日",
  "date": "2025-01-15",
  "type": "Anniversary"
}
```

**type 取值**:
- `Anniversary`: 纪念日
- `Birthday`: 生日
- `Special`: 特殊日子

**响应** (200):
```json
{
  "success": true,
  "data": {
    "id": 3
  }
}
```

### DELETE /api/milestones

**描述**: 删除里程碑（实际使用 POST 方法）

**认证**: 必需

**请求体**:
```json
{
  "id": "3",
  "delete": true
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "changes": 1
  }
}
```

---

## 文件上传 API

### POST /api/upload

**描述**: 上传图片文件到 R2

**认证**: 必需

**Content-Type**: `multipart/form-data`

**表单字段**:
- `file`: 图片文件（支持 JPEG, PNG, GIF, WebP）

**响应** (200):
```json
{
  "success": true,
  "data": {
    "url": "/api/file/uploads/1764075111460-0j8btr.jpg"
  }
}
```

**错误响应** (400):
```json
{
  "success": false,
  "error": "未找到文件"
}
```

---

## 文件访问 API

### GET /api/file/uploads/:filename

**描述**: 获取上传的图片

**认证**: 根据配置

**示例**: `/api/file/uploads/1764075111460-0j8btr.jpg`

**响应**: 图片文件（二进制）

**错误响应** (404):
```json
{
  "success": false,
  "error": "文件未找到"
}
```

---

## AI 服务 API

### POST /api/ai

**描述**: 调用 AI 服务（内容润色、情书生成、约会建议）

**认证**: 必需

**请求体**:

#### 内容润色
```json
{
  "type": "polish",
  "content": "今天天气很好，我们一起去了公园。"
}
```

#### 情书生成
```json
{
  "type": "loveLetter",
  "tone": "温柔",
  "context": "纪念日",
  "length": "中等"
}
```

#### 约会建议
```json
{
  "type": "dateIdea",
  "weather": "晴天",
  "budget": "中等",
  "vibe": "浪漫"
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "text": "AI 生成的内容..."
  }
}
```

**错误响应** (400):
```json
{
  "success": false,
  "error": "缺少必需参数: type"
}
```

---

## 数据导入导出 API

### GET /api/data

**描述**: 导出所有数据（回忆 + 里程碑）

**认证**: 必需

**响应** (200):
```json
{
  "success": true,
  "data": {
    "memories": [...],
    "milestones": [...],
    "exportDate": "2025-01-20T10:30:00.000Z"
  }
}
```

### POST /api/data

**描述**: 导入数据

**认证**: 必需

**请求体**:
```json
{
  "memories": [...],
  "milestones": [...]
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "memoriesImported": 10,
    "milestonesImported": 3
  }
}
```

---

## 通用响应格式

所有 API 都遵循统一的响应格式：

### 成功响应
```json
{
  "success": true,
  "data": { /* 数据 */ }
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误描述"
}
```

### 认证失败响应
```json
{
  "success": false,
  "error": "需要登录才能访问",
  "authRequired": true
}
```

## 错误码

| HTTP 状态码 | 说明 |
|------------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 404 | 资源未找到 |
| 500 | 服务器内部错误 |

## 使用示例

### JavaScript/TypeScript

```typescript
// 登录
const loginResponse = await fetch('/api/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'alex',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// 获取回忆（带认证）
const memoriesResponse = await fetch('/api/memories', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data: memories } = await memoriesResponse.json();
```

### cURL

```bash
# 登录
curl -X POST https://your-domain.com/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"alex","password":"password123"}'

# 获取回忆
curl https://your-domain.com/api/memories \
  -H "Authorization: Bearer <your_token>"

# 创建回忆
curl -X POST https://your-domain.com/api/memories \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "美好的一天",
    "content": "...",
    "date": "2025-01-20",
    "mood": "Happy"
  }'
```
