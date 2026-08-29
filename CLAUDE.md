# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Vyasa** (internal name: Edactly) — an AI-powered educational platform with an interactive 3D avatar AI tutor featuring eye-tracking attention monitoring. Built for three user roles: admin, teacher, and student.

## Commands

```bash
pnpm dev           # Start Vite dev server (frontend only, port 5173)
pnpm dev:server    # Start local Express API server for AI Tutor (port 3001)
pnpm dev:all       # Start both frontend and local server together
pnpm build         # TypeScript check + Vite production build
pnpm preview       # Preview production build locally
```

**Package manager:** pnpm@10.30.3 (specified in package.json). Always use `pnpm`.

**Running with AI Tutor features:** Requires two terminals — `pnpm dev:server` for the Express backend and `pnpm dev` for Vite. The frontend proxies AI chat/TTS/narration calls to `http://localhost:3001`.

**Build before committing:** `pnpm build` catches TypeScript errors that the dev server may not surface.

## Architecture

### Framework & Routing
- **React 19** + **Vite 7** with **TanStack Router v1** (file-based, auto code-splitting enabled via `@tanstack/router-plugin/vite`)
- Two top-level layout routes: `_app` (authenticated, sidebar + navbar) and `_auth` (public, animated auth cards with particle background)
- Role-based routing under `_app/` — `admin/`, `teacher/`, `student/` each have their own route trees
- Error pages: `404.tsx`, `500.tsx`

### State Management
- **Zustand** stores in `src/stores/`: `useAuthStore` (session/auth) and `useUIStore` (toasts, modals)
- Auth store intentionally has **no persist middleware** — access tokens stay in JS memory only
- `useAuthStore` exposes `getSchoolContext()` for multi-tenant school-aware routing/logic

### API Client
- Single Axios instance in `src/lib/api-client.ts` with:
  - Request interceptor: attaches `Bearer` token from `useAuthStore`
  - Response interceptor: unwraps `{ data: {...} }` envelope from backend
  - Auto refresh flow on 401: queues concurrent requests, retries with new token, falls back to `/login`
  - Defaults to production API (`https://edactly-api.zoodleme.in`), overridable via `VITE_API_BASE_URL`
- Local AI Tutor server (`server/index.js`) runs separately — endpoints: `/api/chat`, `/api/narrate`, `/api/tts`

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Custom CSS design system** in `src/index.css` — extensive dark-sketchbook theme using CSS custom properties (`--bg-deep`, `--bg-surface`, `--orange`, etc.)
- Light mode toggled via `data-theme="light"` or `.light` class on `:root` (using `next-themes`)
- Four font schemes selectable via `data-font` attribute: default (Edactly: Caveat/Lora/Courier Prime), scholar, clean, modern
- Sketch-style components: `.sketch-btn`, `.sketch-card` with clip-path borders, slight rotations, orange accent glows
- Paper grain overlay via inline SVG noise filter on `body::after`
- UI primitives (shadcn-style) in `src/components/ui/`

### Feature Organization
- `src/features/` is role-organized: `auth/`, `app/admin/`, `app/teacher/`, `app/student/`, `landing/`
- Each role directory has domain components (e.g., `StudentDashboard.tsx`, `TeacherDashboard.tsx`) plus role-specific sidebars and settings
- Student tutor sub-feature: `tutor/TutorAvatar.tsx` (3D avatar via Three.js/R3F), `tutor/TutorChat.tsx`

### 3D & Media
- **Three.js** + **@react-three/fiber** + **@react-three/drei` for the AI Tutor 3D avatar
- **Lenis** for smooth scrolling (initialized in root route via `useLenis` hook)
- **Motion** (Framer Motion) for page animations and transitions

### Forms & Validation
- **React Hook Form** + **Zod** (v4) for form handling and schema validation
- Student profile schemas in `src/features/app/student/schemas/`

### Key Conventions
- Import alias: `@` → `./src`
- Components use `clsx` + `tailwind-merge` (via `cn()` helper) for conditional class merging
- Route components use `createFileRoute` pattern; layout wrappers in `route.tsx` files
- API endpoints referenced in `src/features/app/admin/*.api.ts` files (e.g., `classes.api.ts`, `teachers.api.ts`)

### Local AI Tutor Server (`server/index.js`)
- Express server providing chat (Groq), narration, and TTS (Deepgram)
- Requires `GROK_API_KEY` and `EDACTLY_API_KEY` in `.env` at project root
- The frontend AI Tutor components call these endpoints directly when `dev:server` is running

## Environment Variables

Frontend (`.env.local`):
- `VITE_API_BASE_URL` — backend API origin (defaults to production)

Server (`.env` at root):
- `GROK_API_KEY` — Groq API for AI chat
- `EDACTLY_API_KEY` — Deepgram API for TTS
- `API_PORT` — local server port (default 3001)
