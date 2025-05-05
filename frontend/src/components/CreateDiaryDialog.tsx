import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { diaryApi } from '../utils/api';
import { useTranslations } from 'next-intl';
// Lexical imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DiaryResponse } from 'types/entities';
import * as React from 'react';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { MentionNode, MentionData } from './LexicalMentionNode';
import MentionPlugin from './MentionPlugin';

dayjs.extend(utc);
dayjs.extend(timezone);

interface CreateDiaryDialogProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
    diary?: DiaryResponse;
    mode?: 'create' | 'edit';
}

const editorTheme = {
    // You can customize Lexical theme here or use default
};

const initialConfig = {
    namespace: 'DiaryEditor',
    theme: editorTheme,
    onError(error: Error) {
        throw error;
    },
    nodes: [MentionNode], // 注册 MentionNode
};

const CreateDiaryDialog = ({ open, onClose, onCreated, diary, mode = 'create' }: CreateDiaryDialogProps) => {
    const t = useTranslations();
    const [dateTime, setDateTime] = useState<Dayjs | null>(diary ? dayjs(diary.happened_at) : dayjs());
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState('');
    const [editorState, setEditorState] = useState<EditorState | null>(null);
    const [editor, setEditor] = useState<LexicalEditor | null>(null);
    const [mentionCounts, setMentionCounts] = useState<Record<number, { data: MentionData, count: number }>>({});
    const isEdit = mode === 'edit';
    const handleDateTimeChange = (value: Dayjs | null) => {
        setDateTime(value);
    };

    var count = 0;

    // 初始化编辑器内容（仅首次打开时）
    React.useEffect(() => {
        if (open && diary && isEdit && editor) {
          requestIdleCallback(() => {
            editor.setEditorState(
                editor.parseEditorState(
                    diary.content && diary.content.trim()
                        ? JSON.parse(diary.content)
                        : { root: { children: [], direction: null, format: '', indent: 0, type: 'root', version: 1 }, selection: null },
                    () => {
                        // 默认解析器即可
                    }
                )
            );
          });
        }
        if (open && diary && isEdit) {
            setDateTime(dayjs.utc(diary.happened_at));
            // 解析 mention 并初始化计数
            try {
                const content = diary.content && diary.content.trim() ? JSON.parse(diary.content) : null;
                if (content && content.root) {
                    // 递归遍历所有节点，统计 mention
                    const mentionMap: Record<number, { data: MentionData, count: number }> = {};
                    function traverse(node: any) {
                        if (node.type === 'mention' && node.mention) {
                            const id = node.mention.id;
                            if (mentionMap[id]) {
                                mentionMap[id].count += 1;
                            } else {
                                mentionMap[id] = { data: node.mention, count: 1 };
                            }
                        }
                        if (Array.isArray(node.children)) {
                            node.children.forEach(traverse);
                        }
                    }
                    traverse(content.root);
                    setMentionCounts(mentionMap);
                } else {
                    setMentionCounts({});
                }
            } catch {
                setMentionCounts({});
            }
        }
        if (open && !diary && !isEdit) {
            setDateTime(dayjs());
            setMentionCounts({});
        }
        // eslint-disable-next-line
    }, [open, diary, isEdit, editor]);

    // Lexical onChange handler
    const handleEditorChange = (state: EditorState, editor: LexicalEditor) => {
        setEditorState(state);
        setEditor(editor);
    };

    // 获取 Lexical editor state 的 JSON
    const getContentAsJson = () => {
        if (!editorState) return '';
        return JSON.stringify(editorState.toJSON());
    };

    // 计数增加
    const handleMentionAdd = (mention: MentionData) => {
        setMentionCounts(prev => {
            const next = { ...prev };
            if (next[mention.id]) {
                next[mention.id] = { data: mention, count: next[mention.id].count + 1 };
            } else {
                next[mention.id] = { data: mention, count: 1 };
            }
            return next;
        });
    };

    // 计数减少
    const handleMentionRemove = (mention: MentionData) => {
        setMentionCounts(prev => {
            const next = { ...prev };
            if (next[mention.id]) {
                if (next[mention.id].count > 1) {
                    next[mention.id] = { data: mention, count: next[mention.id].count - 1 };
                } else {
                    delete next[mention.id];
                }
            }
            return next;
        });
    };

    // 绑定删除回调和监听mention节点删除
    React.useEffect(() => {
        MentionNode.onMentionRemoved = handleMentionRemove;
        let unregister: (() => void) | undefined;
        if (editor) {
            // 监听MentionNode的删除
            unregister = editor.registerMutationListener(MentionNode, (mutations, {prevEditorState}) => {
                mutations.forEach((mutation, nodeKey) => {
                    if ( mutation === 'destroyed') {
                        const node = prevEditorState._nodeMap.get(nodeKey);
                        if (node && '__mention' in node) {
                            handleMentionRemove((node as unknown as {__mention: MentionData}).__mention);
                        }
                    }
                });
            });
        }
        return () => {
            MentionNode.onMentionRemoved = null;
            if (unregister) unregister();
        };
    }, [editor]);

    const handleSave = async () => {
        const contentJson = getContentAsJson();
        if (!contentJson.trim() || !dateTime) {
            setFormError('内容和时间不能为空');
            return;
        }
        setCreating(true);
        setFormError('');
        try {
            if (isEdit && diary) {
                await diaryApi.updateDiary(diary.id, {
                    content: contentJson,
                    happened_at: dateTime.local().toISOString(),
                    contact_ids: Object.keys(mentionCounts).map(Number), // 新增联系人ID列表
                });
            } else {
                await diaryApi.createDiary({
                    content: contentJson,
                    happened_at: dateTime.local().toISOString(),
                    contact_ids: Object.keys(mentionCounts).map(Number), // 新增联系人ID列表
                });
            }
            setFormError('');
            onCreated();
            onClose();
        } catch (e: any) {
            setFormError(e.response?.data?.message || (isEdit ? '保存失败' : '创建失败'));
        } finally {
            setCreating(false);
        }
    };

    const handleDialogClose = (event: React.MouseEvent | React.KeyboardEvent, reason: string) => {
        // 阻止点击外部关闭对话框
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setFormError('');
        onClose();
    };

    const handleDialogCancel = (event: React.MouseEvent) => {
        handleDialogClose(event, 'cancel');
    };

    return (
        <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth PaperProps={{
            sx: {
                borderRadius: 4,
                boxShadow: '0 4px 32px #1976d233',
                bgcolor: '#f8fafc',
                p: 0
            }
        }}>
            <DialogTitle sx={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, bgcolor: '#1976d2', color: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, py: 2, px: 3 }}>
                {isEdit ? (t('diary.editEntry') || '编辑日志') : (t('diary.newEntry') || '新建日志')}
            </DialogTitle>
            <DialogContent sx={{ p: { xs: 4, sm:6 }, pt: { xs: 7, sm: 9 } }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label={t('diary.dateTime') || '日期和时间'}
                        value={dateTime}
                        onChange={handleDateTimeChange}
                        defaultValue={isEdit && diary ? dayjs(diary.happened_at) : dayjs()}
                        slotProps={{ textField: { fullWidth: true, size: 'small', sx: { bgcolor: '#fff', borderRadius: 2, mt: 2 } } }}
                    />
                </LocalizationProvider>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mt: 3, gap: 2 }}>
                    <Box sx={{ flex: 1, minHeight: 180, border: '1px solid #e0e7ef', borderRadius: 3, p: 2, background: '#fff', boxShadow: '0 2px 8px #e0e7ef22' }}>
                        <LexicalComposer initialConfig={initialConfig}>
                            <MentionPlugin onMentionAdd={handleMentionAdd} />
                            <RichTextPlugin
                                contentEditable={<ContentEditable style={{ minHeight: 120, outline: 'none', background: 'transparent', fontSize: 16, color: '#222' }} />}
                                placeholder={<div style={{ color: '#bbb', fontSize: 16, padding: '12px 0' }}>{t('diary.content') || '内容'}</div>}
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <HistoryPlugin />
                            <AutoFocusPlugin />
                            <OnChangePlugin onChange={handleEditorChange} />
                        </LexicalComposer>
                    </Box>
                    {/* 右侧显示mention计数列表 */}
                    <Box sx={{ width: 200, bgcolor: '#f6f8fa', borderRadius: 3, p: 2, border: '1px solid #e0e7ef', minHeight: 180, boxShadow: '0 2px 8px #e0e7ef22', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main', letterSpacing: 1, textAlign: 'center' }}>@联系人</Typography>
                        {Object.values(mentionCounts).length === 0 && <Typography color="text.secondary" fontSize={14} sx={{ textAlign: 'center', py: 2 }}>暂无</Typography>}
                        {Object.values(mentionCounts).map(({ data, count }) => (
                            <Box key={data.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, p: 1, borderRadius: 2, bgcolor: '#e0f7fa', boxShadow: '0 1px 4px #b2ebf233' }}>
                                <span style={{ background: '#e0f7fa', color: '#00796b', borderRadius: 4, padding: '0 6px', marginRight: 8, fontWeight: 600 }}>@{data.name}</span>
                                <Typography fontSize={14} color="text.secondary">x{count}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
                {formError && <Typography color="error" sx={{ mt: 2, fontWeight: 500 }}>{formError}</Typography>}
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 3, pt: 2, bgcolor: '#f8fafc', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                <Button onClick={handleDialogCancel} sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16 }}>{t('diary.cancel') || '取消'}</Button>
                <Button onClick={handleSave} disabled={creating} variant="contained" sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16, boxShadow: 2 }}>
                    {isEdit ? (t('diary.save') || '保存') : (t('diary.create') || '创建')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateDiaryDialog;