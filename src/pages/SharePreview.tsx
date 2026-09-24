import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Download, Copy, MessageCircle, Users, MessageSquare, Star } from 'lucide-react';
import { Button } from '../components/ui/button';

const SharePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nodeTitle } = (location.state as any) || { nodeTitle: '知识节点' };

  const shareTargets = [
    { name: '微信好友', icon: MessageCircle, color: 'bg-emerald-500' },
    { name: '朋友圈', icon: Users, color: 'bg-emerald-600' },
    { name: 'QQ好友', icon: MessageSquare, color: 'bg-blue-500' },
    { name: 'QQ空间', icon: Star, color: 'bg-amber-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <h1 className="text-base font-bold text-slate-800">分享知识卡片</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        {/* Card Preview */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-[320px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 mb-8"
        >
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-100">
              <Share2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-3 leading-tight">{nodeTitle}</h2>
            <p className="text-[11px] text-slate-500 mb-6 leading-relaxed px-2">
              我在 Nexus AI 学习枢纽发现了一个非常有价值的知识点，快来和我一起探索 AI 的奥秘吧！
            </p>
            
            {/* Screenshot Placeholder */}
            <div className="w-full aspect-square bg-slate-50 rounded-2xl relative overflow-hidden mb-6 border border-slate-100">
              <img 
                src={`https://modao.cc/agent-py/media/generated_images/2026-05-05/aba00eaf8fe8431a9b4ac544b352de43.jpg#desc=Knowledge%20Card%3A%20%24}`} 
                alt={`${nodeTitle} Knowledge Card`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Download className="w-3 h-3 text-indigo-600" />
                  <span className="text-[9px] font-bold text-indigo-600">截图预览已生成</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 py-4 border-t border-dashed border-slate-200 w-full">
              <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                 <img src="https://modao.cc/agent-py/media/generated_images/2026-05-05/865a8d08b3404c2d88f917b772edc950.jpg#desc=User" alt="User Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[10px] font-bold text-slate-800">Nexus 用户</p>
                <p className="text-[9px] text-slate-400">分享于 2026-05-05</p>
              </div>
              <div className="w-10 h-10 bg-slate-50 rounded-lg p-1 border border-slate-100">
                 <img src="https://modao.cc/agent-py/media/generated_images/2026-05-05/0f8ee2862b08451a8b03db3167cd8ce3.jpg#desc=QR" alt="QR Code" className="w-full h-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Share Targets */}
        <div className="w-full max-w-[320px]">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5 text-center">分享至</h3>
          <div className="grid grid-cols-4 gap-4">
            {shareTargets.map((target) => {
              const TargetIcon = target.icon;

              return (
                <motion.button
                  key={target.name}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-2"
                  onClick={() => alert(`已成功分享到 ${target.name}`)}
                >
                  <div className={`w-12 h-12 ${target.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200`}>
                    <TargetIcon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">{target.name}</span>
                </motion.button>
              );
            })}
          </div>
          
          <div className="mt-10 flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-600 font-bold gap-2 text-xs">
              <Copy className="w-4 h-4" /> 复制链接
            </Button>
            <Button variant="outline" className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-600 font-bold gap-2 text-xs">
              <Download className="w-4 h-4" /> 保存图片
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePreview;
