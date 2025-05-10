import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useEffect } from 'react';
import { TodoCreate, TodoUpdate, TodoResponse, ContactResponse } from 'types/entities';
import { useTranslations } from 'next-intl';
import dayjs, { Dayjs } from 'dayjs';

interface TodoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TodoCreate | TodoUpdate) => void;
  initial?: Partial<TodoResponse>;
  contacts?: ContactResponse[];
  mode?: 'create' | 'edit';
}

const repeatOptions = [
  { value: 'none', label: 'repeatNone' },
  { value: 'daily', label: 'repeatDaily' },
  { value: 'weekly', label: 'repeatWeekly' },
  { value: 'monthly', label: 'repeatMonthly' },
  { value: 'yearly', label: 'repeatYearly' },
];

const priorityOptions = [1, 2, 3, 4, 5];

export default function TodoDialog({ open, onClose, onSubmit, initial, contacts, mode = 'create' }: TodoDialogProps) {
  const t = useTranslations('todo');
  const [form, setForm] = useState<Partial<TodoResponse>>(initial || {});
  const [dueTime, setDueTime] = useState<Dayjs | null>(initial?.due_time ? dayjs(initial.due_time) : null);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initial || {});
    setDueTime(initial?.due_time ? dayjs(initial.due_time) : null);
    setError('');
  }, [initial, open]);

  const handleChange = (key: keyof TodoCreate | keyof TodoUpdate, value: any) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.content || !form.content.trim()) {
      setError(t('contentRequired'));
      return;
    }
    onSubmit({
      ...form,
      due_time: dueTime ? dueTime.toISOString() : undefined,
    });
  };

  const isEdit = mode === 'edit';

  return (
    <Dialog open={open} onClose={(_, reason) => {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
      setError('');
      onClose();
    }} maxWidth="sm" fullWidth PaperProps={{
      sx: {
        borderRadius: 4,
        boxShadow: '0 4px 32px #1976d233',
        bgcolor: '#f8fafc',
        p: 0
      }
    }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, bgcolor: '#1976d2', color: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, py: 2, px: 3 }}>
        {isEdit ? t('editTitle') : t('createTitle')}
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 4, sm: 6 }, pt: { xs: 7, sm: 9 } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label={t('dueTime')}
            value={dueTime}
            onChange={setDueTime}
            slotProps={{ textField: { fullWidth: true, size: 'small', sx: { bgcolor: '#fff', borderRadius: 2, mt: 2 } } }}
          />
        </LocalizationProvider>
        <TextField
          label={t('content')}
          value={form.content || ''}
          onChange={e => handleChange('content', e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 3, mb: 2, bgcolor: '#fff', borderRadius: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
          <TextField
            select
            label={t('priority')}
            value={form.priority ?? 3}
            onChange={e => handleChange('priority', Number(e.target.value))}
            fullWidth
            sx={{ flex: 1, bgcolor: '#fff', borderRadius: 2 }}
          >
            {priorityOptions.map(opt => (
              <MenuItem key={opt} value={opt}>{t('priorityLevel', { level: opt })}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('repeatRule')}
            value={form.repeat_rule || 'none'}
            onChange={e => handleChange('repeat_rule', e.target.value)}
            fullWidth
            sx={{ flex: 1, bgcolor: '#fff', borderRadius: 2 }}
          >
            {repeatOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{t(opt.label)}</MenuItem>
            ))}
          </TextField>
        </Box>
        {contacts && (
          <TextField
            select
            label={t('contact')}
            value={form.contact_id || ''}
            onChange={e => handleChange('contact_id', e.target.value ? Number(e.target.value) : undefined)}
            fullWidth
            sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
          >
            <MenuItem value="">{t('noContact')}</MenuItem>
            {contacts.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
        )}
        {isEdit && (
          <FormControlLabel
            control={<Checkbox checked={!!form.is_completed} onChange={e => handleChange('is_completed', e.target.checked)} />}
            label={t('completed')}
            sx={{ mt: 1 }}
          />
        )}
        {error && <Typography color="error" sx={{ mt: 2, fontWeight: 500 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3, pt: 2, bgcolor: '#f8fafc', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <Button onClick={() => { setError(''); onClose(); }} sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16 }}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1, fontSize: 16, boxShadow: 2 }}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
}
