import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  HelpCircle, 
  ChevronRight, 
  Bell, 
  Shield, 
  Moon, 
  Target, 
  MessageCircle, 
  Share2, 
  FileText, 
  Network, 
  Clock,
  LogOut,
  Mail,
  Smartphone,
  Lock,
  Bookmark,
  CheckCircle,
  Trophy,
  Plus,
  Calendar,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Star
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { useData } from '../context/DataContext';
import { cn } from '../lib/utils';
import { Trash2 } from 'lucide-react';
import { Typography } from '../components/ui/typography';

// --- Components ---

const GoalSetupModal = ({ open, onOpenChange, onSave }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: (goal: any) => void }) => {
  const [goalType, setGoalType] = useState<'career' | 'exam'>('career');
  const [title, setTitle] = useState('');
  const [subInfo, setSubInfo] = useState('');
  const [deadline, setDeadline] = useState('2026-06-04'); // Default 30 days after 2026-05-05

  const handleSave = () => {
    if (!title) return;
    onSave({
      type: goalType,
      title,
      subInfo,
      deadline,
      progress: 45,
      winRate: 45,
      level: 'Lv.2 入门选手',
      records: [
        { date: '5月4日', title: '点亮CNN节点', increment: 2 },
        { date: '5月3日', title: '完成模拟面试', increment: 5 },
      ]
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">设置你的目标</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setGoalType('career')}
              className={cn(
                "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all",
                goalType === 'career' ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-slate-50"
              )}
            >
              <Briefcase className={cn("w-6 h-6", goalType === 'career' ? "text-indigo-600" : "text-slate-400")} />
              <span className={cn("text-xs font-bold", goalType === 'career' ? "text-indigo-600" : "text-slate-600")}>求职目标</span>
            </div>
            <div 
              onClick={() => setGoalType('exam')}
              className={cn(
                "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all",
                goalType === 'exam' ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-slate-50"
              )}
            >
              <GraduationCap className={cn("w-6 h-6", goalType === 'exam' ? "text-indigo-600" : "text-slate-400")} />
              <span className={cn("text-xs font-bold", goalType === 'exam' ? "text-indigo-600" : "text-slate-600")}>期末目标</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">{goalType === 'career' ? '目标岗位' : '课程名称'}</label>
              <Input 
                placeholder={goalType === 'career' ? "如：腾讯产品经理" : "如：计算机网络"} 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">{goalType === 'career' ? '粘贴JD链接（可选）' : '目标分数'}</label>
              <Input 
                placeholder={goalType === 'career' ? "输入或粘贴链接" : "如：90分"} 
                value={subInfo}
                onChange={(e) => setSubInfo(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">截止日期</label>
              <div className="relative">
                <Input 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="rounded-xl border-slate-200 pl-10"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">
          保存并开始追踪
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const ProgressTracker = ({ goal, onSetGoal, onUpdateGoal }: { goal: any, onSetGoal: () => void, onUpdateGoal: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const longPressTimer = useRef<any>(null);

  const handleStartPress = () => {
    longPressTimer.current = setTimeout(() => {
      setIsExpanded(!isExpanded);
    }, 600);
  };

  const handleEndPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  useEffect(() => {
    if (goal?.progress && (goal.progress % 25 === 0 || goal.progress === 100)) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [goal?.progress]);

  if (!goal) {
    return (
      <Card className="border-none shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white rounded-xl h-[72px] flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all" onClick={onSetGoal}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span className="text-sm text-slate-500">设置一个目标，追踪你的准备进度</span>
          <button className="text-sm text-indigo-600 font-bold ml-1">去设置</button>
        </div>
      </Card>
    );
  }

  const isCompleted = goal.progress >= 100;

  return (
    <div className="space-y-3">
      <motion.div 
        layout
        onPointerDown={handleStartPress}
        onPointerUp={handleEndPress}
        onPointerLeave={handleEndPress}
        className={cn(
          "bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden transition-all select-none",
          isCompleted ? "p-6" : "p-4 h-[96px] flex flex-col justify-between"
        )}
      >
        {isCompleted ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="text-3xl animate-bounce">🎉</div>
            <p className="text-base font-bold text-indigo-600 text-center">恭喜！你已准备好迎接{goal.title}面试！</p>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
               <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(to right, #8B5CF6, #A78BFA)' }} />
            </div>
            <Button className="w-full h-12 bg-indigo-600 text-white rounded-xl font-bold">开始面试实战</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-sm">🎯</span>
                <span className="text-sm font-bold text-slate-800">{goal.title}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase">面邀胜率</span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={goal.winRate}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    className="text-lg font-bold text-indigo-600"
                  >
                    {goal.winRate}%
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 rounded-full relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ backgroundImage: 'linear-gradient(to right, #8B5CF6, #A78BFA)' }}
                  className="absolute inset-y-0 left-0 rounded-full"
                />
                <AnimatePresence>
                  {celebrating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 bg-[#FBBF24]"
                    />
                  )}
                </AnimatePresence>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">{goal.level}</span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-[11px] text-slate-400">
                预计完成时间：5月20日 · 还需点亮8个节点
              </p>
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-none shadow-sm bg-white p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-slate-800">详细增长记录</h4>
                <button onClick={onUpdateGoal} className="text-[10px] text-indigo-600 font-bold">调整目标</button>
              </div>
              <div className="space-y-3">
                {goal.records.map((record: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="text-[11px] text-slate-600">{record.date} {record.title}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-500">+{record.increment}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { syncedItems, learningPaths, removeLearningPath, updateLearningPathStatus, goal, setGoal } = useData();
  const profileScrollRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  // Remove local goal state as it's now in context

  useLayoutEffect(() => {
    if (profileScrollRef.current) {
      profileScrollRef.current.scrollTop = 0;
    }
  }, []);

  // Mocked user data for 2026-05-05
  const user = {
    name: 'Nexus 学研人',
    avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/c1e903f6a6e6411db9a34c3759486a6a.jpg#desc=User_Avatar',
    learningDays: 43, // Changed from 44 to 43 as per prompt
    todayMinutes: 128,
    targetMinutes: 180,
    graphNodes: 258
  };

  const ongoingPaths = learningPaths.filter(lp => lp.status === 'in-progress');
  const plannedPaths = learningPaths.filter(lp => lp.status === 'planned');
  const completedPaths = learningPaths.filter(lp => lp.status === 'completed');

  const journeySteps = [
    { date: '今天', event: '正在深入：' + (ongoingPaths[0]?.topic || 'Transformer 架构'), status: 'in-progress' },
    { date: '昨天', event: '规划了：强化学习基础', status: 'planned' },
    { date: '5月1日', event: '完成了：Python 并发编程', status: 'completed' },
  ];

  const accountBindings = [
    { name: 'QQ群组', icon: Share2, status: '已绑定', color: 'text-blue-500' },
    { name: '腾讯文档', icon: FileText, status: '已绑定', color: 'text-blue-400' },
    { name: '个人文件', icon: Network, status: '已同步', color: 'text-indigo-500' }
  ];

  const settingItems = [
    { name: '通知管理', icon: Bell, type: 'link' },
    { name: '隐私设置', icon: Shield, type: 'link' },
    { name: '深色模式', icon: Moon, type: 'toggle', value: isDarkMode, onChange: () => setIsDarkMode(!isDarkMode) }
  ];

  const menuItems = [
    { name: '使用帮助', icon: HelpCircle, path: '#' },
    { name: '反馈建议', icon: Mail, path: '#' },
    { name: '关于 Nexus AI', icon: Smartphone, path: '#' }
  ];

  return (
    <div ref={profileScrollRef} className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-6">
      <GoalSetupModal 
        open={isGoalModalOpen} 
        onOpenChange={setIsGoalModalOpen} 
        onSave={(newGoal) => setGoal(newGoal)} 
      />

      {/* 顶部背景装饰 */}
      <div className="h-32 shrink-0 bg-indigo-600 w-full relative">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* 用户个人信息卡片 - 1. 顶部：等级信息 */}
      <div className="px-4 -mt-16 relative z-10">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 pb-4">
            <div className="flex items-center gap-4 mb-2">
              <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                <AvatarImage src={user.avatar} alt="User" />
                <AvatarFallback>Nexus</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 overflow-hidden">
                  <h2 className="text-xl font-bold text-slate-800 truncate">{user.name}</h2>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 text-px shrink-0">
                    Lv.4 智识达人
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  已坚持 <span className="text-indigo-600 font-bold">{user.learningDays}</span> 天
                </p>
              </div>
              <Settings className="w-5 h-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. [新增] 目标进度条卡片 */}
      <div className="px-4 mt-3">
        <ProgressTracker 
          goal={goal} 
          onSetGoal={() => setIsGoalModalOpen(true)}
          onUpdateGoal={() => setIsGoalModalOpen(true)}
        />
      </div>

      {/* 3. 我的学习旅程时间线 */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-slate-800 mb-3 ml-1">我的学习旅程</h3>
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-4 space-y-4">
            {journeySteps.map((step, idx) => (
              <div key={idx} className="flex gap-3 relative">
                {idx !== journeySteps.length - 1 && (
                  <div className="absolute left-[9px] top-6 bottom-[-16px] w-[2px] bg-slate-100" />
                )}
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10",
                  step.status === 'in-progress' ? 'bg-indigo-600' : 
                  step.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-400'
                )}>
                  {step.status === 'completed' ? <CheckCircle className="w-3 h-3 text-white" /> : <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <div className="flex-1 pb-2 min-w-0">
                  <div className="flex justify-between items-center mb-0.5 gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase truncate">
                      {step.date}
                    </span>
                    <Badge className={cn(
                      "text-[8px] h-4 border-none font-bold shrink-0",
                      step.status === 'in-progress' ? 'bg-indigo-50 text-indigo-600' : 
                      step.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    )}>
                      {step.status === 'in-progress' ? '进行中' : step.status === 'completed' ? '已完成' : '待开启'}
                    </Badge>
                  </div>
                  <p className="text-xs font-bold text-slate-700 break-words leading-relaxed">
                    {step.event}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. 数据统计 */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-slate-800 mb-3 ml-1">数据统计</h3>
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-none shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-500 mb-1" />
              <span className="text-lg font-bold text-slate-800">{user.todayMinutes}</span>
              <span className="text-[10px] text-slate-500">今日分钟</span>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-lg font-bold text-slate-800">{syncedItems.length}</span>
              <span className="text-[10px] text-slate-500">累计采集</span>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Network className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-lg font-bold text-slate-800">{user.graphNodes}</span>
              <span className="text-[10px] text-slate-500">图谱节点</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. 最近同步文档 */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-slate-800 mb-3 ml-1">最近同步文档</h3>
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {syncedItems.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {syncedItems.slice(0, 3).map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => navigate('/document-preview', { 
                      state: { 
                        id: item.id, 
                        title: item.title, 
                        type: 'doc', 
                        isPersonal: item.tags.includes('私有') 
                      } 
                    })}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                        item.tags.includes('私有') ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                      )}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate flex items-center gap-1.5">
                          {item.title}
                          {item.tags.includes('私有') && <Lock className="w-2.5 h-2.5 text-amber-500" />}
                        </div>
                        <div className="text-[10px] text-slate-400">{item.timestamp} · {item.source}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">暂无同步文档</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 正在进行的学习路径 (Moved after other requested sections if they were specifically ordered) */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3 ml-1">
           <div className="flex items-center gap-2">
             <h3 className="text-sm font-bold text-slate-800">学习执行计划</h3>
             <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px]">进行中</Badge>
           </div>
           <span className="text-[10px] text-indigo-600 font-bold">查看详情</span>
        </div>
        <div className="space-y-3">
          {ongoingPaths.length > 0 ? ongoingPaths.map(path => (
            <Card 
              key={path.id}
              className="border-none shadow-sm bg-gradient-to-r from-indigo-50 to-white cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => navigate('/learning-path', { state: { subjectName: path.topic, mode: 'start' } })}
            >
              <CardContent className="p-4">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                       <Target className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-0.5">
                         <h4 className="text-sm font-bold text-slate-800">{path.topic}</h4>
                         <Badge className="bg-emerald-500 text-white border-none text-[8px] h-3.5 px-1 font-bold uppercase">LIVE</Badge>
                       </div>
                       <p className="text-[10px] text-slate-400">已学习 {path.progress}% · 累计时长 12.5h</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                 </div>
                 <div className="space-y-1.5">
                   <div className="flex justify-between items-center text-[9px]">
                     <span className="text-slate-400">总体进度</span>
                     <span className="text-indigo-600 font-bold">{path.progress}%</span>
                   </div>
                   <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600 transition-all" style={{ width: `${path.progress}%` }} />
                   </div>
                 </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="border-none shadow-sm bg-white p-6 text-center">
              <p className="text-xs text-slate-400">暂无进行中的学习路径</p>
            </Card>
          )}
        </div>
      </div>

      {/* 账号管理 */}
      <div className="px-4 mt-6">
        <Typography variant="h3" className="text-sm font-bold text-slate-800 mb-3 ml-1">账号绑定</Typography>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            {accountBindings.map((account, idx) => (
              <div 
                key={account.name} 
                className={`flex items-center justify-between p-4 ${idx !== accountBindings.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <account.icon className={`w-5 h-5 ${account.color}`} />
                  <span className="text-sm font-medium text-slate-700">{account.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${account.status === '已绑定' ? 'text-slate-400' : 'text-indigo-600'}`}>
                    {account.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 设置项 */}
      <div className="px-4 mt-6">
        <Typography variant="h3" className="text-sm font-bold text-slate-800 mb-3 ml-1">系统设置</Typography>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            {settingItems.map((item, idx) => (
              <div 
                key={item.name} 
                className={`flex items-center justify-between p-4 ${idx !== settingItems.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                </div>
                {item.type === 'toggle' ? (
                  <div 
                    onClick={item.onChange}
                    className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ${item.value ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full transition-transform duration-200 ${item.value ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 帮助与反馈 */}
      <div className="px-4 mt-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            {menuItems.map((item, idx) => (
              <div 
                key={item.name} 
                className={`flex items-center justify-between p-4 ${idx !== menuItems.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 退出登录 */}
      <div className="px-4 mt-8 mb-6">
        <button className="w-full h-12 bg-white text-rose-500 font-bold rounded-xl shadow-sm border border-rose-50 flex items-center justify-center gap-2 active:bg-rose-50 transition-colors leading-none">
          <LogOut className="w-5 h-5" />
          退出当前账号
        </button>
        <Typography variant="muted" className="text-[10px] text-center text-slate-400 mt-4 leading-none">
          Nexus AI 学习枢纽 v1.0.4 | 2026-05-05
        </Typography>
      </div>
    </div>
  );
};

export default Profile;
