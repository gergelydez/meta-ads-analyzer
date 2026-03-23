# AdWinner PRO — Full AI Meta Ads Engine

Analizează clipuri video (vizual + audio + captions), detectează publicul țintă și generează copy Meta Ads optimizat pentru CPA minim.

## Stack
- **Next.js 14** (App Router)
- **Anthropic Claude** (claude-sonnet-4) — analiză vizuală + copy generation
- **TypeScript + Tailwind CSS**

## Setup Local

### 1. Instalează dependențele
```bash
npm install
```

### 2. Configurează API Key
```bash
cp .env.local.example .env.local
```
Editează `.env.local` și adaugă cheia ta Anthropic:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```
Obții cheia de la: https://console.anthropic.com

### 3. Pornește aplicația
```bash
npm run dev
```
Deschide http://localhost:3000

## Deploy pe Vercel

### Varianta 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Varianta 2 — GitHub + Vercel Dashboard
1. Push codul pe GitHub
2. Importă repo-ul pe vercel.com
3. Adaugă variabila de mediu `ANTHROPIC_API_KEY` în Settings → Environment Variables
4. Deploy!

## Cum funcționează

1. **URL Produs** → API route `/api/fetch-product` citește pagina cu web_search (server-side, fără CORS)
2. **Upload Clipuri** → Frame-urile sunt extrase client-side (canvas API)
3. **Analiză** → API route `/api/analyze` trimite frames + transcripts + context la Claude
4. **Rezultate** → Ranking CPA + 5 variante copy complet

## Structura proiectului

```
adwinner/
├── app/
│   ├── api/
│   │   ├── fetch-product/route.ts   ← URL scraping server-side
│   │   └── analyze/route.ts         ← Main AI analysis
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     ← Main UI
├── components/
│   ├── StepTrack.tsx
│   ├── VideoDropzone.tsx
│   ├── LoadingView.tsx
│   └── ResultsView.tsx
├── lib/
│   ├── types.ts
│   └── extractFrames.ts
├── .env.local.example
└── package.json
```
