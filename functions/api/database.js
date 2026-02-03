// functions/api/database.js
// 映射到 /api/database

export async function onRequestGet(context) {
  // 1. 访问环境变量（存储敏感信息）
  const DATABASE_URL = context.env.DATABASE_URL

  // 2. 访问 KV 存储（Cloudflare 的 NoSQL 数据库）
  const value = await context.env.MY_KV.get('key')

  // 3. 访问 D1 数据库（Cloudflare 的 SQLite）
  const results = await context.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(1).all()

  // 4. 调用外部 API
  const apiResponse = await fetch('https://api.example.com/data', {
    headers: {
      'Authorization': `Bearer ${context.env.API_KEY}`
    }
  })

  return new Response(JSON.stringify({
    kv: value,
    database: results,
    external: await apiResponse.json()
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
