-- Daily Plans Table (stores daily task plans from roadmaps)

CREATE TABLE IF NOT EXISTS public.daily_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  tasks JSONB NOT NULL DEFAULT '[]',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_id ON public.daily_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_created_at ON public.daily_plans(created_at DESC);

-- Enable RLS
ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own plans
CREATE POLICY "Users can read own daily plans" ON public.daily_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily plans" ON public.daily_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily plans" ON public.daily_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to update daily_plans updated_at
CREATE TRIGGER update_daily_plans_updated_at
  BEFORE UPDATE ON public.daily_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.daily_plans TO authenticated;
