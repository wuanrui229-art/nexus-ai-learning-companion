import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Scan, Network, MessageCircle, RefreshCw, Wifi, Battery, User } from 'lucide-react';
import { cn } from './lib/utils';
import EcosystemPage from './pages/Ecosystem';
import CapturePage from './pages/Capture';
import GraphPage from './pages/Graph';
import ChatPage from './pages/Chat';
import ProfilePage from './pages/Profile';
import QuizPage from './pages/Quiz';
import QuizPreparePage from './pages/QuizPrepare';
import QuizSessionPage from './pages/QuizSession';
import QuizResultPage from './pages/QuizResult';
import DeepLearningPage from './pages/DeepLearning';
import LearningPathPage from './pages/LearningPath';
import DocumentPreviewPage from './pages/DocumentPreview';
import VideoLearningPage from './pages/VideoLearningPage';
import ArticleReadingPage from './pages/ArticleReadingPage';
import PDFReadingPage from './pages/PDFReadingPage';
import InterviewPositionPage from './pages/InterviewPosition';
import InterviewPreparePage from './pages/InterviewPrepare';
import InterviewSessionPage from './pages/InterviewSession';
import InterviewReportPage from './pages/InterviewReport';
import PushHistoryPage from './pages/PushHistory';
import SharePreviewPage from './pages/SharePreview';
import { useData } from './context/DataContext';

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center justify-center w-full py-2 transition-colors duration-200",
      active ? "text-indigo-600" : "text-slate-400"
    )}
  >
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center"
    >
      <Icon className={cn("w-6 h-6 mb-1", active && "animate-pulse")} />
      <span className="text-[10px] font-bold leading-none tracking-tight">{label}</span>
    </motion.div>
  </Link>
);

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isSyncing } = useData();
  const embedded = new URLSearchParams(window.location.search).get('embed') === '1';
  
  return (
    <div className={cn(
      "flex items-center justify-center font-sans text-slate-900",
      embedded ? "h-screen min-h-0 bg-transparent p-0" : "min-h-screen bg-slate-100 p-4"
    )}>
      {/* 手机外壳 */}
      <div className={cn(
        "relative bg-white overflow-hidden flex flex-col",
        embedded
          ? "w-full h-full rounded-none border-0 shadow-none ring-0"
          : "w-[375px] h-[812px] rounded-[3rem] shadow-2xl border-[8px] border-slate-800 ring-4 ring-slate-200"
      )}>
        {/* 顶部状态栏区域 */}
        <div className="h-11 w-full bg-white flex items-center justify-between px-6 relative z-50">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold">9:41</span>
            {isSyncing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <RefreshCw className="w-3 h-3 text-indigo-500" />
              </motion.div>
            )}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-6 bg-slate-800 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
            <div className="w-10 h-1 bg-slate-700 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 同步指示器浮窗 */}
        <AnimatePresence>
          {isSyncing && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-12 left-1/2 -translate-x-1/2 z-[60] bg-indigo-600 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="text-[10px] font-black tracking-wider leading-none">跨模块知识同步中...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 内容区域 */}
        <main className="flex-1 overflow-hidden relative bg-slate-50">
          <div className="h-full">
            {children}
          </div>
        </main>

        {/* 底部导航栏 */}
        <nav className="h-20 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-2 pb-4">
          <NavItem to="/" icon={MessageCircle} label="生态同步" active={location.pathname === '/'} />
          <NavItem to="/capture" icon={Scan} label="多维采集" active={location.pathname === '/capture'} />
          <NavItem to="/graph" icon={Network} label="知识图谱" active={location.pathname === '/graph'} />
          <NavItem to="/chat" icon={MessageSquare} label="AI 伴侣" active={location.pathname === '/chat'} />
          <NavItem to="/profile" icon={User} label="我的" active={location.pathname === '/profile'} />
        </nav>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<EcosystemPage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/prepare" element={<QuizPreparePage />} />
        <Route path="/quiz/session" element={<QuizSessionPage />} />
        <Route path="/quiz/result" element={<QuizResultPage />} />
        <Route path="/deep-learning" element={<DeepLearningPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/document-preview" element={<DocumentPreviewPage />} />
        <Route path="/learning/video" element={<VideoLearningPage />} />
        <Route path="/learning/article" element={<ArticleReadingPage />} />
        <Route path="/learning/pdf" element={<PDFReadingPage />} />
        <Route path="/interview/position" element={<InterviewPositionPage />} />
        <Route path="/interview/prepare" element={<InterviewPreparePage />} />
        <Route path="/interview/session" element={<InterviewSessionPage />} />
        <Route path="/interview/report" element={<InterviewReportPage />} />
        <Route path="/push-history" element={<PushHistoryPage />} />
        <Route path="/share-preview" element={<SharePreviewPage />} />
      </Routes>
    </MobileLayout>
  );
};

export default App;
