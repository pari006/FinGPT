<div align="center">

```
███████╗██╗███╗   ██╗ ██████╗ ██████╗ ████████╗
██╔════╝██║████╗  ██║██╔════╝ ██╔══██╗╚══██╔══╝
█████╗  ██║██╔██╗ ██║██║  ███╗██████╔╝   ██║
██╔══╝  ██║██║╚██╗██║██║   ██║██╔═══╝    ██║
██║     ██║██║ ╚████║╚██████╔╝██║        ██║
╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝        ╚═╝
```

**Your AI-powered finance co-pilot — chat, charts, and clarity in one dark-mode app.**

`React` · `Vite` · `Tailwind` · `Framer Motion` · `Recharts` · `Node` · `Express` · `Alpha Vantage`

</div>

---

> ⚠️ **Disclaimer** — FinGPT is built for education and demonstration only. It does not provide financial or investment advice.

---

## ▍ What is FinGPT?

FinGPT is a finance assistant web app that blends a conversational AI chatbot with live-ish market dashboards, sentiment visualization, and report summarization — wrapped in a dark, glassmorphic fintech interface.

Built to *look* like a funded startup's product, but sized right for a **portfolio piece, internship showcase, or deployment-ready demo.** Ships in two modes: a zero-backend frontend-only demo, or a full backend-connected production setup that keeps your API key off the client.

---

## ▍ Feature Checklist

```
[✓] AI finance chatbot — streaming-style responses, finance-focused explanations
[✓] Stock dashboard — Apple · Tesla · NVIDIA · Microsoft
[✓] Market summaries, investment explainers, term definitions
[✓] Sentiment analysis + visualization
[✓] Voice input, fully responsive layout
[✓] Financial report summarizer (paste or upload text-based reports)
[✓] Dark fintech UI — glassmorphism, charts, motion, live notifications
[✓] Frontend-only demo mode  ⇄  backend-connected production mode
```

---

## ▍ Stack

```yaml
frontend:
  - React
  - Vite
  - Tailwind CSS
  - Framer Motion
  - Recharts

backend:
  - Node.js
  - Express

data:
  - Alpha Vantage API
```

---

## ▍ File Map

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

---

## ▍ Environment Setup

```bash
cp .env.example .env
```

**◦ Frontend-only mode**

```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

**◦ Backend-connected mode**

```env
VITE_API_BASE_URL=http://localhost:5050
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
PORT=5050
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
CLIENT_ORIGINS=https://your-vercel-app.vercel.app,https://your-preview-url.vercel.app
```

*Nothing is hardcoded — FinGPT falls back to demo data automatically when live data isn't available.*

---

## ▍ Run It Locally

**Frontend**

```bash
npm install
npm run dev
```

→ `http://localhost:5173`

**Backend**

```bash
cd server
npm install
npm run dev
```

**Routes**

```
/dashboard   /chat   /insights   /reports
```

---

## ▍ Ship a Production Build

```bash
npm run build
npm run preview
```

Output lands in `dist/`.

---

## ▍ Deploy

<details>
<summary><strong>▸ Frontend → Vercel</strong></summary>

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
<summary><strong>▸ Backend → Render / Railway</strong></summary>

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

---

## ▍ Push to GitHub

```bash
git init
git add .
git commit -m "Initial FinGPT production app"
git remote add origin https://github.com/pari006/FinGPT.git
git branch -M main
git push -u origin main
```

---

## ▍ Screenshots

*(add after deployment)*

- [ ] Dashboard
- [ ] AI finance chatbot
- [ ] Market insights
- [ ] Report summarizer
- [ ] Mobile responsive layout

---

## ▍ Good to Know

- Alpha Vantage's free tier may return delayed data
- Demo fallback data keeps the UI presentable even when live data isn't
- Deploying the backend separately keeps your production API key off the client
- Frontend-only mode is still the fastest path to a quick demo

---

## ▍ Roadmap

```
→ Portfolio tracking
→ Advanced stock analytics
→ OCR-backed PDF parsing
→ Real-time websocket updates
→ Authentication + personalized watchlists
```

---

<div align="center">

**FinGPT** · built for the demo that has to land.

</div>
