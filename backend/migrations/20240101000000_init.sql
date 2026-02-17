-- SQLite Migration for Health AI Backend

-- Users table (Parents/Guardians/Admin)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'parent',
    full_name TEXT NOT NULL,
    phone_number TEXT,
    country TEXT,
    state TEXT,
    location TEXT,
    ethnicity TEXT,
    job TEXT,
    identification_type TEXT,
    identification_number TEXT,
    profile_picture_url TEXT,
    is_verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Child profiles table
CREATE TABLE IF NOT EXISTS child_profiles (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    name TEXT NOT NULL,
    date_of_birth TEXT,
    age INTEGER,
    gender TEXT,
    special_needs TEXT,
    diagnosis TEXT,
    medications TEXT,
    allergies TEXT,
    school_name TEXT,
    grade_level TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    profile_picture_url TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Guardians/Additional contacts table
CREATE TABLE IF NOT EXISTS guardians (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    added_by_user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    can_pickup INTEGER NOT NULL DEFAULT 0,
    emergency_contact INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (added_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mood logs table
CREATE TABLE IF NOT EXISTS mood_logs (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    mood TEXT NOT NULL,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    notes TEXT,
    logged_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- Routines table
CREATE TABLE IF NOT EXISTS routines (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_time TEXT NOT NULL,
    duration_minutes INTEGER,
    icon TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    title TEXT NOT NULL,
    focus_score INTEGER CHECK (focus_score >= 1 AND focus_score <= 10),
    duration_minutes INTEGER,
    notes TEXT,
    logged_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    items TEXT NOT NULL,
    calories INTEGER,
    dietary_notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_child_profiles_parent ON child_profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_guardians_child ON guardians(child_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_child ON mood_logs(child_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_routines_child ON routines(child_id, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_activities_child ON activities(child_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_plans_child ON meal_plans(child_id, scheduled_time);
