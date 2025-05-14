import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { ContactResponse, RelationshipTypeResponse } from 'types/entities';
import { relationshipTypeApi } from 'utils/api';

export function ContactForm({ open, onClose, onSubmit, initial }: { open: boolean; onClose: () => void; onSubmit: (data: any) => void; initial?: Partial<ContactResponse> }) {
  const t = useTranslations();
  const [form, setForm] = useState<Partial<ContactResponse>>(initial || {});
  const fetchedRef = useRef(false);
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipTypeResponse[]>([]);
  useEffect(() => { setForm(initial || {}); }, [initial, open]);
  useEffect(() => {
    // 获取关系类型  
    if (fetchedRef.current) return;
    relationshipTypeApi.getRelationshipTypes()
      .then(types => setRelationshipTypes(types.data))
      .catch(e => console.error(e));
    fetchedRef.current = true;
  }, [open, initial?.user_id]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, boxShadow: '0 4px 32px #1976d233', bgcolor: '#f8fafc', p: 0 } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, bgcolor: '#1976d2', color: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, py: 2, px: 3 }}>
        {initial?.id ? t('contact.edit', { defaultValue: '编辑联系人' }) : t('contact.new', { defaultValue: '新建联系人' })}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, p: { xs: 4, sm: 6 }, pt: { xs: 7, sm: 9 } }}>
        <TextField label={t('contact.name', { defaultValue: '姓名' })} value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required fullWidth size="small" autoFocus sx={{ bgcolor: '#fff', borderRadius: 2, mt: 1 }} />
        <FormControl fullWidth size="small">
          <InputLabel>{t('contact.relationToMe', { defaultValue: '跟我关系' })}</InputLabel>
          <Select
            label={t('contact.relationToMe', { defaultValue: '跟我关系' })}
            value={form.relation_to_me || ''}
            onChange={e => setForm(f => ({ ...f, relation_to_me: e.target.value }))}
          >
            {relationshipTypes.map(type => (
              <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label={t('contact.phone', { defaultValue: '电话' })} value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} fullWidth size="small" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
        <TextField label={t('contact.email', { defaultValue: '邮箱' })} value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} fullWidth size="small" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
        <TextField label={t('contact.company', { defaultValue: '单位' })} value={form.company || ''} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} fullWidth size="small" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
        <TextField label={t('contact.address', { defaultValue: '地址' })} value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} fullWidth size="small" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
        <TextField label={t('contact.birthday', { defaultValue: '生日' })} type="date" InputLabelProps={{ shrink: true }} value={form.birthday || ''} onChange={e => setForm(f => ({ ...f, birthday: e.target.value }))} fullWidth size="small" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
        <TextField label={t('contact.notes', { defaultValue: '备注' })} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} fullWidth size="small" multiline minRows={2} sx={{ bgcolor: '#fff', borderRadius: 2 }} />
        <TextField label={t('contact.tagsInput', { defaultValue: '标签(逗号分隔)' })} value={form.tags?.join(',') || ''} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} fullWidth size="small" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3, pt: 2, bgcolor: '#f8fafc', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <Button onClick={onClose} sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16 }}>{t('common.cancel', { defaultValue: '取消' })}</Button>
        <Button onClick={() => onSubmit(form)} variant="contained" disableElevation sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16, boxShadow: 2 }}>{t('common.save', { defaultValue: '保存' })}</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ContactDetailDialog({ open, onClose, contact, onEdit }: { open: boolean; onClose: () => void; contact?: ContactResponse; onEdit?: (contact: ContactResponse) => void }) {
  const t = useTranslations();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, boxShadow: '0 4px 32px #1976d233', bgcolor: '#f8fafc', p: 0 } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, bgcolor: '#1976d2', color: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, py: 2, px: 3, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>{contact?.name || t('contact.detailTitle', { defaultValue: '联系人详情' })}</Box>
        {contact && onEdit && (
          <IconButton aria-label={t('contact.edit', { defaultValue: '编辑' })} size="small" onClick={() => onEdit(contact)} sx={{ color: '#fff' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 1, minWidth: 340, p: { xs: 4, sm: 6 }, bgcolor: '#f8fafc' }}>
        {contact ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>{t('contact.relationToMe', { defaultValue: '跟我关系' })}</Typography>
              <Typography variant="body1">{contact.relation_to_me || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>{t('contact.phone', { defaultValue: '电话' })}</Typography>
              <Typography variant="body1">{contact.phone || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>{t('contact.email', { defaultValue: '邮箱' })}</Typography>
              <Typography variant="body1">{contact.email || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>{t('contact.company', { defaultValue: '单位' })}</Typography>
              <Typography variant="body1">{contact.company || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>{t('contact.address', { defaultValue: '地址' })}</Typography>
              <Typography variant="body1">{contact.address || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>{t('contact.birthday', { defaultValue: '生日' })}</Typography>
              <Typography variant="body1">{contact.birthday || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>{t('contact.notes', { defaultValue: '备注' })}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{contact.notes || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>{t('contact.tags', { defaultValue: '标签' })}</Typography>
              <Typography variant="body1">{contact.tags?.length ? contact.tags.join(', ') : '-'}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary">{t('contact.notFound', { defaultValue: '未找到联系人信息' })}</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3, pt: 2, bgcolor: '#f8fafc', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <Button onClick={onClose} variant="contained" disableElevation sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16 }}>{t('common.close', { defaultValue: '关闭' })}</Button>
        {contact && (
          <Button
            variant="outlined"
            onClick={() => {
              window.location.href = `/?contactId=${contact.id}`;
            }}
            sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16 }}
          >
            {t('contact.viewRelatedDiaries', { defaultValue: '查看相关日志' })}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
