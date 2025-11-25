# Timeless

> 珍藏你们永恒的爱的瞬间

**Timeless** 是一个专为情侣设计的数字纪念册，旨在记录和珍藏每一个充满爱意的瞬间。结合了现代化的 Web 技术与人工智能，不仅能安全地存储你们的回忆，还能通过 AI 润色日记、生成情书以及提供创意约会建议，让爱意在时光中永恒。

## ✨ 功能特性

- **📝 时光记录**：轻松记录日常生活中的点滴与美好回忆，支持富文本与多媒体。
- **🎨 AI 润色**：利用先进的 AI 技术（OpenAI）优化您的日记内容，让文字更加动人且富有文学色彩。
- **💌 情书生成**：输入关键词或情感基调，AI 为您生成深情款款的情书，传递心中爱意。
- **💡 约会灵感**：不知道周末去哪儿？AI 根据你们的喜好提供独特的创意约会建议。


## 🛠️ 技术栈

本项目采用现代化的前端技术栈构建，注重性能与用户体验：

- **前端框架**: [React 19](https://react.dev/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **开发语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式方案**: [TailwindCSS](https://tailwindcss.com/)
- **图标库**: [Lucide React](https://lucide.dev/)

## 🚀 快速开始

### 前置要求

- Node.js (推荐 v18+)
- pnpm (推荐) 或 npm/yarn

### 安装步骤

1. **克隆仓库**

   ```bash
   git clone https://github.com/yourusername/timeless.git
   cd timeless
   ```

2. **安装依赖**

   ```bash
   pnpm install
   # 或者
   npm install
   ```

3. **配置环境变量**

   复制示例配置文件并重命名为 `.env.local`：

   ```bash
   cp .env.example .env.local
   ```

   在 `.env.local` 中填入您的配置信息：

   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_OPENAI_API_BASE_URL=your_openai_api_base_url
   VITE_OPENAI_MODEL_ID=your_model
   ```

4. **启动开发服务器**

   ```bash
   npm run dev
   ```

   访问 `http://localhost:3000` 即可开始体验。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

---

Made with ❤️ by Timeless_47
