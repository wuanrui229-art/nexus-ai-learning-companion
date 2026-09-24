import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Plus, 
  Mic, 
  Sparkles, 
  BrainCircuit, 
  History, 
  ArrowUpRight, 
  Lightbulb,
  BookOpen,
  Target,
  ChevronDown,
  Link2,
  Network,
  FileText,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';

interface Message {
  id: number;
  role: 'ai' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
  docRef?: string;
  linkToNode?: string;
}

const ChatPage = () => {
  const { syncedItems } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      text: '嗨！我观察到你刚才从 QQ 群同步了一篇关于“Transformer 架构优化”的讲义，还录入了一段关于“强化学习奖励函数”的思考。',
      time: '09:41',
      linkToNode: 'Transformer'
    },
    {
      id: 2,
      role: 'ai',
      text: '这两者在“多智能体强化学习”中有很强的关联性。你想深入探讨一下它们是如何结合的吗？',
      time: '09:42',
      linkToNode: '强化学习'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const processedItems = useRef<Set<string>>(new Set(['initial-1']));

  useEffect(() => {
    const state = location.state as { initialMessage?: string, context?: string };
    if (state?.initialMessage) {
      const userMsg: Message = { 
        id: Date.now(), 
        role: 'user', 
        text: state.initialMessage, 
        time: '现在' 
      };
      setMessages(prev => [...prev, userMsg]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiMsg: Message = { 
          id: Date.now() + 1, 
          role: 'ai', 
          text: `针对你提到的内容，我已经检索了文档背景。基于这些核心观点，我们可以从“模型压缩策略”或“计算效率评估”两个维度深入。你想先了解哪一个？`, 
          time: '现在',
          suggestions: ['模型压缩策略', '计算效率评估', '查看关联图谱']
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 1500);
      
      // Clear state so it doesn't re-trigger on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === '重新发送刚才的问题') {
      const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
      if (lastUserMessage) setInputText(lastUserMessage.text);
      return;
    }
    if (suggestion.includes('关联') || suggestion.includes('图谱') || suggestion.includes('查看节点')) {
      let nodeName = '强化学习';
      if (suggestion.includes('深度学习')) {
        nodeName = '深度学习';
      } else if (suggestion.includes('Transformer')) {
        nodeName = 'Transformer';
      }
      navigate('/graph', { state: { highlightNode: nodeName } });
    } else {
      setInputText(suggestion);
    }
  };

  const handleNodeClick = (node: string) => {
    navigate('/graph', { state: { highlightNode: node } });
  };

  useEffect(() => {
    const newItem = syncedItems.find(item => !processedItems.current.has(item.id));
    if (newItem) {
      processedItems.current.add(newItem.id);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const text = newItem.title.includes('机器学习') 
          ? `我注意到你刚刚导入了《${newItem.title}》。这为你当前的知识体系补充了重要的基础。你想让我基于文档内容为你出几道测试题，还是直接将其关联到你的“深度学习”知识路径中？`
          : `新知识已同步：来自 ${newItem.source} 的“${newItem.title}”。我已经将其内容提取并准备好回答相关问题。`;
        
        const aiMsg: Message = {
          id: Date.now(),
          role: 'ai',
          text: text,
          time: '刚刚',
          docRef: newItem.title,
          suggestions: newItem.title.includes('机器学习') 
            ? ['生成基础知识测试', '关联至深度学习路径', '总结文档核心观点']
            : ['总结内容', '查看节点强化学习']
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 2000);
    }
  }, [syncedItems]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sendingRef.current) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text, time: '现在' };
    const conversation = [...messages, userMsg];
    setMessages(conversation);
    setInputText('');
    sendingRef.current = true;
    setIsTyping(true);

    try {
      const importedContext = syncedItems
        .slice(0, 6)
        .map((item) => [
          `资料标题：${item.title}`,
          `来源：${item.source}`,
          `类型：${item.type}`,
          `标签：${item.tags.join('、') || '无'}`,
          `内容：${item.content.slice(0, 800)}`,
        ].join('\n'))
        .join('\n\n');

      const requestMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
      if (importedContext) {
        requestMessages.push(
          {
            role: 'user',
            content: `以下是我已在 Nexus 中导入或同步的资料，请仅在与问题相关时据此回答，不要补写资料中没有的细节：\n\n${importedContext}`,
          },
          {
            role: 'assistant',
            content: '好的，我会把这些资料作为当前对话上下文，并明确区分资料原文与我的分析。',
          },
        );
      }
      requestMessages.push(...conversation.slice(-16).map((message) => ({
        role: message.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: message.text,
      })));

      const response = await fetch('/api/nexus/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: requestMessages }),
      });
      const payload = await response.json() as { message?: string; error?: string };
      if (!response.ok || !payload.message) {
        throw new Error(payload.error || 'AI 服务暂时没有响应，请稍后再试。');
      }

      setIsTyping(false);
      const aiMsg: Message = { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: payload.message,
        time: '现在',
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = error instanceof Error ? error.message : 'AI 服务暂时不可用，请稍后再试。';
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: errorMessage,
        time: '现在',
        suggestions: ['重新发送刚才的问题'],
      }]);
    } finally {
      sendingRef.current = false;
    }
  };

  useEffect(() => {
    const scrollToLatestMessage = () => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: messages.length > 2 ? 'smooth' : 'auto',
      });
    };

    const frame = requestAnimationFrame(scrollToLatestMessage);
    const settleTimer = window.setTimeout(scrollToLatestMessage, 350);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
    };
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="p-4 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
           <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-white" />
           </motion.div>
           <div>
              <h2 className="text-sm font-bold text-slate-900">Nexus 学习伴侣</h2>
              <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">深度思考模式 · 已开启</span>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 transition-colors">
             <History className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 transition-colors">
             <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-40 no-scrollbar">
        {/* 功能入口卡片 */}
        <div className="space-y-3 mb-6">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Card className="h-20 bg-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[12px] flex items-center px-4 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-3">
                 <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                 <h3 className="text-sm font-bold text-slate-900">与AI伴侣讨论</h3>
                 <p className="text-[10px] text-slate-500">深入探讨知识图谱与学习瓶颈</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Card>
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }} onClick={() => navigate('/interview/position')}>
            <Card className="h-20 bg-white border-none shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[12px] flex items-center px-4 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="relative mr-3">
                 <motion.div 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                   transition={{ repeat: Infinity, duration: 1.5 }}
                   className="absolute inset-0 bg-purple-500/20 rounded-full"
                 />
                 <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center relative z-10">
                    <Mic className="w-5 h-5 text-[#8B5CF6]" />
                 </div>
              </div>
              <div className="flex-1">
                 <h3 className="text-base font-bold text-[#1F2937]">AI模拟面试</h3>
                 <p className="text-xs text-[#6B7280]">真实面试场景 · 高压打断 · 实时评分</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </Card>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">学习问答区域</h3>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-400 text-[10px] py-1 px-3 rounded-full font-medium gap-1.5">
              <BrainCircuit className="w-3 h-3 text-indigo-500" />
              已关联 {syncedItems.length + 2} 条历史上下文及实时同步内容
            </Badge>
          </motion.div>

          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 <Avatar className="w-8 h-8 shrink-0 border-2 border-white shadow-sm">
                    <AvatarFallback className={msg.role === 'ai' ? 'bg-indigo-600 text-white text-[10px]' : 'bg-slate-200 text-slate-600 text-[10px]'}>
                      {msg.role === 'ai' ? 'AI' : 'ME'}
                    </AvatarFallback>
                 </Avatar>
                 <div className="flex flex-col gap-1.5">
                    <div className={cn(
                      "p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all break-words overflow-hidden",
                      msg.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100" : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                    )}>
                      {msg.text}
                      {msg.linkToNode && (
                        <div 
                          onClick={() => handleNodeClick(msg.linkToNode!)}
                          className="mt-2 flex items-center gap-2 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100/50 cursor-pointer hover:bg-indigo-100/50 transition-colors"
                        >
                            <Network className="w-3 h-3 text-indigo-500" />
                            <span className="text-[10px] text-indigo-600 font-bold truncate">查看节点{msg.linkToNode}</span>
                            <ArrowUpRight className="w-2.5 h-2.5 text-indigo-400" />
                        </div>
                      )}
                      {msg.docRef && (
                        <div className="mt-2 flex items-center gap-2 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100/50">
                            <Link2 className="w-3 h-3 text-indigo-500" />
                            <span className="text-[10px] text-indigo-600 font-bold truncate">参考来源: {msg.docRef}</span>
                        </div>
                      )}
                      {msg.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.suggestions.map((s, i) => (
                            <Badge 
                              key={i} 
                              onClick={() => handleSuggestionClick(s)} 
                              variant="outline" 
                              className="bg-white border-indigo-100 text-indigo-600 text-[10px] py-1 cursor-pointer hover:bg-indigo-50 transition-colors"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={cn("text-[9px] text-slate-400 font-medium px-1", msg.role === 'user' ? "text-right" : "text-left")}>
                      {msg.time}
                    </span>
                 </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
             <div className="flex gap-3">
                <Avatar className="w-8 h-8 shrink-0 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-indigo-600 text-white text-[10px]">AI</AvatarFallback>
                </Avatar>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                   <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                   <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                   <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                </div>
             </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-100 absolute bottom-0 w-full z-40 pb-8 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
         <div className="flex items-center gap-2 mb-3 px-1 overflow-x-auto no-scrollbar">
            <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer text-[10px] border-none font-bold h-6 flex shrink-0">
               <BrainCircuit className="w-3 h-3 mr-1" /> 多维上下文已关联
            </Badge>
         </div>
         <div className="flex items-end gap-2">
            <div className="flex-1 bg-slate-50 rounded-[1.5rem] border border-slate-200 p-2 focus-within:border-indigo-400 transition-all shadow-inner">
               <textarea 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                 placeholder="问问你的 AI 学习助手..."
                 className="w-full bg-transparent border-none outline-none text-sm p-2 resize-none max-h-32 min-h-[40px]"
                 rows={1}
               />
               <div className="flex items-center justify-between px-1 pt-1">
                  <div className="flex gap-1">
                     <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-full">
                        <Plus className="w-5 h-5" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-full">
                        <Mic className="w-5 h-5" />
                     </Button>
                  </div>
                  <Button 
                    onClick={handleSend}
                    size="icon" 
                    className={cn(
                      "h-9 w-9 rounded-xl transition-all shadow-lg",
                      inputText.trim() ? "bg-indigo-600 shadow-indigo-200" : "bg-slate-200 text-slate-400 shadow-none"
                    )}
                  >
                     <Send className="w-4 h-4" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatPage;
