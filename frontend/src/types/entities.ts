// Diary
export interface DiaryBase {
  content: string;
  happened_at: string; // ISO string
  tags?: string[];
  location?: string;
  event_type?: string;
}

export interface DiaryCreate extends DiaryBase {}

export interface DiaryUpdate extends Partial<DiaryBase> {}

export interface DiaryResponse extends DiaryBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  contacts?: { id: number; name: string }[];
}

// Contact
export interface ContactBase {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  birthday?: string; // ISO date string
  notes?: string;
  relation_to_me?: string;
  tags?: string[];
}

export interface ContactCreate extends ContactBase {}

export interface ContactUpdate extends Partial<ContactBase> {}

export interface ContactResponse extends ContactBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// User
export interface UserBase {
  email: string;
  name?: string;
}

export interface UserResponse extends UserBase {
  id: number;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

// RelationshipType
export interface RelationshipTypeBase {
  name: string;
  description?: string;
}

export interface RelationshipTypeCreate extends RelationshipTypeBase {
  user_id: number;
}

export interface RelationshipTypeUpdate extends Partial<RelationshipTypeBase> {}

export interface RelationshipTypeResponse extends RelationshipTypeBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Relationship
export interface RelationshipBase {
  id: number;
  user_id: number;
  contact_id_1: number;
  contact_id_2: number;
  relation_type: string;
  notes?: string;
}

export interface RelationshipCreate extends Omit<RelationshipBase, 'id'> {}

export interface RelationshipUpdate {
  relation_type?: string;
  notes?: string;
}

export interface Relationship extends RelationshipBase {
  created_at?: string;
  updated_at?: string;
}

// Todo
export interface TodoBase {
  content: string;
  due_time?: string; // ISO string
  contact_id?: number;
  priority?: number; // 1-5
  repeat_rule?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface TodoCreate extends TodoBase {}

export interface TodoUpdate extends Partial<TodoBase> {
  is_completed?: boolean;
}

export interface TodoResponse extends TodoBase {
  id: number;
  user_id: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}