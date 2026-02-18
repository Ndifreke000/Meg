# Contributing to Health-AI

## Current Development Status

### ✅ Completed Features
- **Frontend Build**: Fixed parsing errors and authentication integration
- **Backend Services**: All API endpoints functional with SQLite database
- **Authentication**: JWT-based auth with admin user seeded
- **Focus Activities**: All 6 games fully functional with scoring
- **Database**: SQLite setup with migrations and admin user seeding

### ⚠️ Known Issues & Limitations

#### AI Chat Integration
- **Issue**: MedGemma requires configuration for full functionality
- **Current State**: Works with fallback responses after authentication
- **Solutions Available**:
  - Option 1: Local MedGemma service (`ai-service/medgemma_local.py`)
  - Option 2: Hugging Face API token configuration
- **Priority**: Medium

#### Authentication Requirements
- **Issue**: AI chat requires login before use
- **Current State**: Fixed with proper redirect to login page
- **Admin Credentials**: admin@healthai.com / admin123
- **Priority**: Resolved

#### Database Schema
- **Issue**: Frontend expects PostgreSQL types but backend uses SQLite
- **Current State**: Working with compatibility layer
- **Future**: Consider PostgreSQL migration for production
- **Priority**: Low

### 🔧 Development Setup Issues

#### Build Dependencies
- **Issue**: npm install requires `--legacy-peer-deps` flag
- **Cause**: React 19 compatibility with some packages
- **Workaround**: Use `npm install --legacy-peer-deps`
- **Priority**: Low

#### Environment Configuration
- **Issue**: Missing .env.example file
- **Current State**: Manual .env setup required
- **Need**: Create .env.example template
- **Priority**: Medium

### 🚀 Future Development Areas

#### High Priority
1. **MedGemma Integration Improvement**
   - Streamline local service setup
   - Better error handling for API failures
   - Model response quality optimization

2. **User Experience**
   - Child profile creation flow
   - Dashboard improvements
   - Mobile responsiveness

#### Medium Priority
1. **Data Persistence**
   - PostgreSQL migration
   - Data backup/restore
   - Performance optimization

2. **Security Enhancements**
   - Rate limiting
   - Input validation
   - CORS configuration

#### Low Priority
1. **Testing**
   - Unit tests for backend
   - Frontend component tests
   - Integration tests

2. **Documentation**
   - API documentation
   - Deployment guides
   - User manual

## Contributing Guidelines

### Getting Started
1. Fork the repository
2. Set up development environment following README.md
3. Create feature branch: `git checkout -b feature/your-feature`
4. Make changes and test thoroughly
5. Submit pull request with detailed description

### Code Standards
- **Frontend**: TypeScript, ESLint, Prettier
- **Backend**: Rust formatting with `cargo fmt`
- **Commits**: Conventional commit messages
- **Testing**: Add tests for new features

### Issue Reporting
- Use GitHub Issues for bug reports
- Include reproduction steps
- Specify environment details
- Label appropriately (bug, enhancement, question)

### Development Priorities
1. Fix critical authentication/security issues
2. Improve AI integration reliability
3. Enhance user experience
4. Add comprehensive testing
5. Optimize performance

## Quick Development Commands

```bash
# Frontend development
npm run dev
npm run build
npm run lint

# Backend development
cd backend
cargo run
cargo test
cargo fmt

# AI service
cd ai-service
pip install -r requirements.txt
python medgemma_local.py

# Database
cd backend
sqlite3 health_ai.db
```

## Need Help?
- Check existing GitHub Issues
- Review README.md setup instructions
- Contact maintainers for complex issues