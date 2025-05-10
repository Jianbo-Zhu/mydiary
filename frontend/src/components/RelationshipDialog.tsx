import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { relationshipApi } from '../utils/api';
import { ContactResponse, RelationshipTypeResponse, Relationship } from 'types/entities';
import { useTranslations } from 'next-intl';

interface RelationshipDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (relationship: Relationship) => void;
  contact1: ContactResponse;
  contact2: ContactResponse;
  relationshipTypes: RelationshipTypeResponse[];
  initial?: Partial<Relationship>;
}

export default function RelationshipDialog({ open, onClose, onSuccess, contact1, contact2, relationshipTypes, initial }: RelationshipDialogProps) {
  const t = useTranslations();
  const [relationType, setRelationType] = useState(initial?.relation_type || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRelationType(initial?.relation_type || '');
    setNotes(initial?.notes || '');
    setError('');
  }, [open, initial]);

  const handleSave = async () => {
    if (!relationType) {
      setError(t('relationship.selectType', { defaultValue: '请选择关系类型' }));
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await relationshipApi.createRelationship({
        contact_id_1: contact1.id,
        contact_id_2: contact2.id,
        relation_type: relationType,
        notes,
        user_id: contact1.user_id,
      });
      onSuccess(res.data);
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.message || t('relationship.createFailed', { defaultValue: '创建关系失败' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
      sx: {
        borderRadius: 4,
        boxShadow: '0 4px 32px #1976d233',
        bgcolor: '#f8fafc',
        p: 0
      }
    }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, bgcolor: '#1976d2', color: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, py: 2, px: 3 }}>
        {initial ? t('relationship.editTitle', { defaultValue: '编辑关系' }) : t('relationship.newTitle', { defaultValue: '新建关系' })}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, p: { xs: 4, sm: 6 }, pt: { xs: 7, sm: 9 } }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', letterSpacing: 1 }}>{t('relationship.contact1', { defaultValue: '联系人1' })}</Typography>
          <Typography>{contact1.name}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', letterSpacing: 1 }}>{t('relationship.contact2', { defaultValue: '联系人2' })}</Typography>
          <Typography>{contact2.name}</Typography>
        </Box>
        <FormControl fullWidth size="small">
          <InputLabel>{t('relationship.type', { defaultValue: '关系类型' })}</InputLabel>
          <Select
            label={t('relationship.type', { defaultValue: '关系类型' })}
            value={relationType}
            onChange={e => setRelationType(e.target.value)}
          >
            {relationshipTypes.map(type => (
              <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label={t('relationship.notes', { defaultValue: '备注' })} value={notes} onChange={e => setNotes(e.target.value)} fullWidth size="small" multiline minRows={2} sx={{ bgcolor: '#fff', borderRadius: 2 }} />
        {error && <Typography color="error" sx={{ mt: 2, fontWeight: 500 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3, pt: 2, bgcolor: '#f8fafc', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <Button onClick={onClose} sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16 }}>{t('common.cancel', { defaultValue: '取消' })}</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16, boxShadow: 2 }}>{t('common.save', { defaultValue: '保存' })}</Button>
      </DialogActions>
    </Dialog>
  );
}
