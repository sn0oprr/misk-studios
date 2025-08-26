# 🐳 Docker Setup for Misk Studios

This project includes Docker configurations for both development and production environments.

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## 🚀 Quick Start

### Production Environment

The easiest way to run the application in production mode:

```bash
# Start the application (make sure your .env file has DATABASE_URL set to Supabase)
docker-compose up -d

# The app will be available at http://localhost:3000
```

### Development Environment

For development with hot reloading:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# The app will be available at http://localhost:3000 with hot reloading
```

## 📁 Docker Files Overview

### Core Files

- **`Dockerfile`** - Multi-stage production build
- **`Dockerfile.dev`** - Development environment with hot reloading
- **`.dockerignore`** - Excludes unnecessary files from Docker context

### Compose Files

- **`docker-compose.yml`** - Production setup with upload volume mounting
- **`docker-compose.dev.yml`** - Development setup with source code and upload volume mounting

## 🛠️ Detailed Usage

### 1. Production Setup

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ this will delete database data)
docker-compose down -v
```

### 2. Development Setup

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Follow logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

### 3. Database Management

```bash
# Seed database (using Supabase connection)
docker-compose exec app npm run db:seed

# Access the running container for debugging
docker-compose exec app sh
```

### 4. Individual Container Management

```bash
# Build only the app
docker build -t misk-studios .

# Run app container standalone (requires external database)
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  misk-studios

# Run development container
docker build -f Dockerfile.dev -t misk-studios-dev .
docker run -p 3000:3000 -v $(pwd):/app misk-studios-dev
```

## 🔧 Configuration

### Environment Variables

**IMPORTANT**: Create a `.env` file in your project root with your environment variables:

```bash
# Supabase Database connection
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT_REF].supabase.co:5432/postgres

# Application port (optional, defaults to 3000)
APP_PORT=3000

# Add any other environment variables your app needs
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Security Note**: 
- `.env` files are excluded from Docker images for security (see `.dockerignore`)
- Docker Compose reads your `.env` file and passes variables to the container at runtime
- This is the recommended approach for production deployments

### Database Configuration

The application uses **Supabase** as the database:
- Make sure your Supabase project is set up
- Get your connection string from Supabase dashboard
- Set the `DATABASE_URL` in your `.env` file

### Port Configuration

The application port is configurable via the `APP_PORT` environment variable:

```bash
# Run on default port 3000
docker-compose up -d

# Run on port 8080
APP_PORT=8080 docker-compose up -d

# Or set in .env file
echo "APP_PORT=8080" >> .env
docker-compose up -d
```

**Examples:**
- `APP_PORT=3000` → http://localhost:3000 (default)
- `APP_PORT=8080` → http://localhost:8080
- `APP_PORT=4000` → http://localhost:4000

## 🏗️ Docker Architecture

### Production Build (Multi-stage)

1. **Dependencies Stage**: Installs production dependencies
2. **Builder Stage**: Builds the Next.js application
3. **Runner Stage**: Creates minimal runtime image with built app

### Key Features

- **Optimized size**: Multi-stage build reduces final image size
- **Security**: Runs as non-root user
- **Performance**: Uses Alpine Linux for smaller footprint
- **Caching**: Leverages Docker layer caching for faster builds

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Use different port with APP_PORT
   APP_PORT=8080 docker-compose up -d
   
   # Or set permanently in .env
   echo "APP_PORT=8080" >> .env
   ```

2. **Database connection issues**
   ```bash
   # Check if your Supabase DATABASE_URL is correct in .env
   # Make sure your Supabase project is running
   
   # Check application logs for database errors
   docker-compose logs app
   ```

3. **Environment variables not loading**
   ```bash
   # Verify .env file exists in project root
   ls -la .env
   
   # Check if variables are being passed to container
   docker-compose exec app env | grep DATABASE_URL
   
   # Check container logs for environment issues
   docker-compose logs app
   
   # Restart containers to reload .env file
   docker-compose down && docker-compose up -d
   ```

4. **Build failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   
   # If TypeScript errors during build
   npm run audit:check
   npm run audit:fix
   ```

5. **Volume issues in development**
   ```bash
   # Remove volumes and rebuild
   docker-compose -f docker-compose.dev.yml down -v
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

6. **NPM audit warnings**
   ```bash
   # Check for vulnerabilities
   npm run audit:check
   
   # Fix automatically (may introduce breaking changes)
   npm run audit:fix
   
   # Force fix (use with caution)
   npm audit fix --force
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# Follow logs for specific service
docker-compose logs -f app

# Execute commands in running container
docker-compose exec app sh

# Check container status
docker-compose ps
```

## 📊 Performance Tips

1. **Use .dockerignore**: Properly configured to exclude unnecessary files
2. **Multi-stage builds**: Reduces final image size
3. **Layer caching**: Package.json copied separately for better caching
4. **Health checks**: Database health checks ensure proper startup order

## 🔒 Security Considerations

- Application runs as non-root user (`nextjs:nodejs`)
- Only necessary ports are exposed
- Environment variables for sensitive data
- No development tools in production image

## 📦 Image Sizes

- **Production image**: ~200MB (Alpine-based)
- **Development image**: ~400MB (includes dev dependencies)

## 🚀 Production Deployment

For production deployment, you can:

1. **Push to registry**:
   ```bash
   docker build -t your-registry/misk-studios .
   docker push your-registry/misk-studios
   ```

2. **Use docker-compose on server**:
   ```bash
   # On production server
   docker-compose up -d
   ```

3. **Environment-specific configs**:
   Create `docker-compose.prod.yml` with production-specific settings.

## 🤝 Contributing

When adding new dependencies or changing the build process:

1. Update both `Dockerfile` and `Dockerfile.dev`
2. Test both production and development builds
3. Update this documentation if needed
