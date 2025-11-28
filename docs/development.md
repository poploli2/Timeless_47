# 开发指南

本文档为开发者提供 Timeless 项目的开发指南。

## 项目结构

```
Timeless_47/
├── functions/              # Cloudflare Pages Functions (后端)
│   ├── api/               # API 路由
│   │   ├── ai.ts         # AI 服务端点
│   │   ├── auth.ts       # 认证端点
│   │   ├── data.ts       # 数据导入导出
│   │   ├── file/         # 文件访问
│   │   ├── memories.ts   # 回忆 CRUD
│   │   ├── milestones.ts # 里程碑 CRUD
│   │   └── upload/       # 文件上传
│   ├── utils/            # 工具函数
│   │   ├── crypto.ts     # 加密工具
│   │   └── jwt.ts        # JWT 工具
│   ├── _middleware.ts    # 全局中间件（CORS、认证）
│   └── types.ts          # 类型定义
├── src/                   # 前端源码
│   ├── components/       # React 组件
│   │   ├── AddMemory.tsx
│   │   ├── Hero.tsx
│   │   ├── Login.tsx
│   │   ├── LoveAssistant.tsx
│   │   ├── MilestoneManager.tsx
│   │   ├── Navbar.tsx
│   │   └── Timeline.tsx
│   ├── services/         # 前端服务层
│   │   ├── aiService.ts
│   │   ├── apiClient.ts  # API 客户端（含拦截器）
│   │   ├── authService.ts
│   │   ├── dataService.ts
│   │   └── uploadService.ts
│   ├── App.tsx           # 主应用组件
│   ├── index.css         # 全局样式
│   ├── main.tsx          # 应用入口
│   └── types.ts          # 前端类型定义
├── docs/                 # 文档
├── schema.sql            # 数据库 Schema
├── wrangler.toml         # Cloudflare 配置
├── tailwind.config.js    # TailwindCSS 配置
├── vite.config.ts        # Vite 配置
└── package.json
```

## 技术栈

### 前端
- **框架**：React 19
- **语言**：TypeScript
- **构建**：Vite
- **样式**：TailwindCSS
- **图标**：Lucide React
- **状态管理**：React Hooks (useState, useEffect)

### 后端
- **运行时**：Cloudflare Pages Functions
- **数据库**：Cloudflare D1 (SQLite)
- **存储**：Cloudflare R2 (S3 兼容)
- **认证**：JWT

### AI
- **API**：OpenAI 兼容接口
- **模型**：GPT-4 / DeepSeek Chat

## 本地开发

### 启动开发服务器

```bash
pnpm run dev
```

访问 `http://localhost:5173`

### 本地测试 Functions

使用 Wrangler 的本地模式：

```bash
npx wrangler pages dev dist --compatibility-date=2025-11-01 --d1=DB=<database_id> --r2=BUCKET=timeless-bucket
```

**注意**：需要先构建前端：
```bash
pnpm run build
```

## 认证系统架构

### 双模式认证

#### 严格模式 (`AUTHENTICATION_REQUIRED = "true"`)
- 所有 API 端点都需要认证
- 包括 GET 请求（查询）
- 适用于私密部署

#### 宽松模式 (`AUTHENTICATION_REQUIRED = "false"`)
- GET 请求开放（可查看）
- POST/PUT/DELETE 需要认证（写操作保护）
- 适用于公开展示

### 认证流程

1. **登录**：`POST /api/auth`
   - 接收用户名和密码
   - 验证密码（SHA-256 哈希）
   - 返回 JWT token

2. **全局拦截器**：
   - 前端：`src/services/apiClient.ts`
   - 自动附加 `Authorization: Bearer <token>`
   - 检测 401 响应并触发登录跳转

3. **后端中间件**：`functions/_middleware.ts`
   - 验证 JWT token
   - 根据配置模式决定是否拦截请求

### 事件驱动的认证跳转

使用观察者模式实现全局认证拦截：

```typescript
// authService.ts
export function onAuthRequired(callback: () => void) {
  authRequiredListeners.push(callback);
  return unsubscribe;
}

export function emitAuthRequired() {
  authRequiredListeners.forEach(listener => listener());
}

// App.tsx
useEffect(() => {
  const unsubscribe = onAuthRequired(() => {
    setIsLoggedIn(false);
    setView(AppView.LOGIN);
  });
  return unsubscribe;
}, []);
```

