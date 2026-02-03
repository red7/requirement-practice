// API 调用工具函数
// src/utils/api.js

/**
 * 发送聊天消息到 DeepSeek API
 * @param {string} message - 用户消息
 * @param {string} persona - 角色类型 (beginner/realistic)
 * @param {string} industry - 行业类型
 * @param {Array} conversationHistory - 对话历史
 * @returns {Promise<string>} AI 回复
 */
export async function sendChatMessage(message, persona, industry, conversationHistory = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        persona,
        industry,
        conversationHistory
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || '请求失败')
    }

    // 可选：在控制台显示 token 使用情况
    if (data.usage) {
      console.log('Token 使用:', data.usage)
    }

    return data.reply
  } catch (error) {
    console.error('Chat API error:', error)
    throw error
  }
}

/**
 * 提交方案进行评审
 * @param {Array} messages - 对话消息列表
 * @param {Object} documentContent - 文档内容
 * @param {string} designSolution - 设计方案
 * @param {string} aiIntegration - AI 集成方案
 * @returns {Promise<Object>} 评审结果
 */
export async function submitForReview(messages, documentContent, designSolution, aiIntegration) {
  try {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        documentContent,
        designSolution,
        aiIntegration
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || '评审失败')
    }

    // 可选：在控制台显示 token 使用情况
    if (data.usage) {
      console.log('评审 Token 使用:', data.usage)
    }

    return data.review
  } catch (error) {
    console.error('Review API error:', error)
    throw error
  }
}

/**
 * 模拟 AI 回复（用于本地测试，无需 API key）
 * @param {string} persona - 角色类型
 * @returns {string} 模拟回复
 */
export function getMockResponse(persona) {
  const responses = persona === 'beginner'
    ? [
        '好的，让我详细说一下。主要问题是用户反馈流程太慢，他们经常要等很久才能得到回复。',
        '具体来说，我们现在的系统没有自动分类功能，所有工单都需要人工处理。',
        '另外，我们需要确保符合数据隐私规定，这个很重要。',
        '用户最常见的问题是无法及时得到响应，平均等待时间超过24小时。',
        '系统需要支持多种渠道的接入，包括网页、移动端和邮件。'
      ]
    : [
        '唉，别提了！这个系统真的让人头疼...用户天天在投诉，我都不知道该怎么跟他们解释了。',
        '嗯...其实我也不太清楚技术上怎么实现，就是觉得应该能快一点吧？对了，我下午还有个会...',
        '哦对了，上次老板说过什么数据不能外传的规定，这个你要注意一下啊。',
        '你知道吗，昨天又有客户投诉了，说他们提交的问题石沉大海...真是烦死了。',
        '我们现在都是手动处理，效率太低了。你能不能弄个自动化的？具体怎么弄我也不懂...'
      ]

  return responses[Math.floor(Math.random() * responses.length)]
}
