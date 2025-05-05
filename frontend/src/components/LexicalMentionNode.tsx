import { DecoratorNode, LexicalEditor, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import * as React from 'react';

export type MentionData = {
  id: number
  name: string;
};

export type SerializedMentionNode = Spread<
  {
    mention: MentionData;
    type: 'mention';
    version: 1;
  },
  SerializedLexicalNode
>;

export class MentionNode extends DecoratorNode<JSX.Element> {
  __mention: MentionData;

  static onMentionRemoved: ((mention: MentionData) => void) | null = null;

  static getType() {
    return 'mention';
  }

  static clone(node: MentionNode) {
    return new MentionNode(node.__mention, node.__key);
  }

  constructor(mention: MentionData, key?: NodeKey) {
    super(key);
    this.__mention = mention;
  }

  createDOM() {
    const dom = document.createElement('span');
    dom.className = 'mention-node';
    dom.style.background = '#e0f7fa';
    dom.style.color = '#00796b';
    dom.style.borderRadius = '4px';
    dom.style.padding = '0 4px';
    dom.textContent = `${this.__mention.name}`;
    return dom;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <>
        
      </>
    );
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mention: this.__mention,
      type: 'mention',
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedMentionNode) {
    return new MentionNode(serializedNode.mention);
  }

  onRemoved(): void {
    console.log('MentionNode removed:', this.__mention);
    if (MentionNode.onMentionRemoved) {
      MentionNode.onMentionRemoved(this.__mention);
    }
  }
}

export function $createMentionNode(mention: MentionData) {
  return new MentionNode(mention);
}

export function $isMentionNode(node: any): node is MentionNode {
  return node instanceof MentionNode;
}
