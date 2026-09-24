import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Sparkles, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  Clock,
  BarChart3,
  Calendar,
  Layers,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { cn } from '../lib/utils';

const DeepLearningPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectName, subjectId } = (location.state as { subjectName?: string, subjectId?: string }) || { subjectName: '强化学习', subjectId: 'RL' };
  
  const [activeTab, setActiveTab] = useState('path');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  // 模拟生成AI计划
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPlan(true);
    }, 2000);
  };

  const learningSteps = [
    { id: 1, title: '核心概念理解', desc: '掌握基本定义、历史背景及核心术语体系。', status: 'completed', duration: '2h' },
    { id: 2, title: '数学建模基础', desc: '深入理解背后的数学原理与算法推导过程。', status: 'current', duration: '4h' },
    { id: 3, title: '经典案例剖析', desc: '研究工业界最成功的 5 个应用案例。', status: 'upcoming', duration: '3h' },
    { id: 4, title: '实战项目应用', desc: '在沙盒环境中构建并部署一个基础模型。', status: 'upcoming', duration: '6h' },
    { id: 5, title: '高级优化策略', desc: '探索前沿的优化技巧与跨领域结合点。', status: 'upcoming', duration: '5h' },
  ];

  const resources = [
    { title: `${subjectName}：从入门到精通`, type: '文档', source: 'Nexus 内部库' },
    { title: '斯坦福公开课：高级 AI 专题', type: '视频', source: 'Coursera' },
    { title: '2026 年最新行业趋势报告', type: 'PDF', source: '研究中心' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-6 pt-4 pb-4 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-slate-900 truncate flex items-center gap-1">
            <span className="truncate">深度学习主题</span>
            <span className="text-slate-300 text-xs shrink-0">· {subjectId}</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">最后更新: 2026年05月04日</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Layers className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Subject Overview Section */}
        <section className="px-6 py-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                  当前研究主题
                </Badge>
                <div className="flex items-center gap-1 text-indigo-100 text-[10px] font-bold">
                  <Clock className="w-3 h-3" />
                  已投入 18h
                </div>
              </div>
              <h2 className="text-3xl font-black mb-2 break-words">{subjectName}</h2>
              <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                作为人工智能的核心分支，{subjectName} 在感知、决策与生成领域展现出巨大的潜力。当前您的知识覆盖率为 68%，正处于从基础向高级跨越的关键阶段。
              </p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold mb-1.5 text-indigo-100 uppercase tracking-widest">
                    <span>当前进度</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2 bg-indigo-900/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Tabs */}
        <div className="px-6 flex gap-2 mb-6">
          {[
            { id: 'path', label: '学习路径', icon: BookOpen },
            { id: 'plan', label: 'AI 计划', icon: Sparkles },
            { id: 'resource', label: '关联资源', icon: Target },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border",
                activeTab === tab.id 
                  ? "bg-white border-indigo-100 text-indigo-600 shadow-sm" 
                  : "bg-slate-100 border-transparent text-slate-500"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="px-6">
          {activeTab === 'path' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">结构化学习步骤</h3>
                <span className="text-[10px] font-bold text-slate-400">共 5 个阶段</span>
              </div>
              {learningSteps.map((step, idx) => (
                <div 
                  key={step.id}
                  className={cn(
                    "relative pl-8 pb-6 border-l-2 last:pb-0",
                    step.status === 'completed' ? "border-emerald-500" : 
                    step.status === 'current' ? "border-indigo-500" : "border-slate-200"
                  )}
                >
                  <div className={cn(
                    "absolute -left-[9px] top-0 w-4 h-4 rounded-full flex items-center justify-center border-2 bg-white transition-all",
                    step.status === 'completed' ? "border-emerald-500 bg-emerald-500" : 
                    step.status === 'current' ? "border-indigo-500" : "border-slate-200"
                  )}>
                    {step.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                    {step.status === 'current' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all",
                    step.status === 'current' ? "bg-white border-indigo-100 shadow-md" : "bg-slate-50 border-slate-100"
                  )}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn("text-sm font-bold", step.status === 'current' ? "text-slate-900" : "text-slate-600")}>
                        {step.title}
                      </h4>
                      <Badge variant="outline" className="text-[9px] font-medium h-4 border-slate-200 text-slate-400">
                        {step.duration}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{step.desc}</p>
                    {step.status === 'current' && (
                      <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold">
                        继续学习
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-6">
              {!showPlan && !isGenerating && (
                <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">生成个性化学习计划</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Nexus AI 将根据您的知识背景、学习习惯和目标时间，为您定制最科学的学习节奏。
                  </p>
                  <Button 
                    onClick={handleGeneratePlan}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                  >
                    立即生成
                  </Button>
                </div>
              )}

              {isGenerating && (
                <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center flex flex-col items-center shadow-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="mb-4"
                  >
                    <RefreshCw className="w-10 h-10 text-indigo-500" />
                  </motion.div>
                  <p className="text-sm font-bold text-slate-700">AI 正在深度分析主题权重...</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">预计需要 2 秒</p>
                </div>
              )}

              {showPlan && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                     <Zap className="w-4 h-4 text-amber-500" />
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">AI 建议计划 (2026/05/04)</h3>
                  </div>
                  
                  <Card className="border-indigo-100 shadow-sm rounded-2xl">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-bold text-indigo-600">本周目标：深度闭环</CardTitle>
                        <Badge className="bg-indigo-50 text-indigo-600 border-none text-[9px]">高强度</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      {[
                        { day: '周一', task: '完成数学建模视频教程', time: '1.5h' },
                        { day: '周二', task: '在沙盒环境调试基础模型', time: '2.0h' },
                        { day: '周四', task: '查漏补缺：梯度爆炸问题', time: '1.0h' },
                        { day: '周末', task: '第一阶段综合素质测评', time: '1.0h' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-400 w-8">{item.day}</span>
                            <span className="text-slate-700">{item.task}</span>
                          </div>
                          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{item.time}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <Calendar className="w-4 h-4 text-slate-400 mb-2" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">预计完成日期</p>
                        <p className="text-sm font-black text-slate-800">2026-05-20</p>
                     </div>
                     <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <BarChart3 className="w-4 h-4 text-slate-400 mb-2" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">预估难度系数</p>
                        <p className="text-sm font-black text-slate-800">4.2 / 5.0</p>
                     </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'resource' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest">多维学习资源</h3>
              {resources.map((res, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    if (res.type === '视频') {
                      navigate('/learning/video', { 
                        state: { 
                          title: res.title, 
                          source: '腾讯视频知识频道', 
                          duration: '18:45' 
                        } 
                      });
                    } else if (res.type === 'PDF') {
                      navigate('/learning/pdf', { state: { title: res.title } });
                    } else if (res.type === '文档') {
                      navigate('/learning/article', { state: { title: res.title } });
                    }
                  }}
                  className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                    {res.type === '视频' ? <PlayCircle className="w-6 h-6" /> : 
                     res.type === 'PDF' ? <FileText className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{res.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[9px] font-medium h-4 border-slate-200 text-slate-400">{res.type}</Badge>
                      <span className="text-[10px] text-slate-400 font-medium">来源: {res.type === '视频' ? '腾讯视频' : res.source}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="text-sm font-bold mb-1">正在同步外部社区...</h4>
                   <p className="text-[10px] text-slate-400">正在从 arXiv 和 GitHub 实时抓取相关开源实现</p>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                  <RefreshCw className="w-20 h-20 animate-spin-slow" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none">
        <div className="max-w-[375px] mx-auto pointer-events-auto">
          <Button 
            onClick={() => navigate('/learning-path', { state: { subjectName, subjectId, mode: 'start' } })}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
             进入沉浸学习模式
             <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeepLearningPage;
