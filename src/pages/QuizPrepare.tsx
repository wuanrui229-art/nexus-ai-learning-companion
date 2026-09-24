import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

const QuizPrepare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nodeName = location.state?.nodeName || '深度学习';

  const stats = [
    { label: '题目数量', value: '5题', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: '预计用时', value: '5-8分钟', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: '题型包含', value: '单选/多选/简答', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full h-9 w-9 text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-sm font-bold text-slate-900">{nodeName} · 随堂测验</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-4 relative">
            <Sparkles className="w-10 h-10 text-indigo-600" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-indigo-200 rounded-3xl -z-10"
            />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">AI 智能组卷中</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
            正在根据《{nodeName}》核心知识点及您的近期学习情况生成个性化测验...
          </p>
        </motion.div>

        <div className="space-y-4">
          {stats.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              key={idx}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-sm font-bold text-slate-600">{item.label}</span>
              </div>
              <span className="text-sm font-black text-slate-900">{item.value}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100">
          <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">测验须知</h4>
          <ul className="space-y-2">
            <li className="text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
              <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
              测验过程中将同步更新您的知识掌握度。
            </li>
            <li className="text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
              <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
              结果将包含基于本地 RAG 的详细溯源解析。
            </li>
          </ul>
        </div>
      </div>

      <div className="p-6 border-t border-slate-50 bg-white">
        <Button 
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          onClick={() => navigate('/quiz/session', { state: { nodeName } })}
        >
          开始测验
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default QuizPrepare;
