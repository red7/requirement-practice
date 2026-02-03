import { useEffect, useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts'
import { RotateCcw, Lightbulb, Loader } from 'lucide-react'
import useAppStore, { PHASES } from '../stores/useAppStore'
import { submitForReview } from '../utils/api'

export default function ReviewPhase() {
  const { messages, documentContent, designSolution, aiIntegration, reviewScores, setReviewScores, reset } = useAppStore()
  const [showRadar, setShowRadar] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [overall, setOverall] = useState('')
  const [useRealAPI, setUseRealAPI] = useState(true)

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true)

      try {
        if (useRealAPI) {
          // 使用真实的 DeepSeek API 进行评审
          const review = await submitForReview(
            messages,
            documentContent,
            designSolution,
            aiIntegration
          )

          setReviewScores(review.scores)
          setFeedback(review.feedback)
          setSuggestions(review.suggestions || [])
          setOverall(review.overall || '')
        } else {
          // 模拟评审（用于测试）
          const mockScores = {
            insight: Math.floor(Math.random() * 30) + 60,
            logic: Math.floor(Math.random() * 30) + 65,
            aiFirst: Math.floor(Math.random() * 30) + 55,
            professionalism: Math.floor(Math.random() * 30) + 70,
            feasibility: Math.floor(Math.random() * 30) + 60
          }

          setReviewScores(mockScores)
          setFeedback({
            insight: '你在访谈中捕捉到了一些关键信息，但可能错过了隐藏的技术约束。',
            logic: '方案基本覆盖了主要需求，但在边界条件处理上还有提升空间。',
            aiFirst: 'AI 结合点的想法有一定价值，但需要进一步论证投入产出比。',
            professionalism: '文档结构清晰，但部分表达可以更精准。',
            feasibility: '方案整体可行，但需要考虑实施成本和周期。'
          })
          setSuggestions([
            '构建 RAG 增强的智能客服系统',
            '使用 Multi-Agent 协作实现智能路由',
            '引入预测性分析识别高风险工单'
          ])
          setOverall('整体表现良好，需求分析能力在中上水平。')
        }

        setTimeout(() => setShowRadar(true), 300)
      } catch (error) {
        console.error('评审失败:', error)
        // 回退到模拟模式
        if (useRealAPI) {
          setUseRealAPI(false)
          return // 重新触发 useEffect
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchReview()
  }, [useRealAPI])

  const radarData = reviewScores ? [
    { subject: '需求洞察力', A: reviewScores.insight, fullMark: 100 },
    { subject: '逻辑完备性', A: reviewScores.logic, fullMark: 100 },
    { subject: 'AI 思维', A: reviewScores.aiFirst, fullMark: 100 },
    { subject: '文档专业度', A: reviewScores.professionalism, fullMark: 100 },
    { subject: '方案可行性', A: reviewScores.feasibility, fullMark: 100 },
  ] : []

  const averageScore = reviewScores
    ? Math.round((reviewScores.insight + reviewScores.logic + reviewScores.aiFirst + reviewScores.professionalism + reviewScores.feasibility) / 5)
    : 0

  const getScoreLevel = (score) => {
    if (score >= 80) return { label: '优秀', color: 'text-green-600 dark:text-green-400' }
    if (score >= 60) return { label: '良好', color: 'text-blue-600 dark:text-blue-400' }
    if (score >= 40) return { label: '及格', color: 'text-yellow-600 dark:text-yellow-400' }
    return { label: '需改进', color: 'text-red-600 dark:text-red-400' }
  }

  const level = getScoreLevel(averageScore)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">五维能力复盘</h1>
          <p className="text-gray-600 dark:text-gray-400">综合评估你的需求分析能力</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              能力雷达图
            </h2>
            {showRadar && (
              <div className="animate-radar-grow">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#6D28D9" strokeOpacity={0.2} />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#6D28D9', fontSize: 12 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF' }} />
                    <Radar
                      name="得分"
                      dataKey="A"
                      stroke="#6D28D9"
                      fill="#6D28D9"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary to-scifi rounded-2xl shadow-xl p-8 text-white text-center">
              <div className="text-sm opacity-90 mb-2">综合得分</div>
              <div className="text-6xl font-bold mb-2">{averageScore}</div>
              <div className={`text-xl font-semibold ${level.color} bg-white dark:bg-gray-800 rounded-full px-4 py-1 inline-block`}>
                {level.label}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">各维度评分</h3>
              {reviewScores && Object.entries({
                insight: '需求洞察力',
                logic: '逻辑完备性',
                aiFirst: 'AI 思维',
                professionalism: '文档专业度',
                feasibility: '方案可行性'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-scifi transition-all duration-1000"
                        style={{ width: `${reviewScores[key]}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-8">
                      {reviewScores[key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mb-6 flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">AI 正在评审你的方案...</p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">专家点评</h3>
              </div>
              {feedback ? (
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  {overall && (
                    <p className="text-base font-medium text-gray-900 dark:text-white mb-4">
                      {overall}
                    </p>
                  )}
                  <p>
                    📊 <strong>需求洞察力：</strong>{feedback.insight}
                  </p>
                  <p>
                    🧩 <strong>逻辑完备性：</strong>{feedback.logic}
                  </p>
                  <p>
                    🤖 <strong>AI 思维：</strong>{feedback.aiFirst}
                  </p>
                  <p>
                    📝 <strong>文档专业度：</strong>{feedback.professionalism}
                  </p>
                  <p>
                    ⚙️ <strong>方案可行性：</strong>{feedback.feasibility}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">暂无详细点评</p>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl shadow-xl p-6 border-2 border-primary/30">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">高阶 AI 解决方案参考</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {suggestions.map((suggestion, idx) => (
                    <p key={idx}>🎯 <strong>方案{idx + 1}：</strong>{suggestion}</p>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              reset()
              setPhase(PHASES.INIT)
            }}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-scifi text-white rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            再来一次
          </button>
        </div>
      </div>
    </div>
  )
}
