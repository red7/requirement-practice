import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import useAppStore, { PHASES } from '../stores/useAppStore'

export default function DesignPhase() {
  const { documentContent, setDesignSolution, setAIIntegration, setPhase } = useAppStore()
  const [solution, setSolution] = useState('')
  const [aiPlan, setAIPlan] = useState('')

  const handleSubmit = () => {
    if (solution.trim() && aiPlan.trim()) {
      setDesignSolution(solution)
      setAIIntegration(aiPlan)
      setPhase(PHASES.REVIEW)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">方案设计与 AI 创新</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">提交你的最终功能设计方案</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!solution.trim() || !aiPlan.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            提交方案
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">需求回顾</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">业务目标：</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{documentContent.businessGoals || '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">痛点清单：</span>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-1">
                  {documentContent.painPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">核心功能：</span>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-1">
                  {documentContent.coreFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              功能设计方案
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="详细描述你的功能设计方案，包括：&#10;- 核心功能模块&#10;- 技术架构&#10;- 实现路径&#10;- 预期效果"
              className="w-full h-48 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg p-6 border-2 border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <label className="text-lg font-semibold text-gray-900 dark:text-white">
                AI 结合点挑战 ⚡
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              如果引入 AI 技术（如 Agent、RAG、CV、NLP 等），你将如何彻底优化当前流程？请说明：
            </p>
            <textarea
              value={aiPlan}
              onChange={(e) => setAIPlan(e.target.value)}
              placeholder="描述 AI 技术的应用方案，例如：&#10;- 使用什么 AI 技术（Agent/RAG/CV/NLP等）&#10;- 解决什么核心问题&#10;- 如何优化现有流程&#10;- 预期带来的价值提升"
              className="w-full h-48 px-4 py-3 rounded-xl border-2 border-primary/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ 注意：AI 结合点不是噱头，而是要真正解决问题。请思考：<br/>
              1. 这个 AI 技术是否真的必要？<br/>
              2. 它如何比传统方案更优？<br/>
              3. 实施的可行性如何？
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
