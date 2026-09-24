import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Search, 
  Filter, 
  Maximize2, 
  Layers, 
  Zap, 
  Info, 
  Share2, 
  MousePointer2, 
  RefreshCw,
  X,
  ArrowRight,
  Link2,
  FileText,
  PlayCircle,
  Download,
  ChevronRight,
  ClipboardList,
  Plus,
  Bookmark,
  Minus,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Target,
  ChevronDown,
  ChevronUp,
  Scan,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';

interface DocImportState {
  fromDoc: string;
  docType: string;
  concepts: string[];
  summary: string;
  timestamp: string;
}

const GraphPage = () => {
  const navigate = useNavigate();
  const { newKnowledgeNodes, isSyncing, addLearningPath } = useData();
  const location = useLocation();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [showLearningSteps, setShowLearningSteps] = useState(false);
  const [importedDoc, setImportedDoc] = useState<DocImportState | null>(null);
  const [showImportAlert, setShowImportAlert] = useState(false);

  // Career Goal States
  const [isGoalExpanded, setIsGoalExpanded] = useState(false);
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    matchPercent: number;
    mastered: string[];
    missing: string[];
  } | null>(null);
  const [showGapPanel, setShowGapPanel] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (analysisResult && !isAnalyzing) {
      let start = 0;
      const end = analysisResult.matchPercent;
      const duration = 1000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayPercent(end);
          clearInterval(timer);
        } else {
          setDisplayPercent(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [analysisResult, isAnalyzing]);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setDisplayPercent(0);
    
    // Simulate 1.5s analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        matchPercent: 68,
        mastered: ['强化学习', '深度学习', 'Transformer', '优化算法', '马尔可夫决策'],
        missing: ['SQL', 'RAG', '竞品分析']
      });
    }, 1500);
  };

  const handleGeneratePlan = () => {
    addLearningPath({
      topic: '14天技能补全计划',
      status: 'planned',
      progress: 0,
      estimatedTime: '14天',
      description: 'Day 1-3 SQL基础 → Day 4-6 RAG原理 → Day 7-10 竞品分析方法论'
    });
    alert('已成功添加到"我的"学习历程中！');
    setShowGapPanel(false);
  };
  
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const state = location.state as DocImportState;
    
    if (state?.fromDoc) {
      setImportedDoc(state);
      setShowImportAlert(true);
      setActiveNode(state.fromDoc);
      
      const timer = setTimeout(() => {
        setShowImportAlert(false);
      }, 5000);

      // Auto-focus on the main document node
      const focusTimer = setTimeout(() => {
        const nodeElement = nodeRefs.current[state.fromDoc];
        if (nodeElement && containerRef.current) {
          const container = containerRef.current;
          const scrollLeft = nodeElement.offsetLeft - container.offsetWidth / 2 + nodeElement.offsetWidth / 2;
          const scrollTop = nodeElement.offsetTop - container.offsetHeight / 2 + nodeElement.offsetHeight / 2;
          
          container.scrollTo({
            left: scrollLeft,
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }, 800);

      return () => {
        clearTimeout(timer);
        clearTimeout(focusTimer);
      };
    }
  }, [location]);

  const baseNodes = [
    { id: 'RL', label: '强化学习', x: 50, y: 50, size: 40, color: 'indigo', detail: '这是你知识体系中的核心节点，关联了 12 个二级概念和 3 个跨学科领域。' },
    { id: 'DL', label: '深度学习', x: 20, y: 30, size: 30, color: 'blue', detail: '底层计算框架，支持卷积与递归网络模型。' },
    { id: 'OPT', label: '优化算法', x: 80, y: 20, size: 25, color: 'purple', detail: '包含 Adam, SGD 等主流梯度下降策略。' },
    { id: 'MDP', label: '马尔可夫决策', x: 30, y: 75, size: 25, color: 'slate', detail: '强化学习的数学建模基础。' },
    { id: 'ENV', label: '环境交互', x: 75, y: 70, size: 30, color: 'emerald', detail: 'Agent 与外部世界的反馈循环闭环。' },
    { id: 'TF', label: 'Transformer', x: 15, y: 55, size: 25, color: 'indigo', detail: '自注意力机制核心架构，近期同步的热点内容。' },
  ];

  const generatedNodes = useMemo(() => {
    if (!importedDoc) return [];

    const nodes: any[] = [];
    const mainId = 'DOC_ROOT';
    
    // Create main document node
    nodes.push({
      id: mainId,
      label: importedDoc.fromDoc,
      x: 60,
      y: 40,
      size: 35,
      color: 'amber',
      isNew: true,
      sourceDoc: importedDoc.fromDoc,
      importTime: importedDoc.timestamp,
      detail: `从《${importedDoc.fromDoc}》导入的知识聚合点。摘要：${importedDoc.summary}`
    });

    // Strategy-based sub-nodes generation
    const getSubNodes = () => {
      const type = importedDoc.docType;
      const concepts = importedDoc.concepts;
      
      if (type === 'transformer') {
        return [
          { label: 'Transformer 架构', detail: '模型整体拓扑结构，包括 Encoder 和 Decoder 层。' },
          { label: 'Self-Attention 机制', detail: '允许模型在处理序列时关注不同位置信息的关键机制。' },
          { label: '多头注意力', detail: '并行运行多个注意力机制，从不同子空间学习信息。' },
          { label: '位置编码 (PE)', detail: '为序列中的每个元素注入位置信息的向量。' }
        ];
      } else if (type === 'attention') {
        return [
          { label: '注意力权重', detail: '通过 Query 和 Key 计算出的对 Value 的关注程度分布。' },
          { label: '缩放点积注意力', detail: 'Attention 的核心计算公式，包含缩放因子以稳定梯度。' },
          { label: '交叉注意力', detail: '用于 Decoder 关注 Encoder 输出的特殊注意力形式。' }
        ];
      } else if (type === 'pytorch') {
        return [
          { label: '张量运算 (Tensor)', detail: 'PyTorch 的核心数据结构，支持 GPU 加速的 N 维数组。' },
          { label: '自动求导 (Autograd)', detail: '实现反向传播的核心引擎，自动计算梯度。' },
          { label: '神经网络层 (nn.Module)', detail: '构建模型的基本组件，包含参数和前向传播。' },
          { label: 'DataLoader', detail: '用于高效加载和预处理大规模数据集的工具。' }
        ];
      } else if (type === 'paper') {
        return [
          { label: '研究背景', detail: '该领域目前的痛点及本文解决的问题。' },
          { label: '方法论', detail: '论文提出的核心算法、模型或理论框架。' },
          { label: '实验结果', detail: '与 SOTA 模型的性能指标对比，验证有效性。' },
          { label: '核心贡献', detail: '本文对学术界或工业界的主要创新点。' }
        ];
      } else {
        return [
          { label: '项目目标', detail: '本项目致力于解决的业务或技术目标。' },
          { label: '进度计划', detail: '各阶段的关键里程碑及交付时间点。' },
          { label: '团队成员', detail: '参与本项目的各岗位负责人员及其职责。' },
          { label: '技术方案', detail: '选用的技术栈、系统架构及核心逻辑设计。' }
        ];
      }
    };

    const subConfigs = getSubNodes();
    subConfigs.forEach((conf, idx) => {
      // Calculate coordinates around the main node
      const angle = (idx / subConfigs.length) * 2 * Math.PI;
      const radius = 15;
      nodes.push({
        id: `SUB_${idx}`,
        label: conf.label,
        x: 60 + radius * Math.cos(angle),
        y: 40 + radius * Math.sin(angle),
        size: 20,
        color: 'amber',
        isNew: true,
        sourceDoc: importedDoc.fromDoc,
        importTime: importedDoc.timestamp,
        detail: conf.detail
      });
    });

    return nodes;
  }, [importedDoc]);

  const dynamicNodes = useMemo(() => {
    const extra: any[] = [...generatedNodes];
    
    // Career Goal Missing Nodes
    if (analysisResult) {
      analysisResult.missing.forEach((skill, idx) => {
        // Find a place at the edge
        const angle = (idx / analysisResult.missing.length) * Math.PI + Math.PI; // Bottom semi-circle
        const radius = 35;
        extra.push({
          id: `MISSING_${idx}`,
          label: skill,
          x: 50 + radius * Math.cos(angle),
          y: 80 + radius * Math.sin(angle) * 0.5,
          size: 25,
          color: 'rose',
          isMissing: true,
          detail: `${skill} 是您目标职位中要求的关键技能。当前您的知识库中尚未覆盖此领域，建议尽快安排学习。`
        });
      });
    }

    if (newKnowledgeNodes.includes('ML_BASE')) {
      extra.push({ id: 'ML_BASE', label: '机器学习基础', x: 85, y: 55, size: 35, color: 'emerald', detail: '最近从《机器学习基础》文档中导入的核心理论，包含监督与无监督学习。' });
    }
    if (newKnowledgeNodes.includes('SUP_LEARN')) {
      extra.push({ id: 'SUP_LEARN', label: '监督学习', x: 90, y: 80, size: 25, color: 'slate', detail: '利用已知标签的数据集进行训练的模式。' });
    }

    // Mark matched nodes in the combined list
    const allNodes = [...baseNodes, ...extra];
    if (analysisResult) {
      return allNodes.map(node => ({
        ...node,
        isMatched: analysisResult.mastered.includes(node.label)
      }));
    }
    return allNodes;
  }, [newKnowledgeNodes, generatedNodes, analysisResult]);

  const nodes = dynamicNodes;

  const baseConnections = [
    { from: 'RL', to: 'DL' },
    { from: 'RL', to: 'OPT' },
    { from: 'RL', to: 'MDP' },
    { from: 'RL', to: 'ENV' },
    { from: 'MDP', to: 'DL' },
    { from: 'TF', to: 'DL' },
    { from: 'TF', to: 'RL' },
  ];

  const connections = useMemo(() => {
    const extra: any[] = [];
    
    // Add connections for generated nodes
    if (generatedNodes.length > 0) {
      const mainId = 'DOC_ROOT';
      generatedNodes.forEach(node => {
        if (node.id.startsWith('SUB_')) {
          extra.push({ from: mainId, to: node.id });
        }
      });
      // Connect main doc node to relevant base nodes
      if (importedDoc?.docType === 'transformer' || importedDoc?.docType === 'attention') {
        extra.push({ from: mainId, to: 'TF' });
      } else if (importedDoc?.docType === 'pytorch') {
        extra.push({ from: mainId, to: 'DL' });
      }
    }

    if (newKnowledgeNodes.includes('ML_BASE')) {
      extra.push({ from: 'ML_BASE', to: 'DL' });
      extra.push({ from: 'ML_BASE', to: 'RL' });
    }
    if (newKnowledgeNodes.includes('SUP_LEARN')) {
      extra.push({ from: 'SUP_LEARN', to: 'ML_BASE' });
    }

    // Connect missing nodes to the central hub for visibility
    if (analysisResult) {
      analysisResult.missing.forEach((_, idx) => {
        extra.push({ from: 'RL', to: `MISSING_${idx}` });
      });
    }

    return [...baseConnections, ...extra];
  }, [newKnowledgeNodes, generatedNodes, importedDoc, analysisResult]);

  const activeNodeData = nodes.find(n => n.label === activeNode);

  // 判断连线是否应该高亮
  const isConnectionActive = (from: string, to: string) => {
    if (!activeNode && !hoveredNode) return false;
    const target = activeNode || hoveredNode;
    const targetNode = nodes.find(n => n.label === target);
    if (!targetNode) return false;
    const targetId = targetNode.id;
    return from === targetId || to === targetId;
  };

  // 知识详情卡片组件
  const KnowledgeDetailCard = ({ node }: { node: any }) => {
    const [showShareMenu, setShowShareMenu] = useState(false);
    if (!node) return null;
    
    const resources = [
      { title: '深度解析：' + node.label + '核心原理', type: '文章', duration: '12 min' },
      { title: node.label + '实战项目指南', type: '视频', duration: '45 min' },
      { title: '相关学术论文：Advanced ' + node.id, type: 'PDF', duration: '20 pages' }
    ];

    const learningPath = [
      { name: '数学基础', status: 'completed' },
      { name: node.label, status: 'current' },
      { name: '跨域项目应用', status: 'upcoming' },
      { name: '高级进阶', status: 'upcoming' }
    ];

    return (
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-2xl z-[60] p-6 max-h-[90%] overflow-y-auto no-scrollbar"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" onClick={() => setActiveNode(null)} />
        
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100",
              node.color === 'indigo' ? 'bg-indigo-600' : 
                node.color === 'blue' ? 'bg-blue-500' :
                node.color === 'purple' ? 'bg-purple-500' :
                node.color === 'emerald' ? 'bg-emerald-500' :
                node.color === 'amber' ? 'bg-amber-500' :
                'bg-slate-500'
            )}>
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{node.label}</h3>
                {node.isNew && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[10px]">新导入</Badge>}
              </div>
              <p className="text-xs text-slate-400 font-medium">知识领域: {node.color === 'indigo' ? '核心' : '辅助'}</p>
            </div>
          </div>
          <div className="flex gap-2 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-xl h-10 w-10 transition-colors", showShareMenu ? "bg-indigo-50 text-indigo-600" : "text-slate-400")}
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[70] overflow-hidden"
                >
                  <button 
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                    onClick={() => {
                      setShowShareMenu(false);
                      navigate('/share-preview', { state: { nodeTitle: node.label } });
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">分享</span>
                  </button>
                  <button 
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-t border-slate-50"
                    onClick={() => {
                      setShowShareMenu(false);
                      alert('已复制链接到剪贴板');
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">复制链接</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400" onClick={() => setActiveNode(null)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {node.sourceDoc && (
            <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                   <FileText className="w-4 h-4 text-amber-500" />
                   <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">来源文档信息</h4>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-7 text-[10px] text-indigo-600 gap-1 px-2 font-bold"
                   onClick={() => navigate('/document-preview', { state: { title: node.sourceDoc } })}
                 >
                   查看原文 <ArrowRight className="w-3 h-3" />
                 </Button>
               </div>
               <div className="flex flex-col gap-1">
                 <p className="text-sm font-bold text-slate-800">《{node.sourceDoc}》</p>
                 <p className="text-[10px] text-slate-400">导入时间：{node.importTime}</p>
               </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-800">概念解析</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {node.detail}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-800">推荐学习资源</h4>
            </div>
            <div className="space-y-3">
              {resources.map((res, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (res.type === '视频') {
                      navigate('/learning/video', { 
                        state: { 
                          title: res.title, 
                          duration: res.duration,
                          source: '腾讯视频知识频道' 
                        } 
                      });
                    } else if (res.type === '文章') {
                      navigate('/learning/article', { state: { title: res.title } });
                    } else if (res.type === 'PDF') {
                      navigate('/learning/pdf', { state: { title: res.title } });
                    }
                  }}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-colors group cursor-pointer"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    res.type === '文章' ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : 
                    res.type === '视频' ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" : 
                    "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
                  )}>
                    {res.type === '文章' ? <FileText className="w-5 h-5" /> : res.type === '视频' ? <PlayCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700">{res.title}</p>
                    <p className="text-[10px] text-slate-400">{res.type} · {res.duration}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-4 pt-2">
            <Button 
              className="w-full h-10 rounded-lg bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#8B5CF6] font-bold flex items-center justify-between px-4 transition-colors"
              onClick={() => navigate('/quiz/prepare', { state: { nodeName: node.label } })}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">📝</span>
                <span className="text-xs">随堂测验（AI根据该节点知识自动组卷）</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 text-xs shadow-md"
                onClick={() => navigate('/chat', { state: { initialMessage: `我想深入讨论一下《${node.sourceDoc || '近期知识'}》中的 ${node.label} 知识点。` } })}
              >
                <MessageSquare className="w-4 h-4" />
                与 AI 伴侣讨论
              </Button>
              <div className="flex flex-col gap-1.5">
                <Button 
                  variant="outline"
                  className="h-12 w-full rounded-xl border-slate-200 text-slate-600 font-bold gap-2 text-xs hover:bg-slate-50 transition-all"
                  onClick={() => {
                    navigate('/learning-path', { state: { subjectName: node.label, subjectId: node.id, mode: 'plan' } });
                  }}
                >
                  <Bookmark className="w-4 h-4" />
                  添加到学习路径
                </Button>
                <p className="text-[9px] text-slate-400 text-center font-medium">收藏到我的学习清单</p>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-1 rounded-2xl">
              <Button 
                className={cn(
                  "w-full h-14 rounded-2xl font-bold text-base shadow-xl transition-all active:scale-95",
                  "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 flex items-center justify-center gap-2"
                )}
                onClick={() => navigate('/deep-learning', { state: { subjectName: node.label, subjectId: node.id } })}
              >
                <PlayCircle className="w-6 h-6" />
                立即开始深度学习
              </Button>
              <p className="text-[10px] text-indigo-600/80 font-bold text-center mt-2 pb-1 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> 立即生成 AI 个性化学习方案并开始
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Career Goal Matching Module */}
      <div className="bg-white z-40 relative">
        <motion.div 
          animate={{ height: isGoalExpanded ? 'auto' : '44px' }}
          className={cn(
            "overflow-hidden border-b transition-all duration-300",
            analysisResult ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent" : "bg-slate-50 border-slate-100"
          )}
        >
          {!isGoalExpanded ? (
            <div 
              className="h-[44px] flex items-center justify-between px-4 cursor-pointer"
              onClick={() => setIsGoalExpanded(true)}
            >
              <div className="flex items-center gap-2">
                <Target className={cn("w-4 h-4", analysisResult ? "text-white" : "text-indigo-500")} />
                <span className="text-xs font-bold">
                  {analysisResult 
                    ? `匹配度 ${displayPercent}% | 已掌握 ${analysisResult.mastered.length} 项 | 缺失 ${analysisResult.missing.length} 项` 
                    : '🎯 设置职业目标，查看技能匹配度'}
                </span>
              </div>
              {analysisResult ? (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-[10px] text-white hover:bg-white/20 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGapPanel(true);
                  }}
                >
                  查看详情 <ChevronRight className="ml-1 w-3 h-3" />
                </Button>
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className={cn("text-xs font-bold flex items-center gap-1.5", analysisResult ? "text-white" : "text-slate-700")}>
                  <Target className="w-3.5 h-3.5" /> 职业目标匹配
                </h4>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={cn("h-6 w-6", analysisResult ? "text-white hover:bg-white/20" : "text-slate-400")}
                  onClick={() => setIsGoalExpanded(false)}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="relative">
                <textarea 
                  placeholder="粘贴JD链接或职位描述，AI将自动提取关键技能要求..." 
                  className={cn(
                    "w-full h-24 p-3 text-xs rounded-xl focus:outline-none transition-all resize-none",
                    analysisResult 
                      ? "bg-white/10 text-white placeholder:text-white/50 border border-white/20" 
                      : "bg-white border border-slate-200 text-slate-700 shadow-sm"
                  )}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
                <Button 
                  disabled={!jdText.trim() || isAnalyzing}
                  className={cn(
                    "absolute bottom-2 right-2 h-8 rounded-lg text-xs font-bold px-4",
                    analysisResult 
                      ? "bg-white text-indigo-600 hover:bg-white/90" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                  )}
                  onClick={handleAnalyze}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" /> 解析中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Scan className="w-3 h-3" /> 技能解析
                    </span>
                  )}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-1/2 bg-white"
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Search & Filter Header */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-b border-slate-100 flex gap-2 sticky top-0 z-30">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="搜索知识节点..." 
              className="pl-9 h-9 bg-slate-100 border-none rounded-xl text-sm focus-visible:ring-indigo-500" 
            />
         </div>
         <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 bg-white">
            <Filter className="w-4 h-4 text-slate-500" />
         </Button>
      </div>

      {/* Import Notification Alert */}
      <AnimatePresence>
        {showImportAlert && importedDoc && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 z-40"
          >
            <Card className="bg-slate-900/90 backdrop-blur-md border-none text-white shadow-2xl overflow-hidden rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">知识导入成功</h4>
                  <p className="text-[10px] text-slate-300">已从《{importedDoc.fromDoc}》中提取 {generatedNodes.length} 个知识点</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-8 text-[10px] font-bold px-3"
                  onClick={() => setActiveNode(importedDoc.fromDoc)}
                >
                  立即探索
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Knowledge Node Map (Simplified SVG-based logic) */}
        <div 
          ref={containerRef}
          className="absolute inset-0 overflow-auto no-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: 'smooth' }}
        >
          <motion.div 
            className="relative" 
            style={{ 
              width: '200%', 
              height: '200%',
              scale: scale 
            }}
          >
            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                const active = isConnectionActive(conn.from, conn.to);
                
                return (
                  <motion.line
                    key={idx}
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={active ? '#6366f1' : '#cbd5e1'}
                    strokeWidth={active ? 2.5 : 1.5}
                    strokeDasharray={active ? "none" : (fromNode.isNew ? "4 4" : "none")}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: active ? 1 : 0.4 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <motion.button
                key={node.id}
                ref={(el) => {
                  nodeRefs.current[node.label] = el;
                }}
                onMouseEnter={() => setHoveredNode(node.label)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setActiveNode(node.label)}
                style={{ 
                  left: `${node.x}%`, 
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-10 group"
                initial={node.isNew ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: node.isNew ? 0.5 : 0 }}
              >
                <div className={cn(
                  "relative rounded-full flex items-center justify-center font-bold text-[11px] shadow-lg transition-all duration-500",
                  node.size === 40 ? "w-16 h-16 text-xs" : 
                    node.size === 35 ? "w-14 h-14" :
                    node.size === 30 ? "w-12 h-12" : "w-10 h-10",
                  node.color === 'indigo' ? 'bg-indigo-600 text-white w-16 h-16' : 
                    node.color === 'blue' ? 'bg-blue-500 text-white w-12 h-12' :
                    node.color === 'purple' ? 'bg-purple-500 text-white w-10 h-10' :
                    node.color === 'emerald' ? 'bg-emerald-500 text-white w-12 h-12' :
                    node.color === 'amber' ? 'bg-amber-500 text-white w-14 h-14 ring-4 ring-amber-100 ring-offset-2' :
                    'bg-slate-500 text-white w-10 h-10',
                  // Career Goal Matching Styles
                  node.isMatched && "ring-4 ring-[#10B981] ring-offset-2",
                  node.isMissing && "bg-slate-100 text-slate-400 border-2 border-dashed border-[#EF4444] shadow-none w-10 h-10"
                )}>
                  {node.isMissing ? <Target className="w-5 h-5 text-[#EF4444]" /> : (node.isNew ? <Sparkles className="w-5 h-5" /> : node.id.substring(0, 2))}
                  {activeNode === node.label && (
                    <motion.div 
                      layoutId="active-ring"
                      className="absolute inset-[-8px] border-2 border-indigo-400 rounded-full"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                  {node.isNew && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </div>
                <span className={cn(
                  "absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm transition-all duration-300 max-w-[120px] text-center break-words leading-tight",
                  activeNode === node.label ? "bg-indigo-600 text-white" : 
                  node.isNew ? "bg-amber-500 text-white" : "bg-white/90 text-slate-700"
                )}>
                  {node.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Floating Modules */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
           <AnimatePresence>
             {importedDoc && (
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="pointer-events-auto"
               >
                 <Card className="bg-white/90 backdrop-blur-md border border-slate-100 shadow-sm w-48 overflow-hidden rounded-2xl">
                   <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                     <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                       <BookOpen className="w-3 h-3" /> 最近导入
                     </span>
                     <Badge variant="outline" className="text-[8px] h-4 border-amber-200 text-amber-600 bg-white">
                       NEW
                     </Badge>
                   </div>
                   <div className="p-3">
                     <p className="text-[11px] font-bold text-slate-700 truncate mb-1">《{importedDoc.fromDoc}》</p>
                     <p className="text-[9px] text-slate-400 mb-2">生成了 {generatedNodes.length} 个相关节点</p>
                     <Button 
                       size="sm" 
                       variant="ghost" 
                       className="w-full h-7 text-[10px] text-indigo-600 font-bold bg-indigo-50/50 hover:bg-indigo-50"
                       onClick={() => setActiveNode(importedDoc.fromDoc)}
                     >
                       定位到图谱节点
                     </Button>
                   </div>
                 </Card>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* 浮动控制工具 */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
           <Button 
             size="icon" 
             className="rounded-2xl w-10 h-10 bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700 border-none text-white active:scale-90 transition-all"
             onClick={() => navigate('/quiz')}
           >
              <ClipboardList className="w-4 h-4" />
           </Button>
           <Button 
             size="icon" 
             className="rounded-2xl w-10 h-10 bg-white/90 backdrop-blur shadow-lg hover:bg-white border-none text-slate-600 active:scale-90 transition-all"
             onClick={() => setScale(scale === 1 ? 0.7 : 1)}
           >
              <Maximize2 className="w-4 h-4" />
           </Button>
           <Button size="icon" className="rounded-2xl w-10 h-10 bg-white/90 backdrop-blur shadow-lg hover:bg-white border-none text-slate-600 active:scale-90 transition-all">
              <Layers className="w-4 h-4" />
           </Button>
           <Button size="icon" className="rounded-2xl w-10 h-10 bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700 border-none text-white active:scale-90 transition-all">
              <Share2 className="w-4 h-4" />
           </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 p-2.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
           {[
             { color: 'bg-indigo-500', label: '核心领域' },
             { color: 'bg-amber-500', label: '文档同步' },
             { color: 'bg-emerald-500', label: '实践场景' },
             { color: 'bg-slate-400', label: '基础概念' },
           ].map((l, i) => (
             <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                <div className={cn("w-2.5 h-2.5 rounded-full", l.color)} />
                {l.label}
             </div>
           ))}
        </div>
      </div>

      {/* Detail Drawer (Enhanced) */}
      <AnimatePresence>
        {activeNode && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNode(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <KnowledgeDetailCard node={activeNodeData} />
          </>
        )}
      </AnimatePresence>

      {/* Career Gap Side Panel */}
      <AnimatePresence>
        {showGapPanel && analysisResult && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGapPanel(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-[85%] bg-white z-[60] shadow-2xl flex flex-col"
            >
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> 技能差距分析
                  </h3>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setShowGapPanel(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">{analysisResult.matchPercent}%</span>
                  <span className="text-sm opacity-80 mb-1.5">岗位匹配度</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisResult.matchPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <section>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">已掌握技能 ({analysisResult.mastered.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.mastered.map((skill, i) => (
                      <Badge key={i} className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> {skill}
                      </Badge>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">缺失关键技能 ({analysisResult.missing.length})</h4>
                  <div className="space-y-3">
                    {analysisResult.missing.map((skill, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{skill}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">该职位对此技能有较高要求</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-[10px] font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
                          onClick={() => {
                            setActiveNode(skill);
                            setShowGapPanel(false);
                          }}
                        >
                          去学习
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-4">
                  <Button 
                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                    onClick={handleGeneratePlan}
                  >
                    <Calendar className="w-5 h-5" />
                    生成 14 天补齐计划
                  </Button>
                  <p className="text-[10px] text-slate-400 text-center mt-3 leading-relaxed">
                    AI 将根据您的现有基础，为您量身定制<br/>
                    <span className="font-bold text-indigo-600">Day 1-14 的个性化技能提升路径</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!activeNode && (
        <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-center text-slate-400 gap-2">
           <MousePointer2 className="w-4 h-4 animate-bounce" />
           <p className="text-xs font-bold tracking-wider uppercase">点击图谱节点探索知识关联</p>
        </div>
      )}
    </div>
  );
};

export default GraphPage;
