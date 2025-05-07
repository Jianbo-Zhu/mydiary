import React from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { ContactResponse } from '../types/entities';

interface ContactNetworkGraphProps {
  contacts: ContactResponse[];
}

// 简单示例：你为中心节点，联系人为子节点，联系人之间无连线（可扩展）
const getGraphData = (contacts: ContactResponse[]) => {
  const nodes: Node[] = [
    {
      id: 'me',
      data: { label: '我' },
      position: { x: 250, y: 50 },
      style: { background: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 8, padding: 8 },
      draggable: true,
    },
    ...contacts.map((c, i) => ({
      id: String(c.id),
      data: { label: c.name },
      position: { x: 100 + 300 * Math.cos((2 * Math.PI * i) / contacts.length), y: 200 + 120 * Math.sin((2 * Math.PI * i) / contacts.length) },
      style: { background: '#fff', color: '#1976d2', border: '2px solid #1976d2', borderRadius: 8, padding: 8 },
      draggable: true,
    })),
  ];
  const edges: Edge[] = contacts.map((c) => ({
    id: `me-${c.id}`,
    source: 'me',
    target: String(c.id),
    animated: true,
    style: { stroke: '#1976d2' },
  }));
  // 可扩展联系人之间的关系边
  return { nodes, edges };
};

const ContactNetworkGraph: React.FC<ContactNetworkGraphProps> = ({ contacts }) => {
  const { nodes, edges } = getGraphData(contacts);
  return (
    <div style={{ width: '100%', height: 500, background: '#f5f7fa', borderRadius: 12 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
};

export default ContactNetworkGraph;
