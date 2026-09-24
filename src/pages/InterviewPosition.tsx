import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Briefcase, Code, Database, Shield, Layout, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Typography } from '../components/ui/typography';

const positions = [
  { id: 'pm', name: '产品经理', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
  { id: 'algo', name: '算法工程师', icon: Settings, color: 'bg-purple-100 text-purple-600' },
  { id: 'frontend', name: '前端开发工程师', icon: Layout, color: 'bg-green-100 text-green-600' },
  { id: 'data', name: '数据分析师', icon: Database, color: 'bg-orange-100 text-orange-600' },
  { id: 'security', name: '信息安全工程师', icon: Shield, color: 'bg-red-100 text-red-600' },
  { id: 'custom', name: '自定义岗位', icon: Settings, color: 'bg-slate-100 text-slate-600' },
];

const InterviewPosition = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 bg-white flex items-center gap-4 border-b border-slate-100">
        <Button variant="ghost" size="icon" onClick={() => navigate('/chat')} className="rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-slate-900">选择面试岗位</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {positions.map((pos) => (
            <motion.div
              key={pos.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/interview/prepare', { state: { position: pos.name } })}
            >
              <Card className="p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-500 transition-colors h-32 border-slate-100 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl ${pos.color} flex items-center justify-center`}>
                  <pos.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-800">{pos.name}</span>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="bg-indigo-50 p-4 rounded-2xl flex items-start gap-3 border border-indigo-100">
          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5">
            <span className="text-[10px] text-white font-bold">!</span>
          </div>
          <p className="text-xs text-indigo-700 leading-relaxed font-medium">
            AI将根据你的知识图谱生成个性化面试题，包括你最近学习的 Transformer 和 强化学习 相关知识点。
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewPosition;
