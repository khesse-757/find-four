# Find Four

Terminal-themed Connect Four game with online multiplayer and AI opponents.

## Project Overview

Find Four is a browser-based Connect Four game styled as a retro terminal/hacker interface. Two players compete: one as the "hacker" (attacking) and one as the "defender" (patching). The aesthetic is 1980s amber CRT terminal.

Live URL: https://findfour.kahdev.me
Repository: https://github.com/khesse-757/find-four

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| TypeScript | Language, strict mode enabled |
| Vite | Build tool and dev server |
| Zustand | State management |
| Tailwind CSS | Styling |
| PeerJS | WebRTC multiplayer |
| Vitest | Unit testing |

## Architecture

```
src/
├── components/
│   ├── Board/
│   │   ├── Board.tsx          # 7x6 grid container, drop animations
│   │   ├── Column.tsx         # Single column, handles hover and click
│   │   └── Cell.tsx           # Individual cell display
│   ├── Menu/
│   │   ├── MainMenu.tsx       # Mode selection (AI, Local, Online)
│   │   ├── DifficultySelect.tsx   # AI difficulty picker
│   │   └── OnlineSetup.tsx    # PeerJS room code UI
│   ├── Game/
│   │   ├── GameContainer.tsx  # Orchestrates board and status
│   │   ├── GameStatus.tsx     # Turn indicator, winner announcement
│   │   └── GameControls.tsx   # Restart, quit, back to menu
│   └── UI/
│       ├── Terminal.tsx       # Terminal window chrome wrapper
│       └── Button.tsx         # Styled terminal button
├── hooks/
│   ├── useKeyboard.ts         # Keyboard navigation for accessibility
│   └── usePeerConnection.ts   # PeerJS connection lifecycle
├── store/
│   ├── gameStore.ts           # Board state, turns, winner, game mode
│   └── connectionStore.ts     # Online connection state, room codes
├── logic/
│   ├── board.ts               # Pure functions: createBoard, dropPiece, checkWin
│   ├── ai.ts                  # Minimax with alpha-beta pruning
│   └── validation.ts          # Move validation helpers
├── types/
│   └── index.ts               # All TypeScript types and interfaces
├── styles/
│   └── terminal.css           # CSS variables for terminal theme
├── constants.ts               # Board dimensions, AI config, theme values
├── App.tsx                    # Root component, route between menu and game
└── main.tsx                   # Entry point
```

## Game Modes

1. **vs AI**: Play against computer. Difficulties: Easy (depth 2), Medium (depth 4), Hard (depth 6)
2. **vs Local**: Hot seat multiplayer on same device
3. **vs Online**: WebRTC peer-to-peer via PeerJS. One player hosts (gets room code), other joins.

## Coding Standards

### File Size
Every file must be under 200 lines. If approaching this limit, split into smaller modules.

### Single Responsibility
Each file does one thing. Components render UI. Hooks manage side effects. Logic files are pure functions. Store files manage state.

### TypeScript
Use strict mode. No `any` types. Define explicit interfaces for all data structures. Prefer `type` for unions and simple aliases, `interface` for objects that may be extended.

### Formatting
Do not use emojis in code, comments, or documentation.
Do not use hyphens in prose or documentation where en-dashes or commas would be appropriate.
Use straightforward, technical language.

### Imports
Group imports: React first, then external libraries, then internal modules. Separate groups with blank line.

### Components
Functional components only. Use named exports. Props interface defined above component.

### Testing
All files in `logic/` must have corresponding test files in `tests/logic/`. Test pure functions thoroughly. Cover edge cases: empty board, full column, horizontal/vertical/diagonal wins, draws.

### Git Operations
ALWAYS ask for user approval before running `git commit` or `git push` commands. Never commit or push without explicit permission.

## Terminal Theme

Aesthetic: 1980s amber CRT monitor. Hacker vs defender concept.

