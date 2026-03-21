# Vyasa Frontend

An AI-powered educational platform with an interactive AI tutor featuring eye-tracking attention monitoring.

## Tech Stack

- **Framework**: React 19 + Vite 7
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS v4 + CSS Variables
- **Animations**: Motion (Framer Motion)
- **3D Graphics**: Three.js + React Three Fiber
- **State Management**: Zustand
- **API Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin

## Project Structure

```
vyasa-frontend/
├── src/
│   ├── components/           # Shared UI components
│   │   ├── ui/              # Shadcn-style UI primitives
│   │   ├── Attention*.tsx   # Eye tracking components
│   │   └── AvatarVisualizer.tsx
│   ├── features/            # Feature modules
│   │   ├── auth/            # Authentication (login, OTP, reset)
│   │   ├── app/             # Main app features
│   │   │   ├── admin/       # Admin dashboard, settings
│   │   │   ├── teacher/     # Teacher tools, content generation
│   │   │   └── student/     # Student views, AI tutor
│   │   │       ├── AiTutor.tsx
│   │   │       └── tutor/    # Tutor components
│   │   │           ├── TutorAvatar.tsx
│   │   │           └── TutorChat.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useGazeTrack.ts  # Eye tracking logic
│   │   ├── useLipSync.ts    # Lip sync for avatar
│   │   └── *.ts
│   ├── lib/                 # Utilities
│   │   ├── api-client.ts    # Axios instance with interceptors
│   │   ├── animation.ts      # Animation utilities
│   │   └── utils.ts         # Helper functions
│   ├── routes/              # TanStack Router routes
│   │   ├── _app/            # Authenticated routes
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   └── teacher/
│   │   ├── _auth/           # Public auth routes
│   │   └── _root.tsx        # Root layout
│   ├── stores/              # Zustand stores
│   │   ├── useAuthStore.ts
│   │   └── useUIStore.ts
│   ├── App.tsx
│   └── main.tsx
├── server/                  # Local API server for AI Tutor
│   └── index.js             # Express server (chat, narrate, TTS)
├── .env.local               # Local environment variables
├── .env.example             # Example environment file
├── vite.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# .env

# AI Provider API Keys
GROK_API_KEY=your_groq_api_key_here
SCHOOLME_API_KEY=your_deepgram_api_key_here

# API Server Port (for local AI tutor)
API_PORT=3001
```

**Required API Keys:**

| Key | Provider | Purpose |
|-----|----------|---------|
| `GROK_API_KEY` | Groq | AI chat responses |
| `SCHOOLME_API_KEY` | Deepgram | Text-to-speech |

**Optional**: For authentication and other features, add to `.env.local`:

```bash
VITE_API_BASE_URL=https://your-backend-api.com
```

### Running the Application

**Frontend only (without AI tutor):**
```bash
pnpm dev
```

**Frontend + AI Tutor API Server:**

Terminal 1 - Start the API server:
```bash
pnpm dev:server
```

Terminal 2 - Start the frontend:
```bash
pnpm dev
```

Or run both together:
```bash
pnpm dev:all
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## Features

### AI Tutor

The AI Tutor features an interactive 3D avatar with:

- **Groq-powered chat**: Conversational AI responses
- **Text-to-speech**: Natural voice output via Deepgram
- **Lip sync**: Synchronized mouth animations
- **Eye tracking**: Attention monitoring with camera
  - Tier 1 (soft): Toast + screen pulse when distracted
  - Tier 2 (hard): Blur + modal intervention
- **Minimizable avatar**: Expand/collapse at will

**Chat Commands:**
- `/clear` - Clear chat history
- `/save` - Download chat as text file
- `/top` - Scroll to top
- `/bottom` - Scroll to bottom

### User Roles

- **Admin**: School management, user management, billing
- **Teacher**: Content creation, quiz generation, library management
- **Student**: Dashboard, study materials, AI tutor, quiz practice

## Development

### Design System

The project uses CSS custom properties for theming. Key tokens in `src/index.css`:

| Token | Purpose |
|-------|---------|
| `--bg-deep` | Base background |
| `--bg-surface` | Cards, panels |
| `--bg-elevated` | Hover states |
| `--border-*` | Border colors |
| `--text-*` | Text colors |
| `--orange` | Brand accent |
| `--font-display` | Caveat (display) |
| `--font-mono` | Courier Prime (mono) |

**Fonts**: Caveat (display), Lora (body), Courier Prime (mono)

### API Endpoints

The main API is configured via `VITE_API_BASE_URL`. Key endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat` | AI tutor chat (via local server) |
| POST | `/api/narrate` | Convert text to speech script |
| POST | `/api/tts` | Text-to-speech audio generation |
| POST | `/auth/login` | User authentication |
| GET | `/auth/me` | Current user info |

### Claude Code Integration

Project-specific rules and references are in `.claude/skills/`:

- `design-schema.md` - Types and interfaces
- `file-structure.md` - Project file tree
- `reference.md` - API endpoint documentation
- `rules.md` - Development guidelines

## Troubleshooting

### Camera not working with eye tracking

1. Ensure camera permissions are granted
2. Click "Start Tracking" in the attention panel
3. To stop: Click "Stop & Save Session" - this should release the camera

### AI chat not responding

1. Ensure the local API server is running (`pnpm dev:server`)
2. Check that `GROK_API_KEY` is set in `.env`
3. Check browser console for errors

### Build errors

Always run `pnpm build` before testing to catch TypeScript errors:

```bash
pnpm build
```

## License

Private - All rights reserved
