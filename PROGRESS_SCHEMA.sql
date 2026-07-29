-- Progress Tracking Tables
-- Tracks student learning progress across all activities

-- Topic Completion Tracking
CREATE TABLE IF NOT EXISTS public.topic_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  topic VARCHAR(255) NOT NULL,
  time_spent_minutes INTEGER NOT NULL DEFAULT 0 CHECK (time_spent_minutes >= 0),

  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Completion Tracking
CREATE TABLE IF NOT EXISTS public.quiz_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,

  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),

  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Tracking
CREATE TABLE IF NOT EXISTS public.project_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  project_title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'in-progress', 'completed')),

  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  notes TEXT
);

-- Roadmap Item Progress
CREATE TABLE IF NOT EXISTS public.roadmap_item_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,

  item_title VARCHAR(255) NOT NULL,
  phase VARCHAR(50) NOT NULL CHECK (phase IN ('beginner', 'intermediate', 'advanced')),
  completed BOOLEAN DEFAULT FALSE,

  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Overall Progress Summary (materialized view, updated daily)
CREATE TABLE IF NOT EXISTS public.progress_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  total_topics_completed INTEGER DEFAULT 0,
  total_quizzes_completed INTEGER DEFAULT 0,
  total_projects_completed INTEGER DEFAULT 0,

  overall_completion_percentage DECIMAL(5,2) DEFAULT 0 CHECK (overall_completion_percentage >= 0 AND overall_completion_percentage <= 100),
  roadmap_completion_percentage DECIMAL(5,2) DEFAULT 0 CHECK (roadmap_completion_percentage >= 0 AND roadmap_completion_percentage <= 100),

  learning_streak_days INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_topic_progress_user_id ON public.topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_completed_at ON public.topic_progress(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_progress_user_id ON public.quiz_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_progress_completed_at ON public.quiz_progress(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_progress_user_id ON public.project_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_project_progress_status ON public.project_progress(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_item_progress_user_id ON public.roadmap_item_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_item_progress_roadmap_id ON public.roadmap_item_progress(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_progress_summary_user_id ON public.progress_summary(user_id);

-- Enable RLS
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_item_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own progress
CREATE POLICY "Users can read own topic progress" ON public.topic_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own topic progress" ON public.topic_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own quiz progress" ON public.quiz_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz progress" ON public.quiz_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own project progress" ON public.project_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own project progress" ON public.project_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own project progress" ON public.project_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own roadmap item progress" ON public.roadmap_item_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roadmap item progress" ON public.roadmap_item_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roadmap item progress" ON public.roadmap_item_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own progress summary" ON public.progress_summary
  FOR SELECT USING (auth.uid() = user_id);

-- Create trigger to update progress_summary updated_at
CREATE TRIGGER update_progress_summary_updated_at
  BEFORE UPDATE ON public.progress_summary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT ON public.topic_progress TO authenticated;
GRANT SELECT, INSERT ON public.quiz_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.project_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.roadmap_item_progress TO authenticated;
GRANT SELECT ON public.progress_summary TO authenticated;
