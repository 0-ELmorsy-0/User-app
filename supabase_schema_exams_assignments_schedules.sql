-- ==========================================
-- Database Schema for Supabase (PostgreSQL)
-- Exams, Assignments, and Schedules Tables
-- ==========================================

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Exams Table (الامتحانات)
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID,
    subject_id UUID,
    module_id UUID,
    duration_minutes INTEGER DEFAULT 60,
    total_marks INTEGER DEFAULT 100,
    is_published BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Assignments Table (الواجبات)
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID,
    subject_id UUID,
    module_id UUID,
    duration_minutes INTEGER DEFAULT 60,
    total_marks INTEGER DEFAULT 100,
    is_published BOOLEAN DEFAULT false,
    file_url VARCHAR(255),
    deadline TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Schedules Table (الجداول)
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID,
    subject_id UUID,
    file_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Anyone can read active exams
CREATE POLICY "Anyone can read active exams" 
ON exams FOR SELECT 
USING (is_active = true);

-- Anyone can read active assignments
CREATE POLICY "Anyone can read active assignments" 
ON assignments FOR SELECT 
USING (is_active = true);

-- Anyone can read active schedules
CREATE POLICY "Anyone can read active schedules" 
ON schedules FOR SELECT 
USING (is_active = true);
