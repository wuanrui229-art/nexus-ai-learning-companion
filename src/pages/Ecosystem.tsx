import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Share2, 
  ShieldCheck, 
  ChevronRight, 
  RefreshCw, 
  FileText, 
  FileCheck,
  FileBox,
  Cloud, 
  Link2, 
  CheckCircle2, 
  Clock, 
  Loader2,
  Zap,
  Grid,
  ArrowRight,
  Download,
  Filter,
  Check,
  X,
  FileSearch,
  Search,
  Layers,
  Sparkles,
  Info,
  Plus,
  Lock,
  FileImage,
  FileSpreadsheet,
  Archive,
  FileWarning,
  Bot,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import { Typography } from '../components/ui/typography';
import { useData } from '../context/DataContext';
import SyncRulesModal, { SyncRules } from '../components/SyncRulesModal';

// --- Types ---
type ImportType = 'qq' | 'tencent-doc' | 'personal-sync' | null;

interface SyncItem {
  id: number;
  source: string;
  content: string;
  time: string;
  type: string;
  sender: string;
  avatar: string;
  status: 'completed' | 'processing' | 'failed';
  progress: number;
  tags: string[];
  extracts: number;
}

interface PersonalFile {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'pdf' | 'word' | 'ppt' | 'excel';
  source: 'qq-personal' | 'tencent-personal';
}

// --- Helper Functions ---
const isWithinRange = (dateStr: string, days: '7' | '30' | 'all') => {
  if (days === 'all') return true;
  const now = new Date('2026-05-05').getTime();
  const target = new Date(dateStr.split(' ')[0]).getTime();
  const diffDays = (now - target) / (1000 * 60 * 60 * 24);
  return diffDays <= parseInt(days);
};

const matchesKeywords = (title: string, keywords: string) => {
  if (!keywords) return true;
  const kwList = keywords.split(/[，,]/).map(k => k.trim()).filter(Boolean);
  return !kwList.some(kw => title.toLowerCase().includes(kw.toLowerCase()));
};

