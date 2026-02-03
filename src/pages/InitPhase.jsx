import { Briefcase, User, ArrowRight } from 'lucide-react'
import useAppStore, { INDUSTRIES, PERSONAS, PHASES } from '../stores/useAppStore'

export default function InitPhase() {
  const { selectedIndustry, selectedPersona, setIndustry, setPersona, setPhase, setTaskBackground } = useAppStore()

  const handleStart = () => {
    if (selectedIndustry && selectedPersona) {
      const tasks = {
        finance: '客户反馈理财产品推荐不够精准，经常推送不相关的产品',
        compliance: '合规审批流程冗长，文档审核平均需要3-5天',
        healthcare: '医疗挂号系统效率低下，患者经常无法预约到合适的时间',
        ecommerce: '用户购物车放弃率高达70%，转化率持续下降',
        sports: '运动数据记录分散，用户难以追踪长期训练效果'
      }

      setTaskBackground(tasks[selectedIndustry])
      setPhase(PHASES.CHAT)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-scifi mb-4">
            Requirement Dojo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            需求道场 - 在实战中磨练你的需求洞察力
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">选择行业场景</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setIndustry(industry.id)}
                className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedIndustry === industry.id
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
              >
                <div className="text-4xl mb-2">{industry.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{industry.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">选择对话难度</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERSONAS.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setPersona(persona.id)}
                className={`p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  selectedPersona === persona.id
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{persona.label}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    难度 {'★'.repeat(persona.difficulty)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{persona.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={!selectedIndustry || !selectedPersona}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-scifi text-white rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            开始挑战
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
