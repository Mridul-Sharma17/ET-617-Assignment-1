# Learning Management System with Clickstream Analytics

A modern, interactive Learning Management System (LMS) built with the MERN stack that provides comprehensive educational content delivery and advanced user behavior analytics through clickstream tracking.

## 📚 What This Application Does

This LMS is designed to provide an engaging learning experience while capturing detailed user interaction data for educational analytics. The platform serves educational content in multiple formats and tracks every user interaction to provide insights into learning patterns and behaviors.

### Core Functionality

**Educational Content Delivery:**
- Multi-format learning materials (text articles, video content, interactive quizzes)
- Course browsing and content discovery
- Progressive learning paths with content categorization
- Real-time content consumption tracking

**User Management:**
- Secure user authentication and registration
- Role-based access (learners and potential instructor roles)
- Personal learning dashboards
- Session persistence across browser refreshes

**Analytics & Tracking:**
- Comprehensive clickstream data collection
- Real-time user behavior analytics
- Learning progress visualization
- Engagement metrics and statistics

## 🚀 Key Features

### 📖 Content Management
- **Multi-Format Content**: Support for text-based articles, video tutorials, and interactive quizzes
- **Content Categorization**: Organized learning materials by subject, difficulty level, and content type
- **Search & Filtering**: Advanced filtering by content type, category, and difficulty level
- **Content Discovery**: Browse all available courses with detailed descriptions and metadata

### 🎯 Interactive Learning
- **Text-Based Learning**: Rich text articles with estimated reading times
- **Video Integration**: Embedded video content with playback tracking
- **Interactive Quizzes**: Multiple-choice questions with immediate feedback and scoring
- **Progress Tracking**: Real-time monitoring of learning completion and achievements

### 📊 Advanced Analytics Dashboard
- **Clickstream Analytics**: Detailed tracking of every user interaction
- **Learning Progress Visualization**: Personal progress charts and statistics
- **Engagement Metrics**: Study hours, course completion rates, and activity streaks
- **Recent Activity Feed**: Timeline of user actions and learning milestones
- **Achievement System**: Badges and milestones based on learning activities

### 👤 User Experience
- **Responsive Design**: Fully responsive interface working on desktop, tablet, and mobile
- **Dark Theme**: Modern dark theme optimized for extended reading sessions
- **Intuitive Navigation**: Clean, user-friendly interface with clear navigation paths
- **Real-time Feedback**: Instant feedback on quizzes and learning activities
- **Session Management**: Persistent login sessions with secure token-based authentication

### 🔍 Clickstream Intelligence
- **Comprehensive Tracking**: Every click, page view, and interaction is recorded
- **Learning Pattern Analysis**: Insights into how users consume content
- **Performance Metrics**: Time spent on different content types and engagement levels
- **Behavioral Analytics**: Understanding user preferences and learning habits
- **Data Export**: Analytics data available for further analysis and reporting

## 🛠️ Technology Stack

**Frontend:**
- **React 19**: Latest React version with modern hooks and features
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn/ui**: Beautiful, accessible component library
- **React Hook Form**: Efficient form handling and validation
- **Zod**: TypeScript-first schema validation

**Backend:**
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Fast, unopinionated web framework
- **JWT Authentication**: Secure token-based authentication system
- **RESTful APIs**: Well-structured API endpoints for all operations

**Database & Storage:**
- **JSON-based Storage**: Lightweight file-based data storage (easily upgradeable to MongoDB)
- **Real-time Data Processing**: Efficient handling of clickstream data
- **Data Persistence**: Reliable storage of user data and analytics

**Deployment & DevOps:**
- **Railway**: Backend hosting and deployment
- **Vercel**: Frontend hosting with automatic deployments
- **Git Integration**: Seamless deployment from version control
- **Environment Management**: Secure configuration management

## 📈 Analytics Capabilities

### Real-time Tracking
- Page views and navigation patterns
- Content interaction timestamps
- Quiz attempts and completion rates
- Video play/pause events and watch time
- User session duration and frequency

### Learning Insights
- Course completion analytics
- Time spent per content type
- Learning streak tracking
- Performance trends over time
- Engagement heat maps

### Behavioral Analysis
- User journey mapping
- Content popularity metrics
- Drop-off point identification
- Learning pattern recognition
- Personalization opportunities

## 🎓 Educational Use Cases

**For Learners:**
- Self-paced learning with progress tracking
- Multiple content formats for different learning styles
- Immediate feedback through interactive quizzes
- Personal analytics to understand learning habits

**For Educators:**
- Detailed insights into student engagement
- Content effectiveness analytics
- Learning pattern identification
- Data-driven curriculum improvements

**For Institutions:**
- Comprehensive learning analytics platform
- Student behavior analysis
- Course optimization insights
- Engagement trend monitoring

## 🚀 Live Demo

- **Frontend**: https://learning-management-system-7wsaizwxx.vercel.app
- **Backend**: https://et-617-assignment-1-production.up.railway.app/api

## 📱 User Interface Highlights

- Clean, modern design with intuitive navigation
- Responsive layout adapting to all screen sizes
- Dark theme optimized for extended use
- Interactive elements with smooth animations
- Accessible design following WCAG guidelines
- Fast loading times with optimized performance

## 📁 Project Structure

```
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── contexts/       # React context providers
│   │   ├── services/       # API and external services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Express API server
│   ├── controllers/        # Route controllers
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── data/              # JSON data storage
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learning-management-system
```

2. Backend Setup:
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

3. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment

### Backend Deployment (Railway)
1. Connect repository to Railway
2. Select backend folder as root directory
3. Railway auto-deploys on git push

### Frontend Deployment (Vercel)
1. Connect repository to Vercel
2. Set root directory to `frontend`
3. Configure environment variables
4. Vercel auto-deploys on git push

## 📊 Clickstream Data Structure

The application tracks comprehensive user interactions:

```json
{
  "sessionId": "unique_session_identifier",
  "userId": "authenticated_user_id",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "eventType": "course_view",
  "eventData": {
    "courseId": "course_identifier",
    "duration": 1200,
    "interactionDetails": "..."
  }
}
```

### Tracked Events
- `session_start` / `session_end`
- `page_view` / `navigation`
- `course_view` / `content_interaction`
- `quiz_start` / `quiz_answer` / `quiz_complete`
- `video_play` / `video_pause`
- `button_click` / `filter_applied`
