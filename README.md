# Learning Website with Clickstream Tracking

A MERN stack learning platform that tracks user interactions and provides interactive content including text, videos, and quizzes.

## 🌐 Live Demo
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway

## 🚀 Features

- User registration and authentication
- Interactive learning content (text, videos, quizzes)
- Real-time clickstream tracking
- User dashboard and progress tracking
- Responsive design with Shadcn UI

## 🛠️ Tech Stack

- **Frontend**: React.js with Vite, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Deployment**: Vercel

## 📁 Project Structure

```
├── frontend/          # React application
├── backend/           # Express API server
├── docs/             # Documentation
└── README.md         # Project documentation
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ET617-Assignment1
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

This project is deployed on Vercel: [Live Demo](#)

## 📊 Clickstream Data

The application tracks various user interactions including:
- Page views and navigation
- Video play/pause/seek actions
- Quiz attempts and submissions
- Click events and user engagement
- Session duration and patterns

## 🤝 Contributing

This is a course assignment project for ET617.

## 📝 License

This project is for educational purposes only.
