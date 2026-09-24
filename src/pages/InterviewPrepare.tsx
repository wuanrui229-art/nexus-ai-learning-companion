import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, FileText, UserCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

const InterviewPrepare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const position = (location.state as any)?.position || '产品经理';

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 bg-white flex items-center gap-4 border-b border-slate-100">
        <Button variant="ghost" size="icon" onClick={() => navigate('/interview/position')} className="rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-slate-900">{position}面试 · 准备中</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 rounded-full bg-indigo-100 absolute -z-10 blur-xl opacity-60"
          />
          <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
            <AvatarImage src="https://modao.cc/agent-py/media/generated_images/2026-05-05/6b88f3ea79a8456399334a94bf2a5c52.jpg#desc=AI_Interviewer_Avatar" alt="Nexus面试官" />
            <AvatarFallback className="bg-indigo-600 text-white text-xl">N</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Nexus面试官</h2>
          <p className="text-sm text-slate-500 font-medium">准备好开始你的挑战了吗？</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <Card className="p-4 border-slate-100 shadow-sm flex flex-col items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span className="text-xs text-slate-400">预计时长</span>
            <span className="text-sm font-bold text-slate-800">15 分钟</span>
          </Card>
          <Card className="p-4 border-slate-100 shadow-sm flex flex-col items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-slate-400">题目数量</span>
            <span className="text-sm font-bold text-slate-800">8 道题</span>
          </Card>
        </div>

        <div className="w-full p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h3 className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">岗位要求摘要</h3>
          <p className="text-xs text-indigo-700 leading-relaxed font-medium">
            针对{position}岗位，我将重点考察你的逻辑思考能力、行业洞察力以及对新技术（如大语言模型）的落地应用理解。
          </p>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 space-y-3">
        <Button 
          onClick={() => navigate('/interview/session', { state: { position } })}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100"
        >
          开始面试
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/interview/position')}
          className="w-full h-12 text-slate-500 hover:text-slate-600 font-bold"
        >
          返回重选
        </Button>
      </div>
    </div>
  );
};

export default InterviewPrepare;