const EcosystemPage = () => {
  const navigate = useNavigate();
  const { addSyncedItem, triggerSync, isSyncing: isGlobalSyncing } = useData();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeImport, setActiveImport] = useState<ImportType>(null);
  const [importStep, setImportStep] = useState(0);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedPersonalSource, setSelectedPersonalSource] = useState<'qq' | 'tencent'>('qq');
  const [autoOrganize, setAutoOrganize] = useState(true);
  const [showQuickActionStatus, setShowQuickActionStatus] = useState<string | null>(null);
  const [importSuccessItem, setImportSuccessItem] = useState<SyncItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncRules, setSyncRules] = useState<SyncRules>({
    timeRange: '7',
    excludeKeywords: '',
    excludeFolders: [],
  });

  const [isPushExpanded, setIsPushExpanded] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushFrequency, setPushFrequency] = useState('每天1条');
  const [selectedPushScenes, setSelectedPushScenes] = useState(['学习提醒', '每日总结', '同步成功', '进度预警', '内容推荐']);
  const [dndStart, setDndStart] = useState('23:00');
  const [dndEnd, setDndEnd] = useState('08:00');

  const [syncItems, setSyncItems] = useState<SyncItem[]>([
    {
      id: 1,
      source: 'QQ群组: 2026 届计算机系',
      content: '同步了群文件中的《Transformer精讲》笔记，涵盖模型压缩与量化技术。',
      time: '10:24',
      type: 'QQ群组解析',
      sender: '学习委员',
      avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/712d2782ee3747d8b1d6b289ff30b8e6.jpg#desc=Academic_Representative_Avatar',
      status: 'completed',
      progress: 100,
      tags: ['Transformer', '笔记'],
      extracts: 5
    },
    {
      id: 2,
      source: 'QQ群组项目组: Nexus 开发小分队',
      content: '正在解析项目组分享的《Attention机制》会议记录.docx 协作资料',
      time: '09:45',
      type: 'QQ群组文件',
      sender: '系统助手',
      avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/d16118b590294b21ab1d6d5bd3a3ac3d.jpg#desc=System_Assistant_Avatar',
      status: 'processing',
      progress: 68,
      tags: ['Attention', '会议记录'],
      extracts: 0
    },
    {
      id: 3,
      source: 'QQ好友: 导师李教授',
      content: '已同步《PyTorch入门》讲义.pptx，包含了最新的深度学习框架实践。',
      time: '08:12',
      type: '文件同步',
      sender: '李教授',
      avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/44ae27b865ee4e59b82dcdd7aa9cd872.jpg#desc=Professor_Avatar',
      status: 'completed',
      progress: 100,
      tags: ['PyTorch', '讲义'],
      extracts: 3
    }
  ]);

  const [docItems, setDocItems] = useState([
    {
      id: 'd1',
      title: '毕业论文大纲 - 2026 届计算机系',
      time: '10分钟前',
      actualDate: '2026-05-05',
      version: 'v2.4',
      author: '本人',
      type: 'doc',
      changes: 12,
      size: '2.5 MB'
    },
    {
      id: 'd2',
      title: '机器学习实验报告 - 第四次小组协作',
      time: '2 小时前',
      actualDate: '2026-05-05',
      version: 'v1.1',
      author: '小组协作',
      type: 'sheet',
      changes: 5,
      size: '1.2 MB'
    },
    {
      id: 'd3',
      title: '项目进度跟踪表',
      time: '昨天',
      actualDate: '2026-05-03',
      version: 'v3.0',
      author: '产品部',
      type: 'ppt',
      changes: 8,
      size: '15.8 MB'
    },
    {
      id: 'd4',
      title: '需求文档 v2.0',
      time: '3 小时前',
      actualDate: '2026-05-05',
      version: 'v2.0',
      author: '张三',
      type: 'doc',
      changes: 4,
      size: '3.1 MB'
    },
    {
      id: 'd5',
      title: '旧版参考资料',
      time: '10天前',
      actualDate: '2026-04-24',
      version: 'v1.0',
      author: '系统',
      type: 'doc',
      changes: 0,
      size: '500 KB'
    }
  ]);

  const [personalFiles, setPersonalFiles] = useState<PersonalFile[]>([
    { id: 'p1', name: '个人论文初稿.pdf', size: '4.2MB', date: '2026-05-03', type: 'pdf', source: 'qq-personal' },
    { id: 'p2', name: '深度学习笔记_2026.word', size: '1.5MB', date: '2026-05-05', type: 'word', source: 'tencent-personal' },
    { id: 'p3', name: '机器学习实验报告_完整版.pdf', size: '2.8MB', date: '2026-05-05', type: 'pdf', source: 'qq-personal' }
  ]);

  const handleQuickSync = () => {
    setShowQuickActionStatus('syncing');
    triggerSync();
    setTimeout(() => {
      setShowQuickActionStatus('completed');
      setTimeout(() => setShowQuickActionStatus(null), 2000);
    }, 3000);
  };

  const handleOrganize = () => {
    setShowQuickActionStatus('organizing');
    setTimeout(() => {
      setShowQuickActionStatus('completed');
      setTimeout(() => setShowQuickActionStatus(null), 2000);
    }, 2500);
  };

  const startImport = (type: ImportType) => {
    setActiveImport(type);
    setImportStep(1);
  };

  const qqGroupFiles = [
    { name: '《Transformer精讲》笔记.pdf', size: '1.2MB', date: '2026-05-02', icon: FileText },
    { name: '《Attention机制》会议记录.docx', size: '850KB', date: '2026-05-05', icon: FileCheck },
    { name: '《PyTorch入门》讲义.pptx', size: '5.6MB', date: '2026-04-28', icon: FileBox },
  ];

  const tencentDocFiles = [
    { name: '项目进度跟踪表.doc', author: '张三', time: '10分钟前', actualDate: '2026-05-05', status: '编辑中' },
    { name: '需求文档 v2.0.sheet', author: '李四', time: '1小时前', actualDate: '2026-05-05', status: '已更新' },
    { name: '毕业论文大纲.doc', author: '本人', time: '刚刚', actualDate: '2026-05-05', status: '已更新' },
    { name: '机器学习实验报告.sheet', author: '小组协作', time: '2小时前', actualDate: '2026-05-05', status: '编辑中' },
  ];

  const qqPersonalFiles = [
    { id: 'q1', name: '我的云盘资料_2026.pdf', size: '5.6MB', date: '2026-05-05', type: 'pdf' },
    { id: 'q2', name: '数学建模竞赛题集.pdf', size: '12.4MB', date: '2026-05-02', type: 'pdf' },
  ];

  const tencentPersonalDocs = [
    { id: 't1', name: '毕业旅行计划.word', size: '2.1MB', date: '2026-05-03', type: 'word' },
    { id: 't2', name: '读书笔记：被讨厌的勇气.word', size: '1.8MB', date: '2026-04-30', type: 'word' },
  ];

  // Derived data
  const filteredTencentDocFiles = tencentDocFiles.filter(item => {
    return isWithinRange(item.actualDate, syncRules.timeRange) && matchesKeywords(item.name, syncRules.excludeKeywords);
  });

  const filteredDocItems = docItems.filter(item => {
    const date = (item as any).actualDate || '2026-05-05';
    return isWithinRange(date, syncRules.timeRange) && matchesKeywords(item.title, syncRules.excludeKeywords);
  });

  const filteredPersonalFiles = personalFiles.filter(item => {
    return isWithinRange(item.date, syncRules.timeRange) && matchesKeywords(item.name, syncRules.excludeKeywords);
  });


  const finishImport = (newItem: SyncItem) => {
    setSyncItems([newItem, ...syncItems]);
    setImportSuccessItem(newItem);
    setImportStep(4); // Success step
    
    // Sync to global context
    addSyncedItem({
      title: newItem.source,
      source: newItem.type,
      type: 'qq',
      tags: newItem.tags,
      content: newItem.content
    });
  };

  // --- QQ Group Simulation ---
  const QQGroupSimulation = () => {
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
    const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const groupFiles = [
      { id: 'f1', name: 'Transformer架构优化深度讲义.pdf', type: 'pdf', size: '2.4MB', date: '2026-05-02', uploader: '张小明', timestamp: new Date('2026-05-02').getTime() },
      { id: 'f2', name: '深度学习实验数据分析表.xlsx', type: 'excel', size: '1.2MB', date: '2026-05-05', uploader: '李华', timestamp: new Date('2026-05-05').getTime() },
      { id: 'f3', name: '小组讨论纪要_20260428.docx', type: 'word', size: '850KB', date: '2026-04-28', uploader: '王五', timestamp: new Date('2026-04-28').getTime() },
      { id: 'f4', name: 'PCG算法流程图-最终版.png', type: 'img', size: '3.5MB', date: '2026-04-20', uploader: '赵六', timestamp: new Date('2026-04-20').getTime() },
      { id: 'f5', name: '项目源码增量备份.zip', type: 'zip', size: '45MB', date: '2026-04-10', uploader: '系统助手', timestamp: new Date('2026-04-10').getTime() },
      { id: 'f6', name: '2026届论文参考文献列表.pdf', type: 'pdf', size: '1.1MB', date: '2026-05-03', uploader: '张小明', timestamp: new Date('2026-05-03').getTime() },
      { id: 'f7', name: 'Attention模型权重参数说明.pdf', type: 'pdf', size: '920KB', date: '2026-05-05', uploader: '系统助手', timestamp: new Date('2026-05-05').getTime() },
    ];

    const filteredFiles = groupFiles.filter(file => {
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      const now = new Date('2026-05-05').getTime();
      const diffDays = (now - file.timestamp) / (1000 * 60 * 60 * 24);
      if (timeFilter === '7d' && diffDays > 7) return false;
      if (timeFilter === '30d' && diffDays > 30) return false;
      return true;
    });

    const chats = [
      { id: 'c1', name: '2026 届计算机系班级群', lastMsg: '[文件] 《Transformer精讲》笔记.pdf', time: '12:00' },
      { id: 'c2', name: 'Nexus 项目实习协作群', lastMsg: '[文件] 《Attention机制》会议记录.docx', time: '11:30' },
      { id: 'c3', name: '数据结构考研交流群', lastMsg: '[文件] 《PyTorch入门》讲义.pptx', time: '11:00' },
    ];

    const runExtraction = () => {
      if (selectedFileIds.length === 0) return;
      setIsSelectModalOpen(false);
      setExtracting(true);
      setTimeout(() => {
        setKeywords(['PCG 场景生成算法', '神经网络渲染', '自动关卡生成']);
        setImportStep(3);
        setExtracting(false);
      }, 2000);
    };

    const getFileIcon = (type: string) => {
      switch (type) {
        case 'pdf': return <FileText className="w-5 h-5 text-rose-500" />;
        case 'excel': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
        case 'word': return <FileText className="w-5 h-5 text-blue-500" />;
        case 'img': return <FileImage className="w-5 h-5 text-amber-500" />;
        case 'zip': return <Archive className="w-5 h-5 text-indigo-500" />;
        default: return <FileText className="w-5 h-5 text-slate-500" />;
      }
    };

    const toggleFile = (id: string) => {
      setSelectedFileIds(prev => 
        prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
      );
    };

    const toggleAll = () => {
      if (selectedFileIds.length === filteredFiles.length) {
        setSelectedFileIds([]);
      } else {
        setSelectedFileIds(filteredFiles.map(f => f.id));
      }
    };

    return (
      <div className="space-y-4">
        {importStep === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography variant="h3" className="text-lg font-bold mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" /> 选择 QQ群组 协作
            </Typography>
            <Typography variant="muted" className="text-[10px] text-slate-400 mb-4 -mt-3">智能解析班级 QQ群组 学习资料与群文件</Typography>
            <div className="space-y-2">
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => { setSelectedChat(chat.name); setImportStep(2); }}
                  className="p-3 border rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{chat.name}</div>
                    <div className="text-[10px] text-slate-400">{chat.lastMsg}</div>
                  </div>
                  <div className="text-[10px] text-slate-300">{chat.time}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {importStep === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
            <Typography variant="h3" className="text-lg font-bold mb-2">QQ群组 AI 智能解析</Typography>
            <Typography variant="muted" className="text-xs text-slate-500 mb-6">正在解析来自 {selectedChat} 的群文件与协作记录</Typography>
            
            <div className="relative h-40 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn(
                  "w-32 h-32 border-4 border-blue-500/20 border-t-blue-500 rounded-full",
                  extracting && "animate-spin"
                )} />
              </div>
              <div className="relative z-10 space-y-2">
                <AnimatePresence>
                  {extracting ? (
                    ['正在提取群文件摘要...', '识别协作关键路径...', '构建知识图谱映射...'].map((text, idx) => (
                      <motion.div 
                        key={text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.8 }}
                        className="text-[10px] font-medium text-slate-600 bg-white shadow-sm border px-3 py-1 rounded-full"
                      >
                        {text}
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                        <FileSearch className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">等待选择解析范围</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Button 
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-2xl shadow-lg shadow-blue-100" 
              onClick={() => setIsSelectModalOpen(true)}
              disabled={extracting}
            >
              {extracting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileSearch className="w-4 h-4 mr-2" />}
              {extracting ? '智能提取中...' : '选择群文件'}
            </Button>
          </motion.div>
        )}

        {importStep === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 群资料解析完成
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-400">提取到的群知识点：</div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  已成功解析 {selectedFileIds.length} 个文件
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map(kw => (
                  <Badge key={kw} className="bg-blue-100 text-blue-700 border-blue-200">
                    {kw}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold">解析报告：</span>
                系统已从 {selectedChat || 'Nexus 项目实习协作群'} 的 {selectedFileIds.length} 个选定文件中提取出关于《{keywords[0] || 'PCG 场景生成算法'}》的核心内容，已自动关联至您的实习项目组知识网络。
              </div>
            </div>
            <Button 
              className="w-full bg-indigo-600 h-12 rounded-2xl font-bold shadow-lg shadow-indigo-100" 
              onClick={() => finishImport({
                id: Date.now(),
                source: `QQ群组: ${selectedChat || 'Nexus 项目实习协作群'}`,
                content: `已同步群内 ${selectedFileIds.length} 个文件的协作成果：《${keywords[0] || 'PCG 场景生成算法'}》等 ${keywords.length || 3} 个关键知识节点`,
                time: '刚刚',
                type: 'QQ群解析',
                sender: 'PCG 助手',
                avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/398fcce6331b4d1b93f681b102dff8cc.jpg#desc=AI_Assistant_Avatar',
                status: 'completed',
                progress: 100,
                tags: keywords,
                extracts: keywords.length
              })}
            >
              存入知识库
            </Button>
          </motion.div>
        )}

        {/* File Selection Modal */}
        <AnimatePresence>
          {isSelectModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4"
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">选择要解析的群文件</h3>
                    <p className="text-xs text-slate-400 mt-1">已选择 {selectedFileIds.length} 个文件</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-10 w-10 bg-slate-100"
                    onClick={() => setIsSelectModalOpen(false)}
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </Button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Search and Filter */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="搜索文件名..." 
                        className="pl-9 bg-slate-50 border-none rounded-xl h-10 text-xs focus-visible:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      {[
                        { id: '7d', label: '最近7天' },
                        { id: '30d', label: '最近30天' },
                        { id: 'all', label: '全部' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setTimeFilter(opt.id as any)}
                          className={cn(
                            "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                            timeFilter === opt.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <button 
                      onClick={toggleAll}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      {selectedFileIds.length === filteredFiles.length && filteredFiles.length > 0 ? '取消全选' : '全选所有'}
                    </button>
                    <span className="text-[10px] text-slate-400">
                      符合筛选条件: {filteredFiles.length} 个文件
                    </span>
                  </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <div 
                        key={file.id}
                        onClick={() => toggleFile(file.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer",
                          selectedFileIds.includes(file.id) 
                            ? "bg-indigo-50/50 border-indigo-200" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                          selectedFileIds.includes(file.id) ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300"
                        )}>
                          {selectedFileIds.includes(file.id) && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                        
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                          {getFileIcon(file.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">{file.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-slate-400 font-medium">{file.size}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[9px] text-slate-400 font-medium">{file.date}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[9px] text-indigo-500 font-bold">{file.uploader}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FileWarning className="w-8 h-8 text-slate-300" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">未找到相关文件</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">该时间段内没有文件，或搜索词不匹配</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 rounded-b-[2.5rem]">
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 rounded-2xl border-slate-200 bg-white"
                      onClick={() => setIsSelectModalOpen(false)}
                    >
                      取消
                    </Button>
                    <Button 
                      className={cn(
                        "flex-[2] h-12 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all",
                        selectedFileIds.length === 0 ? "bg-slate-300" : "bg-indigo-600 hover:bg-indigo-700"
                      )}
                      disabled={selectedFileIds.length === 0}
                      onClick={runExtraction}
                    >
                      {selectedFileIds.length === 0 ? '请至少选择一个文件' : `解析所选文件 (${selectedFileIds.length})`}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const PersonalSyncSimulation = () => {
    const [isUploading, setIsUploading] = useState(false);
    
    const getPersonalSourceFiles = () => {
      if (selectedPersonalSource === 'qq') return qqPersonalFiles;
      if (selectedPersonalSource === 'tencent') return tencentPersonalDocs;
      return [];
    };

    const handleFileSelect = (file: any) => {
      setImportStep(2);
      setTimeout(() => {
        setImportStep(3);
        setKeywords(['个人私有', '重点回顾', '待处理']);
      }, 1500);
    };

    return (
      <div className="space-y-4">
        {importStep === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" /> 个人云端文档同步
            </h3>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <button 
                onClick={() => setSelectedPersonalSource('qq')}
                className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all", selectedPersonalSource === 'qq' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
              >
                QQ 个人文件
              </button>
              <button 
                onClick={() => setSelectedPersonalSource('tencent')}
                className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all", selectedPersonalSource === 'tencent' ? "bg-white text-blue-500 shadow-sm" : "text-slate-500")}
              >
                腾讯文档个人
              </button>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {getPersonalSourceFiles().length > 0 ? getPersonalSourceFiles().map(file => (
                <div 
                  key={file.id} 
                  onClick={() => handleFileSelect(file)}
                  className="p-3 border rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{file.name}</div>
                    <div className="text-[10px] text-slate-400">{file.size} · {file.date}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-300">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )) : (
                <div className="py-10 text-center">
                  <p className="text-xs text-slate-400">暂无云端文档，请确保账号已连接</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-bold text-amber-700">说明</span>
              </div>
              <p className="text-[9px] text-amber-600 leading-relaxed">
                本地文件上传现已整合至“多维采集”功能（主页中心按钮），此处仅支持从云端生态同步。
              </p>
            </div>
          </motion.div>
        )}

        {importStep === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">安全加密同步中</h3>
            <p className="text-xs text-slate-500">正在建立私有加密通道，确保您的个人文档隐私安全</p>
          </motion.div>
        )}

        {importStep === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">个人文档同步成功</h3>
            <p className="text-xs text-slate-500 text-center mb-6">该文档已标记为“私有”，仅您可见，已录入 AI 辅助系统。</p>
            
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[10px] font-bold text-indigo-800 uppercase">AI 建议</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                已识别到该文档属于您的私有学习笔记，系统将自动在“知识图谱”中以金色节点标记。您现在可以在 Chat 页面针对此文档进行提问。
              </p>
            </div>
            
            <Button 
              className="w-full bg-indigo-600 h-11 rounded-xl shadow-lg shadow-indigo-100 font-bold" 
              onClick={() => finishImport({
                id: Date.now(),
                source: selectedPersonalSource === 'qq' ? 'QQ 个人文件' : '腾讯文档个人',
                content: `已完成个人私有文档的加密同步与知识点提取。`,
                time: '刚刚',
                type: '个人文档',
                sender: '本人',
                avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/37287d9092de4fd1a1bd6c47f7a3c63a.jpg#desc=User_Avatar',
                status: 'completed',
                progress: 100,
                tags: ['私有', '个人'],
                extracts: 3
              })}
            >
              完成同步
            </Button>
          </motion.div>
        )}
      </div>
    );
  };

  const TencentDocSimulation = () => {

    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [comparing, setComparing] = useState(false);
    const [comparisonDone, setComparisonDone] = useState(false);

    const docs = [
      { id: 'td1', title: '项目进度跟踪表', version: 'v1.5', lastEdit: '10分钟前' },
      { id: 'td2', title: '需求文档 v2.0', version: 'v3.0', lastEdit: '2小时前' },
      { id: 'td3', title: '毕业论文大纲', version: 'v2.1', lastEdit: '昨日' },
      { id: 'td4', title: '机器学习实验报告', version: 'v1.0', lastEdit: '1小时前' },
    ];

    const runComparison = () => {
      setComparing(true);
      setTimeout(() => {
        setComparing(false);
        setComparisonDone(true);
        setImportStep(3);
      }, 2500);
    };

    return (
      <div className="space-y-4">
        {importStep === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> 选择腾讯文档协作项
            </h3>
            <p className="text-[10px] text-slate-400 mb-4 -mt-3">同步项目组腾讯文档协作成果，实时追踪版本变更</p>
            <div className="space-y-2">
              {docs.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => { setSelectedDoc(doc); setImportStep(2); }}
                  className="p-3 border rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{doc.title}</div>
                    <div className="text-[10px] text-slate-400">版本 {doc.version} · 修改于 {doc.lastEdit}</div>
                  </div>
                  <Badge variant="outline" className="text-[9px] h-4 text-blue-600 border-blue-200 bg-blue-50">协作中</Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {importStep === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              协作版本增量比对
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6 relative">
               <div className="space-y-2">
                 <div className="text-[10px] font-bold text-slate-400 uppercase text-center">本地同步 (v1.4)</div>
                 <div className="p-3 bg-slate-50 rounded-lg border h-32 text-[9px] text-slate-400 overflow-hidden line-clamp-6">
                   ... PCG 业务场景下的 AI 学习助手需要深度整合社交生态。当前的重点是 QQ 群组资料的自动化提取。
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="text-[10px] font-bold text-blue-600 uppercase text-center">协作文档 (v1.5)</div>
                 <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 h-32 text-[9px] text-slate-600 overflow-hidden relative">
                   ... PCG 业务场景下的 AI 学习助手需要深度整合社交生态。
                   <div className="bg-blue-100 text-blue-700 px-1 inline-block">【新增】腾讯文档多端协作功能已通过灰度测试，将正式整合至 Nexus V1.2 版本。</div>
                   当前的重点是 QQ 群组资料的自动化提取。
                   {comparing && (
                     <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                          <span className="text-[8px] font-bold text-blue-600">版本同步中</span>
                        </div>
                     </div>
                   )}
                 </div>
               </div>
               
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                 </div>
               </div>
            </div>

            <Button 
              className="w-full bg-blue-600" 
              onClick={runComparison}
              disabled={comparing}
            >
              {comparing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Filter className="w-4 h-4 mr-2" />}
              {comparing ? '正在执行协作比对...' : '同步协作增量'}
            </Button>
          </motion.div>
        )}

        {importStep === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-bold mb-2">协作同步确认</h3>
            <p className="text-xs text-slate-500 mb-6">检测到 3 处团队协作更新，系统将自动同步至个人知识节点。</p>            
            <div className="space-y-3 mb-6">
               <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="p-1.5 bg-green-200 text-green-700 rounded-lg mt-0.5">
                    <Plus className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-green-800">新增内容：大语言模型应用</div>
                    <div className="text-[10px] text-green-600/80">在“模型架构”章节后增加了关于 GPT-4 的描述</div>
                  </div>
               </div>
               <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="p-1.5 bg-blue-200 text-blue-700 rounded-lg mt-0.5">
                    <RefreshCw className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-800">修改内容：参考资料更新</div>
                    <div className="text-[10px] text-blue-600/80">更新了 2 条过时的学术链接</div>
                  </div>
               </div>
            </div>

            <Button 
              className="w-full bg-indigo-600" 
              onClick={() => {
                setDocItems(prev => prev.map(d => d.id === selectedDoc.id ? {...d, time: '刚刚', version: 'v1.6'} : d));
                finishImport({
                  id: Date.now(),
                  source: `腾讯文档: ${selectedDoc.title}`,
                  content: `文档已完成增量同步，版本更新至 v1.6，共处理 3 处变更。`,
                  time: '刚刚',
                  type: '文档同步',
                  sender: '系统',
                  avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/2de0f245b3d443a3a5bcc5e18d842d86.jpg#desc=Tencent_Doc_Sync_Status_Icon',
                  status: 'completed',
                  progress: 100,
                  tags: ['腾讯文档', '增量同步'],
                  extracts: 3
                });
              }}
            >
              确认并完成同步
            </Button>
          </motion.div>
        )}
      </div>
    );
  };

  const PlusIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Quick Action Overlay */}
      <AnimatePresence>
        {showQuickActionStatus && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-[280px] text-center"
            >
              {showQuickActionStatus === 'completed' ? (
                <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-100">
                  <Check className="w-10 h-10 text-white" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                  <RefreshCw className="w-10 h-10 text-white animate-spin" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {showQuickActionStatus === 'syncing' ? '正在同步生态' : 
                   showQuickActionStatus === 'organizing' ? '正在智能整理' : '操作成功'}
                </h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  {showQuickActionStatus === 'syncing' ? '正在同步 QQ群组文件与腾讯文档协作进度...' : 
                   showQuickActionStatus === 'organizing' ? 'AI 正在为您分类群聊资料并构建图谱...' : '同步已完成'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {activeImport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-4"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-[340px] rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 top-4 rounded-full h-8 w-8 hover:bg-slate-100"
                  onClick={() => { setActiveImport(null); setImportStep(0); }}
                >
                  <X className="w-4 h-4 text-slate-400" />
                </Button>

                {importStep === 4 ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-100">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">同步完成</h3>
                      <p className="text-sm text-slate-500 mt-2 font-medium">
                        PCG 协作成果已成功同步至您的知识库。
                      </p>
                    </div>
                    <div className="flex gap-3 w-full">
                      <Button variant="outline" className="flex-1 rounded-2xl h-12" onClick={() => { setActiveImport(null); setImportStep(0); }}>
                        返回
                      </Button>
                      <Button 
                        className="flex-[1.5] bg-indigo-600 rounded-2xl h-12" 
                        onClick={() => {
                          setActiveImport(null);
                          setImportStep(0);
                          navigate('/document-preview', { 
                            state: { 
                              id: 'sync-new', 
                              title: 'Transformer 架构优化深度解析', 
                              type: 'doc', 
                              author: 'Nexus AI', 
                              time: '刚刚' 
                            } 
                          });
                        }}
                      >
                        立即查看文档
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {activeImport === 'qq' && <QQGroupSimulation />}
                    {activeImport === 'tencent-doc' && <TencentDocSimulation />}
                    {activeImport === 'personal-sync' && <PersonalSyncSimulation />}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 pb-2 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <Typography variant="h2" className="text-xl font-bold text-slate-900">
            生态同步
          </Typography>
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-slate-400 font-medium mr-1">2026年05月05日</div>
            <Badge variant="outline" className="h-5 px-1.5 text-[8px] font-bold border-emerald-100 text-emerald-600 bg-emerald-50/50 flex items-center gap-1 leading-none shrink-0 whitespace-nowrap">
              <RefreshCw className="w-2 h-2 animate-spin-slow" />
              实时同步中
            </Badge>
          </div>
        </div>
        
        {/* Connection Status Indicators */}
        <div className="flex gap-4 mb-1 overflow-x-auto pb-2 no-scrollbar px-1">
          {[
            { name: 'QQ群组', connected: true, icon: Share2, color: 'text-blue-500', status: '已连接' },
            { name: '腾讯文档', connected: true, icon: FileText, color: 'text-blue-600', status: '已连接' },
            { name: '个人文件', connected: true, icon: Cloud, color: 'text-indigo-500', status: '已同步' }
          ].map((conn) => (
            <div 
              key={conn.name} 
              className="flex items-center gap-2.5 shrink-0"
            >
              <div className={cn(
                "relative w-9 h-9 rounded-2xl flex items-center justify-center transition-all",
                conn.connected ? "bg-indigo-50 text-indigo-600 shadow-sm" : "bg-slate-50 text-slate-300"
              )}>
                <conn.icon className="w-4 h-4" />
                {conn.connected && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className={cn("text-[11px] font-bold leading-none", conn.connected ? "text-slate-800" : "text-slate-400")}>{conn.name}</span>
                <span className={cn("text-[9px] mt-1 font-medium", conn.connected ? "text-indigo-500/80" : "text-slate-300")}>{conn.status}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {/* Manage QQ Group Collaboration Module */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
                <Share2 className="w-4 h-4" />
              </div>
              <Typography variant="h3" className="text-[15px] font-bold text-slate-800 truncate">
                QQ 群组协作
              </Typography>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => startImport('qq')}
              className="text-[11px] text-blue-600 font-bold hover:bg-blue-50 h-8 shrink-0 rounded-full px-3"
            >
              解析新群聊
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          
          <Card className="border-none shadow-md shadow-slate-200/50 bg-white overflow-hidden rounded-[1.5rem]">
            <CardContent className="p-0">
              <div className="p-3.5 bg-slate-50/50 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-blue-400 rounded-full" />
                  最近群文件预览
                </div>
                <div className="space-y-2">
                  {qqGroupFiles.map((file, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group"
                      onClick={() => {
                        const type = file.name.split('.').pop()?.toLowerCase();
                        if (type === 'pdf') {
                          navigate('/learning/pdf', { 
                            state: { 
                              id: `qq-file-${idx}`, 
                              title: file.name, 
                              type, 
                              author: '群共享', 
                              time: file.date 
                            } 
                          });
                        } else {
                          navigate('/document-preview', { 
                            state: { 
                              id: `qq-file-${idx}`, 
                              title: file.name, 
                              type, 
                              author: '群共享', 
                              time: file.date 
                            } 
                          });
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shrink-0">
                          <file.icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <Typography variant="h4" className="text-[12px] font-bold text-slate-700 truncate leading-none">{file.name}</Typography>
                          <span className="text-[10px] text-slate-400 mt-1">{file.size} • {file.date}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">同步动态</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[9px] text-blue-500 font-medium">实时更新中</span>
                  </div>
                </div>
                {syncItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-4 border-l-2 border-blue-100/50 pb-4 last:pb-0 cursor-pointer group"
                    onClick={() => {
                      const title = item.content.match(/《(.*?)》/)?.[1] || '协作文档';
                      navigate('/document-preview', { 
                        state: { 
                          id: `sync-${item.id}`, 
                          title: title, 
                          type: 'doc', 
                          author: item.sender, 
                          time: item.time 
                        } 
                      });
                    }}
                  >
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:scale-125 transition-transform" />
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8 rounded-lg group-hover:ring-2 group-hover:ring-blue-100 transition-all">
                        <AvatarImage src={item.avatar} alt="User Avatar" />
                        <AvatarFallback>{item.sender[0]}</AvatarFallback>
                      </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <Typography variant="h4" className="text-[11px] font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors leading-none">{item.source}</Typography>
                        <span className="text-[9px] text-slate-400 font-medium shrink-0 ml-2">{item.time}</span>
                      </div>
                      <Typography variant="muted" className="text-[10px] text-slate-500 line-clamp-1 leading-snug mb-2 italic">
                        "{item.content}"
                      </Typography>
                      <div className="flex items-center gap-1.5">
                          <Badge className="bg-blue-50 text-blue-600 text-[8px] h-4 group-hover:bg-blue-100 border-none px-1.5 font-bold">
                            {item.type}
                          </Badge>
                          {item.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} className="bg-slate-50 text-slate-400 text-[8px] h-4 border-none px-1.5 font-bold">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tencent Docs Integration Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <Typography variant="h3" className="text-[15px] font-bold text-slate-800 truncate">
                    腾讯文档协作
                  </Typography>
                  <Badge variant="outline" className="h-5 px-1.5 border-emerald-100 bg-emerald-50 text-emerald-600 text-[8px] font-bold flex items-center gap-1 shrink-0 whitespace-nowrap leading-none">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    自动同步中
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2 shrink-0">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <Zap className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-600">智能整理</span>
                <div 
                  className={cn("w-6 h-3 rounded-full relative transition-colors cursor-pointer", autoOrganize ? "bg-emerald-500" : "bg-slate-300")}
                  onClick={() => setAutoOrganize(!autoOrganize)}
                >
                  <div className={cn("absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all", autoOrganize ? "right-0.5" : "left-0.5")} />
                </div>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-md shadow-slate-200/50 bg-white overflow-hidden rounded-[1.5rem]">
            <CardContent className="p-0">
              <div className="p-3.5 bg-blue-50/20 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-blue-400 rounded-full" />
                  协作文档预览
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredTencentDocFiles.map((file, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group"
                      onClick={() => {
                        const type = file.name.split('.').pop()?.toLowerCase();
                        if (type === 'pdf') {
                          navigate('/learning/pdf', { 
                            state: { 
                              id: `td-file-${idx}`, 
                              title: file.name, 
                              type, 
                              author: file.author, 
                              time: file.time 
                            } 
                          });
                        } else {
                          navigate('/document-preview', { 
                            state: { 
                              id: `td-file-${idx}`, 
                              title: file.name, 
                              type, 
                              author: file.author, 
                              time: file.time 
                            } 
                          });
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <FileText className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform shrink-0" />
                        <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold leading-none", file.status === '编辑中' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600")}>
                          {file.status}
                        </span>
                      </div>
                      <Typography variant="h4" className="text-[11px] font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors leading-none">{file.name}</Typography>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
                        <span className="truncate mr-2">{file.author}</span>
                        <span className="shrink-0">{file.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 space-y-4">
                {filteredDocItems.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div 
                      className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                      onClick={() => {
                        if (doc.type === 'pdf') {
                          navigate('/learning/pdf', { state: { ...doc } });
                        } else {
                          navigate('/document-preview', { state: { ...doc } });
                        }
                      }}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shrink-0",
                        doc.type === 'doc' ? 'bg-blue-50 text-blue-600' : 
                        doc.type === 'pdf' ? 'bg-rose-50 text-rose-600' : 
                        'bg-green-50 text-green-600'
                      )}>
                        {doc.type === 'doc' ? <FileText className="w-4.5 h-4.5" /> : 
                         doc.type === 'pdf' ? <FileCheck className="w-4.5 h-4.5" /> : 
                         <FileSpreadsheet className="w-4.5 h-4.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <Typography variant="h4" className="text-[11px] font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors leading-none">{doc.title}</Typography>
                          <span className="text-[9px] text-slate-400 font-medium shrink-0 ml-2">{doc.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 font-medium">{doc.author}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                          <span className="text-[9px] text-slate-500 font-bold">{doc.version}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Personal Document Sync Module */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/50">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <Typography variant="h3" className="text-[15px] font-bold text-slate-800 truncate">
                    个人文档同步
                  </Typography>
                  <Badge variant="outline" className="h-5 px-1.5 border-emerald-100 bg-emerald-50 text-emerald-600 text-[8px] font-bold flex items-center gap-1 shrink-0 whitespace-nowrap leading-none">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    已实时同步
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => startImport('personal-sync')}
              className="text-[11px] text-indigo-600 font-bold hover:bg-indigo-50 h-8 shrink-0 rounded-full px-3 ml-2"
            >
              同步云端
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          
          <Card className="border-none shadow-md shadow-slate-200/50 bg-white overflow-hidden rounded-[1.5rem]">
            <CardContent className="p-0">
              <div className="p-3.5 bg-slate-50/50 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                  个人云端空间预览
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => startImport('personal-sync')}
                    className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                      <Share2 className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 truncate">QQ 个人文件</span>
                  </div>
                  <div 
                    onClick={() => startImport('personal-sync')}
                    className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors shrink-0">
                      <Cloud className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 truncate">腾讯文档个人</span>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {personalFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div 
                      className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                      onClick={() => {
                        const type = file.type;
                        if (type === 'pdf') {
                          navigate('/learning/pdf', { 
                            state: { 
                              id: file.id, 
                              title: file.name, 
                              isPersonal: true 
                            } 
                          });
                        } else {
                          navigate('/document-preview', { 
                            state: { 
                              id: file.id, 
                              title: file.name, 
                              isPersonal: true 
                            } 
                          });
                        }
                      }}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shrink-0",
                        file.type === 'pdf' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                      )}>
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <Typography variant="h4" className="text-[11px] font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors leading-none">{file.name}</Typography>
                          <Lock className="w-2.5 h-2.5 text-amber-500 shrink-0 ml-2" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-slate-400 font-medium leading-none">{file.size}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                          <span className="text-[9px] text-slate-400 font-medium leading-none">{file.date}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.div>
                ))}

                <div className="pt-3 mt-1 border-t border-slate-50 flex flex-col gap-2.5">
                  <Typography variant="muted" className="text-[9px] text-slate-400 leading-relaxed font-medium">默认同步QQ个人文件和腾讯文档中最近{syncRules.timeRange === 'all' ? '全部' : syncRules.timeRange + '天'}新增的文件，点击管理可调整规则或排除特定文档</Typography>
                  <Button variant="ghost" size="sm" className="h-7 w-fit px-3 text-[10px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold rounded-lg border border-indigo-100/50" onClick={() => setIsModalOpen(true)}>
                    管理同步规则
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* AI伴侣推送 设置卡片 */}
        <section className="mb-4">
          <div 
            className={cn(
              "w-full bg-white rounded-[12px] shadow-sm overflow-hidden transition-all duration-300 border border-slate-100",
              isPushExpanded ? "pb-6" : "h-[56px]"
            )}
          >
            {/* Collapsed Header */}
            <div 
              className="h-[56px] px-4 flex items-center justify-between cursor-pointer"
              onClick={() => setIsPushExpanded(!isPushExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div className="flex flex-col">
                  <Typography className="text-[14px] font-bold text-[#1F2937] leading-none">AI伴侣推送</Typography>
                  {!isPushExpanded && (
                    <div className="mt-1 flex items-center gap-1">
                      <span className={cn(
                        "text-[10px] font-medium",
                        pushEnabled ? "text-[#10B981]" : "text-[#9CA3AF]"
                      )}>
                        {pushEnabled ? `已开启 · ${pushFrequency}` : '已关闭'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPushExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </div>

            {/* Expanded Content */}
            {isPushExpanded && (
              <div className="px-4 space-y-6 pt-2">
                {/* Master Switch */}
                <div className="flex items-center justify-between">
                  <Typography className="text-[14px] font-bold text-slate-700">QQ私信推送</Typography>
                  <div 
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
                      pushEnabled ? "bg-[#8B5CF6]" : "bg-[#D1D5DB]"
                    )}
                    onClick={() => setPushEnabled(!pushEnabled)}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                      pushEnabled ? "left-[22px]" : "left-0.5"
                    )} />
                  </div>
                </div>

                {/* Frequency Selection */}
                <div className="space-y-3">
                  <Typography className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">推送频率</Typography>
                  <div className="flex flex-wrap gap-2">
                    {['每天1条', '每3天1条', '每周1条', '仅重要提醒'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setPushFrequency(opt)}
                        className={cn(
                          "h-8 px-3 rounded-full text-[12px] font-medium transition-all",
                          pushFrequency === opt 
                            ? "bg-[#8B5CF6] text-white shadow-md shadow-purple-100" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scenes Selection */}
                <div className="space-y-3">
                  <Typography className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">推送场景勾选</Typography>
                  <div className="space-y-3">
                    {[
                      { id: '学习提醒', preview: '您预约的《Transformer精讲》直播课即将开始。' },
                      { id: '每日总结', preview: '今日您已完成 3 篇深度阅读，知识图谱新增 12 个节点。' },
                      { id: '同步成功', preview: '生态同步功能已成功连接您的腾讯文档。' },
                      { id: '进度预警', preview: '本周的学习目标尚未过半，请注意合理安排时间。' },
                      { id: '内容推荐', preview: '基于您的兴趣，为您推荐了《高效学习方法论》相关资料。' },
                    ].map(scene => (
                      <div 
                        key={scene.id} 
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                        onClick={() => {
                          if (selectedPushScenes.includes(scene.id)) {
                            setSelectedPushScenes(selectedPushScenes.filter(s => s !== scene.id));
                          } else {
                            setSelectedPushScenes([...selectedPushScenes, scene.id]);
                          }
                        }}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors",
                          selectedPushScenes.includes(scene.id) ? "bg-[#8B5CF6] border-[#8B5CF6]" : "border-slate-300 bg-white"
                        )}>
                          {selectedPushScenes.includes(scene.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <Typography className="text-[13px] font-bold text-slate-700 leading-none mb-1">{scene.id}</Typography>
                          <Typography className="text-[11px] text-slate-400 line-clamp-1">{scene.preview}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DND Setting */}
                <div className="space-y-3">
                  <Typography className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">勿扰时段设置</Typography>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={dndStart} 
                        onChange={(e) => setDndStart(e.target.value)}
                        className="w-14 bg-transparent border-b border-slate-200 text-[13px] font-bold text-slate-700 text-center focus:outline-none focus:border-purple-400"
                      />
                      <span className="text-slate-400 text-[12px]">到</span>
                      <input 
                        type="text" 
                        value={dndEnd} 
                        onChange={(e) => setDndEnd(e.target.value)}
                        className="w-14 bg-transparent border-b border-slate-200 text-[13px] font-bold text-slate-700 text-center focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>

                {/* History Link */}
                <div className="pt-2 flex justify-center">
                  <Button 
                    variant="ghost" 
                    className="text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-purple-50 text-[13px] font-bold gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/push-history');
                    }}
                  >
                    查看历史推送 <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Account Connection Management - Moved to bottom */}
        <section className="pt-6 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={handleQuickSync}
            className="w-full h-16 rounded-3xl border-slate-200 bg-white shadow-sm flex items-center justify-between px-5 group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Link2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <Typography variant="h4" className="text-[14px] font-bold text-slate-800 leading-tight">账号连接管理</Typography>
                <Typography variant="muted" className="text-[11px] text-slate-400 leading-tight mt-1.5 font-medium">配置同步规则与多平台授权账号</Typography>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </Button>
          
          <div className="mt-5 bg-indigo-50/40 rounded-3xl p-5 flex items-start gap-4 border border-indigo-100/30">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
              <Info className="w-4 h-4 text-indigo-500" />
            </div>
            <Typography variant="muted" className="text-[11px] text-slate-500 leading-relaxed font-medium">
              当前已建立 <span className="text-indigo-600 font-bold">3 个</span> 生态连接。Nexus 将自动按照设定的优先级为您整理每日协作产出的学习资料，确保知识沉淀不遗漏。
            </Typography>
          </div>
        </section>

        <SyncRulesModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={(rules: SyncRules) => setSyncRules(rules)}
          currentRules={syncRules}
        />
      </div>
    </div>
  );
};

export default EcosystemPage;

