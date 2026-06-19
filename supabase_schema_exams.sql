-- ==========================================
-- Database Schema for Supabase (PostgreSQL)
-- Exams, Questions, and Student Attempts
-- ==========================================

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Exams Table
-- Stores the main exam details linked to a course
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID, -- References your existing courses table: REFERENCES courses(id) ON DELETE CASCADE
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    total_marks INTEGER NOT NULL DEFAULT 100,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Questions Table
-- Stores individual questions for each exam
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    image_url TEXT, -- Optional URL for questions with diagrams
    marks INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0, -- To sort questions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Options (Answers) Table
-- Stores the choices for multiple-choice questions
CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0
);

-- 4. Exam Attempts Table
-- Tracks when a student starts and finishes an exam
CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References your users/auth table
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER DEFAULT 0,
    
    -- Optional: Prevent user from taking the exact same exam twice
    UNIQUE(user_id, exam_id) 
);

-- 5. Student Answers Table
-- Stores each answer chosen by the student during their attempt
CREATE TABLE student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES options(id) ON DELETE SET NULL,
    
    -- Ensure one answer per question per attempt
    UNIQUE(attempt_id, question_id)
);


-- ==========================================
-- Optional: Row Level Security (RLS) Policies
-- Useful to ensure security on Supabase
-- ==========================================

-- Enable RLS on tracking tables
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own attempts
CREATE POLICY "Users can view their own attempts" 
ON exam_attempts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts" 
ON exam_attempts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts" 
ON exam_attempts FOR UPDATE 
USING (auth.uid() = user_id);

-- Students can only see and answer their own questions
CREATE POLICY "Users can see own answers" 
ON student_answers FOR SELECT 
USING (
   attempt_id IN (SELECT id FROM exam_attempts WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert own answers" 
ON student_answers FOR INSERT 
WITH CHECK (
   attempt_id IN (SELECT id FROM exam_attempts WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update own answers" 
ON student_answers FOR UPDATE 
USING (
   attempt_id IN (SELECT id FROM exam_attempts WHERE user_id = auth.uid())
);
