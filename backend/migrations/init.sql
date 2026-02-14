-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    age INTEGER,
    special_needs TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mood logs table
CREATE TABLE IF NOT EXISTS mood_logs (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mood VARCHAR(50) NOT NULL,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Routines table
CREATE TABLE IF NOT EXISTS routines (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_time VARCHAR(10) NOT NULL,
    duration_minutes INTEGER,
    icon VARCHAR(50),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    focus_score INTEGER CHECK (focus_score >= 1 AND focus_score <= 10),
    duration_minutes INTEGER,
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    meal_type VARCHAR(50) NOT NULL,
    scheduled_time VARCHAR(10) NOT NULL,
    items TEXT[] NOT NULL,
    calories INTEGER,
    dietary_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mood_logs_profile ON mood_logs(profile_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_routines_profile ON routines(profile_id, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_activities_profile ON activities(profile_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_plans_profile ON meal_plans(profile_id, scheduled_time);
