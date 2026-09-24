import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  Star, 
  Highlighter, 
  MessageCircle, 
  CheckCircle2,
  ChevronLeft,
  MoreVertical,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

interface Paragraph {
  id: number;
  content: string;
  isHighlighted: boolean;
}

const ArticleReadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [readingProgress, setReadingProgress] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  
  const articleData = {
    title: location.state?.title || '深度学习中的 Transformer 架构演进',
    source: '来自：腾讯文档',
    content: [
      { id: 1, content: 'Transformer 模型自 2017 年由 Google 提出以来，已成为自然语言处理（NLP）领域的基石。其核心在于“注意力机制”（Attention Mechanism），尤其是“自注意力机制”（Self-Attention），使得模型能够并行处理序列数据，并捕捉长距离依赖关系。', isHighlighted: false },
      { id: 2, content: '在传统的循环神经网络（RNN）中，信息是按顺序逐个词传递的，这导致了计算效率低下，且容易出现梯度消失或梯度爆炸的问题。Transformer 通过位置编码（Positional Encoding）取代了循环结构，确保了模型能够感知词序信息，同时充分利用 GPU 的并行计算能力。', isHighlighted: false },
      { id: 3, content: '随着 GPT 系列、BERT 等预训练语言模型的兴起，Transformer 的变体层出不穷。例如，Flash Attention 通过优化显存访问路径，极大提升了模型在长文本场景下的推理速度。而量化技术（Quantization）则使得这些庞大的模型能够在移动端设备上流畅运行。', isHighlighted: false },
      { id: 4, content: '在实际应用中，开发者往往需要根据业务场景对 Transformer 进行剪枝或蒸馏，以平衡精度与成本。例如，在 Nexus AI 学习枢纽中，我们采用了多级缓存机制来加速知识图谱的实时渲染，背后的逻辑同样借鉴了 Transformer 的分层表征思想。', isHighlighted: false },
      { id: 5, content: '未来，多模态 Transformer 将成为主流。它不仅能处理文本，还能直接对图像、音频进行端到端的建模。这意味着 AI 学习助手将能够像人类一样，通过看视频、听讲座来快速吸收新知识，并转化为结构化的思维导图。', isHighlighted: false }
    ]
  };

  const [paragraphs, setParagraphs] = useState<Paragraph[]>(articleData.content);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2000);
  };

  const toggleHighlight = (id: number) => {
    setParagraphs(prev => prev.map(p => 
      p.id === id ? { ...p, isHighlighted: !p.isHighlighted } : p
    ));
    const p = paragraphs.find(p => p.id === id);
    if (!p?.isHighlighted) {
      triggerToast('划线内容已保存至笔记');
    }
  };

  const handleShare = () => {
    triggerToast('分享链接已复制到剪贴板');
  };

  const handleAskAI = () => {
    navigate('/chat', { state: { context: articleData.title } });
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* 顶部状态栏 */}
      <header className="flex flex-col border-b border-slate-100 pt-2 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 h-12">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </Button>
          <div className="flex-1 text-center px-4">
            <h1 className="text-sm font-bold text-slate-800 truncate">{articleData.title}</h1>
            <p className="text-[10px] text-slate-400">{articleData.source}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5 text-slate-700" />
          </Button>
        </div>
        <div className="px-0">
          <Progress value={readingProgress} className="h-[2px] rounded-none bg-slate-50" />
        </div>
      </header>

      {/* 文章正文区域 */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
            {articleData.title}
          </h2>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>2026-05-05</span>
            <span className="text-indigo-600 font-medium">Nexus 智能助手</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          {paragraphs.map((p) => (
            <motion.p
              key={p.id}
              onClick={() => toggleHighlight(p.id)}
              className={cn(
                "text-[15px] leading-relaxed text-slate-700 transition-all duration-300 cursor-pointer p-1 rounded-lg",
                p.isHighlighted ? "bg-yellow-100 border-l-4 border-yellow-400 pl-3 shadow-sm" : "hover:bg-slate-50"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: p.id * 0.1 }}
            >
              {p.content}
            </motion.p>
          ))}
        </div>

        {/* 占位图 - 文章相关图片 */}
        <div className="my-8 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src="https://modao.cc/agent-py/media/generated_images/2026-05-04/ed4da66b3e024736a38b16a7f751d453.jpg#desc=Transformer_Architecture_Diagram_showing_multi-head_attention_and_feed-forward_layers_in_deep_learning" 
            alt="Transformer Architecture Diagram"
            className="w-full h-auto"
          />
        </div>

        <div className="h-20" /> {/* 底部留空 */}
      </main>

      {/* 底部固定操作栏 */}
      <footer className="h-20 bg-white/90 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-4 pb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setIsFavorited(!isFavorited);
            triggerToast(isFavorited ? '已从收藏夹移除' : '已收藏至学习库');
          }}
          className={cn(
            "flex-col gap-1 h-12 px-0 w-16",
            isFavorited ? "text-amber-500" : "text-slate-500"
          )}
        >
          <Star className={cn("w-5 h-5", isFavorited && "fill-amber-500")} />
          <span className="text-[10px] font-medium">收藏</span>
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShare}
          className="flex-col gap-1 h-12 px-0 w-16 text-slate-500"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">分享</span>
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => triggerToast('请点击正文段落进行划线笔记')}
          className="flex-col gap-1 h-12 px-0 w-16 text-slate-500"
        >
          <Highlighter className="w-5 h-5" />
          <span className="text-[10px] font-medium">划线笔记</span>
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleAskAI}
          className="flex-col gap-1 h-12 px-0 w-16 text-indigo-600 font-bold"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          </div>
          <span className="text-[10px]">问 AI</span>
        </Button>
      </footer>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-2xl backdrop-blur-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticleReadingPage;
