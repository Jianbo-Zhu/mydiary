'use client';
import { Typography, Box, Paper, Button } from '@mui/material';
import { diaryApi } from '../../utils/api';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CreateDiaryDialog from '../../components/CreateDiaryDialog';
import DiaryTimeline from '../../components/DiaryTimeline';
import { DiaryResponse } from 'types/entities';
import RecentContacts from '../../components/RecentContacts';

export default function Home() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contactId = searchParams.get('contactId');
  const [diaries, setDiaries] = useState<DiaryResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [contactName, setContactName] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [showContactFilter, setShowContactFilter] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCreated = async () => {
    setLoading(true);
    try {
      const res = await diaryApi.getDiaries();
      const sorted = [...res.data].sort((a, b) => new Date(b.happened_at || b.created_at).getTime() - new Date(a.happened_at || a.created_at).getTime());
      setDiaries(sorted);
    } catch (e: any) {
      setError(e.response?.data?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowContactFilter(true);
    setLoading(true);
    diaryApi.getDiaries()
      .then(res => {
        let sorted = [...res.data].sort((a, b) => new Date(b.happened_at || b.created_at).getTime() - new Date(a.happened_at || a.created_at).getTime());
        if (contactId) {
          sorted = sorted.filter(diary => diary.contacts && diary.contacts.some(c => String(c.id) === String(contactId)));
        }
        if(sorted.length > 0){
          setContactName(sorted[0].contacts?.find(c => String(c.id) === String(contactId))?.name || null);
        }
        setDiaries(sorted);
      })
      .catch(e => setError(e.response?.data?.message || '加载失败'));
    setLoading(false);
  }, [router, refreshFlag, contactId]);

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');

  return (
    <Box sx={{ my: 4, px: { xs: 1, sm: 4 } }}>
      <Paper elevation={2} sx={{ borderRadius: 4, p: { xs: 2, sm: 4 }, mb: 4, bgcolor: '#f8fafc' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>{t('home.welcome')}</Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>{t('home.description')}</Typography>
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', width: '100%', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Paper elevation={3} sx={{ flex: 3, borderRadius: 4, p: { xs: 1, sm: 3 }, minHeight: 400, bgcolor: '#fff', boxShadow: '0 2px 12px #e0e7ef55' }}>
            {loading && <Typography sx={{ color: 'primary.main', fontWeight: 500 }}>{t('loading') || '加载中...'}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            {diaries?.length === 0 && <Typography>{t('noDiaries')}</Typography>}
            {contactId && showContactFilter && (
              <Typography sx={{ color: 'text.secondary', fontSize: 14, mb: 2, display: 'flex', alignItems: 'center' }}>
                {t('diary.interactWith') || '最近互动'} :
                <span
                  className="mention-node"
                  style={{
                    background: '#e0f7fa',
                    color: '#00796b',
                    borderRadius: '4px',
                    padding: '0 4px',
                    fontWeight: 500,
                    fontSize: 15,
                    marginLeft: 4,
                    marginRight: 4,
                    display: 'inline-block',
                    verticalAlign: 'middle',
                  }}
                >
                  {contactName}
                  <span
                    style={{
                      marginLeft: 6,
                      cursor: 'pointer',
                      color: '#888',
                      fontSize: 13,
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                    title={t('common.clearFilter', { defaultValue: '清除过滤' })}
                    onClick={e => {
                      e.stopPropagation();
                      setShowContactFilter(false);
                      // router.replace(`/${router.locale || ''}`);
                      handleCreated();
                    }}
                  >
                    ×
                  </span>
                </span>
              </Typography>
            )}
            {diaries && <DiaryTimeline diaries={diaries} setRefreshFlag={setRefreshFlag} />}
          </Paper>
          <Paper elevation={3} sx={{ flex: 1, borderRadius: 4, p: { xs: 1, sm: 3 }, minHeight: 400, bgcolor: '#f6f8fa', boxShadow: '0 2px 12px #e0e7ef33', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, letterSpacing: 1, color: 'primary.main', textAlign: 'center' }}>
              <span style={{fontSize:20,marginRight:6}}>👥</span> {t('contacts') || '联系人'}
            </Typography>
            <RecentContacts />
          </Paper>
        </Box>
      </Box>
      <Box sx={{ position: 'fixed', top: 100, right: 40, zIndex: 1200 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ borderRadius: 3, boxShadow: 2, fontWeight: 600, px: 3, py: 1.2, fontSize: 16, transition: 'all 0.2s', ':hover': { boxShadow: 4, transform: 'translateY(-2px)' } }}
          startIcon={<span style={{fontWeight:900,fontSize:22}}>＋</span>}
        >
          {t('diary.newEntry') || '新建日志'}
        </Button>
      </Box>
      <CreateDiaryDialog open={open} onClose={handleClose} onCreated={handleCreated} />
    </Box>
  );
}
