'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Tooltip, Divider } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { contactsApi } from '../../../utils/api';
import { ContactForm, ContactDetailDialog } from '../../../components/ContactDialog';

interface Contact {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birthday?: string;
  notes?: string;
  tags?: string[];
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Contact | undefined>(undefined);
  const [detailContact, setDetailContact] = useState<Contact | undefined>(undefined);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await contactsApi.getContacts({ page, rowsPerPage });
      setContacts(res.data);
      setTotal(res.data.length < rowsPerPage && page === 0 ? res.data.length : (page + 1) * rowsPerPage + (res.data.length === rowsPerPage ? rowsPerPage : 0));
    } catch (e: any) {
      setError(e.response?.data?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, [page, rowsPerPage]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除该联系人吗？')) return;
    await contactsApi.deleteContact(id);
    fetchContacts();
  };

  const handleEdit = (contact: Contact) => {
    setEditing(contact);
    setOpenForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editing) {
      await contactsApi.updateContact(editing.id, data);
    } else {
      await contactsApi.createContact(data);
    }
    setOpenForm(false);
    setEditing(undefined);
    fetchContacts();
  };

  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', my: 6, px: 2 }}>
      <Paper elevation={3} sx={{ borderRadius: 4, p: { xs: 2, sm: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, letterSpacing: 1 }} gutterBottom>联系人</Typography>
          <Button variant="contained" color="primary" startIcon={<Edit />} sx={{ borderRadius: 3, fontWeight: 600 }} onClick={() => { setEditing(undefined); setOpenForm(true); }}>新建联系人</Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ background: theme => theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: 700 }}>姓名</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>电话</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>邮箱</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>生日</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>备注</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>标签</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 && !loading && !error && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    暂无联系人
                  </TableCell>
                </TableRow>
              )}
              {contacts.map((c) => (
                <TableRow key={c.id} hover sx={{ transition: 'background 0.2s', cursor: 'pointer' }}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('button')) return;
                    setDetailContact(c);
                  }}
                >
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.birthday}</TableCell>
                  <TableCell>{c.notes}</TableCell>
                  <TableCell>{c.tags?.join(', ')}</TableCell>
                  <TableCell>
                    <Tooltip title="编辑" arrow>
                      <IconButton onClick={() => handleEdit(c)} size="small" sx={{ mr: 1 }} color="primary"><Edit fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="删除" arrow>
                      <IconButton onClick={() => handleDelete(c.id)} size="small" color="error"><Delete fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          sx={{ mt: 1 }}
        />
        {loading && <Typography sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>加载中...</Typography>}
        {error && <Typography color="error" sx={{ mt: 3, textAlign: 'center' }}>{error}</Typography>}
      </Paper>
      <ContactForm open={openForm} onClose={() => { setOpenForm(false); setEditing(undefined); }} onSubmit={handleFormSubmit} initial={editing} />
      <ContactDetailDialog 
        open={!!detailContact} 
        onClose={() => setDetailContact(undefined)} 
        contact={detailContact} 
        onEdit={c => {
          setDetailContact(undefined);
          setEditing(c);
          setOpenForm(true);
        }}
      />
    </Box>
  );
}