#!/bin/bash

echo "🔍 Checking Health-AI Status..."
echo ""

# Check Frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Running at http://localhost:3000"
else
    echo "❌ Frontend: Not running"
fi

# Check Backend
if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Backend: Running at http://localhost:8080"
    echo "   API Health: $(curl -s http://localhost:8080/api/health | jq -r '.status' 2>/dev/null || echo 'healthy')"
else
    echo "⏳ Backend: Starting up or not running yet..."
fi

# Check Database
if sudo -u postgres psql -d health_ai -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ Database: Connected (health_ai)"
else
    echo "❌ Database: Not accessible"
fi

echo ""
echo "📊 Services Summary:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   Database: PostgreSQL (local)"
