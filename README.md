# Yosellins - AI Health Assistant

AI-powered support system for children with special needs using MedGemma + HAI-DEF.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Rust 1.83+
- SQLite3

### Setup

1. **Clone & Install**
```bash
git clone <repository-url>
cd Meg
npm install --legacy-peer-deps
```

2. **Backend Setup**
```bash
cd backend
cp .env.example .env
# Add HUGGINGFACE_API_TOKEN for AI features
cargo run
```

3. **Database Setup**
```bash
sudo apt-get install sqlite3  # Ubuntu/Debian
cd backend
sqlite3 health_ai.db < migrations/20240101000000_init.sql
```

4. **Frontend**
```bash
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Default Admin: admin@healthai.com / admin123

## ✅ Features

### Core Healthcare
- **Emergency Alerts** - One-click emergency contacts with medical info
- **Medication Reminders** - Time-based alerts with browser notifications
- **Progress Reports** - PDF generation for healthcare providers
- **Offline Mode** - Works without internet connection

### Focus Activities (All Functional)
- Space Math - Interactive math game with scoring
- Memory Match - Card matching memory game
- Pattern Puzzle - Pattern recognition challenge
- Story Time - Reading comprehension
- Logic Quest - Logic puzzles
- Word Builder - Spelling game

### AI Assistant
- Real-time chat with MedGemma 1.5-4B model
- Medical-focused responses for special needs
- Fallback responses for offline scenarios

### Management
- Profile management with special needs tracking
- Daily routines & schedules
- Mood & behavior tracking
- Analytics & progress visualization
- Multi-theme support (Discord, Spotify, Telegram)

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Rust, Actix-Web, SQLx, JWT
- **Database**: SQLite
- **AI**: MedGemma 1.5-4B via Hugging Face API

## 📱 Navigation

- 🏠 Home Dashboard
- 😊 Daily Wellness
- 👥 Profiles & Setup
- 🍽️ AI Meal Plan
- 🎵 Sensory & Schedule
- 📋 Programs & Analytics
- 🤝 Support Network
- 🎮 Focus Activities
- 💬 AI Assistant
- 🚨 Emergency
- 💊 Medications
- 📊 Reports
- 📱 Offline Mode
- ⚙️ Settings

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
JWT_SECRET=your-secret-key
HUGGINGFACE_API_TOKEN=your-hf-token
DATABASE_URL=sqlite:health_ai.db
```

### MedGemma AI Setup

**Option 1: Hugging Face API**
1. Get token from https://huggingface.co/settings/tokens
2. Add to backend/.env: `HUGGINGFACE_API_TOKEN=your-token`
3. Restart backend

**Option 2: Local Service**
```bash
cd ai-service
pip install -r requirements.txt
python medgemma_local.py
```

## 📄 License

MIT
