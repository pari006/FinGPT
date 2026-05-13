# FinGPT

FinGPT is a production-ready finance assistant web application built for portfolio, internship, and deployment use. It combines a premium fintech dashboard, an Alpha Vantage-backed conversational finance assistant, market insights, stock sentiment cards, voice input, and a financial report summarizer.

> Educational use only. FinGPT does not provide personalized financial advice.

## Features

- Finance chatbot with streaming responses, conversation history, and Alpha Vantage quote lookup
- Alpha Vantage-powered modular market-data service layer with safe demo fallback
- Stock dashboard for Apple, Tesla, NVIDIA, and Microsoft
- Mock prices, percentage movement, trend indicators, mini charts, and AI sentiment bars
- AI market summaries, investment explanations, term definitions, and sentiment analysis
- Voice input for supported browsers
- Financial report summarizer for pasted report text and text-based uploads
- Dark fintech theme with glassmorphism, animations, responsive layouts, and toast notifications
- Vercel-compatible frontend and Render/Railway-compatible Express backend

## Screenshots

Add screenshots after deployment:

- Dashboard
- AI finance chatbot
- Market insights
- Report summarizer

## Tech Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Node.js
- Express
- Alpha Vantage API

## Project Structure

```text
FinGPT/
|-- src/
|   |-- components/
|   |-- data/
|   |-- hooks/
|   |-- pages/
|   |-- services/
|   |-- App.jsx
|   |-- main.jsx
|   `-- styles.css
|-- server/
|   |-- src/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- index.js
|   `-- package.json
|-- .env.example
|-- package.json
|-- tailwind.config.js
|-- vite.config.js
|-- vercel.json
`-- README.md
```

## Environment Variables

Copy the example file and add your Alpha Vantage API key.

```bash
cp .env.example .env
```

Frontend-only mode:

```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

Backend mode:

```env
VITE_API_BASE_URL=http://localhost:5050
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
PORT=5050
```

No API key is hardcoded. If no key is present, FinGPT uses educational demo responses so the UI remains usable.

## Local Development

Install frontend dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Install backend dependencies:

```bash
cd server
npm install
```

Run the backend:

```bash
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

Main app routes:

```text
http://localhost:5173/dashboard
http://localhost:5173/chat
http://localhost:5173/insights
http://localhost:5173/reports
```

## Production Build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Deploy Frontend To Vercel

1. Push this repository to GitHub.
2. In Vercel, import the GitHub repository.
3. Use these settings:
   - Framework Preset: Vite
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add environment variables:
   - `VITE_ALPHA_VANTAGE_API_KEY`
   - Optional: `VITE_API_BASE_URL` if using the deployed backend
5. Deploy.

Production note:

- `VITE_ALPHA_VANTAGE_API_KEY` is embedded into the client bundle and is visible in the browser.
- For a safer production setup, deploy the Express backend separately and set only `VITE_API_BASE_URL` in Vercel.

Vercel CLI commands:

```bash
npm i -g vercel
vercel
vercel --prod
```

If Vercel asks for project settings, use:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

## Deploy Backend To Render Or Railway

Deploy the `server/` directory as a Node service.

Backend settings:

- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `ALPHA_VANTAGE_API_KEY`
  - `CLIENT_ORIGIN=https://your-vercel-app.vercel.app`
  - `PORT` is usually provided by the platform

After backend deployment, set this variable in Vercel:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## GitHub Setup

Initialize and commit:

```bash
git init
git add .
git commit -m "Initial FinGPT production app"
```

Create a GitHub repository, then link and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/fingpt.git
git branch -M main
git push -u origin main
```

## Notes

- The dashboard uses Alpha Vantage quote and market-mover endpoints when an API key is configured.
- Alpha Vantage free quote data can be delayed or end-of-day depending on API entitlement.
- Demo fallback data remains available so the UI does not break during presentations.
- Alpha Vantage quote data powers the stock dashboard and finance assistant.
- The backend API supports server-side key protection for production deployments.
- The frontend can also run directly against Alpha Vantage for simple Vercel demos.
