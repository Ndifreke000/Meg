#!/bin/bash

# Health-AI Database Setup Script

echo "Setting up Health-AI database..."

# Create database directory if it doesn't exist
mkdir -p /home/ndii/Documents/Meg/backend

# Navigate to backend directory
cd /home/ndii/Documents/Meg/backend

# Check if SQLite is installed
if ! command -v sqlite3 &> /dev/null; then
    echo "SQLite3 is not installed. Please install it first:"
    echo "Ubuntu/Debian: sudo apt-get install sqlite3"
    echo "macOS: brew install sqlite3"
    echo "Windows: Download from https://sqlite.org/download.html"
    exit 1
fi

# Create database file if it doesn't exist
if [ ! -f "health_ai.db" ]; then
    echo "Creating SQLite database..."
    touch health_ai.db
fi

# Run migrations
echo "Running database migrations..."
if [ -f "migrations/20240101000000_init.sql" ]; then
    sqlite3 health_ai.db < migrations/20240101000000_init.sql
    echo "Database migrations completed successfully!"
else
    echo "Migration file not found. Please ensure migrations/20240101000000_init.sql exists."
    exit 1
fi

# Insert default admin user if not exists
echo "Checking for admin user..."
ADMIN_EXISTS=$(sqlite3 health_ai.db "SELECT COUNT(*) FROM users WHERE email = 'admin@healthai.com';")

if [ "$ADMIN_EXISTS" -eq 0 ]; then
    echo "Creating default admin user..."
    # Password hash for 'admin123'
    ADMIN_HASH='$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu'
    ADMIN_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
    
    sqlite3 health_ai.db "INSERT INTO users (id, email, password_hash, role, full_name, is_verified, created_at) VALUES ('$ADMIN_ID', 'admin@healthai.com', '$ADMIN_HASH', 'admin', 'System Administrator', 1, datetime('now'));"
    echo "Default admin user created!"
    echo "Email: admin@healthai.com"
    echo "Password: admin123"
else
    echo "Admin user already exists."
fi

echo "Database setup completed!"
echo ""
echo "To start the backend server:"
echo "cd /home/ndii/Documents/Meg/backend"
echo "cargo run"
echo ""
echo "To start the frontend:"
echo "cd /home/ndii/Documents/Meg"
echo "npm run dev"