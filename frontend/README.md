# PricePilot AI Frontend

Modern React + Vite frontend for PricePilot AI, an intelligent dynamic-pricing and sales-recovery platform for e-commerce teams.

## UI highlights

- Responsive company-grade dashboard shell
- Animated landing page with 3D product-intelligence preview
- Modern sign-in and registration experience
- Dark and light workspace themes
- Responsive desktop sidebar and mobile navigation drawer
- Command palette (`Ctrl/Cmd + K`)
- Micro-interactions, route transitions, loading animations, and polished empty/loading states
- Code-split business pages for faster initial loading
- Vercel SPA routing configuration

## Existing API integration

All existing frontend API paths and backend integrations are preserved. Configure only the backend base URL:

```bash
cp .env.example .env
```

```env
VITE_API_BASE=http://localhost:9090/api
```

For Vercel, add `VITE_API_BASE` under **Project Settings → Environment Variables** using your deployed backend URL.

## Development

```bash
npm install
npm run dev
```

The Vite development server runs at `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Vercel deployment

1. Push this frontend folder to GitHub.
2. Import the repository in Vercel.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Add the `VITE_API_BASE` environment variable.

`vercel.json` is included so React Router URLs work after refresh.

## Technology

React 19, Vite, Tailwind CSS, Ant Design, Recharts, Axios, and React Router.
