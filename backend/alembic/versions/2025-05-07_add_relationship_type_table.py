"""
Revision ID: 2025_05_07_add_relationship_type_table
Revises: 2025-05-07_add_relationship_table
Create Date: 2025-05-07
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'relationship_type',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('user.id'), nullable=False),
        sa.Column('name', sa.String(length=64), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.UniqueConstraint('user_id', 'name', name='uq_relationship_type_user_name'),
    )
    op.create_index('idx_relationship_type_user', 'relationship_type', ['user_id'])

def downgrade():
    op.drop_index('idx_relationship_type_user', table_name='relationship_type')
    op.drop_table('relationship_type')
