-- Seed admin user
-- Password hash for 'admin123' using bcrypt with cost 12
INSERT OR IGNORE INTO users (
    id, 
    email, 
    password_hash, 
    role, 
    full_name, 
    phone_number, 
    country, 
    is_verified
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@healthai.com',
    '$2b$12$LQv3c1yqBw2LeOzMpkDCx.pksOHBvxiM/aUlaHdkcf8H/oX8Q5jqy',
    'admin',
    'System Administrator',
    '+1-555-0123',
    'United States',
    1
);