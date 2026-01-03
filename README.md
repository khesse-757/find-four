# Find Four

Terminal-themed Connect Four game with online multiplayer and AI opponents.

**Live Demo: [findfour.kahdev.me](https://findfour.kahdev.me)**

```
┌─┬─┬─┬─┬─┬─┬─┐
│ │ │ │ │ │ │ │
├─┼─┼─┼─┼─┼─┼─┤
│ │ │●│○│ │ │ │
├─┼─┼─┼─┼─┼─┼─┤
│ │○│●│○│ │ │ │
├─┼─┼─┼─┼─┼─┼─┤
│●│○│●│●│○│ │ │
├─┼─┼─┼─┼─┼─┼─┤
│○│●│○│○│●│●│ │
├─┼─┼─┼─┼─┼─┼─┤
│●│○│●│●│○│○│●│
└─┴─┴─┴─┴─┴─┴─┘
```

## Table of Contents

1. [Features](#features)
2. [How to Play](#how-to-play)
3. [Quick Start](#quick-start)
4. [Development](#development)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Deployment](#deployment)
8. [Version Management](#version-management)
9. [License](#license)

## Features

- **VS Computer**: Three difficulty levels with AI powered by minimax algorithm
  - Easy: Depth 2, occasional random moves
  - Medium: Depth 4, balanced strategy
  - Hard: Depth 6, optimal play
- **VS Local**: Hot seat multiplayer on the same device
- **VS Online**: Real-time WebRTC multiplayer via PeerJS
  - Host creates room with shareable code
  - Guest joins using room code
  - Peer-to-peer connection, no server required
- **Terminal Aesthetic**: 1980s amber CRT monitor styling
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Keyboard navigation support
- **Auto-Reconnect**: Graceful handling of connection issues

## How to Play

Find Four is a strategy game where two players compete to connect four pieces in a row.

### Game Rules

1. Players take turns dropping pieces into a 7×6 grid
2. Pieces fall to the lowest available position in each column
3. First player to get four pieces in a row wins (horizontal, vertical, or diagonal)
4. If the board fills without a winner, the game is a draw

### Theme: Hacker vs Defender

- **Hacker** (Player 1): Attacks the system (amber pieces ●)
- **Defender** (Player 2): Patches vulnerabilities (cyan pieces ○)

The terminal interface reinforces the cybersecurity theme with appropriate styling and terminology.

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/khesse-757/find-four.git
cd find-four

# Build and run with Docker
docker build -t find-four .
docker run -p 5173:5173 find-four
```

The game will be available at `http://localhost:5173`

### Option 2: Node.js

```bash
# Clone the repository
git clone https://github.com/khesse-757/find-four.git
cd find-four

# Install dependencies
npm install

# Start development server
npm run dev
```

**Requirements**: Node.js 20+ and npm

## Development

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/khesse-757/find-four.git
cd find-four

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test -- --run` | Run tests once |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

### Development Environment

For a consistent development experience, use the provided dev container:

```bash
# VS Code with Dev Containers extension
code .
# Click "Reopen in Container" when prompted
```

Or use GitHub Codespaces for instant cloud development.

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI framework | ^19.0.0 |
| TypeScript | Language, strict mode | ^5.7.0 |
| Vite | Build tool and dev server | ^6.0.0 |
| Zustand | State management | ^5.0.0 |
| Tailwind CSS | Styling framework | ^4.0.0 |
| PeerJS | WebRTC multiplayer | ^1.5.0 |
| Vitest | Unit testing | ^2.0.0 |
| ESLint | Code linting | ^9.0.0 |

### Development Tools

- Docker and Docker Compose
- GitHub Actions for CI/CD
- VS Code Dev Containers
- GitHub Pages for hosting

## Project Structure

```
src/
├── components/           # React components
│   ├── Board/           # Game board and cell components
│   ├── Game/            # Game container and controls
│   ├── Menu/            # Main menu and setup screens
│   └── UI/              # Reusable UI components
├── hooks/               # Custom React hooks
├── store/               # Zustand state stores
├── logic/               # Pure game logic functions
├── types/               # TypeScript type definitions
├── constants.ts         # Application constants
├── App.tsx              # Root component
└── main.tsx             # Application entry point
```

### Key Directories

- **components/**: Organized by feature (Board, Game, Menu, UI)
- **logic/**: Pure functions for game rules, AI, and validation
- **store/**: Zustand stores for game state and connection management
- **hooks/**: Custom hooks for keyboard input and peer connections

## Deployment

The project uses GitHub Actions for automated deployment to GitHub Pages.

### Deployment Pipeline

1. **CI Workflow** (`ci.yml`): Runs on all pushes and pull requests
   - TypeScript type checking
   - ESLint linting
   - Unit tests
   - Build verification

2. **Deploy Workflow** (`deploy.yml`): Runs on pushes to main
   - Builds production bundle
   - Deploys to GitHub Pages
   - Available at custom domain

### Custom Domain Setup

The live site is hosted at [findfour.kahdev.me](https://findfour.kahdev.me) using:

1. GitHub Pages with custom domain
2. DNS CNAME record pointing to GitHub Pages
3. HTTPS enabled via GitHub Pages SSL

### Manual Deployment

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to GitHub Pages (automatic via Actions)
git push origin main
```

## Version Management

The project uses semantic versioning with automated tools.

### VERSION File

Current version is stored in `/VERSION` and automatically displayed in the UI.

### Version Bumping

Use the included script to bump versions:

```bash
# Interactive version bump
./bump-version.sh

# Options available:
# 1) Patch (x.x.X) - Bug fixes
# 2) Minor (x.X.0) - New features
# 3) Major (X.0.0) - Breaking changes
# 4) Custom version
```

The script updates:
- `VERSION` file
- `package.json`
- `package-lock.json`

### Release Process

1. Run version bump script
2. Commit changes: `git commit -m "Bump version to X.Y.Z"`
3. Push to main: `git push origin main`
4. GitHub Actions automatically creates release and deploys

## License

MIT License

Copyright (c) 2024 Find Four

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.