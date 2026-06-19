-- ==========================================
-- Database Schema for Supabase (PostgreSQL)
-- Alerts Table
-- ==========================================

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year VARCHAR(255) NOT NULL, -- e.g., 'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Anyone can read active alerts
CREATE POLICY "Anyone can read active alerts" 
ON alerts FOR SELECT 
USING (is_active = true);

-- Only admins can insert/update/delete (You will need to adjust this depending on your admin role setup)
-- CREATE POLICY "Admins can manage alerts" ON alerts USING (auth.uid() IN (SELECT user_id FROM admin_users));
