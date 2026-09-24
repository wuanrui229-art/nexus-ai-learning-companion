import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Trophy, 
  BarChart3, 
  RotateCcw, 
  ArrowLeft,
  Info,
  Check,
  ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

// 题型定义
type QuestionType = 'single' | 'multiple' | 'boolean' | 'short';

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  category: string;
}

const QUIZ_DATA: Question[] = [
  {
    id: 1,
    type: 'single',
    category: '强化学习',
    question: '在强化学习中，Agent 通过什么与环境进行交互并获得反馈？',
    options: ['策略 (Policy)', '动作 (Action) 和 奖励 (Reward)', '神经网络层', '数据集'],
    answer: '动作 (Action) 和 奖励 (Reward)',
    explanation: 'Agent 通过执行动作 (Action) 作用于环境，环境返回状态 (State) 和奖励 (Reward) 给 Agent。'
  },
  {
    id: 2,
    type: 'multiple',
    category: '深度学习',
    question: '以下哪些属于常用的深度学习优化算法？（多选）',
    options: ['Adam', 'SGD', 'K-Means', 'RMSprop'],
    answer: ['Adam', 'SGD', 'RMSprop'],
    explanation: 'Adam, SGD 和 RMSprop 都是常用的梯度下降优化算法；K-Means 是聚类算法。'
  },
  {
    id: 3,
    type: 'boolean',
    category: 'Transformer',
    question: 'Transformer 架构中的自注意力机制 (Self-Attention) 允许模型并行处理序列数据。',
    answer: '正确',
    explanation: '自注意力机制消除了序列依赖，使得 Transformer 可以比 RNN 更高效地并行训练。'
  },
  {
    id: 4,
    type: 'short',
    category: '机器学习基础',
    question: '什么是监督学习 (Supervised Learning) 的核心特征？',
    answer: '使用带标签的数据进行训练',
    explanation: '监督学习的核心在于训练集中包含每个样本的期望输出（标签）。'
  }
];

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const progress = ((currentStep + 1) / QUIZ_DATA.length) * 100;
  const currentQuestion = QUIZ_DATA[currentStep];

  const handleOptionSelect = (option: string) => {
    if (submitted[currentQuestion.id]) return;

    if (currentQuestion.type === 'multiple') {
      const currentAnswers = (answers[currentQuestion.id] || []) as string[];
      if (currentAnswers.includes(option)) {
        setAnswers({ ...answers, [currentQuestion.id]: currentAnswers.filter(a => a !== option) });
      } else {
        setAnswers({ ...answers, [currentQuestion.id]: [...currentAnswers, option] });
      }
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: option });
    }
  };

  const handleSubmitQuestion = () => {
    setSubmitted({ ...submitted, [currentQuestion.id]: true });
  };

  const handleNext = () => {
    if (currentStep < QUIZ_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_DATA.forEach(q => {
      const userAnswer = answers[q.id];
      if (q.type === 'multiple') {
        const isCorrect = Array.isArray(userAnswer) && 
                         userAnswer.length === (q.answer as string[]).length &&
                         userAnswer.every(a => (q.answer as string[]).includes(a));
        if (isCorrect) score += 1;
      } else if (q.type === 'short') {
        // 简答题简单模拟：包含关键字即正确
        if (userAnswer && userAnswer.includes('标签')) score += 1;
      } else {
        if (userAnswer === q.answer) score += 1;
      }
    });
    return Math.round((score / QUIZ_DATA.length) * 100);
  };

  if (showResult) {
    const score = calculateScore();
    return (
      <div className="h-full bg-slate-50 flex flex-col">
        {/* Result Header */}
        <div className="bg-white px-6 pt-12 pb-8 border-b border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 left-4"
            onClick={() => navigate('/graph')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
            >
              <Trophy className="w-12 h-12 text-indigo-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800">测评完成！</h1>
            <p className="text-slate-500 text-sm mt-1">今天是 2026年05月04日</p>
          </div>
        </div>

        {/* Result Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 text-center">
                <div className="text-5xl font-black text-indigo-600 mb-2">{score}</div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">总分 (百分制)</div>
              </div>
              <div className="bg-indigo-50 p-4 flex justify-around border-t border-indigo-100/50">
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-700">{QUIZ_DATA.length}</div>
                  <div className="text-[10px] text-indigo-500 font-medium">总题数</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-700">{Math.floor(score / (100 / QUIZ_DATA.length))}</div>
                  <div className="text-[10px] text-indigo-500 font-medium">正确数</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-700">95%</div>
                  <div className="text-[10px] text-indigo-500 font-medium">超越用户</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              题型表现分析
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '核心概念', value: 100, color: 'bg-emerald-500' },
                { label: '逻辑推导', value: 75, color: 'bg-indigo-500' },
                { label: '实战应用', value: 60, color: 'bg-amber-500' },
                { label: '跨域关联', value: 90, color: 'bg-purple-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-lg font-bold text-slate-700">{stat.value}%</div>
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                      <div className={cn("h-full", stat.color)} style={{ width: `${stat.value}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-indigo-100"
            onClick={() => {
              setCurrentStep(0);
              setAnswers({});
              setSubmitted({});
              setShowResult(false);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新测评
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-slate-200 text-slate-600 rounded-2xl h-12 font-bold"
            onClick={() => navigate('/graph')}
          >
            返回知识图谱
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-4 pb-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full -ml-2"
            onClick={() => navigate('/graph')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold text-slate-800">阶段性知识测评</h2>
            <p className="text-[10px] text-slate-400 font-medium">2026年05月03日</p>
          </div>
          <div className="w-10" />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Progress</span>
            <span>{currentStep + 1} / {QUIZ_DATA.length}</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-100" />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none px-2 py-0.5 rounded text-[10px] shrink-0">
                {currentQuestion.category}
              </Badge>
              <h1 className="text-xl font-bold text-slate-800 leading-tight break-words">
                {currentQuestion.question}
                {currentQuestion.type === 'multiple' && (
                  <span className="text-sm font-medium text-slate-400 ml-2 whitespace-nowrap">(多选)</span>
                )}
              </h1>
            </div>

            <div className="space-y-3">
              {currentQuestion.type === 'short' ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"
                    placeholder="请输入您的回答..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                    disabled={submitted[currentQuestion.id]}
                  />
                  {!submitted[currentQuestion.id] && (
                    <Button 
                      className="w-full bg-slate-800 text-white rounded-xl py-6 font-bold"
                      onClick={handleSubmitQuestion}
                      disabled={!answers[currentQuestion.id]}
                    >
                      确认提交
                    </Button>
                  )}
                </div>
              ) : currentQuestion.type === 'boolean' ? (
                <div className="grid grid-cols-2 gap-4">
                  {['正确', '错误'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect(opt)}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                        answers[currentQuestion.id] === opt
                          ? "border-indigo-600 bg-indigo-50/50"
                          : "border-slate-100 bg-white"
                      )}
                      disabled={submitted[currentQuestion.id]}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        answers[currentQuestion.id] === opt ? "bg-indigo-600 border-indigo-600" : "border-slate-200"
                      )}>
                        {answers[currentQuestion.id] === opt && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="font-bold text-slate-700">{opt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                currentQuestion.options?.map((option, index) => {
                  const isSelected = currentQuestion.type === 'multiple' 
                    ? (answers[currentQuestion.id] || []).includes(option)
                    : answers[currentQuestion.id] === option;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-4",
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50/50" 
                          : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                      disabled={submitted[currentQuestion.id]}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5",
                        isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-200"
                      )}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className={cn(
                        "text-sm font-medium leading-relaxed break-words overflow-hidden",
                        isSelected ? "text-indigo-900" : "text-slate-600"
                      )}>
                        {option}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Answer Explanation */}
            <AnimatePresence>
              {(submitted[currentQuestion.id] || (currentQuestion.type !== 'short' && answers[currentQuestion.id] && currentQuestion.type !== 'multiple')) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2"
                >
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">知识解析</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
        <Button 
          variant="outline" 
          className="rounded-xl border-slate-200 text-slate-500 h-12 flex-1 font-bold"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          上一题
        </Button>
        <Button 
          className="rounded-xl bg-slate-900 text-white h-12 flex-1 font-bold shadow-lg shadow-slate-200"
          onClick={handleNext}
          disabled={!answers[currentQuestion.id] || (currentQuestion.type === 'multiple' && answers[currentQuestion.id].length === 0)}
        >
          {currentStep === QUIZ_DATA.length - 1 ? '提交测评' : '下一题'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default QuizPage;
