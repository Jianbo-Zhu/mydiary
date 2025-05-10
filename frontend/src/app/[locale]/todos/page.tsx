'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { todoApi, contactsApi } from '../../../utils/api';
import { TodoResponse, ContactResponse } from 'types/entities';
import { Box, Button, Paper, Typography } from '@mui/material';
import TodoDialog from '../../../components/TodoDialog';
import TodoList from '../../../components/TodoList';

export default function TodosPage() {
  const t = useTranslations('todo');
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<TodoResponse | undefined>(undefined);

  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await todoApi.getTodos();
      setTodos(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || t('loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await contactsApi.getContacts();
      setContacts(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchTodos();
    fetchContacts();
  }, []);

  const handleCreate = async (data: any) => {
    await todoApi.createTodo(data);
    setOpenDialog(false);
    fetchTodos();
  };

  const handleEdit = async (data: any) => {
    if (!editing) return;
    await todoApi.updateTodo(editing.id, data);
    setEditing(undefined);
    setOpenDialog(false);
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('confirmDelete'))) return;
    await todoApi.deleteTodo(id);
    fetchTodos();
  };

  const handleToggleComplete = async (todo: TodoResponse) => {
    await todoApi.updateTodo(todo.id, { is_completed: !todo.is_completed });
    fetchTodos();
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', my: 6, px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>{t('title')}</Typography>
        <Button variant="contained" onClick={() => { setEditing(undefined); setOpenDialog(true); }} sx={{ borderRadius: 3, fontWeight: 600 }}>{t('create')}</Button>
      </Box>
      <Paper elevation={3} sx={{ borderRadius: 4, p: { xs: 2, sm: 4 }, mb: 4 }}>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <TodoList
          todos={todos}
          onEdit={todo => { setEditing(todo); setOpenDialog(true); }}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
          contacts={contacts}
        />
        {loading && <Typography sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>{t('loading')}</Typography>}
      </Paper>
      <TodoDialog
        open={openDialog}
        onClose={() => { setOpenDialog(false); setEditing(undefined); }}
        onSubmit={editing ? handleEdit : handleCreate}
        initial={editing}
        contacts={contacts}
        mode={editing ? 'edit' : 'create'}
      />
    </Box>
  );
}
