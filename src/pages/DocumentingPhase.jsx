import { useState } from 'react'
import { ArrowRight, MessageSquare } from 'lucide-react'
import useAppStore, { PHASES } from '../stores/useAppStore'

export default function DocumentingPhase() {
  const { messages, documentContent, updateDocument, setPhase } = useAppStore()
  const [businessGoals, setBusinessGoals] = useState(documentContent.businessGoals)
  const [painPoints, setPainPoints] = useState(documentContent.painPoints.join('\n'))
  const [coreFeatures, setCoreFeatures] = useState(documentContent.coreFeatures.join('\n'))

  const handleSave = () => {
    updateDocument({
      businessGoals,
      painPoints: painPoints.split('\n').filter(p => p.trim()),
      coreFeatures: coreFeatures.split('\n').filter(f => f.trim())
    })
    setPhase(PHASES.DESIGN)
  }

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">访谈记录</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="text-sm">
              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                {message.role === 'user' ? '你' : '业务方'}:
              </div>
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2 flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">需求文档编写</h2>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              进入方案设计
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              业务目标
            </label>
            <textarea
              value={businessGoals}
              onChange={(e) => setBusinessGoals(e.target.value)}
              placeholder="描述项目的核心业务目标..."
              className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              痛点清单（每行一个）
            </label>
            <textarea
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              placeholder="- 用户反馈流程慢&#10;- 缺乏自动分类&#10;- 数据隐私合规问题"
              className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              核心功能列表（每行一个）
            </label>
            <textarea
              value={coreFeatures}
              onChange={(e) => setCoreFeatures(e.target.value)}
              placeholder="- 智能工单分类&#10;- 自动化响应系统&#10;- 数据加密存储"
              className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 提示：整理访谈内容时，重点关注：<br/>
              1. 明确的业务指标和目标<br/>
              2. 用户真正的痛点（而非表面症状）<br/>
              3. 可能存在的隐藏约束条件
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
