import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  ChevronRight, 
  RotateCcw, 
  Home, 
  ExternalLink, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Link2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';

interface TraceabilityProps {
  source: string;
  confidence: number;
  type: 'pdf' | 'qq' | 'doc' | 'none';
  link?: string;
}

const TraceabilityInfo = ({ source, confidence, type, link }: TraceabilityProps) => {
  const getColor = (c: number) => {
    if (c >= 90) return 'text-emerald-500 bg-emerald-50';
    if (c >= 70) return 'text-amber-500 bg-amber-50';
    return 'text-rose-500 bg-rose-50';
  };

  const handleLinkClick = () => {
    if (type === 'none') return;
    if (type === 'qq') {
      alert('正在准备下载群文件...');
    } else {
      alert(`正在跳转至: ${source}`);
    }
  };

  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
      <div 
        className={cn(
          "flex items-center gap-1.5 text-[10px] font-bold transition-all",
          type === 'none' ? "text-slate-400 cursor-not-allowed" : "cursor-pointer group"
        )}
        onClick={handleLinkClick}
      >
        <Link2 className={cn("w-3 h-3", type === 'none' ? "text-slate-400" : "text-blue-500")} />
        <span className={cn(
          type === 'none' ? "text-slate-400" : "text-[#8B5CF6] underline decoration-[#8B5CF6]/30 group-hover:decoration-[#8B5CF6]"
        )}>
          {type === 'none' ? '基于通用知识推理（无直接溯源）' : `溯源至${source}`}
        </span>
      </div>
      {type !== 'none' && (
        <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase", getColor(confidence))}>
          RAG置信度：{confidence}%
        </div>
      )}
    </div>
  );
};

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addLearningPath, updateGoalProgress } = useData();
  const nodeName = location.state?.nodeName || '知识点';
  
  const score = 84; // Fixed score for demo
  const isHigh = score >= 80;

  useEffect(() => {
    // Sync to progress bar (simulated by adding a path if it doesn't exist)
    addLearningPath({
      topic: `${nodeName} 测验`,
      status: 'completed',
      progress: 100,
      estimatedTime: '8分钟',
      description: `已完成 ${nodeName} 随堂测验，得分：${score}`
    });

    // Update global goal progress
    updateGoalProgress(5, `完成 ${nodeName} 随堂测验`);
  }, []);

  const quizResults = [
    { id: 1, question: 'Transformer 架构中，解决长距离依赖问题的核心机制是？', user: '自注意力机制 (Self-Attention)', correct: '自注意力机制 (Self-Attention)', status: 'correct', source: '《Transformer精讲》笔记.pdf 第12页', confidence: 94, type: 'pdf' },
    { id: 2, question: '以下哪些是大型语言模型 (LLM) 训练中的常用技术？（多选）', user: 'RLHF, 卷积神经网络', correct: 'RLHF, 混合专家模型 (MoE), 量化技术', status: 'wrong', source: 'AI 前沿动态.docx', confidence: 82, type: 'doc' },
    { id: 3, question: '在 RAG 系统中，Retrieval 阶段的主要目的是？', user: '从知识库检索相关文档块', correct: '从知识库检索相关文档块', status: 'correct', source: '基于通用知识推理（无直接溯源）', confidence: 0, type: 'none' },
    { id: 4, question: '请简述什么是「幻觉」 (Hallucination) 现象？', user: '模型胡言乱语', correct: '模型生成事实性错误但听起来合理的文本', status: 'correct', source: 'QQ群文件: 提示词工程.pdf', confidence: 65, type: 'qq' },
    { id: 5, question: '梯度消失问题最容易出现在哪种类型的神经网络中？', user: 'ResNet', correct: '深层神经网络', status: 'wrong', source: '深度学习理论基础.pdf 第45页', confidence: 91, type: 'pdf' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-20">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
            <Trophy className={cn("w-10 h-10", isHigh ? "text-amber-500" : "text-indigo-500")} />
          </div>

          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">本次测验得分</h2>
          <div className="flex items-baseline gap-1 mb-4">
            <span className={cn("text-6xl font-black tabular-nums", isHigh ? "text-emerald-500" : "text-amber-500")}>
              {score}
            </span>
            <span className="text-xl font-bold text-slate-300">/ 100</span>
          </div>

          <div className="flex gap-2 mb-8">
            {quizResults.map((q, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "w-3 h-3 rounded-full",
                  q.status === 'correct' ? "bg-emerald-500" : "bg-rose-500"
                )} 
              />
            ))}
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">用时</p>
              <p className="text-base font-black text-slate-700">5:24</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">击败同学</p>
              <p className="text-base font-black text-slate-700">92%</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">错题解析与溯源</h3>
            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[10px]">共 5 题</Badge>
          </div>

          <div className="space-y-4">
            {quizResults.map((q, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn(
                    "mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                    q.status === 'correct' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {q.status === 'correct' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-snug">{q.question}</p>
                </div>

                <div className="space-y-2 pl-8 mb-4">
                  {q.status === 'wrong' && (
                    <div className="text-xs">
                      <span className="text-slate-400 font-medium">你的答案：</span>
                      <span className="text-rose-500 font-bold line-through">{q.user}</span>
                    </div>
                  )}
                  <div className="text-xs">
                    <span className="text-slate-400 font-medium">正确答案：</span>
                    <span className="text-emerald-500 font-bold">{q.correct}</span>
                  </div>
                </div>

                <div className="pl-8">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-indigo-600 mb-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">AI 解析</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      {q.status === 'correct' ? '理解非常准确。' : '这里容易混淆。'}此知识点主要考察{q.question.includes('Transformer') ? '自注意力机制在捕捉长距离依赖方面的优势' : '深度学习的基本概念和常见挑战'}。
                    </p>
                    
                    <TraceabilityInfo 
                      source={q.source} 
                      confidence={q.confidence} 
                      type={q.type as any} 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 grid grid-cols-2 gap-4">
        <Button 
          variant="outline"
          className="h-12 rounded-xl border-slate-200 text-slate-600 font-bold gap-2"
          onClick={() => navigate('/graph')}
        >
          <Home className="w-4 h-4" />
          返回图谱
        </Button>
        <Button 
          className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-lg shadow-indigo-100"
          onClick={() => navigate('/quiz/prepare', { state: { nodeName } })}
        >
          <RotateCcw className="w-4 h-4" />
          再测一次
        </Button>
      </div>
    </div>
  );
};

export default QuizResult;
