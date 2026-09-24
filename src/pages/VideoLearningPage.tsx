import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  MoreHorizontal, 
  Share2, 
  Heart, 
  ExternalLink, 
  MessageSquare, 
  CheckCircle2, 
  X,
  FastForward,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

interface TimelinePoint {
  time: string;
  seconds: number;
  label: string;
}

const VideoLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, source, duration } = (location.state as { title?: string, source?: string, duration?: string }) || { 
    title: 'Transformer架构深度解析', 
    source: '腾讯视频知识频道',
    duration: '18:45'
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const totalSeconds = 1125; // 18:45
  const timelinePoints: TimelinePoint[] = [
    { time: '02:15', seconds: 135, label: '注意力机制核心' },
    { time: '05:23', seconds: 323, label: 'Transformer架构介绍' },
    { time: '09:40', seconds: 580, label: '编码器与解码器差异' },
    { time: '12:45', seconds: 765, label: '多头注意力详解' },
    { time: '16:10', seconds: 970, label: '工业界落地案例' },
  ];

  // 模拟播放
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (0.5 * playbackRate);
          if (next >= 100) {
            setIsPlaying(false);
            setShowFinishedModal(true);
            return 100;
          }
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackRate]);

  const handleTimelineClick = (point: TimelinePoint) => {
    const percent = (point.seconds / totalSeconds) * 100;
    setProgress(percent);
    setIsPlaying(true);
  };

  const handleMarkComplete = () => {
    setShowFinishedModal(true);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* 顶部状态栏占位 */}
      <div className="h-4 bg-white" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-50 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full h-10 w-10"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </Button>
        <div className="flex-1 px-4 text-center overflow-hidden">
          <h1 className="text-base font-bold text-slate-900 truncate">{title}</h1>
          <p className="text-[10px] text-indigo-500 font-bold">来自腾讯视频知识频道</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
          <MoreHorizontal className="w-5 h-5 text-slate-800" />
        </Button>
      </div>

      {/* 视频播放区 */}
      <div className="relative aspect-video bg-[#0F172A] flex items-center justify-center overflow-hidden shrink-0">
        {/* 占位背景 */}
        <img 
          src="https://modao.cc/agent-py/media/generated_images/2026-05-04/143cc3f494be4cdd9cad30b2f608c1dc.jpg#desc=Video_Playback_Deep_Learning_Tutorial" 
          alt="Video Thumbnail" 
          className="w-full h-full object-cover opacity-40 blur-[2px]"
        />
        
        {/* 播放控制按钮 (中心) */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white fill-white" />
          ) : (
            <Play className="ml-1 w-8 h-8 text-white fill-white" />
          )}
        </motion.button>

        {/* 底部控制条 (模拟) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex flex-col gap-2">
            <div className="h-1 bg-white/30 rounded-full relative">
              <div 
                className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full" 
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/80 font-mono">
              <span>{Math.floor((progress / 100) * totalSeconds / 60).toString().padStart(2, '0')}:{Math.floor(((progress / 100) * totalSeconds) % 60).toString().padStart(2, '0')}</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setPlaybackRate(r => r === 2 ? 1 : r + 0.5)} className="font-bold hover:text-white transition-colors">
                  {playbackRate}x
                </button>
                <FastForward className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* AI知识点时间轴 */}
        <section className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI 知识点时间轴
            </h3>
            <Badge variant="outline" className="text-[10px] border-indigo-100 text-indigo-600 bg-indigo-50">已生成 5 个锚点</Badge>
          </div>
          
          <div className="space-y-3">
            {timelinePoints.map((point, idx) => (
              <motion.div 
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTimelineClick(point)}
                className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 active:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="bg-white px-2 py-1 rounded-lg text-[10px] font-black text-indigo-600 border border-indigo-50 shadow-sm min-w-[48px] text-center">
                  {point.time}
                </div>
                <span className="text-sm font-bold text-slate-700">{point.label}</span>
                <Play className="w-3 h-3 text-slate-300 ml-auto" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 视频简介 */}
        <section className="px-5 pb-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-widest">AI 摘要</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 leading-relaxed">
                本课程系统讲解了Transformer的核心架构，重点分析了多头注意力机制如何解决长距离依赖问题。
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                通过可视化对比，展示了编码器(Encoder)与解码器(Decoder)在不同NLP任务中的差异化应用。
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                结合腾讯PCG真实业务场景，探讨了该架构在大规模短视频内容理解中的工程化落地细节。
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {['Transformer', '神经网络', '深度学习', '腾讯视频'].map(tag => (
                <Badge key={tag} className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-none px-3 py-1 text-[10px] font-bold">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* 操作按钮 */}
        <section className="px-5 pb-8 flex items-center gap-3">
          <Button 
            variant="outline" 
            className={cn("flex-1 h-12 rounded-2xl gap-2 transition-all", isFavorited && "bg-rose-50 border-rose-100 text-rose-500")}
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={cn("w-4 h-4", isFavorited && "fill-rose-500")} />
            {isFavorited ? '已收藏' : '收藏'}
          </Button>
          <Button variant="outline" className="flex-1 h-12 rounded-2xl gap-2">
            <Share2 className="w-4 h-4" />
            分享
          </Button>
          <Button variant="outline" className="flex-1 h-12 rounded-2xl gap-2 group">
            <ExternalLink className="w-4 h-4 group-hover:text-indigo-500" />
            原视频
          </Button>
        </section>
      </div>

      {/* 底部固定栏 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center gap-4">
        <Button 
          variant="outline" 
          className="w-14 h-14 rounded-2xl bg-indigo-50 border-indigo-100 text-indigo-600 shrink-0"
          onClick={() => navigate('/chat')}
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
        <Button 
          className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100"
          onClick={handleMarkComplete}
        >
          标记已完成
        </Button>
      </div>

      {/* 完成确认弹窗 */}
      <AnimatePresence>
        {showFinishedModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500" />
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">学习进度更新！</h2>
              <p className="text-slate-500 text-sm mb-8">
                恭喜！你已完成《{title}》的学习。AI 已为你更新了相关知识图谱的掌握度。
              </p>
              
              <div className="space-y-3">
                <Button 
                  className="w-full h-14 bg-indigo-600 rounded-2xl font-bold"
                  onClick={() => setShowFinishedModal(false)}
                >
                  继续学习
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-12 text-slate-400 font-bold"
                  onClick={() => navigate('/graph')}
                >
                  查看我的图谱
                </Button>
              </div>

              <button 
                onClick={() => setShowFinishedModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 时间显示 */}
      <div className="hidden">2026年05月04日</div>
    </div>
  );
};

export default VideoLearningPage;
