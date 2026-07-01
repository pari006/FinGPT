<div align="center">

# 💹 FinGPT

### Your AI-powered finance co-pilot — chat, charts, and clarity in one dark-mode app.

<br/>

![React](https://img.shields.io/badge/React-18-0d9488?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-1e293b?style=for-the-badge&logo=vite&logoColor=facc15)
![Node](https://img.shields.io/badge/Node.js-Express-166534?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-0f172a?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8)

![Alpha Vantage](https://img.shields.io/badge/Data-Alpha_Vantage-065f46?style=flat-square)
![Mode](https://img.shields.io/badge/mode-demo_%7C_production-334155?style=flat-square)
![Status](https://img.shields.io/badge/status-deployment_ready-0ea5e9?style=flat-square)

<br/>

**[Overview](#-overview)** · **[Features](#-features)** · **[Stack](#-tech-stack)** · **[Quick Start](#-run-it-locally)** · **[Deploy](#-deployment)**

</div>

<br/>

> ⚠️ **Disclaimer** — FinGPT is built for education and demonstration only. It does not provide financial or investment advice.

<br/>

## 🧭 Overview

FinGPT is a finance assistant web app that blends a conversational AI chatbot with market dashboards, sentiment visualization, and report summarization — wrapped in a dark, glassmorphic fintech interface.

Built to *feel* like a funded startup's product, but sized right for a **portfolio piece, internship showcase, or deployment-ready demo.** It ships in two modes: a zero-backend frontend-only demo, or a full backend-connected production setup that keeps your API key off the client.

<br/>

## ⚡ Features

<table>
<tr>
<td width="50%" valign="top">

**💬 AI & Insights**
- Finance chatbot with streaming-style responses
- Market summaries & investment explainers
- Term definitions and glossary support
- Sentiment analysis with visualization

</td>
<td width="50%" valign="top">

**📊 Dashboard & Reports**
- Live stock dashboard — Apple, Tesla, NVIDIA, Microsoft
- Financial report summarizer (paste or upload)
- Voice input support
- Fully responsive across devices

</td>
</tr>
</table>

<div align="center">

| | |
|---|---|
| 🎨 **UI** | Dark fintech theme — glassmorphism, charts, motion, live notifications |
| 🔀 **Modes** | Frontend-only demo mode ⇄ backend-connected production mode |

</div>

<br/>

## 🛠️ Tech Stack

| Layer | Tools |
| :--- | :--- |
| **Frontend** | React · Vite · Tailwind CSS · Framer Motion · Recharts |
| **Backend** | Node.js · Express |
| **Market Data** | Alpha Vantage API |

<br/>

## 🗂️ File Map

```text
FinGPT/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   └── package.json
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
├── render.yaml
└── README.md
```

<br/>

## 🔑 Environment Setup

```bash
cp .env.example .env
```

**Frontend-only mode**

```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

**Backend-connected mode**

```env
VITE_API_BASE_URL=http://localhost:5050
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
PORT=5050
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
CLIENT_ORIGINS=https://your-vercel-app.vercel.app,https://your-preview-url.vercel.app
```

> Nothing is hardcoded — FinGPT falls back to demo data automatically when live data isn't available.

<br/>

## 🚀 Run It Locally

**1️⃣ Frontend**

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

**2️⃣ Backend** *(new terminal)*

```bash
cd server
npm install
npm run dev
```

**Routes**

| Path | Page |
| :--- | :--- |
| `/dashboard` | Stock dashboard |
| `/chat` | AI finance chatbot |
| `/insights` | Market insights |
| `/reports` | Report summarizer |

<br/>

## 📦 Production Build

```bash
npm run build
npm run preview
```

Output lands in `dist/`.

<br/>

## ☁️ Deployment

<details>
<summary><strong>Frontend → Vercel</strong></summary>

<br/>

1. Push the repo to GitHub
2. Import it into Vercel
3. Configure:

   | Setting | Value |
   |---|---|
   | Framework Preset | `Vite` |
   | Root Directory | `.` |
   | Install Command | `npm install` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

4. Add env vars — `VITE_ALPHA_VANTAGE_API_KEY` (frontend-only) or `VITE_API_BASE_URL` (backend-connected)
5. Deploy

Or via CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

> 🔓 **Heads up:** `VITE_ALPHA_VANTAGE_API_KEY` gets embedded into the browser bundle. For a safer setup, deploy the backend separately and point the frontend at it with `VITE_API_BASE_URL`.

</details>

<details>
<summary><strong>Backend → Render / Railway</strong></summary>

<br/>

Deploy the `server/` directory as a Node service.

| Setting | Value |
|---|---|
| Build command | `npm install` |
| Start command | `npm start` |
| `ALPHA_VANTAGE_API_KEY` | your key |
| `CLIENT_ORIGIN` | `https://your-vercel-app.vercel.app` |
| `CLIENT_ORIGINS` *(optional)* | comma-separated origin list |
| `PORT` | usually set by the platform |

Once deployed, point Vercel at it:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

💡 Render can also use the included `render.yaml` for a one-click setup straight from the repo root.

</details>

<br/>

## 📤 Push to GitHub

```bash
git init
git add .
git commit -m "Initial FinGPT production app"
git remote add origin https://github.com/pari006/FinGPT.git
git branch -M main
git push -u origin main
```

<br/>

## 🖼️ Screenshots

*(add after deployment)*

- [ ] Dashboard
- [ ] AI finance chatbot
- [ ] Market insights
- [ ] Report summarizer
- [ ] Mobile responsive layout

<br/>

## 💡 Good to Know

- Alpha Vantage's free tier may return delayed data
- Demo fallback data keeps the UI presentable even when live data isn't
- Deploying the backend separately keeps your production API key off the client
- Frontend-only mode is still the fastest path to a quick demo

<br/>

## 🗺️ Roadmap

- [ ] Portfolio tracking
- [ ] Advanced stock analytics
- [ ] OCR-backed PDF parsing
- [ ] Real-time websocket updates
- [ ] Authentication + personalized watchlists

<br/>

<div align="center">

---

**FinGPT** · built for the demo that has to land. 💹

</div>
