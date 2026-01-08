# Quiz App - Comprehensive Educational Platform

A full-stack quiz application designed for educational, cultural, and competitive purposes. This application helps students prepare for quiz competitions locally in Nepal, across Asia, and globally.

## Features

### Core Functionality
- **Multi-User System**: Role-based access for Students, Parents, and Teachers
- **Quiz Categories**: General Knowledge, Cultural, Political, Historical, Current Affairs, and Custom quizzes
- **Question Types**: Multiple Choice, True/False, and Fill-in-the-Blank
- **AI-Powered Quiz Generation**: Generate quizzes from book links and news articles using OpenAI
- **Real-time Data Integration**: Daily news updates and current affairs quizzes
- **Leaderboards**: Global and quiz-specific rankings
- **Performance Tracking**: Detailed statistics and progress analysis
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### User Roles
1. **Students**: Take quizzes, track progress, compete on leaderboards
2. **Parents**: Create custom quizzes, generate AI quizzes from books, monitor student progress
3. **Teachers**: All parent features plus advanced quiz management

## Tech Stack

### Backend
- Node.js & Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API (for quiz generation)
- News API (for current affairs)
- Helmet & CORS for security

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Vite for fast development
- Responsive CSS

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/utasar/Quiz-app.git
cd Quiz-app
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure Backend Environment**
```bash
cd backend
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your-secure-secret-key
NEWS_API_KEY=your-newsapi-key (optional)
OPENAI_API_KEY=your-openai-key (optional)
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the Application**

Development mode (both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

### Quizzes
- GET `/api/quizzes` - Get all quizzes
- GET `/api/quizzes/:id` - Get quiz by ID
- POST `/api/quizzes` - Create manual quiz (Parent/Teacher only)
- POST `/api/quizzes/generate/book` - Generate quiz from book (Parent/Teacher only)
- POST `/api/quizzes/generate/news` - Generate quiz from news (Parent/Teacher only)
- PUT `/api/quizzes/:id` - Update quiz
- DELETE `/api/quizzes/:id` - Delete quiz

### Results
- POST `/api/results` - Submit quiz result
- GET `/api/results/user/:userId?` - Get user results
- GET `/api/results/stats/:userId?` - Get user statistics
- GET `/api/results/leaderboard/quiz/:quizId` - Get quiz leaderboard
- GET `/api/results/leaderboard/global` - Get global leaderboard

## Building for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## Project Structure

```
Quiz-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Authentication middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (AI, News)
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── package.json
```

## Usage Guide

### For Students
1. Register with role "Student"
2. Browse available quizzes by category
3. Take quizzes and view instant results
4. Track your progress in the Profile section
5. Compete on the Global Leaderboard

### For Parents/Teachers
1. Register with role "Parent" or "Teacher"
2. Create custom quizzes manually
3. Generate quizzes from book links (e.g., Bhagavad Gita, educational texts)
4. Generate quizzes from latest news for current affairs practice
5. Monitor student progress and performance

## API Keys (Optional)

The app works without API keys but with limited functionality:

### News API
Get a free key from https://newsapi.org
- Used for fetching latest news articles
- Without this key, mock news data will be used

### OpenAI API
Get a key from https://platform.openai.com
- Used for AI-powered quiz generation
- Without this key, mock questions will be generated

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

## Future Enhancements

- [ ] Stock market price quizzes
- [ ] Image-based questions
- [ ] Timed competitions
- [ ] Certificate generation
- [ ] Mobile apps (iOS & Android)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social features (study groups, challenges)

---

**Note**: This application is designed to prepare students for quiz competitions at local, regional, and global levels. It emphasizes educational content, cultural awareness, and current affairs knowledge.