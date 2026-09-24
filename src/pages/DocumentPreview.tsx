import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  MoreHorizontal, 
  FileText, 
  FileSpreadsheet, 
  FileBox, 
  Download, 
  Clock, 
  User, 
  Shield, 
  MessageSquare, 
  Printer, 
  History,
  Star,
  Copy,
  ExternalLink,
  ChevronDown,
  Lock,
  Users,
  Info,
  Sparkles,
  List,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Home,
  Cloud,
  BrainCircuit,
  Zap,
  Library,
  GraduationCap,
  LayoutDashboard,
  FileSearch,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface Collaborator {
  name: string;
  role: string;
  avatar: string;
}

interface OutlineItem {
  id: string;
  title: string;
  level: number;
}

interface HistoryItem {
  id: string;
  user: string;
  action: string;
  time: string;
}

interface RelatedDoc {
  id: string;
  title: string;
  type: string;
  relevance: string;
}

const getSpecificContent = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('transformer')) {
    return {
      outline: [
        { id: '1', title: '1. Transformer 架构基础', level: 1 },
        { id: '2', title: '2. 注意力机制优化 (Flash Attention)', level: 1 },
        { id: '3', title: '3. 模型量化与剪枝技术', level: 1 },
        { id: '4', title: '4. 在 Edge 设备上的部署实践', level: 1 },
      ],
      summary: [
        '本讲义深入探讨了 Transformer 架构的核心组件及其演进过程。',
        '重点介绍了如何通过算子融合与 KV Cache 优化提升模型推理速度。',
        '提供了针对移动端芯片的量化方案对比数据，并给出了性能优化建议。'
      ],
      learningRelevance: '该讲义是您正在准备的《深度学习》期末考试的核心范围，且与您毕业论文中的推理加速模块高度相关。'
    };
  }
  if (t.includes('attention')) {
    return {
      outline: [
        { id: '1', title: '1. 会议议程回顾', level: 1 },
        { id: '2', title: '2. Self-Attention 复杂度分析', level: 1 },
        { id: '3', title: '3. 稀疏注意力 (Sparse Attention) 讨论', level: 1 },
        { id: '4', title: '4. 下一步开发计划与分工', level: 1 },
      ],
      summary: [
        '本次会议重点讨论了在大模型中引入稀疏注意力机制以支持更长上下文的可能性。',
        '对比了多种稀疏方案的优劣，最终确定了初步的技术选型方案。',
        '明确了性能考核指标（Latency & Memory Usage），并分配了原型开发的任务。'
      ],
      learningRelevance: '这是项目组的最新技术选型会议记录，建议您根据会议结论更新代码仓库中的 Attention 实现部分。'
    };
  }
  if (t.includes('pytorch')) {
    return {
      outline: [
        { id: '1', title: '1. PyTorch 基础张量操作', level: 1 },
        { id: '2', title: '2. 自动求导机制 (Autograd)', level: 1 },
        { id: '3', title: '3. 构建自定义神经网络层', level: 1 },
        { id: '4', title: '4. 分布式训练初探 (DDP)', level: 1 },
      ],
      summary: [
        '本讲义为 PyTorch 初学者设计，从张量基础出发，逐步深入到复杂的分布式训练逻辑。',
        '包含多个实战案例，如手写数字识别和情感分类，适合巩固基础。',
        '特别强调了 GPU 显存管理的最佳实践，帮助读者避免常见的 OOM 错误。'
      ],
      learningRelevance: '您的 PyTorch 基础还需要加强，该讲义提供的分布式训练部分对您后续处理大型数据集非常有帮助。'
    };
  }
  if (t.includes('毕业论文大纲')) {
    return {
      outline: [
        { id: '1', title: '摘要与引言', level: 1 },
        { id: '2', title: '相关工作综述', level: 1 },
        { id: '3', title: '核心算法设计与实现', level: 1 },
        { id: '4', title: '实验结果与分析', level: 1 },
        { id: '5', title: '结论与未来工作', level: 1 },
      ],
      summary: [
        '本文档详细列出了 2026 届毕业论文的章节结构。',
        '当前已完成引言和相关工作部分的撰写，重点在第三章算法创新点。',
        '需要进一步补充对比实验的数据，尤其是与 SOTA 模型的性能指标比对。'
      ],
      learningRelevance: '这是您的毕业论文大纲，请务必根据导师李教授的反馈及时调整第三章的实验方案。'
    };
  }
  if (t.includes('机器学习实验报告')) {
    return {
      outline: [
        { id: '1', title: '一、实验目的', level: 1 },
        { id: '2', title: '二、实验环境', level: 1 },
        { id: '3', title: '三、SVM 算法实现过程', level: 1 },
        { id: '4', title: '四、交叉验证与参数调优', level: 1 },
        { id: '5', title: '五、实验总结', level: 1 },
      ],
      summary: [
        '本报告详细记录了 SVM 算法在鸢尾花数据集上的分类表现。',
        '通过网格搜索找到了最优的核函数参数 C 和 gamma，显著提升了泛化能力。',
        '实验结果显示分类准确率达到了 98.5%，验证了参数调优的重要性。'
      ],
      learningRelevance: '该报告是小组作业的关键组成部分，已完成大部分工作，建议尽快补齐剩余的图表分析。'
    };
  }
  if (t.includes('进度') || t.includes('跟踪')) {
    return {
      outline: [
        { id: '1', title: '1. 本周任务概览', level: 1 },
        { id: '2', title: '2. 各模块负责人进度', level: 1 },
        { id: '3', title: '3. 待解决的阻塞问题 (Blockers)', level: 1 },
        { id: '4', title: '4. 关键里程碑与交付日期', level: 1 },
      ],
      summary: [
        '项目目前处于集成测试的关键阶段，整体进度基本符合预期。',
        'UI 适配工作已完成 80%，后端接口对接正在收尾。',
        '预计下周五开启全量压力测试，需提前准备测试用例。'
      ],
      learningRelevance: '这是您实习项目组的进度表，您的“图谱渲染优化”任务处于关键路径上，请务必保证按时交付。'
    };
  }
  if (t.includes('需求文档')) {
    return {
      outline: [
        { id: '1', title: '1. 产品定位与目标用户', level: 1 },
        { id: '2', title: '2. 核心功能需求 (Feature List)', level: 1 },
        { id: '3', title: '3. 用户交互流程与状态机', level: 1 },
        { id: '4', title: '4. 非功能性需求与性能指标', level: 1 },
      ],
      summary: [
        'Nexus AI 学习枢纽 V2.0 版本的需求详述文档。',
        '新增了对多模态输入（语音/图像）的知识提取支持，是本次更新的亮点。',
        '强化了社交生态中的协作学习体验，通过与 QQ 和腾讯文档的深度整合实现。'
      ],
      learningRelevance: '这是产品开发的基础文档，建议您仔细研读交互流程，确保前端开发不偏离设计目标。'
    };
  }
  if (t.includes('论文') && t.includes('个人')) {
    return {
      outline: [
        { id: '1', title: '1. 问题定义与现状分析', level: 1 },
        { id: '2', title: '2. 提出的创新架构', level: 1 },
        { id: '3', title: '3. 系统实现与算子优化', level: 1 },
        { id: '4', title: '4. 性能评估与消融实验', level: 1 },
      ],
      summary: [
        '这是您的个人学术论文初稿，探讨了轻量级神经网络的训练策略。',
        '目前正在尝试引入知识蒸馏来进一步缩小模型体积而不损失精度。',
        '摘要部分需要进一步精炼，引言部分的逻辑链条还需加强。'
      ],
      learningRelevance: '这是您的核心学术产出，系统已为您提供了 3 条针对引言部分的 AI 润色建议。'
    };
  }
  if (t.includes('笔记')) {
    return {
      outline: [
        { id: '1', title: '基本概念定义与推导', level: 1 },
        { id: '2', title: '关键算法流程图', level: 1 },
        { id: '3', title: '易错点总结与避坑指南', level: 1 },
        { id: '4', title: '复习思考题与练习', level: 1 },
      ],
      summary: [
        '这是您在学习过程中积累的知识点精华笔记。',
        '包含了大量的示意图和手绘公式推导，比教材更易于理解。',
        '已经根据往年试题标记了 5 个核心考点，是考前复习的神器。'
      ],
      learningRelevance: '这是您的宝贵个人资产，系统已将其中的关键知识点索引至您的“知识图谱”个人节点中。'
    };
  }
  return null;
};

const DocumentPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [showToast, setShowToast] = useState<string | null>(null);

  const docData = useMemo(() => {
    const base = location.state || { 
      id: 'default', 
      title: '未命名文档', 
      type: 'doc', 
      author: '未知作者', 
      time: '刚刚' 
    };
    
    const isPersonal = base.isPersonal || false;
    const specificContent = getSpecificContent(base.title);
    
    return {
      ...base,
      size: base.size || '1.4 MB',
      createdTime: '2026-05-05 14:30',
      lastModified: '2026-05-05 09:15',
      permission: isPersonal ? '私人文档' : '团队文档',
      shareStatus: isPersonal ? '私有 (仅本人可见)' : '内网共享 (项目组成员)',
      isPersonal,
      collaborators: isPersonal ? [
        { name: '本人', role: '所有者', avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/0153add2666e4dab9c52622beddd4a83.jpg#desc=User_Avatar' }
      ] : [
        { name: base.author || '张三', role: '所有者', avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/7e2e2a2eaefc4d0bb3f1c49ee2345316.jpg#desc=User_Avatar_of_Author' },
        { name: '李四', role: '编辑者', avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/427cc2e16ebb4ee68d823aa27be7fc46.jpg#desc=User_Avatar_of_Li_Si' },
        { name: '王五', role: '查看者', avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-04/ffff080ab5b44ab2a2bbf79dae374844.jpg#desc=User_Avatar_of_Wang_Wu' },
      ],
      outline: specificContent?.outline || [
        { id: '1', title: '1. 项目背景与研究动机', level: 1 },
        { id: '2', title: '2. 核心技术架构分析', level: 1 },
        { id: '3', title: '2.1 Transformer 优化策略', level: 2 },
        { id: '4', title: '2.2 计算效率提升方案', level: 2 },
        { id: '5', title: '3. 实验数据与结果评估', level: 1 },
        { id: '6', title: '4. 结论与未来工作', level: 1 },
      ],
      history: [
        { id: 'h1', user: base.author || (isPersonal ? '本人' : '张三'), action: '更新了核心章节', time: '10分钟前' },
        { id: 'h2', user: isPersonal ? '本人' : '李四', action: '修正了部分数据', time: '1小时前' },
        { id: 'h3', user: base.author || (isPersonal ? '本人' : '张三'), action: '上传了初始版本', time: '3天前' },
      ],      summary: specificContent?.summary || [
        '本文档详细探讨了在大规模语言模型训练中，如何优化 Transformer 架构以提高计算效率。',
        '提出了基于稀疏注意力机制的改进方案，在大长序列建模中表现出显著优势。',
        '实验结果表明，该优化方案可降低约 30% 的 GPU 显存占用，同时保持模型精度。'
      ],
      learningRelevance: specificContent?.learningRelevance || (isPersonal ? '该文档与您正在进行的“LLM 推理加速”研究高度相关，可作为您毕业论文第二章的核心参考。' : '团队协作资料，建议关注其对现有项目的性能影响。'),
      relatedDocs: [
        { id: 'rd1', title: base.title.toLowerCase().includes('transformer') ? 'Attention Is All You Need' : '机器学习实战指南', type: 'pdf', relevance: '98%' },
        { id: 'rd2', title: base.title.toLowerCase().includes('attention') ? 'Longformer 原理详解' : '深度学习数学基础', type: 'doc', relevance: '85%' },
        { id: 'rd3', title: 'Nexus 系统使用手册 v2.0', type: 'pdf', relevance: '70%' },
      ],
      learningPath: [
        { step: 1, title: `理解 ${base.title} 核心点`, desc: '复习文档中提到的关键技术点' },
        { step: 2, title: '导入知识图谱', desc: '将本文档的实体关系映射到个人知识库' },
        { step: 3, title: 'AI 深度问答', desc: '针对不理解的细节与 AI 进行对话' },
      ]
    };
  }, [location.state]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleImportToGraph = () => {
    triggerToast('正在提取文档知识点并构建图谱...');
    
    // Determine document type for graph generation
    let docType = 'project';
    const title = docData.title;
    if (title.includes('Transformer')) docType = 'transformer';
    else if (title.includes('Attention')) docType = 'attention';
    else if (title.includes('PyTorch')) docType = 'pytorch';
    else if (title.includes('论文') || title.includes('报告') || title.includes('大纲')) docType = 'paper';

    setTimeout(() => {
      navigate('/graph', { 
        state: { 
          fromDoc: title,
          docType: docType,
          concepts: docData.outline.map((o: OutlineItem) => o.title.replace(/^\d+\.\s*/, '')),
          summary: docData.summary[0],
          timestamp: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
        } 
      });
    }, 1500);
  };

  const handleChatWithAI = () => {
    navigate('/chat', { state: { 
      initialMessage: `我想深入讨论关于《${docData.title}》中提到的 ${docData.summary[1]}。`,
      context: docData.summary.join('\n')
    } });
  };

  const handleGenerateCards = () => {
    triggerToast('已生成 5 张学习卡片，已添加至“我的卡包”');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
          />
          <Sparkles className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">AI 正在深度解析文档内容...</p>
          <p className="text-[10px] text-slate-400 mt-1">正在提取核心观点与关联知识点</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-24">
      {/* Top Navigation & Breadcrumbs */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-50">
          <Link to="/" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link to="/" className="text-[10px] font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            生态同步
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[10px] font-bold text-slate-800 truncate max-w-[120px]">
            {docData.title}
          </span>
        </div>
        
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800 max-w-[200px] truncate">{docData.title}</h1>
                {docData.isPersonal && (
                  <Badge variant="outline" className="h-4 px-1 bg-amber-50 text-amber-600 border-amber-100 text-[9px] gap-0.5">
                    <Lock className="w-2 h-2" />
                    私人
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-400">{docData.type.toUpperCase()}</span>
                <span className="text-[10px] text-slate-200">|</span>
                <span className="text-[10px] text-slate-400">{docData.size}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <Star className="w-4 h-4 text-slate-400" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <Share2 className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Permission Banner for Personal Docs */}
        {docData.isPersonal && (
          <div className="mx-4 mt-4 p-3 bg-indigo-50 rounded-2xl border border-indigo-100/50 flex items-start gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-indigo-900">文档已加密存储</div>
              <p className="text-[10px] text-indigo-600/70 mt-0.5 leading-relaxed">
                这是您的个人资料，除了您本人，任何人都无法访问。AI 解析仅在本地安全环境下进行。
              </p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-4 space-y-6">
          {/* Main Preview Tab Content */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                AI 智能摘要
              </h2>
              <Badge className="bg-indigo-600 text-[9px] h-4">核心内容</Badge>
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
              {docData.summary.map((item: string, idx: number) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-indigo-400 font-bold text-[10px] mt-0.5 shrink-0">{idx + 1}.</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed break-words">{item}</p>
                </div>
              ))}
              
              <div className="pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-700">对我的学习建议</span>
                </div>
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200 italic break-words">
                  “{docData.learningRelevance}”
                </p>
              </div>
            </div>
          </section>

          {/* Next Steps Card */}
          <section>
            <Card className="border-none bg-gradient-to-br from-slate-900 to-indigo-950 text-white overflow-hidden rounded-2xl shadow-xl">
              <CardContent className="p-5 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold tracking-wider uppercase opacity-80">智能下一步建议</span>
                  </div>
                  <h3 className="text-sm font-bold mb-4">准备好将这些知识内化了吗？</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={handleImportToGraph}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 h-10 rounded-xl flex items-center gap-2 justify-start px-3 transition-all"
                    >
                      <BrainCircuit className="w-4 h-4 text-indigo-400" />
                      <div className="text-left">
                        <div className="text-[10px] font-bold">导入图谱</div>
                        <div className="text-[8px] opacity-60">构建关系网</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={handleChatWithAI}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 h-10 rounded-xl flex items-center gap-2 justify-start px-3 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <div className="text-left">
                        <div className="text-[10px] font-bold">AI 深度探讨</div>
                        <div className="text-[8px] opacity-60">破除知识盲点</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={handleGenerateCards}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 h-10 rounded-xl flex items-center gap-2 justify-start px-3 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      <div className="text-left">
                        <div className="text-[10px] font-bold">生成卡片</div>
                        <div className="text-[8px] opacity-60">间隔重复复习</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={() => navigate('/quiz')}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 h-10 rounded-xl flex items-center gap-2 justify-start px-3 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      <div className="text-left">
                        <div className="text-[10px] font-bold">知识自测</div>
                        <div className="text-[8px] opacity-60">验证学习效果</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Document Content / Preview Tabs */}
          <Tabs defaultValue="preview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full bg-slate-100/50 p-1 rounded-xl h-10">
              <TabsTrigger value="preview" className="flex-1 text-[11px] rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">文档概览</TabsTrigger>
              <TabsTrigger value="outline" className="flex-1 text-[11px] rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">结构大纲</TabsTrigger>
              <TabsTrigger value="collaborators" className="flex-1 text-[11px] rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {docData.isPersonal ? '权限详情' : '协作记录'}
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <AnimatePresence mode="wait">
                {activeTab === 'preview' && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                      <div className="bg-slate-50/50 border-b border-slate-100 p-3 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">文件预览 (示意)</span>
                        <Button variant="ghost" size="sm" className="h-6 text-[9px] gap-1 text-indigo-600 hover:bg-indigo-50">
                          <ExternalLink className="w-3 h-3" />
                          阅读全文
                        </Button>
                      </div>
                      <div className="aspect-[3/4] p-6 flex flex-col items-center justify-center bg-white">
                        <div className="w-full h-full border border-slate-100 rounded shadow-sm bg-slate-50/20 p-8 flex flex-col gap-4">
                          <div className="h-4 bg-slate-200/50 rounded w-3/4"></div>
                          <div className="h-2 bg-slate-100 rounded w-full"></div>
                          <div className="h-2 bg-slate-100 rounded w-full"></div>
                          <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                          <div className="h-2 bg-slate-100 rounded w-4/5 mt-4"></div>
                          <div className="h-2 bg-slate-100 rounded w-full"></div>
                          <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                          
                          <div className="mt-12 space-y-3">
                            <div className="h-32 bg-slate-200/20 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
                              <FileSearch className="w-8 h-8 text-slate-300" />
                              <span className="text-[10px] text-slate-400">正在渲染实时内容预览...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'outline' && (
                  <motion.div
                    key="outline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      {docData.outline.map((item: OutlineItem) => (
                        <div 
                          key={item.id} 
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-slate-50",
                            item.level === 1 ? "pl-2" : "pl-8"
                          )}
                        >
                          <div className={cn(
                            "w-1 h-4 rounded-full",
                            item.level === 1 ? "bg-indigo-400" : "bg-slate-200"
                          )} />
                          <span className={cn(
                            "text-[11px]",
                            item.level === 1 ? "font-bold text-slate-800" : "text-slate-500"
                          )}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'collaborators' && (
                  <motion.div
                    key="collaborators"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">所有权与权限</span>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-slate-500">
                          <Shield className="w-3.5 h-3.5" />
                          权限设置
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {docData.collaborators.map((c: Collaborator, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-slate-100">
                                <AvatarImage src={c.avatar} />
                                <AvatarFallback>{c.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-[11px] font-bold text-slate-800">{c.name}</div>
                                <div className="text-[9px] text-slate-400">{c.role}</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-[9px] text-slate-400 border-none bg-transparent">
                              {i === 0 ? '全权拥有' : '可编辑'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
                      <div className="text-xs font-bold text-slate-800">操作记录</div>
                      <div className="space-y-4">
                        {docData.history.map((h: HistoryItem) => (
                          <div key={h.id} className="flex gap-3 relative">
                            <div className="absolute left-1.5 top-6 bottom-[-16px] w-[1px] bg-slate-100 last:hidden" />
                            <div className="w-3 h-3 rounded-full bg-slate-200 mt-0.5 relative z-10 border-2 border-white" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-700">{h.user}</span>
                                <span className="text-[9px] text-slate-400">{h.time}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">{h.action}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tabs>

          {/* Related Documents Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Library className="w-3.5 h-3.5 text-indigo-500" />
                相关文档推荐
              </h2>
              <span className="text-[10px] text-slate-400">基于内容关联</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {docData.relatedDocs.map((doc: RelatedDoc) => (
                <div key={doc.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 group hover:border-indigo-200 transition-colors">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    doc.type === 'pdf' ? "bg-rose-50 text-rose-500" : "bg-blue-50 text-blue-500"
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-slate-800 truncate group-hover:text-indigo-600">{doc.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-slate-400 uppercase">{doc.type}</span>
                      <span className="text-[9px] text-slate-200">•</span>
                      <span className="text-[9px] text-indigo-500 font-medium">相似度 {doc.relevance}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-indigo-500">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Learning Path Suggestion */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              学习路径建议
            </h2>
            <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-100/50">
              <div className="space-y-4">
                {docData.learningPath.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                        {item.step}
                      </div>
                      {idx !== docData.learningPath.length - 1 && (
                        <div className="w-[1px] h-full bg-indigo-200" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="text-[11px] font-bold text-indigo-900">{item.title}</div>
                      <p className="text-[10px] text-indigo-600/70 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Discussion Section */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                最近讨论
              </h2>
            </div>
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="flex gap-3">
                  <Avatar className="h-8 w-8 border border-slate-100">
                    <AvatarImage src={docData.collaborators[i]?.avatar} />
                    <AvatarFallback>{docData.collaborators[i]?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-800">{docData.collaborators[i]?.name}</span>
                      <span className="text-[9px] text-slate-400">{i * 2 + 1} 小时前</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                      {i === 1 ? '我觉得这个摘要里关于显存占用的数据可以再标注一下测试环境。' : '已经核对过第 3 部分了，数据无误，可以同步到我们的知识库。'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-30 flex items-center justify-between gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => triggerToast('文档已添加到你的学习库')}
            className="text-[10px] h-10 flex-col gap-0.5 px-3 text-slate-600 hover:text-indigo-600"
          >
            <Star className="w-4 h-4" />
            <span>收藏学习</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleChatWithAI}
            className="text-[10px] h-10 flex-col gap-0.5 px-3 text-indigo-600 hover:bg-indigo-50"
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI 对话</span>
          </Button>
        </div>
        <div className="flex gap-2 flex-1 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[10px] h-10 gap-1.5 rounded-xl px-4 border-slate-200 font-bold hover:bg-slate-50"
            onClick={handleImportToGraph}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            导入图谱
          </Button>
          <Button 
            onClick={() => {
              if (docData.type === 'pdf') {
                navigate('/learning/pdf', { state: { title: docData.title } });
              } else {
                navigate('/learning/article', { state: { title: docData.title } });
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-[10px] h-10 gap-1.5 rounded-xl px-5 shadow-lg shadow-indigo-100 font-bold"
          >
            <BookOpen className="w-3.5 h-3.5" />
            阅览全文
          </Button>
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-2xl"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentPreview;
