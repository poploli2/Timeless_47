# 部署指南

本文档将指导你如何将 Timeless 部署到 Cloudflare Pages。

## 前置准备

1. **Cloudflare 账号**：[注册 Cloudflare](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI**：全局安装 Wrangler
   ```bash
   npm install -g wrangler
   ```
3. **登录 Cloudflare**：
   ```bash
   npx wrangler login
   ```

## 步骤 1: 创建 D1 数据库

```bash
npx wrangler d1 create timeless_db
```

记录输出中的 `database_id`，并更新到 `wrangler.toml` 的 `database_id` 字段。

## 步骤 2: 创建 R2 存储桶

```bash
npx wrangler r2 bucket create timeless-bucket
```

## 步骤 3: 初始化数据库

```bash
npx wrangler d1 execute timeless_db --file=./schema.sql
```

## 步骤 4: 配置环境变量

### 设置 Secrets（生产环境）

```bash
# JWT Secret（用于认证）
echo "你的随机字符串" | npx wrangler pages secret put JWT_SECRET --project-name=timeless

# OpenAI API Key
echo "你的OpenAI API Key" | npx wrangler pages secret put OPENAI_API_KEY --project-name=timeless
```

**生成安全的 JWT Secret：**
```bash
openssl rand -base64 32
```

### 设置 Secrets（预览环境）

如果需要在预览环境也启用认证和 AI 功能：

```bash
echo "你的随机字符串" | npx wrangler pages secret put JWT_SECRET --project-name=timeless --env=preview
echo "你的OpenAI API Key" | npx wrangler pages secret put OPENAI_API_KEY --project-name=timeless --env=preview
```

## 步骤 5: 构建项目

```bash
pnpm run build
```

## 步骤 6: 部署到 Cloudflare Pages

### 首次部署

```bash
npx wrangler pages deploy dist --project-name=timeless
```

### 后续部署

每次更新代码后，只需重新构建并部署：

```bash
pnpm run build
npx wrangler pages deploy dist --project-name=timeless
```

## 步骤 7: 绑定资源

在 Cloudflare Dashboard 中：

1. 进入你的 Pages 项目
2. 进入 **Settings** → **Functions** → **D1 database bindings**
3. 添加绑定：
   - Variable name: `DB`
   - D1 database: 选择你创建的 `timeless_db`
4. 进入 **R2 bucket bindings**
5. 添加绑定：
   - Variable name: `BUCKET`
   - R2 bucket: 选择你创建的 `timeless-bucket`

## 步骤 8: 配置自定义域名（可选）

1. 在 Cloudflare Dashboard 中进入你的 Pages 项目
2. 进入 **Custom domains**
3. 添加你的域名并按照指引配置 DNS

## 验证部署

1. 访问部署完成后的 URL
2. 尝试登录（默认用户名：`alex` 或 `sam`，默认密码：`password123`）
3. 测试上传图片、创建回忆等功能

## 常见问题

### 1. 401 错误 - JWT_SECRET 未设置

**原因**：环境变量 `JWT_SECRET` 未正确设置。

**解决**：确保已执行步骤 4 中的 secret 配置命令。

### 2. 图片上传失败

**原因**：R2 存储桶未正确绑定。

**解决**：检查步骤 7 中的 R2 绑定配置。

### 3. AI 功能不可用

**原因**：`OPENAI_API_KEY` 未设置或无效。

**解决**：
1. 检查 API Key 是否正确
2. 确认 `wrangler.toml` 中的 `OPENAI_BASE_URL` 和 `OPENAI_MODEL` 配置正确

### 4. 预览环境和生产环境不一致

Cloudflare Pages 的预览环境和生产环境是分离的。如果需要在预览环境测试，请为预览环境单独配置 secrets（见步骤 4）。

## 更新部署

当你更新代码后：

```bash
# 1. 拉取最新代码
git pull

# 2. 安装新依赖（如有）
pnpm install

# 3. 重新构建
pnpm run build

# 4. 部署
npx wrangler pages deploy dist --project-name=timeless
```

## 数据库迁移

如果 `schema.sql` 有更新：

```bash
# 生产环境
npx wrangler d1 execute timeless_db --file=./schema.sql

# 预览环境（如有）
npx wrangler d1 execute timeless_db --file=./schema.sql --env=preview
```

**注意**：执行前请备份数据库！
