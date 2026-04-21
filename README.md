# shareapp

Production-ready React app for collecting Shopee links, sending them to Google Apps Script, and showing per-user processing status.

## Features

- URL-based uid identification (`?uid=abc123`) with localStorage fallback.
- Submit page (`/submit`) with Shopee link validation and status feedback.
- History page (`/history`) with periodic auto refresh.
- Detail page with proof-image upload and status tracking.
- Redux store for selected record flow (reduce payload in URL params).
- Shopee-style orange UI optimized for user-friendly actions.

## Stack

- React + TypeScript + Vite
- Redux Toolkit + React Redux
- Native `fetch` API
- Google Apps Script REST endpoints
- Google Sheets storage only

## Configuration

Create `.env` from `.env.example` and update values:

```bash
VITE_API_BASE_URL=https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT/exec
VITE_API_KEY=replace_with_your_api_key
VITE_ZALO_URL=https://zalo.me/your-account
```

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
```
