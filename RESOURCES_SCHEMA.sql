-- Resource Recommendations Table
-- Stores recommended resources for each student

CREATE TABLE IF NOT EXISTS public.resource_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  topic VARCHAR(255) NOT NULL,
  career_goal VARCHAR(100) NOT NULL,
  skill_level VARCHAR(50) NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  roadmap_stage VARCHAR(50) NOT NULL CHECK (roadmap_stage IN ('beginner', 'intermediate', 'advanced')),

  -- Store recommended resources as JSONB
  resources JSONB NOT NULL DEFAULT '[]'::JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_resource_recommendations_user_id
  ON public.resource_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_recommendations_topic
  ON public.resource_recommendations(topic);
CREATE INDEX IF NOT EXISTS idx_resource_recommendations_created_at
  ON public.resource_recommendations(created_at DESC);

-- Enable RLS
ALTER TABLE public.resource_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own recommendations
CREATE POLICY "Users can read own recommendations" ON public.resource_recommendations
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own recommendations
CREATE POLICY "Users can insert own recommendations" ON public.resource_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own recommendations
CREATE POLICY "Users can update own recommendations" ON public.resource_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_resource_recommendations_updated_at
  BEFORE UPDATE ON public.resource_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.resource_recommendations TO authenticated;
