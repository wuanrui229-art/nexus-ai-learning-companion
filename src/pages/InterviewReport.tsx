import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Award, CheckCircle, TrendingUp, Target, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

const InterviewReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const position = (location.state as any)?.position || '产品经理';

  const scores = [
    { label: '技术能力', value: 85, icon: Award, color: 'text-indigo-500', bg: 'bg-indigo-500' },
    { label: '沟通表达', value: 78, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500' },
    { label: '应变能力', value: 92, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500' },
    { label: '岗位匹配', value: 88, icon: Target, color: 'text-green-500', bg: 'bg-green-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar">
      <div className="p-4 bg-white flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/chat')} className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900">面试评分报告</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-400">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6 pb-24">
        {/* Overall Score */}
        <Card className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none shadow-xl shadow-indigo-100 rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full translate-y-12 -translate-x-12 blur-2xl" />
          
          <span className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-2">综合评估得分</span>
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-black">86</span>
            <span className="text-xl font-bold opacity-70">/100</span>
          </div>
          <div className="mt-4 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold border border-white/30 uppercase tracking-tighter">
            表现优异 · 建议投递
          </div>
        </Card>

        {/* Dimension Scores */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 px-1">
            <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
            能力维度评分
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {scores.map((s, i) => (
              <Card key={i} className="p-4 border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <s.icon className={cn("w-4 h-4", s.color)} />
                    <span className="text-xs font-bold text-slate-700">{s.label}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{s.value}%</span>
                </div>
                <Progress value={s.value} className="h-2 bg-slate-100" />
              </Card>
            ))}
          </div>
        </div>

        {/* Evaluation & Suggestions */}
        <div className="space-y-4">
           <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 px-1">
              <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
              详细评价与改进
           </h3>
           <Card className="p-5 border-slate-100 shadow-sm space-y-4">
              <div>
                 <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" /> 优势亮点
                 </h4>
                 <p className="text-xs text-slate-600 leading-relaxed bg-green-50/50 p-3 rounded-xl border border-green-100/50 font-medium">
                    在回答“AI 如何在{position}领域产生价值”时，你敏锐地结合了你最近学习的 Transformer 模型优化知识，展示了极强的跨领域知识迁移能力。
                 </p>
              </div>
              <div>
                 <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> 改进建议
                 </h4>
                 <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 font-medium">
                    回答长难问题时偶尔会出现逻辑停顿，建议在思考时可以采用“总-分-总”结构。面试过程中有一次回答超时，需注意言语的精炼度。
                 </p>
              </div>
           </Card>
        </div>
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 fixed bottom-0 w-full flex gap-3">
         <Button 
           variant="outline" 
           onClick={() => navigate('/interview/position')}
           className="flex-1 h-12 rounded-xl font-bold border-slate-200 text-slate-600"
         >
           重新面试
         </Button>
         <Button 
           onClick={() => navigate('/chat')}
           className="flex-1 h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
         >
           返回AI伴侣
         </Button>
      </div>
    </div>
  );
};

export default InterviewReport;
