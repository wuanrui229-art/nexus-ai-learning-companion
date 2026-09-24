import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Pause, Play, Mic, MessageSquare, AlertCircle, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { cn } from '../lib/utils';

const InterviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const position = (location.state as any)?.position || '产品经理';

  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(8);
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [isUserAnswering, setIsUserAnswering] = useState(false);
  const [userAnswerTime, setUserAnswerTime] = useState(0);
  const [showInterruption, setShowInterruption] = useState(false);
  const [waveformColor, setWaveformColor] = useState('bg-purple-500');

  const timerRef = useRef<any>(null);
  const answerTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, timeLeft]);

  useEffect(() => {
    if (isUserAnswering) {
      answerTimerRef.current = setInterval(() => {
        setUserAnswerTime(prev => {
          const next = prev + 1;
          // Interruption trigger: > 60 seconds
          if (next >= 60) {
            triggerInterruption('回答时长超过 60 秒');
          }
          return next;
        });
      }, 1000);
    } else {
      if (answerTimerRef.current) clearInterval(answerTimerRef.current);
      setUserAnswerTime(0);
      setShowInterruption(false);
      setWaveformColor('bg-purple-500');
    }
    return () => {
      if (answerTimerRef.current) clearInterval(answerTimerRef.current);
    };
  }, [isUserAnswering]);

  const triggerInterruption = (reason: string) => {
    setShowInterruption(true);
    setWaveformColor('bg-red-500 animate-pulse');
    // AI Head Shake animation handled in JSX
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
      setIsAiSpeaking(true);
      setIsUserAnswering(false);
      setTimeout(() => setIsAiSpeaking(false), 3000); // Mock AI speaking for 3s
    } else {
      navigate('/interview/report', { state: { position } });
    }
  };

  useEffect(() => {
    // Initial AI greeting
    setTimeout(() => setIsAiSpeaking(false), 2000);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between bg-slate-800/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/interview/prepare')} className="text-white hover:bg-slate-700">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">正在进行</span>
            <span className="text-xs font-bold">{position}面试</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">
            <div className={cn("w-2 h-2 rounded-full", isPaused ? "bg-amber-500" : "bg-green-500 animate-pulse")} />
            <span className="text-xs font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="text-white h-8 w-8">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center">
           <span className="text-indigo-400 text-[10px] font-black tracking-widest uppercase">问题 {currentQuestion} / {totalQuestions}</span>
           <h2 className="text-lg font-bold mt-2 px-4 leading-relaxed">
             {currentQuestion === 1 ? `请先简单介绍一下你自己，并谈谈你对${position}这个岗位的理解。` : 
              `针对当前行业趋势，你认为 AI 如何在${position}领域产生最大的价值？`}
           </h2>
        </div>

        {/* AI Avatar & Interruption */}
        <div className="relative">
          <motion.div 
            animate={showInterruption ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Avatar className="w-32 h-32 border-4 border-slate-700 shadow-2xl">
              <AvatarImage src="https://modao.cc/agent-py/media/generated_images/2026-05-05/36d9d4f36c6b4da18e850bb7725d8c34.jpg#desc=AI_Interviewer_Interviewing" alt="AI Interviewer" />
              <AvatarFallback className="bg-indigo-600 text-3xl">AI</AvatarFallback>
            </Avatar>
            {isAiSpeaking && (
               <div className="absolute inset-0 rounded-full border-4 border-indigo-500 animate-ping opacity-50" />
            )}
          </motion.div>

          <AnimatePresence>
            {showInterruption && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 bg-red-500 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2 z-20"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-bold">不好意思打断一下，请尽量精炼你的核心观点。</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Waveform Animation */}
        <div className="w-full flex items-center justify-center gap-1 h-12">
           {[...Array(12)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ 
                 height: isUserAnswering ? [8, Math.random() * 40 + 10, 8] : [8, 12, 8]
               }}
               transition={{ 
                 repeat: Infinity, 
                 duration: isUserAnswering ? 0.3 + Math.random() * 0.2 : 1.5,
                 delay: i * 0.05 
               }}
               className={cn("w-1.5 rounded-full transition-colors duration-300", waveformColor)}
             />
           ))}
        </div>

        <div className="text-center space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            {isAiSpeaking ? '正在提问...' : isUserAnswering ? '正在倾听你的回答...' : '等待你的回答...'}
          </span>
          {isUserAnswering && (
             <p className={cn("text-xs font-mono", userAnswerTime > 50 ? "text-red-400" : "text-slate-400")}>
               已回答: {userAnswerTime}s / 60s
             </p>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 bg-slate-800/80 backdrop-blur-xl rounded-t-[3rem] border-t border-slate-700">
        <div className="flex items-center justify-around gap-6">
          <Button 
            variant="ghost" 
            className="flex flex-col gap-1 items-center h-auto text-slate-400 hover:text-white"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-[10px] font-bold">文字输入</span>
          </Button>

          <motion.div whileTap={{ scale: 0.9 }}>
            <Button 
              onClick={() => setIsUserAnswering(!isUserAnswering)}
              className={cn(
                "w-20 h-20 rounded-full shadow-2xl transition-all",
                isUserAnswering ? "bg-red-500 hover:bg-red-600 ring-8 ring-red-500/20" : "bg-indigo-600 hover:bg-indigo-700 ring-8 ring-indigo-500/20"
              )}
            >
              <Mic className="w-10 h-10 text-white" />
            </Button>
          </motion.div>

          <Button 
            onClick={handleNext}
            variant="ghost" 
            className="flex flex-col gap-1 items-center h-auto text-slate-400 hover:text-white"
          >
            <div className="w-6 h-6 flex items-center justify-center font-bold text-lg">Next</div>
            <span className="text-[10px] font-bold">下一题</span>
          </Button>
        </div>
        
        <div className="mt-6 flex justify-center">
           <Button variant="link" className="text-slate-500 text-[10px] uppercase font-black tracking-widest" onClick={() => navigate('/interview/report')}>
             结束面试并生成报告
           </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
