# Timeless

> 珍藏你们永恒的爱的瞬间 ❤️

**Timeless** 是一个专为情侣设计的现代化数字纪念册，帮助你们记录和珍藏每一个充满爱意的瞬间。结合了最新的 Web 技术与人工智能，不仅能安全地存储你们的回忆，还能通过 AI 润色日记、生成情书以及提供创意约会建议，让爱意在时光中永恒。

## ✨ 核心特性

### 📝 时光记录
- **回忆时间线**：优雅的时间线展示，记录你们的美好瞬间
- **多媒体支持**：上传照片、添加位置、选择心情
- **里程碑管理**：纪念重要日期，自动提醒即将到来的纪念日

### 🎨 AI 功能
- **内容润色**：AI 优化你的日记内容，让文字更加动人
- **情书生成**：输入关键词，AI 生成深情款款的情书
- **约会建议**：根据天气、预算和氛围，AI 提供创意约会方案

### 🔐 安全与隐私
- **JWT 认证**：安全的登录系统保护你们的私密回忆
- **双模式部署**：支持完全私密或部分公开展示
- **数据导出**：随时导出你们的所有数据

### 🎨 精美设计
- **响应式设计**：完美适配移动端和桌面端
- **中文优化**：专为中文用户优化的字体和排版
- **流畅动画**：精心设计的过渡动画和交互效果
- **暗色玻璃态**：现代化的 UI 设计语言

## 🛠️ 技术栈

### 前端
- [React 19](https://react.dev/) - UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vitejs.dev/) - 快速构建工具
- [TailwindCSS](https://tailwindcss.com/) - 原子化 CSS
- [Lucide React](https://lucide.dev/) - 精美图标

### 后端
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/) - Serverless 运行时
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite 数据库
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - 对象存储

### AI
- OpenAI / DeepSeek API - AI 能力

## 🚀 快速开始

### 前置要求

- Node.js (v18+)
- pnpm / npm / yarn
- Cloudflare 账号（用于部署）

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/timeless.git
   cd timeless
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   ```
   
   编辑 `.env.local`：
   ```env
   VITE_COUPLE_NAME=你的名字 & TA的名字
   VITE_START_DATE=2025-01-01
   VITE_OPENAI_API_KEY=你的API密钥
   VITE_OPENAI_BASE_URL=https://api.openai.com/v1
   VITE_OPENAI_MODEL=gpt-4
   ```

4. **启动开发服务器**
   ```bash
   pnpm run dev
   ```
   
   访问 `http://localhost:5173`

### 部署到 Cloudflare Pages

详细的部署步骤请参考 [部署指南](docs/deployment.md)。

快速部署：

```bash
# 1. 创建 D1 数据库
npx wrangler d1 create timeless_db

# 2. 创建 R2 存储桶
npx wrangler r2 bucket create timeless-bucket

# 3. 初始化数据库
npx wrangler d1 execute timeless_db --file=./schema.sql

# 4. 配置环境变量
echo "$(openssl rand -base64 32)" | npx wrangler pages secret put JWT_SECRET --project-name=timeless
echo "你的API密钥" | npx wrangler pages secret put OPENAI_API_KEY --project-name=timeless

# 5. 构建并部署
pnpm run build
npx wrangler pages deploy dist --project-name=timeless
```

## 📖 文档

- [部署指南](docs/deployment.md) - 详细的部署步骤和配置
- [配置指南](docs/configuration.md) - 环境变量和参数配置
- [开发指南](docs/development.md) - 项目结构和开发说明
- [API 文档](docs/api.md) - 完整的 API 接口文档

## 🎯 功能展示

### 认证系统
- **双模式认证**：支持严格模式（全部认证）和宽松模式（读公开，写认证）
- **全局拦截器**：自动处理未认证跳转

### 回忆管理
- 创建、查看、编辑、删除回忆
- 图片上传和展示
- 心情标签
- 位置记录

### 里程碑
- 纪念日提醒
- 生日管理
- 自动计算天数

### AI 助手
- 日记内容润色
- 情书自动生成
- 个性化约会建议

## 🔧 自定义

### 修改情侣信息

编辑 `wrangler.toml`：
```toml
COUPLE_NAME = "你的名字 & TA的名字"
START_DATE = "2025-01-01"
```

### 修改用户信息

编辑 `schema.sql` 并重新执行：
```sql
INSERT INTO users (username, password, real_name, birthday, description) VALUES 
  ('username1', '<SHA256(密码)>', '真实姓名', '1995-01-01', '个人描述'),
  ('username2', '<SHA256(密码)>', '真实姓名', '1998-01-01', '个人描述');
```

使用 [SHA256 在线工具](https://emn178.github.io/online-tools/sha256.html) 生成密码哈希。

### 自定义样式

修改 `tailwind.config.js` 中的颜色、字体等配置。

## 🤝 贡献

欢迎贡献！请查看 [开发指南](docs/development.md) 了解如何参与开发。

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

## 🙏 致谢

- [React](https://react.dev/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [OpenAI](https://openai.com/)
- [DeepSeek](https://deepseek.com/)

## 📮 联系

如有问题或建议，欢迎提交 Issue。

---

Made with ❤️ by Timeless Team
