-- Create puffs table to track individual puff events
CREATE TABLE puffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz DEFAULT now() NOT NULL,
  count integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for fast queries by user and timestamp
CREATE INDEX idx_puffs_user_timestamp ON puffs(user_id, timestamp DESC);

-- Enable RLS
ALTER TABLE puffs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own puffs
CREATE POLICY "Users can view own puffs" ON puffs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own puffs
CREATE POLICY "Users can insert own puffs" ON puffs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own puffs
CREATE POLICY "Users can delete own puffs" ON puffs
  FOR DELETE USING (auth.uid() = user_id);