Colors:
- Background: near black (#0a0a0a)
- Primary text: amber (#ffb000)
- Secondary text: dim amber (#996a00)
- Player 1 (Hacker): bright amber or orange accent
- Player 2 (Defender): contrasting color, perhaps cyan or green

Typography:
- Monospace font throughout (JetBrains Mono, Fira Code, or system monospace)
- Uppercase for headers and labels

Effects:
- Subtle scanlines optional
- No heavy glow effects
- ASCII-style borders where appropriate

## State Management

### gameStore (Zustand)
- board: 2D array representing grid
- currentPlayer: 1 or 2
- winner: null, 1, 2, or 'draw'
- gameMode: 'ai' | 'local' | 'online'
- aiDifficulty: 'easy' | 'medium' | 'hard'
- actions: dropPiece, resetGame, setMode

### connectionStore (Zustand)
- peerId: own PeerJS ID
- remotePeerId: opponent's ID
- connectionStatus: 'disconnected' | 'connecting' | 'connected'
- isHost: boolean
- actions: connect, disconnect, sendMove

## File Naming

- Components: PascalCase (Board.tsx, GameStatus.tsx)
- Hooks: camelCase with use prefix (useKeyboard.ts)
- Logic/utils: camelCase (board.ts, validation.ts)
- Types: index.ts in types folder
- Tests: same name as source with .test.ts suffix

## Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0",
    "peerjs": "^1.5.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0"
  }
}
```

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Production build
- `npm run preview`: Preview production build
- `npm run test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript compiler check

## CI/CD

GitHub Actions workflows:
1. `ci.yml`: On push/PR to main, run lint, typecheck, and tests
2. `deploy.yml`: On push to main, build and deploy to GitHub Pages

## Version Management

- VERSION file at root contains current version (e.g., 1.0.0)
- bump-version.sh script for incrementing version
- GitHub Action creates release tags automatically

### bump-version.sh

Use this exact script:

```bash
#!/bin/bash
# bump-version.sh - Helper script to bump version numbers
set -e

CURRENT_VERSION=$(cat VERSION | tr -d '[:space:]')
echo "Current version: $CURRENT_VERSION"
echo ""
echo "What type of version bump?"
echo "  1) Patch (x.x.X) - Bug fixes"
echo "  2) Minor (x.X.0) - New features, backwards compatible"
echo "  3) Major (X.0.0) - Breaking changes"
echo "  4) Custom version"
echo ""
read -p "Enter choice (1-4): " choice

IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"

case $choice in
  1)
    NEW_VERSION="$major.$minor.$((patch + 1))"
    ;;
  2)
    NEW_VERSION="$major.$((minor + 1)).0"
    ;;
  3)
    NEW_VERSION="$((major + 1)).0.0"
    ;;
  4)
    read -p "Enter new version (e.g., 1.2.3): " NEW_VERSION
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "Bumping version: $CURRENT_VERSION -> $NEW_VERSION"

# Update VERSION file
echo "$NEW_VERSION" > VERSION
echo "VERSION file updated"

# Update package.json
npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version
echo "package.json updated"

echo ""
echo "Next steps:"
echo "  1. Review your changes"
echo "  2. git add VERSION package.json package-lock.json"
echo "  3. git commit -m 'Bump version to $NEW_VERSION'"
echo "  4. git push origin main"
echo ""
echo "The GitHub Action will automatically:"
echo "  - Create tag v$NEW_VERSION"
echo "  - Generate a changelog from commits"
echo "  - Create a GitHub release"
```

## Documentation

- README.md: Overview, features, installation, usage, controls
- ARCHITECTURE.md: Detailed technical documentation
- Inline JSDoc comments for exported functions

## Board Representation

The board is a 2D array: `board[row][col]` where row 0 is the top.
- 0: empty cell
- 1: player 1 piece (hacker)
- 2: player 2 piece (defender)

Standard dimensions: 7 columns, 6 rows.

## Win Detection

Check after each move:
- Horizontal: 4 consecutive in any row
- Vertical: 4 consecutive in any column
- Diagonal: 4 consecutive in both diagonal directions

Return winning player or null. Also detect draw when board is full with no winner.

## AI Implementation

Minimax algorithm with alpha-beta pruning.
- Evaluate board positions based on potential winning lines
- Depth varies by difficulty
- Easy: looks 2 moves ahead, makes occasional random moves
- Medium: looks 4 moves ahead
- Hard: looks 6+ moves ahead, plays optimally

## Online Multiplayer Flow

1. Host clicks "Create Game", receives room code (PeerJS ID)
2. Guest enters room code, connection established
3. Host is always Player 1 (hacker)
4. Moves sent as simple objects: { column: number }
5. Both clients validate moves independently
6. Handle disconnection gracefully with reconnect option