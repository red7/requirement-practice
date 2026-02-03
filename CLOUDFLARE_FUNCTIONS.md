# Cloudflare Pages Functions 完全指南

## 什么是 Pages Functions？

Cloudflare Pages Functions 是运行在 **Cloudflare Workers** 上的 serverless 函数，让你的静态网站拥有动态后端能力。

---

## 🌟 核心特性

### 1. **零配置部署**
- 只需创建 `functions/` 文件夹
- 自动部署到全球 300+ 边缘节点
- 无需配置服务器、容器、Kubernetes

### 2. **文件路由**
```
functions/
├── hello.js              → /hello
├── api/
│   ├── users.js         → /api/users
│   └── posts/[id].js    → /api/posts/123 (动态路由)
└── [[path]].js          → 匹配所有路径（中间件）
```

### 3. **环境变量**
```javascript
export async function onRequest(context) {
  const apiKey = context.env.MY_API_KEY  // 安全存储
  const dbUrl = context.env.DATABASE_URL

  return new Response('Secrets are safe!')
}
```

### 4. **HTTP 方法支持**
```javascript
// 支持所有 HTTP 方法
export async function onRequestGet(context) { }
export async function onRequestPost(context) { }
export async function onRequestPut(context) { }
export async function onRequestDelete(context) { }
export async function onRequestPatch(context) { }
export async function onRequest(context) { } // 所有方法
```

---

## 🔥 实际应用场景

### 1. **调用 AI API（你的项目）**
```javascript
// functions/api/chat.js
export async function onRequestPost(context) {
  const { message } = await context.request.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    headers: { 'x-api-key': context.env.CLAUDE_API_KEY }
  })

  return new Response(JSON.stringify(await response.json()))
}
```

### 2. **用户认证**
```javascript
// functions/api/login.js
export async function onRequestPost(context) {
  const { username, password } = await context.request.json()

  // 验证用户
  const user = await validateUser(username, password)

  // 生成 JWT token
  const token = await generateJWT(user, context.env.JWT_SECRET)

  return new Response(JSON.stringify({ token }))
}
```

### 3. **操作数据库**
```javascript
// functions/api/todos.js
export async function onRequestGet(context) {
  // 使用 Cloudflare D1 (SQLite)
  const results = await context.env.DB
    .prepare('SELECT * FROM todos')
    .all()

  return new Response(JSON.stringify(results))
}

export async function onRequestPost(context) {
  const { title } = await context.request.json()

  await context.env.DB
    .prepare('INSERT INTO todos (title) VALUES (?)')
    .bind(title)
    .run()

  return new Response('Todo created!')
}
```

### 4. **文件上传**
```javascript
// functions/api/upload.js
export async function onRequestPost(context) {
  const formData = await context.request.formData()
  const file = formData.get('file')

  // 上传到 Cloudflare R2 (S3 兼容存储)
  await context.env.MY_BUCKET.put(file.name, file)

  return new Response('File uploaded!')
}
```

### 5. **发送邮件**
```javascript
// functions/api/send-email.js
export async function onRequestPost(context) {
  const { to, subject, body } = await context.request.json()

  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${context.env.SENDGRID_API_KEY}`
    },
    body: JSON.stringify({ to, subject, html: body })
  })

  return new Response('Email sent!')
}
```

---

## 🆚 与传统后端对比

| 特性 | 传统后端 | Cloudflare Pages Functions |
|------|----------|---------------------------|
| **服务器管理** | 需要自己维护 | 无需管理，自动扩展 |
| **部署位置** | 单个数据中心 | 全球 300+ 边缘节点 |
| **冷启动** | 无 | 极快（< 10ms） |
| **定价** | 按服务器计费 | 按请求计费（免费额度：100k/天）|
| **扩展性** | 需要配置负载均衡 | 自动无限扩展 |
| **延迟** | 取决于地理位置 | 全球低延迟（边缘计算）|

---

## 📊 Cloudflare 生态集成

Pages Functions 可以访问整个 Cloudflare 生态：

### **1. KV（键值存储）**
```javascript
await context.env.MY_KV.put('key', 'value')
const value = await context.env.MY_KV.get('key')
```

### **2. D1（SQL 数据库）**
```javascript
await context.env.DB.prepare('SELECT * FROM users').all()
```

### **3. R2（对象存储，S3 兼容）**
```javascript
await context.env.MY_BUCKET.put('file.jpg', fileData)
```

### **4. Durable Objects（有状态对象）**
```javascript
const stub = context.env.CHAT_ROOM.get(id)
await stub.fetch(request)
```

### **5. Workers AI（内置 AI 模型）**
```javascript
const response = await context.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
  messages: [{ role: 'user', content: 'Hello' }]
})
```

---

## 🚀 部署步骤

### 1. **本地开发**
```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 本地运行（支持热重载）
wrangler pages dev dist

# 或者直接用 npm script
npm run dev
```

### 2. **推送到 Git**
```bash
git add .
git commit -m "Add Functions"
git push origin main
```

### 3. **Cloudflare 自动部署**
- Functions 会自动识别并部署
- 访问 `https://your-site.pages.dev/api/chat` 即可

---

## 💰 定价

**免费额度（每天）：**
- 100,000 次请求
- 10ms CPU 时间/请求
- 完全够个人项目使用

**付费版：**
- 超出部分 $0.50/百万请求

---

## ⚠️ 限制

1. **CPU 时间限制**：每个请求最多 50ms（免费版）
2. **无状态**：每次请求都是独立的（需要用 KV/D1 持久化）
3. **文件大小**：单个函数文件最大 1MB
4. **内存限制**：128MB

---

## 🎯 最佳实践

### 1. **环境变量管理**
```bash
# 本地开发：.dev.vars
CLAUDE_API_KEY=sk-ant-xxx

# 生产环境：Cloudflare Dashboard
Settings → Environment variables
```

### 2. **错误处理**
```javascript
export async function onRequest(context) {
  try {
    // 业务逻辑
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

### 3. **CORS 设置**
```javascript
export async function onRequest(context) {
  return new Response('OK', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
```

---

## 📚 参考资源

- 官方文档：https://developers.cloudflare.com/pages/functions/
- Workers 文档：https://developers.cloudflare.com/workers/
- 示例项目：https://github.com/cloudflare/pages-functions-examples

---

## 总结

**Cloudflare Pages = 静态托管 + Serverless 后端**

你不需要：
- ❌ 购买服务器
- ❌ 配置 Nginx/Apache
- ❌ 担心扩展性
- ❌ 管理 DevOps

你只需要：
- ✅ 写代码（JavaScript/TypeScript）
- ✅ 推送到 Git
- ✅ 自动部署全球

这就是现代 Serverless 架构的魅力！🚀
