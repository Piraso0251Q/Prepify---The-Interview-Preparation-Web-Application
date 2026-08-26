# Prepify - Technical Interview Preparation Platform 🚀

Prepify is an AI-powered, full-stack web application designed to help developers prepare for technical interviews. It generates dynamic, role-specific mock interviews, tracks user progress, and provides a massive, ever-growing database of technical questions.

## ✨ Key Features

* **🤖 AI-Powered Mock Interviews:** Uses Groq's high-speed AI to dynamically generate 100% unique, highly technical interview questions every time you start a test.
* **⏱️ Realistic Testing Environment:** Timed 10-minute mock interviews with a distraction-free UI to simulate real-world pressure.
* **📚 Question Bank & Bookmarks:** Browse a curated database of interview questions. Bookmark difficult questions to review later.
* **📈 History & Progress Tracking:** Automatically saves your past interview sessions, answers, and completion times so you can measure your improvement.
* **🎯 Role-Specific Tracks:** Tailored question sets for Frontend, Backend, Full-Stack, SDE-1, and QA roles.

## 🛠️ Tech Stack

* **Frontend:** React, Vite, React Router
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **AI Integration:** Groq SDK (LLM generation)

---

## 💻 Getting Started (Local Development)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* [MongoDB](https://www.mongodb.com/) installed and running locally
* A free [Groq API Key](https://console.groq.com/keys)

### 1. Clone the Repository
```bash
git clone https://github.com/Piraso0251Q/Prepify---The-Interview-Preparation-Web-Application.git
cd Prepify---The-Interview-Preparation-Web-Application
```

### 2. Backend Setup
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add your configuration:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/prepify
GROQ_API_KEY=your_groq_api_key_here
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a **second** terminal window and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Open the App
Hold `Ctrl` and click the `http://localhost:5173` link in your frontend terminal to open the application in your browser!

---

## 👥 Team
Built as a collaborative college project by a team of 3 developers, handling UI/UX, Frontend architecture, and Backend/AI integration.
