@echo off
setlocal enabledelayedexpansion

:: Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Docker is required but not installed.
  exit /b 1
)

where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Docker Compose is required but not installed.
  exit /b 1
)

:: Process command line arguments
if "%1"=="" goto show_help

if "%1"=="start" (
  echo Starting all containers...
  docker-compose up -d
  goto end
)

if "%1"=="stop" (
  echo Stopping all containers...
  docker-compose down
  goto end
)

if "%1"=="restart" (
  echo Restarting all containers...
  docker-compose down
  docker-compose up -d
  goto end
)

if "%1"=="rebuild" (
  echo Rebuilding and starting all containers...
  docker-compose up -d --build
  goto end
)

if "%1"=="logs" (
  echo Showing logs from all containers...
  docker-compose logs -f
  goto end
)

if "%1"=="logs-fe" (
  echo Showing logs from frontend container...
  docker-compose logs -f frontend
  goto end
)

if "%1"=="logs-be" (
  echo Showing logs from backend container...
  docker-compose logs -f backend
  goto end
)

if "%1"=="logs-db" (
  echo Showing logs from MongoDB container...
  docker-compose logs -f mongodb
  goto end
)

if "%1"=="clean" (
  echo Removing all containers, networks, and volumes...
  docker-compose down -v
  goto end
)

if "%1"=="status" (
  echo Showing status of all containers...
  docker-compose ps
  goto end
)

if "%1"=="help" (
  goto show_help
) else (
  goto show_help
)

:show_help
echo PEBS Online Docker Helper Script
echo.
echo Usage: docker-scripts.bat [command]
echo.
echo Commands:
echo   start       - Start all containers
echo   stop        - Stop all containers
echo   restart     - Restart all containers
echo   rebuild     - Rebuild and start all containers
echo   logs        - Show logs from all containers
echo   logs-fe     - Show logs from frontend container
echo   logs-be     - Show logs from backend container
echo   logs-db     - Show logs from MongoDB container
echo   clean       - Remove all containers, networks, and volumes
echo   status      - Show status of all containers
echo   help        - Show this help message
echo.
goto end

:end
endlocal 