import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { MentionNode } from './LexicalMentionNode';
import React from 'react';
import { LexicalEditor } from 'lexical';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';

interface LexicalReadOnlyViewerProps {
  content: string; // lexical JSON string
}

function Placeholder() {
  return <div style={{ opacity: 0.5, fontSize: 16, color: '#888', padding: '12px 0', textAlign: 'center' }}>无内容</div>;
}

export default function LexicalReadOnlyViewer({ content }: LexicalReadOnlyViewerProps) {

  const editorRef = React.useRef<LexicalEditor | null>(null);

  const initialConfig = {
    editable: false,
    theme: {},
    onError: (error: Error) => {
      console.error(error);
    },
    editorState: content,
    namespace: 'ReadOnlyViewer',
    nodes: [MentionNode], // 注册 MentionNode 以支持自定义 mention 类型
  };

  
  React.useEffect(() => {
    if (editorRef.current && content) {
      requestIdleCallback(() => {
        editorRef.current?.setEditorState(editorRef.current?.parseEditorState(content, () => {}));
      });
    }
  }, [content]);

  return (
    <div style={{
      background: '#f8fafc',
      borderRadius: 10,
      boxShadow: '0 2px 8px #e0e7ef33',
      padding: 20,
      minHeight: 48,
      border: '1px solid #e0e7ef',
      margin: '8px 0',
      fontSize: 16,
      color: '#222',
      wordBreak: 'break-word',
      overflowX: 'auto',
    }}>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable style={{ minHeight: 24, outline: 'none', background: 'transparent', fontSize: 16, color: '#222' }} />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <EditorRefPlugin editorRef={editorRef} />
      </LexicalComposer>
    </div>
  );
}