-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Student Profiles Table
-- Stores the onboarding data for each student
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  name VARCHAR(255) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  year VARCHAR(50) NOT NULL,
  background TEXT,

  -- Academic Profile
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  career_goal VARCHAR(255) NOT NULL,
  learning_style VARCHAR(50) NOT NULL CHECK (learning_style IN ('visual', 'reading', 'hands-on', 'mixed')),

  -- Time & Budget
  daily_study_hours DECIMAL(3,1) NOT NULL CHECK (daily_study_hours > 0 AND daily_study_hours <= 24),
  monthly_budget DECIMAL(10,2) NOT NULL CHECK (monthly_budget >= 0),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Users cannot delete their profile (prevent accidental deletion)
-- Deletion only via CASCADE from auth.users or admin

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions to anon role (for unauthenticated requests)
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon;

-- Grant permissions to authenticated role
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
