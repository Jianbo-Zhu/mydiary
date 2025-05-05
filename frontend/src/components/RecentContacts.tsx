// frontend/src/components/RecentContacts.tsx
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { contactsApi } from '../utils/api';
import { ContactResponse } from 'types/entities';
import { ContactDetailDialog } from './ContactDialog';

export default function RecentContacts() {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailContact, setDetailContact] = useState<ContactResponse | undefined>(undefined);

  useEffect(() => {
    const fetchRecentContacts = async () => {
      setLoading(true);
      try {
        const res = await contactsApi.getRecentContacts();
        setContacts(res.data);
      } catch (e: any) {
        setError(e.response?.data?.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentContacts();
  }, []);

  return (
    <>
      <Box sx={{
        background: '#fff',
        borderRadius: 4,
        boxShadow: '0 2px 12px #e0e7ef33',
        p: { xs: 2, sm: 3 },
        mb: 2,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        border: '1px solid #e0e7ef',
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, letterSpacing: 1 }}>
          <span style={{fontSize:18,marginRight:6}}>🕒</span> 最近联系人
        </Typography>
        {loading ? (
          <Typography>{'加载中...'}</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : contacts.length === 0 ? (
          <Typography color="text.secondary" fontSize={15} sx={{ textAlign: 'center', py: 2 }}>
            暂无联系人
          </Typography>
        ) : (
          contacts.map((c) => (
            <Box key={c.id} sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.2,
              borderRadius: 2,
              bgcolor: '#f8fafc',
              boxShadow: '0 1px 4px #e0e7ef22',
              mb: 1,
              transition: 'all 0.15s',
              ':hover': { bgcolor: '#e0f7fa', boxShadow: '0 2px 8px #b2ebf233' },
              cursor: 'pointer',
            }} onClick={() => setDetailContact(c)}>
              <span style={{fontSize:20,background:'#e0f7fa',borderRadius: '50%',padding:'2px 8px',color:'#00796b',fontWeight:700}}>{c.name[0]}</span>
              <Typography fontWeight={500} fontSize={16}>{c.name}</Typography>
            </Box>
          ))
        )}
      </Box>
      <ContactDetailDialog open={!!detailContact} onClose={() => setDetailContact(undefined)} contact={detailContact} />
    </>
  );
}