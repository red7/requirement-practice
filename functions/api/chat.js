// Cloudflare Pages Function - DeepSeek v3.2 对话 API
// 路径: functions/api/chat.js

import { generateScenarioPrompt } from './scenarioPrompts.js'

export async function onRequestPost(context) {
  try {
    const { message, persona, industry, conversationHistory = [] } = await context.request.json()

    // 从环境变量获取 API key（安全）
    const DEEPSEEK_API_KEY = context.env.DEEPSEEK_API_KEY

    if (!DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        error: '未配置 API Key'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 生成深度场景化的系统 prompt（根据行业、角色和对话轮次）
    const conversationRound = conversationHistory.length
    const systemPrompt = generateScenarioPrompt(industry, persona, conversationRound)

    // 构建对话历史
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    // 调用阿里云百炼平台 - DeepSeek v3.2 API
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3.2',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek API Error:', error)
      return new Response(JSON.stringify({
        success: false,
        error: `API 调用失败: ${response.status}`
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = await response.json()

    return new Response(JSON.stringify({
      success: true,
      reply: data.choices[0].message.content,
      usage: data.usage // 返回 token 使用情况
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Function Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// CORS 预检请求处理
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

// 生成系统 prompt
function generateSystemPrompt(persona, industry) {
  const industryContext = {
    finance: '金融行业',
    compliance: '合规领域',
    healthcare: '医疗行业',
    ecommerce: '电商行业',
    sports: '运动健康领域'
  }

  const industryName = industryContext[industry] || '某个行业'

  if (persona === 'beginner') {
    return `你现在是${industryName}的业务人员。你的语言逻辑清晰，表达完整，能够准确描述业务痛点和需求。你会主动提供关键信息，包括业务流程、技术约束和具体指标。`
  } else {
    return `你现在是${industryName}的业务人员。你的语言风格是口语化的，偶尔会抱怨工作压力，表达比较破碎。你的对话中会包含30%的无关噪音（如抱怨、琐事）。你知道2个核心痛点和1个硬性技术约束，但只有当用户提问足够具体或结构化时（例如："具体流程是什么"、"有什么限制条件"、"遇到异常怎么办"），你才会逐渐透露这些关键信息。否则，你的回答会比较模糊和情绪化。`
  }
}
