-- Chat History Table
-- Stores all conversations for memory and context

CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  question TEXT NOT NULL,
  answer TEXT NOT NULL,

  detected_topic VARCHAR(255),
  topics TEXT[] DEFAULT ARRAY[]::TEXT[],

  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_timestamp ON public.chat_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_detected_topic ON public.chat_history(detected_topic);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_timestamp ON public.chat_history(user_id, timestamp DESC);

-- Enable RLS
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own chat history
CREATE POLICY "Users can read own chat history" ON public.chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history" ON public.chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT ON public.chat_history TO authenticated;
