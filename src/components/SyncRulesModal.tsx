import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface SyncRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rules: SyncRules) => void;
  currentRules: SyncRules;
}

export interface SyncRules {
  timeRange: '7' | '30' | 'all';
  excludeKeywords: string;
  excludeFolders: string[];
}

const SyncRulesModal: React.FC<SyncRulesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentRules,
}) => {
  const [timeRange, setTimeRange] = useState<SyncRules['timeRange']>(currentRules.timeRange);
  const [excludeKeywords, setExcludeKeywords] = useState(currentRules.excludeKeywords);
  const [excludeFolders, setExcludeFolders] = useState<string[]>(currentRules.excludeFolders);

  const folderOptions = [
    { id: 'life', label: '生活照片' },
    { id: 'unrelated', label: '工作无关' },
    { id: 'backup', label: '个人备份' },
    { id: 'download', label: '下载目录' },
  ];

  const handleFolderChange = (folderLabel: string, checked: boolean) => {
    if (checked) {
      setExcludeFolders([...excludeFolders, folderLabel]);
    } else {
      setExcludeFolders(excludeFolders.filter((f) => f !== folderLabel));
    }
  };

  const handleSave = () => {
    onSave({
      timeRange,
      excludeKeywords,
      excludeFolders,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">同步规则配置</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Time Range */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-700">时间范围</Label>
            <RadioGroup
              value={timeRange}
              onValueChange={(value: '7' | '30' | 'all') => setTimeRange(value)}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center space-x-3 h-8">
                <RadioGroupItem value="7" id="r1" className="shrink-0" />
                <Label htmlFor="r1" className="text-sm font-medium text-slate-700 cursor-pointer whitespace-nowrap leading-none py-1">最近7天</Label>
              </div>
              <div className="flex items-center space-x-3 h-8">
                <RadioGroupItem value="30" id="r2" className="shrink-0" />
                <Label htmlFor="r2" className="text-sm font-medium text-slate-700 cursor-pointer whitespace-nowrap leading-none py-1">最近30天</Label>
              </div>
              <div className="flex items-center space-x-3 h-8">
                <RadioGroupItem value="all" id="r3" className="shrink-0" />
                <Label htmlFor="r3" className="text-sm font-medium text-slate-700 cursor-pointer whitespace-nowrap leading-none py-1">全部</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Keywords */}
          <div className="space-y-3">
            <Label htmlFor="keywords" className="text-sm font-bold text-slate-700">
              排除包含以下关键词的文档
            </Label>
            <Input
              id="keywords"
              placeholder="私人、草稿、临时"
              value={excludeKeywords}
              onChange={(e) => setExcludeKeywords(e.target.value)}
              className="rounded-xl border-slate-200"
            />
          </div>

          {/* Folders */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-700">选择要排除的文件夹</Label>
            <div className="grid grid-cols-2 gap-3">
              {folderOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 h-9">
                  <Checkbox
                    id={option.id}
                    checked={excludeFolders.includes(option.label)}
                    onCheckedChange={(checked) => handleFolderChange(option.label, !!checked)}
                    className="shrink-0"
                  />
                  <Label htmlFor={option.id} className="text-sm font-medium text-slate-700 cursor-pointer whitespace-nowrap leading-none py-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3 sm:justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none rounded-xl h-11 font-bold text-slate-600">
            取消
          </Button>
          <Button onClick={handleSave} className="flex-1 sm:flex-none rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-11 font-bold shadow-lg shadow-indigo-100">
            保存并应用
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncRulesModal;
