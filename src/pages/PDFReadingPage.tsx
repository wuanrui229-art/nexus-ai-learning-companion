import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  MoreVertical, 
  Layers, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Highlighter, 
  Type, 
  Share2,
  CheckCircle2,
  List,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

interface PDFPage {
  id: number;
  content: string;
  image: string;
}

const PDFReadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(12);
  const [zoom, setZoom] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const pdfData = {
    title: location.state?.title || 'Transformer 精讲.pdf',
    pages: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      content: `这是第 ${i + 1} 页的学术内容摘要...`,
      image: `https://modao.cc/agent-py/media/generated_images/2026-05-04/a4ab2557bdcc477997e50b7f3c79cb2d.jpg#desc=Academic_PDF_Page_%24}_for_Transformer_Research_Paper_with_complex_equations_and_diagrams`
    }))
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const pageIndex = Math.round((scrollTop / (scrollHeight - clientHeight)) * (totalPages - 1));
      setCurrentPage(pageIndex + 1);
    }
  };

  const scrollToPage = (pageNumber: number) => {
    if (containerRef.current) {
      const pageHeight = containerRef.current.scrollHeight / totalPages;
      containerRef.current.scrollTo({
        top: (pageNumber - 1) * pageHeight,
        behavior: 'smooth'
      });
      setShowThumbnails(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-200 relative overflow-hidden">
      {/* 顶部栏 */}
      <header className="h-14 bg-slate-900/90 backdrop-blur-md text-white flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex flex-col">
            <span className="text-xs font-bold truncate w-40">{pdfData.title}</span>
            <span className="text-[10px] text-slate-400">{currentPage} / {totalPages} 页</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setShowThumbnails(!showThumbnails)} className="text-white hover:bg-white/10">
            <List className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* PDF 渲染主区域 */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* 侧边缩略图 */}
        <AnimatePresence>
          {showThumbnails && (
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              className="absolute left-0 top-0 bottom-0 w-48 bg-slate-800/95 backdrop-blur-xl z-40 border-r border-slate-700 overflow-y-auto p-4 flex flex-col gap-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300">页面导航</span>
                <Button variant="ghost" size="icon" onClick={() => setShowThumbnails(false)} className="h-6 w-6 text-slate-400">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              {pdfData.pages.map((page) => (
                <div 
                  key={page.id} 
                  onClick={() => scrollToPage(page.id)}
                  className={cn(
                    "relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer group",
                    currentPage === page.id ? "border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={page.image} alt={`Page ${page.id}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 rounded text-[8px] text-white">
                    {page.id}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF 页面滚动容器 */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 touch-pan-y scroll-smooth bg-slate-200"
        >
          {pdfData.pages.map((page) => (
            <motion.div 
              key={page.id}
              style={{ scale: zoom }}
              className="w-full aspect-[3/4] bg-white shadow-xl rounded-sm overflow-hidden relative origin-top mx-auto"
            >
              <img src={page.image} alt={`Page ${page.id}`} className="w-full h-full object-contain" />
              {/* 模拟批注 */}
              {page.id === 1 && (
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[4%] bg-yellow-400/30 border-b border-yellow-500/50" />
              )}
            </motion.div>
          ))}
        </div>

        {/* 缩放控制 */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-2 z-20">
          <Button 
            size="icon" 
            className="rounded-full bg-white/90 shadow-lg text-slate-700 hover:bg-white"
            onClick={() => setZoom(Math.min(2, zoom + 0.2))}
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            className="rounded-full bg-white/90 shadow-lg text-slate-700 hover:bg-white"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            className="rounded-full bg-white/90 shadow-lg text-slate-700 hover:bg-white"
            onClick={() => setZoom(1)}
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
        </div>
      </main>

      {/* 底部功能栏 */}
      <footer className="bg-white border-t border-slate-200 p-4 space-y-4 z-30">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-400 w-8">P. {currentPage}</span>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 w-8">P. {totalPages}</span>
        </div>

        <div className="flex items-center justify-around pb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setIsAnnotating(!isAnnotating);
              triggerToast(isAnnotating ? '已退出批注模式' : '进入批注模式：长按页面可添加高亮');
            }}
            className={cn(
              "flex-col gap-1 h-12 px-0 w-16",
              isAnnotating ? "text-indigo-600" : "text-slate-500"
            )}
          >
            <Highlighter className="w-5 h-5" />
            <span className="text-[10px]">批注</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => triggerToast('文字批注功能已激活')}
            className="flex-col gap-1 h-12 px-0 w-16 text-slate-500"
          >
            <Type className="w-5 h-5" />
            <span className="text-[10px]">文字</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => triggerToast('页面已保存到学习书签')}
            className="flex-col gap-1 h-12 px-0 w-16 text-slate-500"
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px]">书签</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => triggerToast('文档生成分享卡片中...')}
            className="flex-col gap-1 h-12 px-0 w-16 text-slate-500"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[10px]">分享</span>
          </Button>
        </div>
      </footer>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-2xl backdrop-blur-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFReadingPage;
