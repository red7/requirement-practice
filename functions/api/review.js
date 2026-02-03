// Cloudflare Pages Function - DeepSeek v3.2 评审 API
// 路径: functions/api/review.js

export async function onRequestPost(context) {
  try {
    const { messages, documentContent, designSolution, aiIntegration } = await context.request.json()

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

    // 构建评审 prompt
    const reviewPrompt = `
你是一位资深的产品经理和需求分析专家。请对以下用户的需求分析过程进行评审。

## 访谈记录
${messages.map(m => `${m.role === 'user' ? '用户' : '业务方'}: ${m.content}`).join('\n')}

## 需求文档
业务目标: ${documentContent.businessGoals || '未填写'}
痛点清单: ${documentContent.painPoints.join(', ') || '未填写'}
核心功能: ${documentContent.coreFeatures.join(', ') || '未填写'}

## 设计方案
${designSolution}

## AI 结合点方案
${aiIntegration}

---

请严格按照以下五个维度打分（1-100分），并给出犀利但建设性的点评：

1. **需求洞察力 (Insight)**: 是否挖掘出了隐藏的约束条件和真实痛点？是否仅停留在表面需求？
2. **逻辑完备性 (Logic)**: 方案是否覆盖了所有已确认的需求？是否考虑了边界条件和异常场景？
3. **AI 思维 (AI-First)**: AI 结合点是否具备实战价值而非噱头？是否真正优化了流程？
4. **文档专业度 (Professionalism)**: 表达是否精准、结构化？是否使用了产品术语？
5. **方案可行性 (Feasibility)**: 技术上是否可以落地？成本和收益是否合理？

请以 **严格的 JSON 格式** 返回评分，格式如下：

\`\`\`json
{
  "scores": {
    "insight": 75,
    "logic": 68,
    "aiFirst": 82,
    "professionalism": 70,
    "feasibility": 65
  },
  "feedback": {
    "insight": "你在访谈中捕捉到了一些关键信息，但可能错过了隐藏的技术约束。建议多问'如果...会怎样'这类假设性问题。",
    "logic": "方案基本覆盖了主要需求，但在边界条件处理上还有提升空间。",
    "aiFirst": "AI 结合点的想法有一定价值，但需要进一步论证投入产出比。",
    "professionalism": "文档结构清晰，但部分表达可以更精准。",
    "feasibility": "方案整体可行，但需要考虑实施成本和周期。"
  },
  "suggestions": [
    "构建 RAG 增强的智能客服系统，基于历史工单自动生成回复建议",
    "使用 Multi-Agent 协作，实现工单的自动分类、优先级排序和智能路由",
    "引入预测性分析，提前识别高风险工单并主动干预"
  ],
  "overall": "整体表现良好，需求分析能力在中上水平。建议加强对隐藏约束的挖掘，以及提升 AI 方案的可行性论证。"
}
\`\`\`

注意：
- 打分要客观，不要都给高分
- 点评要犀利但建设性
- 建议要具体可执行
- 必须严格返回 JSON 格式
`

    // 调用 DeepSeek API
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3.2',
        messages: [
          { role: 'user', content: reviewPrompt }
        ],
        temperature: 0.3, // 降低温度以获得更稳定的评分
        max_tokens: 2000,
        response_format: { type: 'json_object' } // 强制 JSON 输出
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
    const reviewContent = data.choices[0].message.content

    // 解析 JSON 响应
    let reviewData
    try {
      reviewData = JSON.parse(reviewContent)
    } catch (parseError) {
      // 如果解析失败，尝试提取 JSON
      const jsonMatch = reviewContent.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        reviewData = JSON.parse(jsonMatch[1])
      } else {
        throw new Error('无法解析评审结果')
      }
    }

    return new Response(JSON.stringify({
      success: true,
      review: reviewData,
      usage: data.usage
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Review Function Error:', error)
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