## 数据流

### 回忆创建流程

```
用户填写表单
  ↓
AddMemory.tsx
  ↓
uploadService.ts (上传图片到 R2)
  ↓
dataService.ts (创建回忆记录)
  ↓
apiClient.ts (发送 POST /api/memories)
  ↓
functions/api/memories.ts (后端处理)
  ↓
D1 数据库保存
  ↓
返回结果
  ↓
App.tsx (刷新数据)
  ↓
Timeline.tsx (显示新回忆)
```

### AI 服务流程

```
用户点击 AI 润色
  ↓
AddMemory.tsx / LoveAssistant.tsx
  ↓
aiService.ts
  ↓
apiClient.ts (POST /api/ai)
  ↓
functions/api/ai.ts
  ↓
调用 OpenAI API
  ↓
返回 AI 生成内容
  ↓
显示给用户
```

## 样式系统

### TailwindCSS 自定义配置

**自定义颜色**：
```javascript
colors: {
  love: { /* 粉色系 */ },
  rose: { /* 玫瑰色 */ },
  warm: { /* 暖色系 */ },
  slate: { /* 中性灰 */ }
}
```

**自定义组件类**：
```css
.glass         /* 玻璃态效果 */
.glass-dark    /* 深色玻璃态 */
.gradient-text /* 渐变文字 */
.card-hover    /* 卡片悬浮 */
.btn-primary   /* 主按钮 */
.btn-secondary /* 次按钮 */
```

### 中文字体优化

```javascript
fontFamily: {
  sans: [
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    'Noto Sans SC',
    // ...
  ]
}
```

## 数据库操作

### 查询示例

```typescript
// 获取所有回忆
const memories = await env.DB.prepare(
  'SELECT * FROM memories ORDER BY date DESC'
).all();

// 创建回忆
const result = await env.DB.prepare(
  'INSERT INTO memories (title, content, date, ...) VALUES (?, ?, ?, ...)'
).bind(title, content, date, ...).run();
```

### 事务处理

```typescript
await env.DB.batch([
  env.DB.prepare('INSERT INTO ...').bind(...),
  env.DB.prepare('UPDATE ...').bind(...),
]);
```

## API 开发规范

### 统一响应格式

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  authRequired?: boolean;
}
```

### 错误处理

```typescript
try {
  // 业务逻辑
} catch (error) {
  console.error('错误:', error);
  return Response.json({
    success: false,
    error: error instanceof Error ? error.message : '操作失败'
  }, { status: 500 });
}
```

### CORS 处理

中间件自动添加 CORS 头：
```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
```

## 测试

### 手动测试

1. **登录流程**
2. **创建回忆**（含图片上传）
3. **删除回忆**
4. **创建里程碑**
5. **AI 功能**（润色、情书、约会建议）
6. **认证拦截**（未登录时的跳转）

### 测试认证模式

- 切换 `wrangler.toml` 中的 `AUTHENTICATION_REQUIRED`
- 测试 GET 请求是否按预期开放/限制

## 调试技巧

### 前端调试

使用浏览器开发者工具：
- **Network**：查看 API 请求和响应
- **Console**：查看日志和错误
- **Application** → **Local Storage**：查看 token

### 后端调试

查看 Cloudflare Pages 日志：
```bash
npx wrangler pages deployment tail <deployment-id>
```

或在 Cloudflare Dashboard → Functions → Logs

### 数据库调试

查询 D1 数据库：
```bash
npx wrangler d1 execute timeless_db --command="SELECT * FROM memories"
```

## 性能优化

1. **图片压缩**：上传前自动压缩到 800x800
2. **懒加载**：Timeline 组件使用 `loading="lazy"`
3. **代码分割**：Vite 自动处理
4. **CDN 缓存**：Cloudflare 全球 CDN

## 贡献指南

1. Fork 项目
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 常见开发问题

### 1. 类型错误

确保导入正确的类型定义：
```typescript
import { Memory, Milestone } from './types';
```

### 2. CORS 错误

确认中间件已正确配置，且本地开发使用正确的端口。

### 3. 认证循环

检查 `onAuthRequired` 监听器是否在组件卸载时正确清理。

### 4. 图片上传失败

检查 R2 绑定和权限配置。
