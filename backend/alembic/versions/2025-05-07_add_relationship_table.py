"""
Revision ID: 2025_05_07_add_relationship_table
Revises: 2025-05-04_06.48_12_add_diary_contact_association_table
Create Date: 2025-05-07
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'relationship',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('user.id'), nullable=False),
        sa.Column('contact_id_1', sa.Integer(), sa.ForeignKey('contact.id', ondelete='CASCADE'), nullable=False),
        sa.Column('contact_id_2', sa.Integer(), sa.ForeignKey('contact.id', ondelete='CASCADE'), nullable=False),
        sa.Column('relation_type', sa.String(length=64), nullable=False),
        sa.Column('notes', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('idx_relationship_contact1', 'relationship', ['contact_id_1'])
    op.create_index('idx_relationship_contact2', 'relationship', ['contact_id_2'])
    op.create_index('idx_relationship_user', 'relationship', ['user_id'])

def downgrade():
    op.drop_index('idx_relationship_contact1', table_name='relationship')
    op.drop_index('idx_relationship_contact2', table_name='relationship')
    op.drop_index('idx_relationship_user', table_name='relationship')
    op.drop_table('relationship')
