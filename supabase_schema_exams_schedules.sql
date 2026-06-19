-- ==========================================
-- Database Schema for Supabase (PostgreSQL)
-- Exams and Schedules Tables
-- ==========================================

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Exams Table
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID,
    subject_id UUID,
    duration_minutes INTEGER DEFAULT 60,
    questions JSONB, -- Array of questions
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Schedules Table (الجداول)
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID,
    subject_id UUID,
    file_url VARCHAR(255), -- If there is a PDF/Image of the schedule
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Anyone can read active exams
CREATE POLICY "Anyone can read active exams" 
ON exams FOR SELECT 
USING (is_active = true);

-- Anyone can read active schedules
CREATE POLICY "Anyone can read active schedules" 
ON schedules FOR SELECT 
USING (is_active = true);
