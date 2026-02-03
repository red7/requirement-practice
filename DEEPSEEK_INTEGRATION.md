# DeepSeek v3.2 API 集成指南

## API 信息

- **服务商**: 阿里云百炼平台
- **模型**: deepseek-v3.2
- **API 端点**: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- **兼容性**: OpenAI API 格式

---

## 🔐 安全配置

### ⚠️ 重要提醒

你在对话中提供的 API key 已被记录在对话历史中。**强烈建议你立即重置这个 key**！

重置步骤：
1. 访问 https://bailian.console.aliyun.com/
2. 进入 API 管理
3. 删除旧 key 并生成新 key

---

## 📝 环境变量配置

### 本地开发

创建 `.dev.vars` 文件（已在 .gitignore 中，不会提交到 Git）：

```bash
# .dev.vars
DEEPSEEK_API_KEY=sk-你的新key
```

### Cloudflare Pages 生产环境

1. 登录 Cloudflare Dashboard
2. 进入 **Pages** → 你的项目 → **Settings** → **Environment variables**
3. 添加变量：
   - **Variable name**: `DEEPSEEK_API_KEY`
   - **Value**: `sk-你的新key`
   - **Environment**: Production（和 Preview）
4. 保存并重新部署

---

## 🚀 功能实现

### 1. 对话功能（已集成）

**文件**: `functions/api/chat.js`

**特性**:
- ✅ 支持对话历史上下文
- ✅ 根据角色（小白/职场现实）动态调整 system prompt
- ✅ 根据行业（金融/合规/医疗/电商/运动）生成场景
- ✅ 返回 token 使用统计

**API 参数**:
```javascript
{
  model: 'deepseek-v3.2',
  messages: [...],
  temperature: 0.7,    // 创造性（0-2）
  max_tokens: 500,     // 最大输出长度
  top_p: 0.9          // 采样策略
}
```

### 2. 评审功能（已集成）

**文件**: `functions/api/review.js`

**特性**:
- ✅ 综合评估五个维度（需求洞察、逻辑完备、AI思维、文档专业度、方案可行性）
- ✅ 生成详细点评和改进建议
- ✅ 返回 JSON 结构化数据
- ✅ 提供高阶 AI 解决方案参考

**API 参数**:
```javascript
{
  model: 'deepseek-v3.2',
  messages: [...],
  temperature: 0.3,              // 降低随机性，获得稳定评分
  max_tokens: 2000,              // 更长的输出
  response_format: { type: 'json_object' }  // 强制 JSON 输出
}
```

---

## 🎮 前端使用

### ChatPhase（对话页面）

```javascript
import { sendChatMessage } from '../utils/api'

// 发送消息
const reply = await sendChatMessage(
  message,           // 用户消息
  selectedPersona,   // beginner / realistic
  selectedIndustry,  // finance / healthcare / ...
  conversationHistory // 对话历史
)
```

**特性**:
- 🔄 支持切换真实 API / 模拟模式（测试用）
- ⚠️ API 失败时自动回退到模拟响应
- 📊 控制台显示 token 使用情况

### ReviewPhase（评审页面）

```javascript
import { submitForReview } from '../utils/api'

// 提交评审
const review = await submitForReview(
  messages,          // 对话记录
  documentContent,   // 需求文档
  designSolution,    // 设计方案
  aiIntegration     // AI 结合点
)

// 返回结构
{
  scores: {
    insight: 75,
    logic: 68,
    aiFirst: 82,
    professionalism: 70,
    feasibility: 65
  },
  feedback: { ... },
  suggestions: [ ... ],
  overall: "..."
}
```

---

## 💰 成本估算

### DeepSeek v3.2 定价

| 项目 | 价格 |
|------|------|
| 输入 token | ¥0.001 / 1K tokens |
| 输出 token | ¥0.002 / 1K tokens |

### 使用示例

**单次对话**:
- 输入：约 500 tokens（system prompt + 对话历史 + 用户消息）
- 输出：约 200 tokens
- 成本：¥0.001 × 0.5 + ¥0.002 × 0.2 = ¥0.0009（不到 0.001 元）

**单次评审**:
- 输入：约 2000 tokens（完整的对话记录 + 文档 + 方案）
- 输出：约 800 tokens（详细评审）
- 成本：¥0.001 × 2 + ¥0.002 × 0.8 = ¥0.0036（约 0.004 元）

