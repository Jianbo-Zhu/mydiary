import { Paper, Typography, Box, Chip, Avatar } from '@mui/material';
import { DiaryResponse } from 'types/entities';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import CreateDiaryDialog from './CreateDiaryDialog';
import LexicalReadOnlyViewer from './LexicalReadOnlyViewer';

dayjs.extend(utc);

const colorMap: Record<number, string> = {
  0: '#FFA726',
  1: '#FF7043',
  2: '#EC407A',
  3: '#AB47BC',
  4: '#42A5F5',
  5: '#26A69A',
  6: '#66BB6A',
  7: '#D4E157',
  8: '#FFEE58',
  9: '#8D6E63',
};

export default function DiaryTimeline({ diaries, setRefreshFlag }) {
  const t = useTranslations();
  const [editDiary, setEditDiary] = useState<DiaryResponse | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleEditClick = (diary: DiaryResponse) => {
    setEditDiary(diary);
  };
  const handleEditClose = () => {
    setEditDiary(null);
  };
  const handleEdited = () => {
    setEditDiary(null);
    setRefreshFlag(f => f + 1); // 通知父组件刷新
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', py: 4, bgcolor: '#f8fafc', borderRadius: 4, boxShadow: '0 2px 12px #e0e7ef22', px: { xs: 0, sm: 2 } }}>
      {/* 时间线主线 */}
      <Box sx={{
        position: 'absolute',
        left: 40,
        top: 0,
        bottom: 0,
        width: 4,
        bgcolor: '#1976d2',
        borderRadius: 2,
        zIndex: 0,
        opacity: 0.12,
        display: { xs: 'none', sm: 'block' },
      }} />
      {diaries.map((diary, idx) => (
        <Box
          key={diary.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 4,
            width: '100%',
            maxWidth: 700,
            position: 'relative',
            zIndex: 1,
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={() => setHoveredId(diary.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* 时间点 */}
          <Box sx={{
            width: 80,
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            pt: 2,
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: '#1976d2',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 25,
              boxShadow: '0 2px 8px #1976d244',
              mb: 1,
              border: '3px solid #fff',
              zIndex: 2,
            }}>
              {dayjs.utc(diary.happened_at).local().format('DD')}
            </Box>
            <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 500, fontSize: 22,letterSpacing: 1 }}>
              {dayjs.utc(diary.happened_at).local().format('YYYY/MM')}
            </Typography>
          </Box>
          <Paper elevation={3} sx={{ ml: { xs: 0, sm: 2 }, p: { xs: 2, sm: 3 }, flex: 1, position: 'relative', borderRadius: 4, boxShadow: hoveredId === diary.id ? '0 4px 24px #1976d233' : '0 2px 12px #e0e7ef22', transition: 'box-shadow 0.2s', minHeight: 120, bgcolor: '#fff' }}>
            {/* 编辑按钮，悬浮时显示 */}
            {hoveredId === diary.id && (
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, bgcolor: '#f8fafc', boxShadow: 1, ':hover': { bgcolor: '#e0f7fa' } }}
                onClick={() => handleEditClick(diary)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {diary.event_type && (
                <Chip label={diary.event_type} size="small" sx={{ ml: 1, bgcolor: '#e0f7fa', color: '#00796b', fontWeight: 600, fontSize: 14 }} />
              )}
              {diary.location && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  <span style={{fontSize:16,marginRight:2}}>📍</span>{diary.location}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                <span style={{fontSize:16,marginRight:2}}>🕒</span>{dayjs.utc(diary.happened_at).local().format('YYYY-MM-DD HH:mm')}
              </Typography>
            </Box>
            {diary.content && (
              <Box sx={{ mt: 1 }}>
                <LexicalReadOnlyViewer content={diary.content} />
              </Box>
            )}
          </Paper>
        </Box>
      ))}
      {/* 编辑对话框 */}
      {editDiary && (
        <CreateDiaryDialog
          open={!!editDiary}
          onClose={handleEditClose}
          onCreated={handleEdited}
          diary={editDiary}
          mode="edit"
        />
      )}
    </Box>
  );
}