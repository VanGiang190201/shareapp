# Affiliate Link Processing Tool

Production-ready React app for collecting Shopee links, sending them to Google Apps Script, and showing per-user processing status.

## Features

- URL-based uid identification (`?uid=abc123`) with localStorage fallback.
- Submit page (`/submit`) with Shopee link validation and status feedback.
- History page (`/history`) with 5-second auto refresh.
- WAIT / DONE status badges and clickable affiliate links.
- Copy affiliate link action and open original product link action.
- Lightweight architecture with `fetch` and Google Sheets backend via Apps Script.

## Stack

- React + TypeScript + Vite
- Native `fetch` API
- Google Apps Script REST endpoints
- Google Sheets storage only

## Configuration

Create `.env` from `.env.example` and update values:

```bash
VITE_API_BASE_URL=https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT/exec
VITE_API_KEY=replace_with_your_api_key
```

## API Contract

Expected endpoints relative to `VITE_API_BASE_URL`:

- `POST /submit`
  - body: `{ uid, link, key }`
- `GET /list?uid=xxx&key=xxx`
  - response: `{ data: [{ link, affiliate, status, time }] }`

Only per-uid records should be returned by backend logic.

## Run

```bash
# install dependencies
npm install

# start local development
npm run dev

# production build
npm run build

# preview build
npm run preview
```

## Project Structure

- `src/config.ts`: environment config and polling constants
- `src/hooks/useUid.ts`: uid query/localStorage management
- `src/services/api.ts`: submit + history API integration
- `src/pages/SubmitPage.tsx`: link submission flow
- `src/pages/HistoryPage.tsx`: history table with polling
- `src/components/*`: navbar, badge, skeleton, toast