**每天 100 次完整流程**:
- 对话 10 轮 × 100 人 = 1000 次对话
- 评审 100 次
- 总成本：¥0.0009 × 1000 + ¥0.0036 × 100 = ¥1.26/天
- 月成本：约 ¥38

**非常便宜！** 🎉

---

## 🧪 测试方法

### 1. 本地测试（无需 API key）

```javascript
// ChatPhase.jsx 中点击切换按钮
🎭 模拟模式  // 使用预设响应，不调用 API
```

### 2. 本地测试（使用真实 API）

```bash
# 1. 创建 .dev.vars 文件
echo "DEEPSEEK_API_KEY=sk-你的key" > .dev.vars

# 2. 安装 Wrangler
npm install -g wrangler

# 3. 运行开发服务器
wrangler pages dev dist --compatibility-date=2024-01-01

# 4. 或者先构建再运行
npm run build
wrangler pages dev dist
```

### 3. 在线测试（Cloudflare Pages）

1. 推送代码到 Git
2. Cloudflare Pages 自动部署
3. 在 Settings → Environment variables 添加 `DEEPSEEK_API_KEY`
4. 访问你的站点测试

---

## 🔍 调试技巧

### 查看 API 调用日志

**前端（浏览器控制台）**:
```javascript
console.log('Token 使用:', data.usage)
// 输出: { prompt_tokens: 120, completion_tokens: 50, total_tokens: 170 }
```

**后端（Cloudflare Functions）**:
```javascript
console.log('DeepSeek API 响应:', data)
```

在 Cloudflare Dashboard → Pages → 你的项目 → Functions 中查看日志

### 常见错误处理

**1. API Key 错误**
```
Error: API 调用失败: 401
```
解决：检查环境变量 `DEEPSEEK_API_KEY` 是否配置正确

**2. 超出速率限制**
```
Error: API 调用失败: 429
```
解决：等待一段时间或升级 API 套餐

**3. JSON 解析失败**
```
Error: 无法解析评审结果
```
解决：检查 API 返回是否为有效 JSON，或调整 prompt

---

## 🎯 优化建议

### 1. 减少 Token 使用

```javascript
// 只保留最近 5 轮对话
const recentMessages = conversationHistory.slice(-5)
```

### 2. 缓存重复请求

```javascript
// 使用 Cloudflare KV 缓存相同问题的回复
const cached = await context.env.CACHE.get(messageHash)
if (cached) return new Response(cached)
```

### 3. 流式输出（提升体验）

```javascript
// 使用 Server-Sent Events 实现打字机效果
body: JSON.stringify({
  model: 'deepseek-v3.2',
  messages: [...],
  stream: true  // 启用流式输出
})
```

---

## 📚 参考文档

- 阿里云百炼文档: https://help.aliyun.com/zh/model-studio/
- DeepSeek 官网: https://www.deepseek.com/
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/

---

## ✅ 集成检查清单

- [x] 创建 `functions/api/chat.js`
- [x] 创建 `functions/api/review.js`
- [x] 创建 `src/utils/api.js`
- [x] 更新 `ChatPhase.jsx` 使用真实 API
- [x] 更新 `ReviewPhase.jsx` 使用真实 API
- [x] 配置环境变量 `.dev.vars`
- [ ] 重置泄露的 API key（**请立即执行**）
- [ ] 在 Cloudflare 配置 `DEEPSEEK_API_KEY`
- [ ] 测试对话功能
- [ ] 测试评审功能
- [ ] 部署到生产环境

---

## 🔒 安全提醒

**再次强调**：你在对话中提供的 API key 需要立即重置！

**最佳实践**:
- ✅ 永远不要在代码中硬编码 API key
- ✅ 永远不要在对话、邮件、聊天中分享 API key
- ✅ 使用环境变量存储敏感信息
- ✅ 定期轮换 API key
- ✅ 设置 API 使用额度限制

---

## 🎉 集成完成！

现在你的 Requirement Dojo 项目已经拥有真实的 AI 对话和评审能力！

**下一步**:
1. 重置 API key（重要！）
2. 配置环境变量
3. 测试功能
4. 部署到 Cloudflare Pages

祝你使用愉快！🚀
