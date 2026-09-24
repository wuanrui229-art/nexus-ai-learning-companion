import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Sparkles, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  CheckCircle2,
  Clock,
  BarChart3,
  Calendar,
  Layers,
  Zap,
  RefreshCw,
  Share2,
  Award,
  MessageSquare,
  Network,
  MoreVertical,
  CheckCircle,
  Circle,
  Trophy,
  History,
  Lightbulb,
  ArrowUpRight,
  User,
  ExternalLink,
  Info,
  Play,
  Bookmark,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';

interface Task {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'read' | 'video' | 'practice' | 'quiz' | 'pdf';
}

interface Stage {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  status: 'locked' | 'current' | 'completed';
}

const LearningPathPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addLearningPath } = useData();
  const state = location.state as { subjectName?: string, subjectId?: string, mode?: 'plan' | 'start' } || {};
  const subjectName = state.subjectName || 'Transformer架构';
  const subjectId = state.subjectId || 'TF';
  const mode = state.mode || 'start';
  
  const [activeTab, setActiveTab] = useState('stages');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (mode === 'start') {
      addLearningPath({
        topic: subjectName,
        status: 'in-progress',
        progress: 45, // Default progress for demo
        estimatedTime: '12小时',
        description: '深入理解 ' + subjectName + ' 的核心机制与应用场景。'
      });
    }
  }, [mode, subjectName]);
  
  // Initial learning path data based on subject
  const [stages, setStages] = useState<Stage[]>([
    {
      id: 'basics',
      name: '入门理解',
      description: '构建核心概念体系，理解基础原理。',
      status: 'completed',
      tasks: [
        { id: 't1', title: '核心术语定义与背景', duration: '30m', completed: true, type: 'read' },
        { id: 't2', title: '基础数学原理回顾', duration: '45m', completed: true, type: 'read' },
        { id: 't3', title: '入门视频：核心概念导读', duration: '15m', completed: true, type: 'video' },
      ]
    },
    {
      id: 'deepdive',
      name: '深度掌握',
      description: '深入算法细节，掌握高级特性与推导。',
      status: 'current',
      tasks: [
        { id: 't4', title: '自注意力机制推导', duration: '60m', completed: false, type: 'practice' },
        { id: 't5', title: '多头注意力实现细节', duration: '45m', completed: false, type: 'read' },
        { id: 't6', title: '位置编码与残差连接', duration: '40m', completed: false, type: 'video' },
      ]
    },
    {
      id: 'practice',
      name: '实践应用',
      description: '在真实场景中部署与优化模型。',
      status: 'locked',
      tasks: [
        { id: 't7', title: '搭建基础模型架构', duration: '120m', completed: false, type: 'practice' },
        { id: 't8', title: '超参数调优实战', duration: '90m', completed: false, type: 'practice' },
      ]
    },
    {
      id: 'assessment',
      name: '测评验证',
      description: '综合评估学习成果，获取能力认证。',
      status: 'locked',
      tasks: [
        { id: 't9', title: '知识点综合测评', duration: '45m', completed: false, type: 'quiz' },
        { id: 't10', title: '实战项目评审', duration: '60m', completed: false, type: 'practice' },
      ]
    }
  ]);

  // Calculate overall progress
  const totalTasks = stages.reduce((acc, stage) => acc + stage.tasks.length, 0);
  const completedTasks = stages.reduce((acc, stage) => acc + stage.tasks.filter(t => t.completed).length, 0);
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const toggleTask = (stageId: string, taskId: string) => {
    setStages(prev => prev.map(stage => {
      if (stage.id === stageId) {
        const newTasks = stage.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        // If all tasks completed, mark stage as completed and next as current
        const allCompleted = newTasks.every(t => t.completed);
        return { ...stage, tasks: newTasks, status: allCompleted ? 'completed' : 'current' as any };
      }
      return stage;
    }));
  };

  const handleAIReplan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Simulate adding a personalized task
      setStages(prev => prev.map(stage => {
        if (stage.status === 'current') {
          return {
            ...stage,
            tasks: [
              ...stage.tasks,
              { id: 'ai-' + Date.now(), title: 'AI 补充：领域前沿论文阅读', duration: '45m', completed: false, type: 'read' }
            ]
          };
        }
        return stage;
      }));
    }, 2000);
  };

  const today = '2026年05月04日';

  if (mode === 'plan') {
    return (
      <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* Planning Header */}
        <div className="bg-white px-6 pt-4 pb-4 border-b border-slate-100 flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">学习路径规划</h1>
              <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-indigo-50 text-[10px]">规划中</Badge>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">添加到学习路径是收集主题，开始深度学习是执行计划</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
          <div className="max-w-md mx-auto space-y-6">
            <section className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-20">
                <Bookmark className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="w-4 h-4 text-indigo-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">添加到学习路径</span>
                </div>
                <h2 className="text-2xl font-black mb-2">{subjectName}</h2>
                <p className="text-xs text-indigo-100 leading-relaxed opacity-90">
                  此主题将被收藏至“待开启”清单。您可以随时从个人中心启动完整学习模式。
                </p>
              </div>
            </section>

            <div className="bg-white rounded-[2.5rem] shadow-sm p-6 border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-4 h-4 text-slate-400" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">学习规划预览</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-700">预计学习时长</span>
                      <span className="text-[10px] text-slate-400">基于社区平均学习速度</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-indigo-600">约 12 小时</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-700">学习难度</span>
                      <span className="text-[10px] text-slate-400">由 AI 评估知识复杂度</span>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">中等难度</Badge>
                </div>
              </div>

              <div className="mt-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <p className="text-[11px] text-indigo-600 font-bold leading-relaxed">
                  💡 提示：添加到学习路径后，您可以在个人中心的「待开启学习路径」中随时开始深度学习。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button 
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                onClick={() => {
                  addLearningPath({
                    topic: subjectName,
                    status: 'planned',
                    progress: 0,
                    estimatedTime: '12小时',
                    description: '深入理解 ' + subjectName + ' 的核心机制与应用场景。'
                  });
                  navigate('/profile');
                }}
              >
                <Bookmark className="w-5 h-5" />
                确认加入学习清单
              </Button>
              
              <Button 
                variant="outline"
                className="w-full h-14 border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-2xl font-black flex items-center justify-center gap-2"
                onClick={() => {
                  addLearningPath({
                    topic: subjectName,
                    status: 'in-progress',
                    progress: 0,
                    estimatedTime: '12小时',
                    description: '深入理解 ' + subjectName + ' 的核心机制与应用场景。'
                  });
                  navigate('/learning-path', { state: { subjectName, subjectId, mode: 'start' }, replace: true });
                }}
              >
                <Play className="w-5 h-5 fill-current" />
                跳过规划，立即开始学习
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 truncate">深度学习进行中</h1>
            <Badge className="bg-emerald-500 text-white border-none text-[9px] h-4">LIVE</Badge>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">正在执行学习计划 · 开始深度学习即刻开始执行</p>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl h-9 border-slate-200 text-slate-500 text-[10px] font-bold gap-1 px-3"
            onClick={() => navigate('/profile')}
          >
             <History className="w-3.5 h-3.5" />
             路径列表
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl h-9 w-9 text-indigo-600 bg-indigo-50"
            onClick={() => navigate('/graph')}
          >
             <Network className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Relationship Explanation Banner */}
        <div className="px-6 mt-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-900 leading-relaxed font-medium">
              当前处于<span className="font-bold">完整学习模式</span>。您可以专注于当前主题，或者通过右上角“路径列表”查看所有已收集的待开启主题。
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <section className="px-6 py-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
             <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <Badge className="bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-100 border-none mb-2">
                     进行中
                   </Badge>
                   <h2 className="text-2xl font-black">{subjectName}</h2>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-indigo-300 uppercase">总进度</p>
                    <p className="text-2xl font-black">{progressPercent}%</p>
                 </div>
               </div>
               
               <Progress value={progressPercent} className="h-2 bg-white/10 mb-6" />
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/5">
                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">已学习时间</p>
                    <p className="text-xl font-black mt-1 text-white">12.5h</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/5">
                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">预计剩余时间</p>
                    <p className="text-xl font-black mt-1 text-white">7.5h</p>
                  </div>
               </div>
             </div>
          </div>
        </section>

        {/* Tab Selection */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full h-12 bg-slate-100 p-1 rounded-2xl">
              <TabsTrigger value="stages" className="rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">学习任务</TabsTrigger>
              <TabsTrigger value="analysis" className="rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">数据分析</TabsTrigger>
              <TabsTrigger value="ai" className="rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">AI 规划</TabsTrigger>
            </TabsList>

            <TabsContent value="stages" className="mt-6 space-y-6">
              {stages.map((stage, idx) => (
                <div key={stage.id} className="relative">
                  {/* Timeline connector */}
                  {idx !== stages.length - 1 && (
                    <div className={cn(
                      "absolute left-4 top-10 bottom-0 w-0.5 z-0",
                      stage.status === 'completed' ? 'bg-indigo-500' : 'bg-slate-200'
                    )} />
                  )}
                  
                  <div className="flex gap-4 relative z-10">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                      stage.status === 'completed' ? 'bg-indigo-600 text-white' : 
                      stage.status === 'current' ? 'bg-white border-2 border-indigo-600 text-indigo-600' : 
                      'bg-white border-2 border-slate-200 text-slate-300'
                    )}>
                      {stage.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : (idx + 1)}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={cn(
                          "font-black text-base",
                          stage.status === 'locked' ? 'text-slate-400' : 'text-slate-900'
                        )}>{stage.name}</h3>
                        {stage.status === 'current' && <Badge className="bg-amber-100 text-amber-700 border-none text-[9px]">当前阶段</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 mb-4 break-words leading-relaxed">{stage.description}</p>
                      
                      <div className="space-y-3">
                        {stage.tasks.map((task) => (
                          <div 
                            key={task.id}
                            onClick={() => {
                              if (stage.status === 'locked') return;
                              if (task.type === 'video') {
                                navigate('/learning/video', { 
                                  state: { 
                                    title: task.title, 
                                    duration: task.duration,
                                    source: '腾讯视频知识频道' 
                                  } 
                                });
                              } else if (task.type === 'read') {
                                navigate('/learning/article', { state: { title: task.title } });
                              } else if (task.type === 'pdf') {
                                navigate('/learning/pdf', { state: { title: task.title } });
                              }
                            }}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer",
                              task.completed ? "bg-slate-50 border-slate-100" : "bg-white border-slate-100 shadow-sm hover:border-indigo-100",
                              stage.status === 'locked' && "opacity-50 grayscale cursor-not-allowed"
                            )}
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (stage.status !== 'locked') toggleTask(stage.id, task.id);
                              }}
                              className={cn(
                                "shrink-0 transition-colors z-10",
                                task.completed ? "text-emerald-500" : "text-slate-300 hover:text-indigo-400"
                              )}
                            >
                              {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-bold break-words leading-tight",
                                task.completed ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700"
                              )}>{task.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {task.duration}
                                </span>
                                <Badge variant="outline" className="text-[8px] h-4 text-slate-400 border-slate-200">
                                  {task.type === 'read' ? '阅读' : task.type === 'video' ? '视频' : task.type === 'practice' ? '实战' : '测评'}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                               <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {completedTasks === totalTasks && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] p-8 text-center"
                >
                   <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-10 h-10 text-emerald-600" />
                   </div>
                   <h3 className="text-xl font-black text-emerald-900 mb-2">学习完成！</h3>
                   <p className="text-sm text-emerald-600 mb-6">你已完成 {subjectName} 的全部学习路径，系统已为你生成学习认证。</p>
                   <div className="flex flex-col gap-3">
                     <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 font-bold" onClick={() => setShowReport(true)}>
                       查看学习报告
                     </Button>
                     <Button variant="outline" className="w-full border-emerald-200 text-emerald-600 rounded-2xl h-12 font-bold">
                       领取数字认证
                     </Button>
                   </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="mt-6 space-y-6">
               <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
                 <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-sm font-black flex items-center gap-2">
                       <BarChart3 className="w-4 h-4 text-indigo-600" />
                       学习趋势与掌握度
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6">
                    <div className="h-40 flex items-end justify-between gap-2 px-2 mb-6">
                       {[40, 65, 30, 85, 55, 90, 75].map((val, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${val}%` }}
                              className={cn(
                                "w-full rounded-t-lg transition-all",
                                i === 5 ? "bg-indigo-600" : "bg-indigo-200"
                              )} 
                            />
                            <span className="text-[8px] font-bold text-slate-400">04/2{8+i}</span>
                         </div>
                       ))}
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">核心概念掌握</span>
                          <span className="text-xs font-black text-indigo-600">92%</span>
                       </div>
                       <Progress value={92} className="h-1.5 bg-slate-100" />
                       
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">数学建模深度</span>
                          <span className="text-xs font-black text-indigo-600">65%</span>
                       </div>
                       <Progress value={65} className="h-1.5 bg-slate-100" />

                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">实战应用能力</span>
                          <span className="text-xs font-black text-indigo-600">40%</span>
                       </div>
                       <Progress value={40} className="h-1.5 bg-slate-100" />
                    </div>
                    
                    <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                       <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-black text-amber-900">优化建议</h4>
                       </div>
                       <p className="text-[11px] text-amber-700 leading-relaxed">
                          检测到你在“数学建模”环节停留时间较长，建议结合 AI 伴侣的公式拆解功能，辅以配套习题强化记忆。
                       </p>
                    </div>
                 </CardContent>
               </Card>

               <div className="grid grid-cols-2 gap-4">
                  <Card className="rounded-3xl border-slate-100 p-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">预计完成</p>
                     <p className="text-lg font-black text-slate-800">2026-05-15</p>
                     <p className="text-[10px] text-emerald-500 font-bold mt-1">提前 2 天</p>
                  </Card>
                  <Card className="rounded-3xl border-slate-100 p-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">活跃时间</p>
                     <p className="text-lg font-black text-slate-800">20:30-22:00</p>
                     <p className="text-[10px] text-indigo-500 font-bold mt-1">高效时段</p>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
               <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                     <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">AI 智能规划</h3>
                    <p className="text-sm text-slate-500">基于你的当前进度、知识盲区及学习目标，动态调整最优路径。</p>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                        <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">加速模式</p>
                          <p className="text-[10px] text-slate-400">过滤已掌握概念，缩短路径 30%</p>
                        </div>
                        <div className="ml-auto w-10 h-6 bg-slate-200 rounded-full p-1 cursor-pointer">
                           <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl text-left border border-indigo-100">
                        <Target className="w-5 h-5 text-indigo-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-indigo-900">实战导向</p>
                          <p className="text-[10px] text-indigo-400">增加 2 个开源项目复现环节</p>
                        </div>
                        <div className="ml-auto w-10 h-6 bg-indigo-600 rounded-full p-1 cursor-pointer">
                           <div className="w-4 h-4 bg-white rounded-full shadow-sm ml-auto" />
                        </div>
                     </div>
                  </div>

                  <Button 
                    className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 relative overflow-hidden group"
                    onClick={handleAIReplan}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        生成个性化路径
                      </>
                    )}
                  </Button>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none">
        <div className="max-w-[375px] mx-auto pointer-events-auto flex gap-3">
          <Button 
            className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={() => navigate('/chat', { state: { initialMessage: `我想就 "${subjectName}" 学习路径中的当前进度发起讨论，你能帮我解析一下自注意力机制的数学推导吗？` } })}
          >
             <MessageSquare className="w-5 h-5" />
             AI 伴侣讨论
          </Button>
          <Button variant="outline" className="w-14 h-14 rounded-2xl bg-white border-slate-200 shadow-lg text-slate-600 active:scale-95">
             <Share2 className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Learning Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] w-full max-h-[80%] overflow-y-auto no-scrollbar shadow-2xl relative"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-6 top-6 rounded-full"
                onClick={() => setShowReport(false)}
              >
                <ArrowLeft className="w-5 h-5 rotate-90" />
              </Button>
              
              <div className="p-8 pt-12 text-center">
                 <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Award className="w-12 h-12 text-indigo-600" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 mb-1">学习结项报告</h2>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Generated: {today}</p>
                 
                 <div className="space-y-6 text-left">
                    <section>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">知识图谱变化</h4>
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Network className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800">节点状态更新</p>
                                <p className="text-[10px] text-slate-400">1 个节点由 "模糊" 变为 "精通"</p>
                             </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                       </div>
                    </section>

                    <section>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">能力雷达图</h4>
                       <div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 relative">
                          {/* Simulated Radar Chart */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-20">
                             <div className="w-40 h-40 border border-slate-300 rounded-full" />
                             <div className="w-28 h-28 border border-slate-300 rounded-full absolute" />
                             <div className="w-16 h-16 border border-slate-300 rounded-full absolute" />
                          </div>
                          <svg viewBox="0 0 100 100" className="w-40 h-40 drop-shadow-lg">
                             <polygon points="50,10 90,40 80,85 20,85 10,40" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="2" />
                             <polygon points="50,25 82,45 75,80 30,75 25,45" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="2" />
                          </svg>
                          <div className="absolute top-4 text-[8px] font-bold text-slate-500 uppercase">理论</div>
                          <div className="absolute right-4 top-1/3 text-[8px] font-bold text-slate-500 uppercase">数学</div>
                          <div className="absolute right-8 bottom-4 text-[8px] font-bold text-slate-500 uppercase">应用</div>
                          <div className="absolute left-8 bottom-4 text-[8px] font-bold text-slate-500 uppercase">工具</div>
                          <div className="absolute left-4 top-1/3 text-[8px] font-bold text-slate-500 uppercase">广度</div>
                       </div>
                    </section>

                    <section>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">下一步建议</h4>
                       <ul className="space-y-2">
                          {[
                            '开始 Transformer 变体 (BERT/GPT) 的学习',
                            '尝试在大型数据集上进行模型微调',
                            '参与 GitHub 相关开源项目的代码评审'
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-indigo-50/50 p-3 rounded-xl">
                               <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                               {item}
                            </li>
                          ))}
                       </ul>
                    </section>
                 </div>
                 
                 <div className="mt-10 flex gap-3">
                    <Button className="flex-1 h-12 bg-slate-900 rounded-2xl font-bold gap-2">
                       <Share2 className="w-4 h-4" /> 分享给 QQ 群
                    </Button>
                    <Button variant="outline" className="flex-1 h-12 border-slate-200 rounded-2xl font-bold gap-2">
                       <ExternalLink className="w-4 h-4" /> 腾讯文档
                    </Button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningPathPage;
