# 🚀 FinGPT — AI-Powered Finance Assistant

FinGPT is a modern AI-powered fintech web application designed to combine conversational AI with real-time financial insights in a sleek and professional dashboard experience.

Built for portfolio projects, internships, and deployment-ready demonstrations, FinGPT integrates intelligent finance assistance, market analytics, stock insights, sentiment visualization, and financial report summarization into a single responsive platform.

> ⚠️ Disclaimer: FinGPT is developed for educational and demonstration purposes only and does not provide financial or investment advice.

---

# ✨ Key Features

## 🤖 AI Finance Assistant
- Conversational finance chatbot
- Streaming AI responses
- Finance-focused explanations
- Conversation history support
- Real-time stock quote lookup

## 📈 Smart Stock Dashboard
Track major companies including:
- Apple
- Tesla
- NVIDIA
- Microsoft

Dashboard includes:
- Live/mock stock pricing
- Percentage movement indicators
- AI sentiment bars
- Mini analytical charts
- Market trend visualization

## 🧠 AI Market Insights
Generate:
- Market summaries
- Beginner-friendly investment explanations
- Financial term definitions
- Sentiment analysis
- Stock outlook insights

## 🎤 Voice & Accessibility
- Voice input support
- Responsive layouts
- Smooth animations
- Interactive notifications

## 📄 Financial Report Summarizer
Upload or paste financial reports to generate:
- Investor-friendly summaries
- Key financial highlights
- Risk analysis
- Simplified explanations

## 🎨 Premium UI/UX
- Dark fintech theme
- Glassmorphism design
- Framer Motion animations
- Fully responsive interface
- Professional dashboard layouts

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts

## Backend
- Node.js
- Express.js

## APIs & Services
- Alpha Vantage API

---

# 📂 Project Structure

```text
FinGPT/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   └── package.json
│
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── README.md

# ⚙️ Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

## Frontend Mode

```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

## Backend Mode

```env
VITE_API_BASE_URL=http://localhost:5050
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
PORT=5050
```

> 🔐 No API keys are hardcoded.  
> FinGPT automatically switches to educational demo mode if API keys are unavailable.

---

# 💻 Local Development Setup

## 1️⃣ Install Frontend Dependencies

```bash
npm install
```

## 2️⃣ Start Frontend Server

```bash
npm run dev
```

## 3️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

## 4️⃣ Run Backend Server

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# 🌐 Application Routes

```text
/dashboard   → Stock Dashboard
/chat        → AI Finance Chatbot
/insights    → Market Insights
/reports     → Financial Report Summarizer
```

---

# 🏗️ Production Build

Generate production build:

```bash
npm run build
npm run preview
```

Production files are generated inside:

```text
dist/
```

---

# 🚀 Deploying FinGPT

## Deploy Frontend on Vercel

### Steps

1. Push project to GitHub
2. Import repository into Vercel
3. Configure build settings

---

## Vercel Configuration

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | npm run build |
| Output Directory | dist |

---

## Required Environment Variables

```env
VITE_ALPHA_VANTAGE_API_KEY
```

Optional:

```env
VITE_API_BASE_URL
```

---

## Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

---

# 🖥️ Deploy Backend (Render / Railway)

Deploy the `server/` directory as a Node.js service.

## Environment Variables

```env
ALPHA_VANTAGE_API_KEY
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
PORT=5050
```

After deployment, update frontend environment:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

# 🔗 GitHub Setup

## Initialize Repository

```bash
git init
git add .
git commit -m "Initial FinGPT production app"
```

## Connect GitHub Repository

```bash
git remote add origin https://github.com/pari006/fingpt.git
git branch -M main
git push -u origin main
```

---

# 📸 Screenshots

Add screenshots after deployment:

- Dashboard View
- AI Finance Chatbot
- Market Insights
- Report Summarizer
- Mobile Responsive Layout

---

# 📌 Important Notes

- Alpha Vantage free-tier data may have delayed market updates.
- Demo fallback data ensures uninterrupted UI experience.
- Backend deployment protects API keys securely in production.
- Frontend-only mode is supported for quick Vercel demos.
- Optimized for portfolio showcasing and internship demonstrations.

---

# 📚 Learning Outcomes

Through FinGPT, the project explores:

- AI-powered financial assistants
- API integration workflows
- Conversational finance systems
- Responsive fintech UI design
- Financial data visualization
- Full-stack deployment pipelines

---

# 👨‍💻 Author

Developed by Pari as part of hands-on learning in Generative AI, full-stack development, and fintech application design.

---

# ⭐ Future Enhancements

- Portfolio tracking
- Advanced stock analytics
- AI investment recommendation engine
- PDF parsing with OCR
- Real-time websocket updates
- Multi-language finance assistant
- Authentication and personalized watchlists
