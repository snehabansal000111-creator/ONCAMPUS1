-- Roadmap Table
-- Stores AI-generated learning roadmaps for students

CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,

  -- Beginner Phase
  beginner_duration VARCHAR(100) NOT NULL,
  beginner_topics TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  beginner_milestones TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  beginner_projects JSONB NOT NULL DEFAULT '[]'::JSONB,
  beginner_resources JSONB NOT NULL DEFAULT '[]'::JSONB,
  beginner_practice JSONB NOT NULL DEFAULT '[]'::JSONB,

  -- Intermediate Phase
  intermediate_duration VARCHAR(100) NOT NULL,
  intermediate_topics TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  intermediate_milestones TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  intermediate_projects JSONB NOT NULL DEFAULT '[]'::JSONB,
  intermediate_resources JSONB NOT NULL DEFAULT '[]'::JSONB,
  intermediate_practice JSONB NOT NULL DEFAULT '[]'::JSONB,

  -- Advanced Phase
  advanced_duration VARCHAR(100) NOT NULL,
  advanced_topics TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  advanced_milestones TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  advanced_projects JSONB NOT NULL DEFAULT '[]'::JSONB,
  advanced_resources JSONB NOT NULL DEFAULT '[]'::JSONB,
  advanced_practice JSONB NOT NULL DEFAULT '[]'::JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON public.roadmaps(user_id);

-- Enable RLS
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own roadmap
CREATE POLICY "Users can read own roadmap" ON public.roadmaps
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own roadmap
CREATE POLICY "Users can insert own roadmap" ON public.roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own roadmap
CREATE POLICY "Users can update own roadmap" ON public.roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.roadmaps TO authenticated;
