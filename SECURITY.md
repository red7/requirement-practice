# Cloudflare Pages 环境变量配置指南

## 如何配置 API Key（安全方式）

### 1. 本地开发环境

创建 `.dev.vars` 文件（已在 .gitignore 中，不会提交到 Git）：

```bash
# .dev.vars（用于本地开发）
CLAUDE_API_KEY=sk-ant-api03-xxxxx
```

然后使用 Wrangler 运行本地开发：
```bash
npm install -g wrangler
wrangler pages dev dist --compatibility-date=2024-01-01
```

### 2. Cloudflare Pages 生产环境

在 Cloudflare Dashboard 中配置：

1. 登录 Cloudflare Dashboard
2. 进入 **Pages** → 选择你的项目
3. 点击 **Settings** → **Environment variables**
4. 添加变量：
   - **Variable name**: `CLAUDE_API_KEY`
   - **Value**: `sk-ant-api03-xxxxx`
   - **Environment**: Production（或 Preview）
5. 保存并重新部署

### 3. 获取 Claude API Key

访问：https://console.anthropic.com/settings/keys

---

## 安全性保证

✅ **API Key 存储在 Cloudflare 服务端**
- 不会出现在前端代码中
- 不会出现在浏览器网络请求中
- 只有 Functions 能访问环境变量

✅ **前端只调用自己的 API**
```javascript
// 前端代码只知道这个路径，看不到 API key
fetch('/api/chat', { ... })
```

✅ **请求流程**
```
用户浏览器 → /api/chat (你的 Function) → Claude API (带 key)
                ↑                              ↓
            看不到 key                    返回结果
```

---

## 成本控制建议

为了防止 API key 被滥用，建议添加：

### 1. 速率限制
```javascript
// functions/api/chat.js
const cache = caches.default
const rateLimitKey = `rate-limit:${context.request.headers.get('CF-Connecting-IP')}`

// 检查速率限制（每分钟最多 10 次请求）
const cachedCount = await cache.match(rateLimitKey)
if (cachedCount && parseInt(await cachedCount.text()) > 10) {
  return new Response('Too many requests', { status: 429 })
}
```

### 2. 用户认证
```javascript
// 只有登录用户才能调用
const sessionToken = context.request.headers.get('Authorization')
if (!validateSession(sessionToken)) {
  return new Response('Unauthorized', { status: 401 })
}
```

---

## 文件结构

```
RDojo/
├── functions/              # Cloudflare Pages Functions（服务端）
│   └── api/
│       ├── chat.js        # API key 在这里使用
│       └── review.js      # API key 在这里使用
├── src/                   # 前端代码（不包含 key）
│   └── utils/
│       └── api.js         # 只调用 /api/* 路径
├── .dev.vars             # 本地开发环境变量（不提交到 Git）
└── .gitignore            # 确保 .dev.vars 被忽略
```

---

## 总结

**直接在前端调用 API = ❌ 100% 会泄露 key**
**使用 Cloudflare Pages Functions = ✅ 完全安全**

这就是为什么我推荐使用 Functions 的原因！
