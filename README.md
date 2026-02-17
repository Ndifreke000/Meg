# Health-AI

AI-powered support system for children with special needs using MedGemma + HAI-DEF.

## Current Status

✅ **Frontend Build**: Fixed parsing errors and authentication integration  
✅ **Backend Services**: All API endpoints functional with SQLite database  
✅ **Authentication**: JWT-based auth with admin user seeded  
✅ **Focus Activities**: All 6 games fully functional with scoring  
⚠️ **AI Chat**: Requires Hugging Face API token configuration for MedGemma  

**To use AI Chat**: 
1. Log in with admin@healthai.com / admin123
2. Configure HUGGINGFACE_API_TOKEN in backend/.env
3. Restart backend

## Features

✅ **All Focus Activities Functional**
- Space Math - Interactive math game with scoring
- Memory Match - Card matching memory game
- Pattern Puzzle - Pattern recognition challenge
- Story Time - Reading comprehension with questions
- Logic Quest - Logic puzzles and reasoning
- Word Builder - Spelling and vocabulary game

✅ **AI Assistant with MedGemma Integration**
- Real-time chat with Google's MedGemma 1.5-4B model
- Medical-focused AI responses for children with special needs
- Fallback responses for offline scenarios

✅ **Authentication System**
- Parent/Guardian registration and login
- JWT-based authentication
- Secure password hashing (bcrypt)
- Admin dashboard access

✅ **Profile Management**
- Parent/Guardian profiles with detailed information
- Multiple child profiles per parent
- Guardian/contact management for each child
- Special needs tracking

✅ **AI-Powered Insights**
- Mood & behavior tracking
- Focus pattern analysis
- Routine adherence monitoring
- Personalized recommendations

✅ **Daily Management**
- Customizable routines & schedules
- Activity logging with focus scores
- Meal planning
- Sensory break scheduling

✅ **Analytics & Progress**
- Weekly trend analysis
- Achievement system
- Progress visualization
- AI-generated insights

## Quick Start

### Prerequisites
- Node.js 20+
- Rust 1.83+
- PostgreSQL

### Setup

1. **Database Setup**
```bash
# Run the automated setup script
./setup_db.sh

# Or manually:
sudo apt-get install sqlite3  # Ubuntu/Debian
# brew install sqlite3        # macOS
cd backend
sqlite3 health_ai.db < migrations/20240101000000_init.sql
```

2. **Backend Configuration**
```bash
cd backend
cp .env.example .env
# Edit .env file with your settings:
# - Add your Hugging Face API token for MedGemma integration
# - Set JWT_SECRET for production
cargo run
```

3. **Frontend**
```bash
npm install --legacy-peer-deps
npm run dev
```

### MedGemma AI Integration

**Option 1: Local MedGemma Service (Recommended)**
```bash
cd ai-service
pip install -r requirements.txt
python medgemma_local.py
```

**Option 2: Hugging Face API**
1. Get token from https://huggingface.co/settings/tokens
2. Add to backend/.env: `HUGGINGFACE_API_TOKEN=your-token-here`
3. Restart backend: `cd backend && cargo run`

**Note**: Local service is tried first, then falls back to Hugging Face API.

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup

### Default Admin
- Email: admin@healthai.com
- Password: admin123

**Important**: You must log in first before using the AI chat feature. The AI chat requires authentication.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, React Query
- **Backend**: Rust, Actix-Web, SQLx, JWT
- **Database**: PostgreSQL
- **AI**: MedGemma + HAI-DEF patterns

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register parent/guardian
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Children
- `POST /api/children` - Create child profile (protected)
- `GET /api/children` - Get all children (protected)

### Guardians
- `POST /api/guardians` - Add guardian/contact (protected)
- `GET /api/guardians/{child_id}` - Get guardians (protected)

### Tracking
- `POST /api/mood` - Log mood (protected)
- `GET /api/mood/{child_id}` - Get mood history (protected)
- `POST /api/routines` - Create routine (protected)
- `GET /api/routines/{child_id}` - Get routines (protected)
- `PUT /api/routines/{id}/status` - Update routine (protected)
- `POST /api/activities` - Log activity (protected)
- `GET /api/activities/{child_id}` - Get activities (protected)

### AI & Analytics
- `GET /api/ai/insights/{child_id}` - Get AI insights (protected)
- `GET /api/analytics/{child_id}` - Get analytics (protected)

## License

MIT
