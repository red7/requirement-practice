import { useState, useRef, useEffect } from 'react'
import { Send, Copy, ArrowRight, AlertCircle } from 'lucide-react'
import useAppStore, { PHASES } from '../stores/useAppStore'
import { sendChatMessage, getMockResponse } from '../utils/api'

export default function ChatPhase() {
  const { messages, taskBackground, selectedPersona, selectedIndustry, addMessage, setPhase } = useAppStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [useRealAPI, setUseRealAPI] = useState(true) // 切换真实 API / 模拟模式
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: `哎呀，最近真的是忙死了...对了，跟你说个事儿。${taskBackground}。你有什么想法吗？`
      })
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    addMessage({ role: 'user', content: userMessage })
    setIsLoading(true)

    try {
      let aiReply

      if (useRealAPI) {
        // 使用真实的 DeepSeek API
        aiReply = await sendChatMessage(
          userMessage,
          selectedPersona,
          selectedIndustry,
          messages
        )
      } else {
        // 使用模拟响应（用于本地测试）
        await new Promise(resolve => setTimeout(resolve, 1000))
        aiReply = getMockResponse(selectedPersona)
      }

      addMessage({ role: 'assistant', content: aiReply })
    } catch (err) {
      console.error('发送消息失败:', err)
      setError(err.message)

      // 如果 API 失败，回退到模拟模式
      if (useRealAPI) {
        const fallbackResponse = getMockResponse(selectedPersona)
        addMessage({ role: 'assistant', content: fallbackResponse })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const extractToWorkspace = (content) => {
    alert('内容已提取到工作台！（将在文档阶段使用）')
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">需求访谈</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">与业务方深入沟通，挖掘真实需求</p>
          </div>
          <button
            onClick={() => setPhase(PHASES.DOCUMENTING)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            进入文档编写
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => extractToWorkspace(message.content)}
                    className="mt-2 text-xs flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-3 h-3" />
                    提取到工作台
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
              <AlertCircle className="w-4 h-4" />
              <span>API 调用失败: {error}（已使用模拟响应）</span>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="输入你的问题..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 提示：尝试问一些结构化的问题，比如"具体的流程是什么"、"遇到异常情况怎么办"等
            </p>
            <button
              onClick={() => setUseRealAPI(!useRealAPI)}
              className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {useRealAPI ? '🤖 真实 API' : '🎭 模拟模式'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
