# Next.js Application with Bun

This is a Dockerfile setup for building and running a Next.js application using Bun as the package manager and a minimal Distroless Node.js image for production.

## Features

- Multi-stage Docker build for optimized production deployment
- Uses Bun for faster package management and builds
- Distroless Node.js runtime for security and minimal footprint
- Non-root user execution in production
- Telemetry disabled for privacy
- Optimized caching of dependencies

## Prerequisites

- Docker installed on your system
- A Next.js application with proper configuration

## Usage

### Building the Docker Image

```bash
docker build -t my-nextjs-app .
```

### Running the Container

```bash
docker run -p 3000:3000 my-nextjs-app
```
