import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ChevronRight, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

interface Question {
  id: number;
  type: 'single' | 'multiple' | 'short';
  question: string;
  options?: string[];
}

const QUIZ_DATA: Question[] = [
  {
    id: 1,
    type: 'single',
    question: 'Transformer 架构中，解决长距离依赖问题的核心机制是？',
    options: ['卷积操作 (CNN)', '循环单元 (RNN)', '自注意力机制 (Self-Attention)', '池化层 (Pooling)']
  },
  {
    id: 2,
    type: 'multiple',
    question: '以下哪些是大型语言模型 (LLM) 训练中的常用技术？（多选）',
    options: ['RLHF', '混合专家模型 (MoE)', '卷积神经网络', '量化技术 (Quantization)']
  },
  {
    id: 3,
    type: 'single',
    question: '在 RAG 系统中，Retrieval 阶段的主要目的是？',
    options: ['生成文本答案', '从知识库检索相关文档块', '压缩模型体积', '评估生成内容的流畅度']
  },
  {
    id: 4,
    type: 'short',
    question: '请简述什么是「幻觉」 (Hallucination) 现象及其在 AI 学习中的影响？'
  },
  {
    id: 5,
    type: 'single',
    question: '梯度消失问题最容易出现在哪种类型的神经网络中？',
    options: ['浅层线性网络', '深层神经网络', '单层感知机', 'ResNet']
  }
];

const QuizSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nodeName = location.state?.nodeName || '知识点';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [shortText, setShortText] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (option: string) => {
    const q = QUIZ_DATA[currentStep];
    if (q.type === 'multiple') {
      const current = answers[q.id] || [];
      if (current.includes(option)) {
        setAnswers({ ...answers, [q.id]: current.filter((a: string) => a !== option) });
      } else {
        setAnswers({ ...answers, [q.id]: [...current, option] });
      }
    } else {
      setAnswers({ ...answers, [q.id]: option });
    }
  };

  const handleNext = () => {
    if (QUIZ_DATA[currentStep].type === 'short') {
      setAnswers({ ...answers, [QUIZ_DATA[currentStep].id]: shortText });
    }

    if (currentStep < QUIZ_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
      setShortText('');
    } else {
      navigate('/quiz/result', { state: { nodeName, answers } });
    }
  };

  const currentQuestion = QUIZ_DATA[currentStep];
  const progress = ((currentStep + 1) / QUIZ_DATA.length) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Header */}
      <div className="bg-white px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full h-8 w-8">
            <X className="w-5 h-5 text-slate-400" />
          </Button>
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-black text-amber-600 tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          <div className="w-8" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-black text-slate-900">{currentStep + 1} / {QUIZ_DATA.length}</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-100" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                {currentQuestion.type === 'single' ? '单选题' : currentQuestion.type === 'multiple' ? '多选题' : '简答题'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {currentQuestion.question}
              </h3>
            </div>

            {currentQuestion.type === 'short' ? (
              <textarea
                value={shortText}
                onChange={(e) => setShortText(e.target.value)}
                placeholder="在此输入您的回答..."
                className="w-full h-40 p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm leading-relaxed transition-all resize-none"
              />
            ) : (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, idx) => {
                  const isSelected = currentQuestion.type === 'multiple' 
                    ? (answers[currentQuestion.id] || []).includes(option)
                    : answers[currentQuestion.id] === option;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-4",
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50/50" 
                          : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5",
                        isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-200"
                      )}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className={cn(
                        "text-sm font-bold leading-tight",
                        isSelected ? "text-indigo-900" : "text-slate-600"
                      )}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <Button 
          className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2"
          onClick={handleNext}
          disabled={currentQuestion.type !== 'short' && (!answers[currentQuestion.id] || (currentQuestion.type === 'multiple' && answers[currentQuestion.id].length === 0))}
        >
          {currentStep === QUIZ_DATA.length - 1 ? '提交测验' : '下一题'}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default QuizSession;
