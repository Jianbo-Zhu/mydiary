'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Tooltip, Divider } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { contactsApi } from '../../../utils/api';
import { ContactForm, ContactDetailDialog } from '../../../components/ContactDialog';
import { ContactResponse } from 'types/entities';

export default function ContactsPage() {
  const t = useTranslations();
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<ContactResponse | undefined>(undefined);
  const [detailContact, setDetailContact] = useState<ContactResponse | undefined>(undefined);

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
    if (!window.confirm(t('contact.confirmDelete', { defaultValue: '确定要删除该联系人吗？' }))) return;
    await contactsApi.deleteContact(id);
    fetchContacts();
  };

  const handleEdit = (contact: ContactResponse) => {
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
          <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, letterSpacing: 1 }} gutterBottom>{t('contact.title', { defaultValue: '联系人' })}</Typography>
          <Button variant="contained" color="primary" startIcon={<Edit />} sx={{ borderRadius: 3, fontWeight: 600 }} onClick={() => { setEditing(undefined); setOpenForm(true); }}>{t('contact.new', { defaultValue: '新建联系人' })}</Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ background: theme => theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.name', { defaultValue: '姓名' })}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.phone', { defaultValue: '电话' })}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.email', { defaultValue: '邮箱' })}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.company', { defaultValue: '单位' })}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.address', { defaultValue: '地址' })}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.birthday', { defaultValue: '生日' })}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.notes', { defaultValue: '备注' })}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.tags', { defaultValue: '标签' })}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('contact.actions', { defaultValue: '操作' })}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 && !loading && !error && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {t('contact.empty', { defaultValue: '暂无联系人' })}
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
                  <TableCell>{c.company}</TableCell>
                  <TableCell>{c.address}</TableCell>
                  <TableCell>{c.birthday}</TableCell>
                  <TableCell>{c.notes}</TableCell>
                  <TableCell>{c.tags?.join(', ')}</TableCell>
                  <TableCell>
                    <Tooltip title={t('contact.edit', { defaultValue: '编辑' })} arrow>
                      <IconButton onClick={() => handleEdit(c)} size="small" sx={{ mr: 1 }} color="primary"><Edit fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title={t('contact.delete', { defaultValue: '删除' })} arrow>
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
          labelRowsPerPage={t('contact.rowsPerPage', { defaultValue: '每页行数' })}
        />
        {loading && <Typography sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>{t('loading', { defaultValue: '加载中...' })}</Typography>}
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