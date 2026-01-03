# Docker Development Environment

This project includes Docker configurations for consistent development environments across different machines and platforms.

## Quick Start

### Option 1: VS Code Dev Containers (Recommended)

1. Install [VS Code](https://code.visualstudio.com/) and [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open this project in VS Code
4. Click "Reopen in Container" when prompted (or use Command Palette: `Dev Containers: Reopen in Container`)
5. Wait for container to build and install dependencies
6. Run `npm run dev` in the integrated terminal

**Benefits:**
- Pre-configured VS Code extensions (ESLint, Tailwind CSS IntelliSense, etc.)
- Automatic dependency installation
- Port forwarding for development server
- Consistent environment across all contributors

### Option 2: GitHub Codespaces

1. Go to the GitHub repository
2. Click the green "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"
5. Wait for environment to initialize
6. Run `npm run dev` in the terminal

**Benefits:**
- Zero local setup required
- Full VS Code in the browser
- Same configuration as local dev containers

### Option 3: Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd find-four

# Start development environment
docker-compose up
```

The application will be available at `http://localhost:5173`

### Option 4: Manual Docker

```bash
# Build the image
docker build -t find-four-dev .

# Run the container
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules find-four-dev
```

## Container Configurations

### Dev Container Features

- **Base Image**: Node 20 Alpine Linux
- **Port Forwarding**: 5173 (Vite dev server)
- **VS Code Extensions**:
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript support
  - Prettier
  - Auto rename tag
  - NPM IntelliSense
- **Automatic Setup**: Dependencies installed on container creation
- **Git Integration**: Local git config and SSH keys mounted

### Dockerfile Features

- **Multi-layer optimization**: Separate layers for dependencies and source code
- **Non-root user**: Security best practice
- **Health checks**: Monitor development server status
- **Hot reloading**: Source code changes reflected immediately
- **Alpine Linux**: Minimal footprint for faster builds

## Development Workflow

1. Make code changes (hot reload active)
2. Run tests: `npm run test`
3. Check linting: `npm run lint`
4. Type checking: `npm run typecheck`
5. Build for production: `npm run build`

## Troubleshooting

### Container won't start
- Ensure Docker Desktop is running
- Check available disk space and memory
- Try rebuilding: `docker-compose down && docker-compose up --build`

### Port conflicts
- Change port mapping in `docker-compose.yml` or devcontainer.json
- Kill processes using port 5173: `lsof -ti:5173 | xargs kill -9`

### Slow performance on macOS
- Ensure Docker Desktop has sufficient memory allocated (4GB+ recommended)
- Consider using Docker volumes instead of bind mounts for node_modules

### VS Code extensions not working
- Reload window: Command Palette → "Developer: Reload Window"
- Rebuild container: Command Palette → "Dev Containers: Rebuild Container"

## Production Deployment

For production deployment, create a separate Dockerfile.prod:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

This creates a multi-stage build with a production-ready nginx image serving the static assets.