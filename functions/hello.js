// functions/hello.js
// 自动映射到 /hello 路径

export async function onRequest(context) {
  return new Response('Hello from Cloudflare Pages Functions!', {
    headers: { 'Content-Type': 'text/plain' }
  })
}

// 支持不同的 HTTP 方法
export async function onRequestGet(context) {
  return new Response('GET request')
}

export async function onRequestPost(context) {
  const body = await context.request.json()
  return new Response(JSON.stringify({
    message: 'POST received',
    data: body
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
