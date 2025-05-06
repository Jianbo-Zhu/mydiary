import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export interface Contact {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birthday?: string;
  notes?: string;
  tags?: string[];
}

export function ContactForm({ open, onClose, onSubmit, initial }: { open: boolean; onClose: () => void; onSubmit: (data: any) => void; initial?: Partial<Contact> }) {
  const t = useTranslations();
  const [form, setForm] = useState<Partial<Contact>>(initial || {});
  useEffect(() => { setForm(initial || {}); }, [initial, open]);
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 360 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>{initial?.id ? t('contact.edit', { defaultValue: '编辑联系人' }) : t('contact.new', { defaultValue: '新建联系人' })}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label={t('contact.name', { defaultValue: '姓名' })} value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required fullWidth size="small" autoFocus />
        <TextField label={t('contact.phone', { defaultValue: '电话' })} value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} fullWidth size="small" />
        <TextField label={t('contact.email', { defaultValue: '邮箱' })} value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} fullWidth size="small" />
        <TextField label={t('contact.birthday', { defaultValue: '生日' })} type="date" InputLabelProps={{ shrink: true }} value={form.birthday || ''} onChange={e => setForm(f => ({ ...f, birthday: e.target.value }))} fullWidth size="small" />
        <TextField label={t('contact.notes', { defaultValue: '备注' })} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} fullWidth size="small" multiline minRows={2} />
        <TextField label={t('contact.tagsInput', { defaultValue: '标签(逗号分隔)' })} value={form.tags?.join(',') || ''} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} fullWidth size="small" />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} variant="text">{t('common.cancel', { defaultValue: '取消' })}</Button>
        <Button onClick={() => onSubmit(form)} variant="contained" disableElevation>{t('common.save', { defaultValue: '保存' })}</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ContactDetailDialog({ open, onClose, contact, onEdit }: { open: boolean; onClose: () => void; contact?: Contact; onEdit?: (contact: Contact) => void }) {
  const t = useTranslations();
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, minWidth: 360, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 0, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>{contact?.name || t('contact.detailTitle', { defaultValue: '联系人详情' })}</Box>
        {contact && onEdit && (
          <IconButton aria-label={t('contact.edit', { defaultValue: '编辑' })} size="small" onClick={() => onEdit(contact)}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 1, minWidth: 340 }}>
        {contact ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('contact.phone', { defaultValue: '电话' })}</Typography>
              <Typography variant="body1">{contact.phone || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('contact.email', { defaultValue: '邮箱' })}</Typography>
              <Typography variant="body1">{contact.email || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('contact.birthday', { defaultValue: '生日' })}</Typography>
              <Typography variant="body1">{contact.birthday || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('contact.notes', { defaultValue: '备注' })}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{contact.notes || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('contact.tags', { defaultValue: '标签' })}</Typography>
              <Typography variant="body1">{contact.tags?.length ? contact.tags.join(', ') : '-'}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary">{t('contact.notFound', { defaultValue: '未找到联系人信息' })}</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} variant="contained" disableElevation>{t('common.close', { defaultValue: '关闭' })}</Button>
        {contact && (
          <Button
            variant="outlined"
            onClick={() => {
              window.location.href = `/?contactId=${contact.id}`;
            }}
          >
            {t('contact.viewRelatedDiaries', { defaultValue: '查看相关日志' })}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
