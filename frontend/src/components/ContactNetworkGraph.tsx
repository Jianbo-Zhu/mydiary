import React from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { ContactResponse, Relationship, RelationshipTypeResponse } from '../types/entities';
import RelationshipDialog from './RelationshipDialog';
import { relationshipTypeApi } from '../utils/api';

interface ContactNetworkGraphProps {
  contacts: ContactResponse[];
  relationships: any[];
}

const getGraphData = (contacts: ContactResponse[], relationships: Relationship[]) => {
  const contactNodes: Node[] = [
    {
      id: 'me',
      data: { label: '我' },
      position: { x: 250, y: 50 },
      style: { background: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 8, padding: 8 },
      // draggable: true,
    },
    ...contacts.map((c, i) => {
      let nodeStyle = { background: '#fff', color: '#1976d2', border: '2px solid #1976d2', borderRadius: 8, padding: 8 };
      // 根据关系类型设置不同颜色
      if (c.relation_to_me === '家人') {
        nodeStyle = { ...nodeStyle, background: '#ffe0e0', border: '2px solid #e57373', color: '#b71c1c' };
      } else if (c.relation_to_me === '朋友') {
        nodeStyle = { ...nodeStyle, background: '#e8f7fa', border: '2px solid #4dd0e1', color: '#006064' };
      } else if (c.relation_to_me === '同事') {
        nodeStyle = { ...nodeStyle, background: '#e8f5e9', border: '2px solid #81c784', color: '#1b5e20' };
      } else if (c.relation_to_me === '亲戚') {
        nodeStyle = { ...nodeStyle, background: '#fffde7', border: '2px solid #ffd54f', color: '#ff6f00' };
      }
      return {
        id: String(c.id),
        data: { label: c.name },
        position: { x: 100 + 300 * Math.cos((2 * Math.PI * i) / contacts.length), y: 200 + 120 * Math.sin((2 * Math.PI * i) / contacts.length) },
        style: nodeStyle,
        // draggable: true,
      };
    }),
  ];
  const relationEdges: Edge[] = contacts.filter((c) => c.relation_to_me).map((c) => ({
    id: `me-${c.id}`,
    source: 'me',
    target: String(c.id),
    // ariaLabel:'我与联系人的关系',
    label: c.relation_to_me,
    // animated: true,
    style: { stroke: '#1976d2' },
  })).concat(
    relationships.map((r) => ({
      id: `${r.contact_id_1}-${r.contact_id_2}`,
      source: String(r.contact_id_1),
      target: String(r.contact_id_2),
      label: r.relation_type,
      // animated: true,
      style: { stroke: '#1976d2' },
    })));
  return { contactNodes, relationEdges };
};

const ContactNetworkGraph: React.FC<ContactNetworkGraphProps> = ({ contacts, relationships }) => {
  const { contactNodes, relationEdges } = getGraphData(contacts, relationships);
  const [nodes, setNodes, onNodesChange] = useNodesState(contactNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(relationEdges);
  const [relationshipDialogOpen, setRelationshipDialogOpen] = React.useState(false);
  const [relationshipTypes, setRelationshipTypes] = React.useState<RelationshipTypeResponse[]>([]);
  const [pendingEdge, setPendingEdge] = React.useState<Connection | null>(null);
  const [contactsMap] = React.useState(() => Object.fromEntries(contacts.map(c => [String(c.id), c])));

  React.useEffect(() => {
    relationshipTypeApi.getRelationshipTypes().then(res => setRelationshipTypes(res.data));
  }, []);

  const handleConnect = (connection: Connection) => {
    // 只允许联系人之间建立关系
    if (connection.source !== 'me' && connection.target !== 'me') {
      setPendingEdge(connection);
      setRelationshipDialogOpen(true);
    }
  };

  const handleRelationshipCreated = (relationship: Relationship) => {
    // 新增edge
    setEdges(edges => ([...edges, {
      id: `${relationship.contact_id_1}-${relationship.contact_id_2}`,
      source: String(relationship.contact_id_1),
      target: String(relationship.contact_id_2),
      label: relationship.relation_type,
      style: { stroke: '#1976d2' },
    }]));
  };

  return (
    <div style={{ width: '100%', height: 500, background: '#f5f7fa', borderRadius: 12 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        style={{ background: '#f5f7fa' }}
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
      {pendingEdge && relationshipDialogOpen && pendingEdge.source && pendingEdge.target && contactsMap[pendingEdge.source] && contactsMap[pendingEdge.target] && (
        <RelationshipDialog
          open={relationshipDialogOpen}
          onClose={() => { setRelationshipDialogOpen(false); setPendingEdge(null); }}
          onSuccess={handleRelationshipCreated}
          contact1={contactsMap[pendingEdge.source]}
          contact2={contactsMap[pendingEdge.target]}
          relationshipTypes={relationshipTypes}
        />
      )}
    </div>
  );
};

export default ContactNetworkGraph;
