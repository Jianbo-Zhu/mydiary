import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import React from 'react';

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();

  const format = (type: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
  };

  const insertList = (type: 'bullet' | 'number') => {
    if (type === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const clearList = () => {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  };

  return (
    <ButtonGroup size="small" sx={{ mb: 1 }}>
      <Tooltip title="Bold"><Button onClick={() => format('bold')}><FormatBoldIcon /></Button></Tooltip>
      <Tooltip title="Italic"><Button onClick={() => format('italic')}><FormatItalicIcon /></Button></Tooltip>
      <Tooltip title="Underline"><Button onClick={() => format('underline')}><FormatUnderlinedIcon /></Button></Tooltip>
      <Tooltip title="Bulleted List"><Button onClick={() => insertList('bullet')}><FormatListBulletedIcon /></Button></Tooltip>
      <Tooltip title="Numbered List"><Button onClick={() => insertList('number')}><FormatListNumberedIcon /></Button></Tooltip>
      <Tooltip title="Clear List"><Button onClick={clearList}><FormatClearIcon /></Button></Tooltip>
    </ButtonGroup>
  );
}
