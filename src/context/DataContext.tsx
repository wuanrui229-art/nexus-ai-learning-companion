import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SyncedItem {
  id: string;
  title: string;
  source: string;
  type: 'doc' | 'qq' | 'voice' | 'image' | 'vision';
  tags: string[];
  content: string;
  timestamp: string;
}

export interface LearningPath {
  id: string;
  topic: string;
  status: 'planned' | 'in-progress' | 'completed';
  progress: number;
  addedAt: string;
  estimatedTime: string;
  description: string;
}

export interface Goal {
  type: 'career' | 'exam';
  title: string;
  subInfo: string;
  deadline: string;
  progress: number;
  winRate: number;
  level: string;
  records: { date: string; title: string; increment: number }[];
}

interface DataContextType {
  syncedItems: SyncedItem[];
  isSyncing: boolean;
  lastSyncTime: string;
  addSyncedItem: (item: Omit<SyncedItem, 'id' | 'timestamp'>) => void;
  triggerSync: () => void;
  newKnowledgeNodes: string[]; // Nodes to be highlighted in Graph
  learningPaths: LearningPath[];
  addLearningPath: (path: Omit<LearningPath, 'id' | 'addedAt'>) => void;
  removeLearningPath: (id: string) => void;
  updateLearningPathStatus: (id: string, status: LearningPath['status']) => void;
  goal: Goal | null;
  setGoal: (goal: Goal) => void;
  updateGoalProgress: (increment: number, activity: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [syncedItems, setSyncedItems] = useState<SyncedItem[]>([
    {
      id: 'initial-1',
      title: 'Transformer 架构优化',
      source: 'QQ群文件: AI 前沿动态',
      type: 'qq',
      tags: ['深度学习', '架构优化'],
      content: '从班级QQ群文件同步：关于 Transformer 架构优化深度解析的文章，内容涵盖了模型压缩与量化技术。',
      timestamp: '2026-05-05 10:24'
    }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('刚刚');
  const [newKnowledgeNodes, setNewKnowledgeNodes] = useState<string[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: 'lp-1',
      topic: 'Transformer架构',
      status: 'in-progress',
      progress: 45,
      addedAt: '2026-05-05',
      estimatedTime: '12小时',
      description: '深入理解注意力机制与序列建模。'
    }
  ]);
  const [goal, setGoal] = useState<Goal | null>({
    type: 'career',
    title: '腾讯产品经理',
    subInfo: 'AI 方向',
    deadline: '2026-06-05',
    progress: 45,
    winRate: 45,
    level: 'Lv.2 入门选手',
    records: [
      { date: '5月4日', title: '点亮CNN节点', increment: 2 },
      { date: '5月3日', title: '完成模拟面试', increment: 5 },
    ]
  });

  const updateGoalProgress = (increment: number, activity: string) => {
    if (!goal) return;
    setGoal(prev => {
      if (!prev) return null;
      return {
        ...prev,
        progress: Math.min(100, prev.progress + increment),
        records: [
          { date: '5月5日', title: activity, increment },
          ...prev.records
        ]
      };
    });
  };

  const addLearningPath = (path: Omit<LearningPath, 'id' | 'addedAt'>) => {
    const newPath: LearningPath = {
      ...path,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date().toISOString().split('T')[0]
    };
    setLearningPaths(prev => {
      // Avoid duplicates
      if (prev.find(p => p.topic === path.topic)) return prev;
      return [newPath, ...prev];
    });
  };

  const removeLearningPath = (id: string) => {
    setLearningPaths(prev => prev.filter(p => p.id !== id));
  };

  const updateLearningPathStatus = (id: string, status: LearningPath['status']) => {
    setLearningPaths(prev => prev.map(p => 
      p.id === id ? { ...p, status, progress: status === 'completed' ? 100 : p.progress } : p
    ));
  };

  const addSyncedItem = (item: Omit<SyncedItem, 'id' | 'timestamp'>) => {
    setIsSyncing(true);
    
    // Simulate sync delay
    setTimeout(() => {
      const newItem: SyncedItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      };
      
      setSyncedItems(prev => [newItem, ...prev]);
      
      // If it's the machine learning doc, add specific nodes to graph
      if (item.title.includes('机器学习基础') || item.content.includes('机器学习')) {
        setNewKnowledgeNodes(prev => [...prev, 'ML_BASE', 'SUP_LEARN', 'UNSUP_LEARN']);
      }
      
      setIsSyncing(false);
      setLastSyncTime('1分钟前');
    }, 1500);
  };

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('刚刚');
    }, 1000);
  };

  return (
    <DataContext.Provider value={{ 
      syncedItems, 
      isSyncing, 
      lastSyncTime, 
      addSyncedItem, 
      triggerSync,
      newKnowledgeNodes,
      learningPaths,
      addLearningPath,
      removeLearningPath,
      updateLearningPathStatus,
      goal,
      setGoal,
      updateGoalProgress
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
