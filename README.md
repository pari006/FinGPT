# FinGPT

FinGPT is a modern AI-powered finance assistant that combines conversational guidance, stock dashboards, market insights, sentiment visualization, and financial report summarization in a polished web app.

It is built for portfolio projects, internship showcases, and deployment-ready demos, with a Vite frontend and an Express backend that can be hosted separately for safer API key handling.

> Disclaimer: FinGPT is for educational and demonstration purposes only and does not provide financial or investment advice.

## Features

- AI finance chatbot with streaming-style responses and finance-focused explanations
- Stock dashboard for Apple, Tesla, NVIDIA, and Microsoft
- Market summaries, investment explanations, term definitions, and sentiment analysis
- Voice input support and responsive layouts
- Financial report summarizer for pasted or uploaded text-based reports
- Dark fintech UI with glassmorphism, charts, motion, and notifications
- Frontend-only demo mode or backend-connected production mode

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts

### Backend
- Node.js
- Express

### APIs and Services
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
|-- render.yaml
`-- README.md
```

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

### Frontend-only mode

```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

### Backend-connected mode

```env
VITE_API_BASE_URL=http://localhost:5050
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
PORT=5050
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
CLIENT_ORIGINS=https://your-vercel-app.vercel.app,https://your-preview-url.vercel.app
```

No API keys are hardcoded. FinGPT falls back to demo data when live data is unavailable.

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

Frontend default URL:

```text
http://localhost:5173
```

Application routes:

```text
/dashboard
/chat
/insights
/reports
```

## Production Build

```bash
npm run build
npm run preview
```

Production files are generated in `dist/`.

## Deploy Frontend on Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Use these settings:
   - Framework Preset: `Vite`
   - Root Directory: `.`
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables:
   - `VITE_ALPHA_VANTAGE_API_KEY` for frontend-only mode
   - `VITE_API_BASE_URL` for backend-connected mode
5. Deploy.

Vercel CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

Production note:

- `VITE_ALPHA_VANTAGE_API_KEY` is embedded into the browser bundle.
- For a safer production setup, deploy the backend separately and set `VITE_API_BASE_URL` in Vercel.

## Deploy Backend on Render or Railway

Deploy the `server/` directory as a Node service.

Backend settings:

- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `ALPHA_VANTAGE_API_KEY`
  - `CLIENT_ORIGIN=https://your-vercel-app.vercel.app`
  - Optional: `CLIENT_ORIGINS=https://your-vercel-app.vercel.app,https://your-preview-url.vercel.app`
  - `PORT` is usually provided by the platform

After backend deployment, set this in Vercel:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

Render can also use the included `render.yaml` for one-click setup from the repo root.

## GitHub Setup

```bash
git init
git add .
git commit -m "Initial FinGPT production app"
git remote add origin https://github.com/pari006/FinGPT.git
git branch -M main
git push -u origin main
```

## Screenshots

Add screenshots after deployment:

- Dashboard
- AI finance chatbot
- Market insights
- Report summarizer
- Mobile responsive layout

## Notes

- Alpha Vantage free-tier data may be delayed.
- Demo fallback data keeps the UI usable during presentations.
- Backend deployment keeps the production API key off the client.
- Frontend-only mode remains useful for quick demos.

## Future Enhancements

- Portfolio tracking
- Advanced stock analytics
- OCR-backed PDF parsing
- Real-time websocket updates
- Authentication and personalized watchlists
