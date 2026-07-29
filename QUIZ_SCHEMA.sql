-- Quiz Table
-- Stores AI-generated quizzes for students

CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE SET NULL,

  topic VARCHAR(255) NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),

  -- Store entire quiz as JSON for flexibility
  questions JSONB NOT NULL,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON public.quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_roadmap_id ON public.quizzes(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty ON public.quizzes(difficulty);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own quizzes
CREATE POLICY "Users can read own quizzes" ON public.quizzes
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own quizzes
CREATE POLICY "Users can insert own quizzes" ON public.quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own quizzes
CREATE POLICY "Users can update own quizzes" ON public.quizzes
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.quizzes TO authenticated;

-- Quiz Submissions Table (optional, for tracking answers)
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,

  answers JSONB NOT NULL, -- User's answers
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.quiz_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_quiz_id ON public.quiz_submissions(quiz_id);

-- Enable RLS
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can read own submissions" ON public.quiz_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON public.quiz_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT ON public.quiz_submissions TO authenticated;
