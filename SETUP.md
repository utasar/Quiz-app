# Setup and Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Production Deployment](#production-deployment)
6. [API Documentation](#api-documentation)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
  ```bash
  node --version  # Should be v18+
  ```

- **npm** (v9.0.0 or higher)
  ```bash
  npm --version
  ```

- **MongoDB** (v6.0 or higher)
  - Local installation OR
  - MongoDB Atlas account (free tier available)

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/utasar/Quiz-app.git
cd Quiz-app
```

### 2. Install Dependencies

#### Option A: Install All at Once
```bash
npm run install:all
```

#### Option B: Install Separately
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
cd ..
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB
```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` file with your connection string

### 4. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app  # Or your Atlas URI
JWT_SECRET=your-secure-random-secret-key
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Optional API Keys
NEWS_API_KEY=your-newsapi-key  # Get from https://newsapi.org
OPENAI_API_KEY=your-openai-key  # Get from https://platform.openai.com
```

## Environment Configuration

### Required Variables
- `PORT`: Backend server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a strong random string)
- `JWT_EXPIRATION`: Token expiration time (e.g., "7d", "24h")
- `CORS_ORIGIN`: Frontend URL (default: http://localhost:5173)
- `NODE_ENV`: Environment (development/production)

### Optional Variables
- `NEWS_API_KEY`: For fetching real news articles (app works without it using mock data)
- `OPENAI_API_KEY`: For AI-powered quiz generation (app works without it using mock questions)
- `STOCK_API_KEY`: For future stock market quizzes

## Running the Application

### Development Mode

#### Option A: Run Both Frontend and Backend Together
```bash
npm run dev
```

This uses `concurrently` to run both servers:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application
Open your browser and navigate to: http://localhost:5173

## Production Deployment

### 1. Build the Application

```bash
# Build both frontend and backend
npm run build

# Or build separately
cd backend && npm run build
cd ../frontend && npm run build
```

### 2. Production Environment Setup

Create `backend/.env` for production:
```env
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-very-secure-production-secret
JWT_EXPIRATION=7d
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production
NEWS_API_KEY=your-production-newsapi-key
OPENAI_API_KEY=your-production-openai-key
```

### 3. Start Production Server

```bash
# From the backend directory
cd backend
npm start

# Or using PM2 (recommended for production)
pm2 start dist/server.js --name quiz-app-backend
```

### 4. Serve Frontend

The frontend can be served using:
- **Nginx** (recommended)
- **Apache**
- **Static hosting** (Vercel, Netlify, etc.)

#### Example Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/Quiz-app/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Deployment Options

#### Heroku
```bash
# Backend deployment
cd backend
heroku create quiz-app-backend
git subtree push --prefix backend heroku main

# Add MongoDB Atlas as DATABASE_URL
heroku config:set MONGODB_URI=your-mongodb-uri
```

#### Vercel (Frontend)
```bash
cd frontend
vercel
```

#### DigitalOcean/AWS/GCP
- Use Docker containers (see Docker section below)
- Or deploy directly on VM instances

## Docker Deployment

### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
Create `docker-compose.yml` in root:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/quiz-app

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Run with: `docker-compose up`

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "student"  // or "parent" or "teacher"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Quiz Endpoints

#### Get All Quizzes
```http
GET /api/quizzes?category=cultural
Authorization: Bearer <token>
```

#### Create Manual Quiz
```http
POST /api/quizzes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "History Quiz",
  "description": "Test your history knowledge",
  "category": "historical",
  "questions": [
    {
      "questionText": "Who was the first president?",
      "questionType": "multiple-choice",
      "options": ["George Washington", "John Adams", "Thomas Jefferson", "Benjamin Franklin"],
      "correctAnswer": "George Washington",
      "difficulty": "medium"
    }
  ]
}
```

#### Generate Quiz from Book
```http
POST /api/quizzes/generate/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookLink": "https://example.com/bhagavad-gita",
  "topic": "Karma Yoga",
  "numberOfQuestions": 10,
  "title": "Bhagavad Gita Quiz",
  "description": "Quiz on Karma Yoga chapter"
}
```

### Result Endpoints

#### Submit Quiz Result
```http
POST /api/results
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizId": "quiz-id-here",
  "answers": [
    {
      "questionIndex": 0,
      "userAnswer": "George Washington",
      "timeTaken": 15
    }
  ],
  "timeTaken": 300
}
```

#### Get Leaderboard
```http
GET /api/results/leaderboard/global?limit=10
Authorization: Bearer <token>
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongo --version
mongod --version

# Test connection
mongo mongodb://localhost:27017/quiz-app
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # On macOS/Linux
netstat -ano | findstr :5000  # On Windows

# Kill the process
kill -9 <PID>  # On macOS/Linux
taskkill /PID <PID> /F  # On Windows
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
Make sure `CORS_ORIGIN` in backend `.env` matches your frontend URL exactly.

### Build Errors
```bash
# TypeScript errors
cd backend
npx tsc --noEmit  # Check for type errors

# Clear build
rm -rf dist
npm run build
```

## Monitoring and Logs

### PM2 (Production)
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start dist/server.js --name quiz-app

# Monitor
pm2 monit

# Logs
pm2 logs quiz-app

# Restart
pm2 restart quiz-app
```

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
3. **Enable HTTPS** in production
4. **Rate limiting** - Consider adding express-rate-limit
5. **Input validation** - Already implemented with express-validator
6. **Update dependencies** regularly: `npm audit fix`

## Support

For issues and questions:
- GitHub Issues: https://github.com/utasar/Quiz-app/issues
- Documentation: See README.md

## License

MIT License - See LICENSE file for details
