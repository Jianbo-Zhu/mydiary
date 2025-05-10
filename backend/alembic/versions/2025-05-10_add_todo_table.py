"""
2025-05-10: add todo table
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'todos',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('due_time', sa.DateTime(), nullable=True),
        sa.Column('contact_id', sa.Integer(), sa.ForeignKey('contacts.id'), nullable=True),
        sa.Column('is_completed', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('priority', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('repeat_rule', sa.String(length=16), nullable=False, server_default='none'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('idx_todo_user', 'todos', ['user_id'])
    op.create_index('idx_todo_contact', 'todos', ['contact_id'])
    op.create_index('idx_todo_due_time', 'todos', ['due_time'])

def downgrade():
    op.drop_index('idx_todo_due_time', table_name='todos')
    op.drop_index('idx_todo_contact', table_name='todos')
    op.drop_index('idx_todo_user', table_name='todos')
    op.drop_table('todos')
