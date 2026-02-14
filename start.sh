#!/bin/bash

echo "🚀 Starting Health-AI Application..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

# Start services
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check backend health
echo "🔍 Checking backend health..."
if curl -s http://localhost:8080/api/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:8080"
else
    echo "⚠️  Backend may still be starting up..."
fi

# Check frontend
echo "🔍 Checking frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "⚠️  Frontend may still be starting up..."
fi

echo ""
echo "🎉 Health-AI is starting up!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   API Health: http://localhost:8080/api/health"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
