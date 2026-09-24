import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Typography } from '../components/ui/typography';
import { Card, CardContent } from '../components/ui/card';

const PushHistory = () => {
  const navigate = useNavigate();

  const historyData = [
    {
      id: 1,
      time: '2026-05-05 10:30',
      content: '【学习提醒】您预约的《Transformer精讲》直播课即将开始。',
      status: '已发送',
    },
    {
      id: 2,
      time: '2026-05-04 18:00',
      content: '【每日总结】今日您已完成 3 篇深度阅读，知识图谱新增 12 个节点。',
      status: '已发送',
    },
    {
      id: 3,
      time: '2026-05-03 09:15',
      content: '【系统消息】生态同步功能已成功连接您的腾讯文档。',
      status: '已发送',
    },
    {
      id: 4,
      time: '2026-05-02 20:00',
      content: '【进度预警】本周的学习目标尚未过半，请注意合理安排时间。',
      status: '已发送',
    },
    {
      id: 5,
      time: '2026-05-01 14:00',
      content: '【内容推荐】基于您的兴趣，为您推荐了《高效学习方法论》相关资料。',
      status: '已发送',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-slate-100 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 rounded-full" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <Typography variant="h3" className="text-lg font-bold text-slate-800">历史推送记录</Typography>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {historyData.map((item) => (
          <Card key={item.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{item.time}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{item.status}</span>
                </div>
              </div>
              <Typography className="text-sm text-slate-700 leading-relaxed font-medium mt-1">
                {item.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PushHistory;
