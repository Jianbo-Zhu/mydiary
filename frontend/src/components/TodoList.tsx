import { useState } from 'react';
import { TodoResponse, ContactResponse } from 'types/entities';
import { useTranslations } from 'next-intl';
import { Box, Typography, IconButton, Chip, Tooltip, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

interface TodoListProps {
  todos: TodoResponse[];
  onEdit: (todo: TodoResponse) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (todo: TodoResponse) => void;
  contacts?: ContactResponse[];
}

const priorityColors = ['#bbb', '#90caf9', '#64b5f6', '#1976d2', '#d32f2f', '#388e3c'];

export default function TodoList({ todos, onEdit, onDelete, onToggleComplete, contacts }: TodoListProps) {
  const t = useTranslations('todo');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {todos.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>{t('empty')}</Typography>
      )}
      {todos.map(todo => (
        <Box
          key={todo.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: todo.is_completed ? '#e0e7ef' : '#fff',
            borderRadius: 3,
            boxShadow: hoveredId === todo.id ? '0 2px 12px #1976d233' : '0 1px 4px #e0e7ef22',
            p: 2,
            border: '1px solid #e0e7ef',
            transition: 'box-shadow 0.2s',
            opacity: todo.is_completed ? 0.6 : 1,
            position: 'relative',
          }}
          onMouseEnter={() => setHoveredId(todo.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Checkbox
            checked={todo.is_completed}
            onChange={() => onToggleComplete(todo)}
            sx={{ mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, textDecoration: todo.is_completed ? 'line-through' : undefined }}>
              {todo.content}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              {todo.due_time && (
                <Chip size="small" label={dayjs(todo.due_time).format('YYYY-MM-DD HH:mm')} color="primary" />
              )}
              <Chip size="small" label={t('priorityLevel', { level: todo.priority ?? 3 })} sx={{ bgcolor: priorityColors[todo.priority ?? 3], color: '#fff' }} />
              {todo.repeat_rule && todo.repeat_rule !== 'none' && (
                <Chip size="small" label={t(`repeat${todo.repeat_rule.charAt(0).toUpperCase() + todo.repeat_rule.slice(1)}`)} />
              )}
              {todo.contact_id && contacts && contacts.length > 0 && (
                <Chip size="small" label={contacts.find(c => c.id === todo.contact_id)?.name || t('contact')} />
              )}
            </Box>
          </Box>
          <Box>
            <Tooltip title={t('edit')} arrow>
              <IconButton onClick={() => onEdit(todo)} color="primary"><EditIcon /></IconButton>
            </Tooltip>
            <Tooltip title={t('delete')} arrow>
              <IconButton onClick={() => onDelete(todo.id)} color="error"><DeleteIcon /></IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
