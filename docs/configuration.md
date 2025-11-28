# 配置指南

本文档详细说明 Timeless 项目的各项配置。

## 环境变量配置

### 本地开发环境 (`.env.local`)

```env
# 情侣信息
VITE_COUPLE_NAME=Sam & Alex
VITE_START_DATE=2025-01-01

# OpenAI 配置（本地开发用）
VITE_OPENAI_API_KEY=your_api_key_here
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-4
```

### 生产环境配置 (`wrangler.toml`)

```toml
[vars]
OPENAI_BASE_URL = "https://api.deepseek.com"  # 或其他兼容 OpenAI 的 API
OPENAI_MODEL = "deepseek-chat"
AUTHENTICATION_REQUIRED = "true"  # 设置为 "true"（推荐）启用登录认证
COUPLE_NAME = "Sam & Alex"  # 替换成自己的
START_DATE = "2025-01-01"  # 替换成自己的
```

## 配置项说明

### 基础配置

#### `COUPLE_NAME`
- **说明**：情侣名称，显示在首页和个人资料页
- **示例**：`"Sam & Alex"`, `"小明 & 小红"`
- **位置**：
  - 本地：`.env.local` → `VITE_COUPLE_NAME`
  - 生产：`wrangler.toml` → `COUPLE_NAME`

#### `START_DATE`
- **说明**：恋爱开始日期，用于计算在一起的天数
- **格式**：`YYYY-MM-DD`
- **示例**：`"2025-01-01"`
- **位置**：
  - 本地：`.env.local` → `VITE_START_DATE`
  - 生产：`wrangler.toml` → `START_DATE`

### 认证配置

#### `AUTHENTICATION_REQUIRED`
- **说明**：是否启用登录认证
- **取值**：
  - `"true"`：严格模式，所有 API 请求都需要认证
  - `"false"`：宽松模式，GET 请求开放，写操作需要认证
- **推荐**：`"true"`（更安全）
- **位置**：`wrangler.toml` → `AUTHENTICATION_REQUIRED`

#### `JWT_SECRET`
- **说明**：JWT 令牌签名密钥
- **生成方式**：
  ```bash
  openssl rand -base64 32
  ```
- **配置方式**：通过 Wrangler Secret 设置（不要写入文件）
  ```bash
  echo "生成的密钥" | npx wrangler pages secret put JWT_SECRET --project-name=timeless
  ```

### AI 配置

#### `OPENAI_API_KEY`
- **说明**：OpenAI API 密钥（或兼容的 API 密钥）
- **获取**：
  - OpenAI: https://platform.openai.com/api-keys
  - DeepSeek: https://platform.deepseek.com/api_keys
- **配置方式**：
  - 本地：`.env.local` → `VITE_OPENAI_API_KEY`
  - 生产：通过 Wrangler Secret 设置
    ```bash
    echo "你的API密钥" | npx wrangler pages secret put OPENAI_API_KEY --project-name=timeless
    ```

#### `OPENAI_BASE_URL`
- **说明**：OpenAI API 端点地址
- **示例**：
  - OpenAI 官方：`https://api.openai.com/v1`
  - DeepSeek：`https://api.deepseek.com`
  - 其他兼容服务：根据服务商文档配置
- **位置**：
  - 本地：`.env.local` → `VITE_OPENAI_BASE_URL`
  - 生产：`wrangler.toml` → `OPENAI_BASE_URL`

#### `OPENAI_MODEL`
- **说明**：使用的 AI 模型
- **示例**：
  - OpenAI：`gpt-4`, `gpt-3.5-turbo`
  - DeepSeek：`deepseek-chat`
- **位置**：
  - 本地：`.env.local` → `VITE_OPENAI_MODEL`
  - 生产：`wrangler.toml` → `OPENAI_MODEL`

## 数据库配置

### 用户配置 (`schema.sql`)

默认创建两个用户：

```sql
INSERT INTO users (username, password, real_name, birthday, description) VALUES 
  ('alex', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Alex', '1995-03-15', '热爱生活的人'),
  ('sam', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Sam', '1998-05-20', '喜欢冒险');
```

**默认密码**：`password123`

**修改密码**：
1. 访问 [SHA256 在线工具](https://emn178.github.io/online-tools/sha256.html)
2. 输入你的新密码
3. 将生成的哈希值替换 SQL 中的 `password` 字段
4. 更新用户名、真实姓名、生日、描述等信息
5. 重新执行数据库初始化：
   ```bash
   npx wrangler d1 execute timeless_db --file=./schema.sql
   ```

## 资源绑定配置

在 `wrangler.toml` 中配置：

### D1 数据库

```toml
[[d1_databases]]
binding = "DB"
database_name = "timeless_db"
database_id = "你的数据库ID"  # 创建 D1 后获得
```

### R2 存储桶

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "timeless-bucket"
```

## 配置检查清单

部署前确保以下配置已完成：

- [ ] `COUPLE_NAME` 和 `START_DATE` 已更新为你们的信息
- [ ] `JWT_SECRET` 已通过 Wrangler Secret 设置
- [ ] `OPENAI_API_KEY` 已配置（如需 AI 功能）
- [ ] `OPENAI_BASE_URL` 和 `OPENAI_MODEL` 已正确配置
- [ ] `database_id` 已更新为你创建的 D1 数据库 ID
- [ ] `schema.sql` 中的用户信息已自定义
- [ ] 已在 Cloudflare Dashboard 中绑定 D1 和 R2 资源

## 安全建议

1. **不要将敏感信息提交到 Git**
   - `.env.local` 已在 `.gitignore` 中
   - Secret 应通过 Wrangler CLI 设置，不写入配置文件

2. **定期更换密码**
   - 定期更新用户密码哈希值
   - 定期轮换 `JWT_SECRET`

3. **启用认证**
   - 生产环境强烈建议设置 `AUTHENTICATION_REQUIRED = "true"`

4. **备份数据**
   - 定期导出 D1 数据库
   - 定期备份 R2 存储桶中的文件
