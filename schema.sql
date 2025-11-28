-- Timeless 数据库架构
-- 用于 Cloudflare D1

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  real_name TEXT NOT NULL,
  birthday TEXT,
  description TEXT,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 回忆表
CREATE TABLE IF NOT EXISTS memories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  mood TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 里程碑表
CREATE TABLE IF NOT EXISTS milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初始化用户数据（示例）
-- 默认密码：password123（已使用 SHA-256 哈希）
-- 哈希值：ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
-- https://emn178.github.io/online-tools/sha256.html  sha256生成工具
INSERT INTO users (username, password, real_name, birthday, description) VALUES 
  ('alex', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Alex', '1995-03-15', '热爱生活的人'), --替换成自己的
  ('sam', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Sam', '1998-05-20', '喜欢冒险') --替换成自己的
ON CONFLICT(username) DO NOTHING;

-- 自动为所有用户创建生日里程碑
INSERT INTO milestones (title, date, type, description)
SELECT 
  real_name || ' 的生日',
  birthday,
  'Birthday',
  description
FROM users
WHERE birthday IS NOT NULL
ON CONFLICT DO NOTHING;
