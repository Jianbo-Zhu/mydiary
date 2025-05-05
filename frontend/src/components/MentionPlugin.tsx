import { useEffect, useState, useRef } from 'react';
import { $createMentionNode, MentionData } from './LexicalMentionNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, KEY_DOWN_COMMAND } from 'lexical';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { contactsApi } from '../utils/api';
import { isElement } from 'react-dom/test-utils';

// 监听 @ 输入，弹出联系人建议，选择后插入 MentionNode
export default function MentionPlugin({ onMentionAdd }: { onMentionAdd?: (mention: MentionData) => void }) {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [query, setQuery] = useState('');
  const [contacts, setContacts] = useState<MentionData[]>([]);
  const [filtered, setFiltered] = useState<MentionData[]>([]);
  const [selected, setSelected] = useState(0);
  const [newContactName, setNewContactName] = useState('');
  const inputRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    contactsApi.getContacts().then(res => {
      setContacts(res.data.map((c: any) => ({ id: c.id, name: c.name })));
    });
  }, []);

  useEffect(() => {
    if (open) {
      if (query) {
        const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
        setFiltered(filteredContacts);
        // If no existing contact matches and query is not empty, enable new contact creation
        if (filteredContacts.length === 0 && query.trim() !== '') {
          setNewContactName(query);
        } else {
          setNewContactName('');
        }
      } else {
        setFiltered(contacts); // 输入@时显示全部联系人
        setNewContactName('');
      }
    } else {
      setFiltered([]);
      setNewContactName('');
    }
    setSelected(0);
  }, [query, contacts, open]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        if (open) {
          if (event.key === 'ArrowDown') {
            setSelected(s => Math.min(s + 1, filtered.length - 1));
            event.preventDefault();
            return true;
          }
          if (event.key === 'ArrowUp') {
            setSelected(s => Math.max(s - 1, 0));
            event.preventDefault();
            return true;
          }
          if (event.key === 'Enter') {
            if (filtered[selected]) {
              insertMention(filtered[selected]);
              event.preventDefault();
              return true;
            }
          }
          if (event.key === 'Escape') {
            setOpen(false);
            setQuery('');
            event.preventDefault();
            return true;
          }
        } else if (event.key === '@') {
          const sel = window.getSelection();
          setTimeout(() => {
            let anchor: HTMLElement | null = null;
            if (sel && sel.anchorNode) {
              anchor = ((sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement) as HTMLElement) || editor.getRootElement();
            }
            setAnchorEl(anchor);
            setOpen(true);
            setQuery('');
          }, 0);
          event.preventDefault();
          return false;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
    // eslint-disable-next-line
  }, [open, filtered, selected]);

  function insertMention(mention: MentionData) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([$createMentionNode(mention)]);
      }
    });
    if (onMentionAdd) onMentionAdd(mention);
    setOpen(false);
    setQuery('');
  }

  async function handleCreateNewContact() {
    if (newContactName.trim() === '') return;

    try {
      // 创建新联系人
      const response = await contactsApi.createContact({ name: newContactName });

      // 将新联系人添加到列表并选择它
      const newContact = response.data;
      setContacts([...contacts, newContact]);

      // 插入提及
      insertMention(newContact);

      // 清空新联系人输入框
      setNewContactName('');
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  }

  return (
    <Popper sx={{ zIndex: 2000 }} open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper sx={{ minWidth: 180, maxHeight: 240, overflow: 'auto', zIndex: 20000 }}>
        <List>
          <ListItem key={'search'} disablePadding>
            <TextField
              // autoFocus
              fullWidth
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ m: 1 }}
              placeholder="Search or create contact"
            />
          </ListItem>
          {newContactName && (
            <ListItem key={'addButton'} disablePadding>
              <Button
                size="small"
                variant="contained"
                onClick={handleCreateNewContact}
                sx={{ mx: 1, mb: 1 }}
              >
                Add New Contact: {newContactName}
              </Button>
            </ListItem>
          )}
          {filtered.map((c, idx) => (
            <ListItem key={c.id} disablePadding>
              <ListItemButton selected={idx === selected} onClick={() => insertMention(c)}>
                <ListItemText primary={`${c.name}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Popper>
  );
}
