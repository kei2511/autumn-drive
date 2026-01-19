-- Migration: Add user_id to files table for multi-user support
-- Run this in your Supabase SQL Editor after the initial schema.sql

-- 1. Add user_id column to files table
ALTER TABLE files ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_files_user ON files(user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies - Users can only access their own files
CREATE POLICY "Users can view own files" ON files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files" ON files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON files
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON files
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Update the atomic save function to include user_id
CREATE OR REPLACE FUNCTION save_file_with_chunks(
    p_file_id UUID,
    p_name TEXT,
    p_size BIGINT,
    p_type TEXT,
    p_folder_id TEXT,
    p_iv TEXT,
    p_date TIMESTAMPTZ,
    p_chunks JSONB,
    p_user_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- Use auth.uid() if p_user_id is not provided
    INSERT INTO files (id, name, size, type, folder_id, iv, date, user_id)
    VALUES (p_file_id, p_name, p_size, p_type, p_folder_id, p_iv, COALESCE(p_date, NOW()), COALESCE(p_user_id, auth.uid()))
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        size = EXCLUDED.size,
        type = EXCLUDED.type,
        folder_id = EXCLUDED.folder_id,
        iv = EXCLUDED.iv,
        date = EXCLUDED.date;

    -- Targeted cleanup
    DELETE FROM chunks WHERE file_id = p_file_id;
    
    -- Bulk insert chunks
    INSERT INTO chunks (file_id, chunk_index, message_id, url, iv, size)
    SELECT 
        p_file_id, 
        (value->>'index')::INT, 
        value->>'messageId', 
        value->>'url', 
        value->>'iv', 
        (value->>'size')::BIGINT
    FROM jsonb_array_elements(p_chunks);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
