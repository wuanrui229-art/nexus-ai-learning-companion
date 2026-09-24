import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Mic, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  X,
  Zap,
  ChevronRight,
  Files,
  FileType,
  FileBarChart,
  ClipboardList
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';
import { Typography } from '../components/ui/typography';

const CapturePage = () => {
  const navigate = useNavigate();
  const { addSyncedItem } = useData();
  const [step, setStep] = useState('idle'); // idle, file_selection, scanning, recording, uploading, processing, success
  const [mode, setMode] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);

  const modules = [
    {
      id: 'scan',
      title: '拍照扫描',
      desc: '智能识别纸质文档与笔记',
      icon: <Camera className="w-8 h-8" />,
      color: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/20'
    },
    {
      id: 'voice',
      title: '语音录入',
      desc: '实时记录并提取知识核心',
      icon: <Mic className="w-8 h-8" />,
      color: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20'
    },
    {
      id: 'manual',
      title: '手动上传',
      desc: '支持多格式文件智能分析',
      icon: <Upload className="w-8 h-8" />,
      color: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20'
    }
  ];

  const fileTypes = [
    { id: 'pdf', name: 'PDF 文档', icon: <FileText className="w-6 h-6 text-red-400" /> },
    { id: 'doc', name: 'Word 文档', icon: <FileType className="w-6 h-6 text-blue-400" /> },
    { id: 'ppt', name: 'PPT 演示', icon: <FileBarChart className="w-6 h-6 text-orange-400" /> },
    { id: 'img', name: '图片资料', icon: <ImageIcon className="w-6 h-6 text-emerald-400" /> },
  ];

  const handleModuleClick = (id: string) => {
    setMode(id);
    if (id === 'manual') {
      setStep('file_selection');
    } else if (id === 'scan') {
      setStep('scanning');
      startProgress('processing');
    } else if (id === 'voice') {
      setStep('recording');
      setTimeout(() => {
        setStep('processing');
        startProgress('success');
      }, 3000);
    }
  };

  const startProgress = (nextStep: string) => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(nextStep);
            if (nextStep === 'success') {
              completeCapture();
            }
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleFileSelect = (typeId: string) => {
    setSelectedFileType(typeId);
    setStep('uploading');
    startProgress('processing');
  };

  useEffect(() => {
    if (step === 'processing' && mode !== 'voice') {
       const timer = setTimeout(() => {
         setStep('success');
         completeCapture();
       }, 2500);
       return () => clearTimeout(timer);
    }
  }, [step, mode]);

  const completeCapture = () => {
    let title = '';
    let source = '';
    let tags: string[] = [];

    if (mode === 'scan') {
      title = '手写笔记 - 神经科学概论';
      source = '拍照扫描';
      tags = ['神经科学', '手写', '笔记'];
    } else if (mode === 'voice') {
      title = '语音灵感 - 算法优化思路';
      source = '语音录入';
      tags = ['算法', '灵感', '录音'];
    } else if (mode === 'manual') {
      const typeName = fileTypes.find(f => f.id === selectedFileType)?.name || '文档';
      title = `深度解析 - ${typeName}`;
      source = '手动上传';
      tags = ['文档分析', '智能提取'];
    }

    addSyncedItem({
      title,
      source,
      type: mode === 'voice' ? 'voice' : (mode === 'scan' ? 'vision' : 'doc'),
      tags,
      content: `系统已自动完成对该内容的解析与多维标签提取。基于 Nexus AI 的智能分析，该内容已关联至您的知识图谱。`
    });
  };

  const reset = () => {
    setStep('idle');
    setMode(null);
    setProgress(0);
    setSelectedFileType(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-600/20 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6 pt-12">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => step === 'idle' ? navigate(-1) : reset()}
            className="rounded-full bg-white/5 hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {step === 'idle' ? '多维采集' : (mode === 'manual' ? '文件分析' : '智能采集')}
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Multimodal Perception</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-slate-400 uppercase">AI 在线</span>
        </div>
      </div>

      <div className="px-6 pb-24 relative z-10">
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 pt-4"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">欢迎使用</h2>
                <p className="text-slate-400 text-sm">选择一种方式开始构建你的知识宇宙</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {modules.map((m) => (
                  <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModuleClick(m.id)}
                    className={cn(
                      "relative w-full p-6 rounded-[2rem] border overflow-hidden flex items-center gap-5 transition-all group",
                      m.borderColor,
                      "bg-slate-900/50 backdrop-blur-md"
                    )}
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", m.color)} />
                    <div className={cn("relative z-10 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner", m.iconColor)}>
                      {m.icon}
                    </div>
                    <div className="relative z-10 text-left flex-1">
                      <h3 className="text-lg font-bold mb-0.5">{m.title}</h3>
                      <p className="text-xs text-slate-400">{m.desc}</p>
                    </div>
                    <ChevronRight className="relative z-10 w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                  </motion.button>
                ))}
              </div>

              <div className="mt-12 p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-300 mb-1">小贴士</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    所有采集的内容将由 Nexus AI 自动进行 OCR 识别、语义提取并关联至您的知识图谱。
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'file_selection' && (
            <motion.div 
              key="file_selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pt-6"
            >
              <div className="mb-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-xl shadow-amber-500/5">
                  <Files className="w-10 h-10 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">选择文件</h2>
                <p className="text-slate-400 text-sm px-10">上传后自动智能分析，支持多种文档格式</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {fileTypes.map((ft) => (
                  <button
                    key={ft.id}
                    onClick={() => handleFileSelect(ft.id)}
                    className="p-6 rounded-[2rem] bg-slate-900/80 border border-white/5 hover:border-amber-500/30 transition-all flex flex-col items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {ft.icon}
                    </div>
                    <span className="text-sm font-medium">{ft.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                  <Zap className="w-3 h-3 text-amber-500" />
                  AI 深度解析引擎就绪
                </div>
                <Button 
                  variant="ghost" 
                  onClick={reset}
                  className="text-slate-500 hover:text-white"
                >
                  返回上级
                </Button>
              </div>
            </motion.div>
          )}

          {(step === 'scanning' || step === 'recording' || step === 'uploading') && (
            <motion.div 
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-12">
                <div className="w-40 h-40 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                   {step === 'scanning' && <Camera className="w-16 h-16 text-indigo-400" />}
                   {step === 'recording' && <Mic className="w-16 h-16 text-emerald-400 animate-pulse" />}
                   {step === 'uploading' && <Upload className="w-16 h-16 text-amber-400" />}
                   
                   <svg className="absolute -inset-1 w-[105%] h-[105%] rotate-[-90deg]">
                     <circle 
                        cx="50%" cy="50%" r="48%" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        className={cn(
                          "transition-all duration-300",
                          step === 'scanning' && "text-indigo-500",
                          step === 'recording' && "text-emerald-500",
                          step === 'uploading' && "text-amber-500"
                        )}
                        strokeDasharray="300"
                        strokeDashoffset={300 - (300 * progress / 100)}
                     />
                   </svg>
                </div>
                {step === 'recording' && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [8, 20, 8] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                        className="w-1 bg-emerald-500 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-3">
                {step === 'scanning' && '正在扫描...'}
                {step === 'recording' && '正在录音...'}
                {step === 'uploading' && '正在上传...'}
              </h2>
              <p className="text-slate-400 text-sm">
                {step === 'scanning' && '正在实时提取文本与图形数据'}
                {step === 'recording' && 'AI 正在同步理解语音语境'}
                {step === 'uploading' && '正在将文档传输至云端分析引擎'}
              </p>

              <Button 
                variant="outline" 
                onClick={reset}
                className="mt-12 rounded-full border-white/10 text-slate-400 px-8"
              >
                取消
              </Button>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-24 h-24 relative mb-10">
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-t-2 border-emerald-500 animate-spin [animation-duration:1.5s]" />
                <div className="absolute inset-4 rounded-full border-t-2 border-amber-500 animate-spin [animation-duration:2s]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">AI 深度分析中</h2>
              <p className="text-slate-400 text-sm text-center max-w-[240px] leading-relaxed">
                正在构建语义关联，并将新知识编织进您的个人图谱...
              </p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">采集成功</h2>
              <p className="text-slate-400 text-sm text-center max-w-[280px] leading-relaxed mb-10">
                内容已成功解析并存入您的个人知识库，图谱关联已自动更新。
              </p>

              <div className="space-y-4 w-full px-6">
                <Button 
                  onClick={() => navigate('/graph')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] h-14 font-bold text-lg shadow-xl shadow-indigo-600/20"
                >
                  查看图谱关联
                </Button>
                <Button 
                  variant="outline" 
                  onClick={reset}
                  className="w-full border-white/10 bg-white/5 hover:bg-white/10 rounded-[1.5rem] h-14 font-bold text-slate-300"
                >
                  继续采集
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-10 left-0 w-full px-12 text-center">
         <div className="flex justify-between items-center opacity-30">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white" />
            <span className="px-4 text-[9px] font-black uppercase tracking-[0.4em]">Nexus OS v2.1</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white" />
         </div>
      </div>
    </div>
  );
};

export default CapturePage;
