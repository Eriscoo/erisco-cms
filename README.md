# Erisco Blog · Frontend

React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js 22.12.0 |
| Package | Yarn 1.22 |
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Lint | Oxlint |
| Styling | Tailwind CSS 4 |
| i18n | Custom context (`useLocale()`) |
| Router | Custom hook (`useRouter()`) |
| API | Fetch wrapper + Bearer token |

## Folder Structure

```
erisco-fe/
├── public/
├── src/
│   ├── assets/
│   │   ├── css/index.css         ← Global styles + Tailwind + light theme
│   │   └── images/               ← Static images (vite logo, etc.)
│   │
│   ├── components/               ← Reusable UI components (per feature)
│   │   ├── header/               ← Unified Header (default / dashboard variant)
│   │   ├── sidebar/              ← Collapsible sidebar nav
│   │   ├── breadcrumb/           ← Breadcrumb nav
│   │   ├── table/                ← Generic table with sort, sticky header
│   │   ├── modal/                ← Dialog modal with overlay
│   │   ├── toast/                ← Toast notification (bottom-right)
│   │   ├── pagination/           ← Page nav with total count
│   │   ├── spinner/              ← Loading spinner
│   │   ├── language-switch/      ← EN / ID toggle (compact & full mode)
│   │   └── theme-switch/         ← Dark / Light toggle
│   │
│   ├── constants/
│   │   └── env.ts                ← VITE_API_URL
│   │
│   ├── locales/
│   │   ├── en.ts                 ← English translations
│   │   ├── id.ts                 ← Indonesian translations
│   │   └── index.tsx             ← I18nProvider + useLocale() hook
│   │
│   ├── modules/                  ← Feature modules (api + hooks per feature)
│   │   ├── auth/api.ts           ← login(), register()
│   │   ├── auth/token.ts         ← getToken, setToken, removeToken, isLoggedIn
│   │   ├── auth/hooks/useAuth.ts ← useAuth() hook
│   │   ├── tags/api.ts           ← tags CRUD
│   │   ├── categories/api.ts     ← categories CRUD
│   │   └── profile/api.ts        ← profile GET/PUT
│   │
│   ├── pages/
│   │   ├── home/index.tsx        ← Blog homepage
│   │   ├── login/index.tsx       ← Login form (email, password, remember me)
│   │   ├── dashboard/index.tsx   ← Dashboard greeting
│   │   ├── settings/index.tsx    ← Tags & categories management (tabs, table, CRUD)
│   │   ├── profile/index.tsx     ← User profile (edit bio, website, avatar upload)
│   │   └── not-found/index.tsx   ← 404 page
│   │
│   ├── utils/
│   │   ├── api.ts                ← HTTP client (fetch wrapper + token injection)
│   │   └── router.ts             ← useRouter() — path-based SPA router
│   │
│   ├── App.tsx                   ← Route switch (/ | /login | /dashboard | /settings | /profile)
│   └── main.tsx                  ← Entrypoint + I18nProvider
│
├── tests/
├── .env / .env.example
├── .nvmrc / .node-version
├── package.json                  ← engines: node 22.12.0
└── yarn.lock
```

## Commands

```bash
yarn dev       # dev server → http://localhost:5173
yarn build     # tsc + vite build
yarn lint      # oxlint
yarn preview   # preview production build
```

## How to Run

### 1. Start Database
```bash
docker compose up -d
```

### 2. Start Backend
```bash
cd erisco-backend
go run ./cmd/server
```

### 3. Start Frontend
```bash
cd erisco-fe
yarn dev
```

### 4. Login
`http://localhost:5173` — `{USERNAME}` / `{PASSWORD}`

## Environment

| Variable | Default |
|---|---|
| `VITE_API_URL` | `http://localhost:8080` |

## i18n Convention

**Every new feature must add keys in both language files:**

1. `src/locales/en.ts` — English
2. `src/locales/id.ts` — Indonesian (copy the same key)

> Keys must always be in sync, only values differ.
