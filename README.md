# Ripple Exchange Platform

A web application for a community exchange system where users can trade goods and services.

## Technology Stack

- **Frontend**: React with Next.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Containerization**: Docker

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd ripple
```

### Running with Docker

1. Build and start all services:

```bash
docker-compose up -d
```

This will start three containers:
- Frontend (Next.js) - accessible at http://localhost:3000
- Backend (Express API) - accessible at http://localhost:3001
- MongoDB - running on port 27017

2. View logs:

```bash
# View logs from all services
docker-compose logs -f

# View logs from a specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb
```

3. Stop all services:

```bash
docker-compose down
```

4. Rebuild services after making changes:

```bash
docker-compose up -d --build
```

## Development Without Docker

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend

Create a `.env` file in the backend directory with the following variables:

```
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pebs
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:3000
```

### Frontend

Create a `.env.local` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Features

- User authentication and authorization
- Community exchange listings
- User profiles
- Exchange management
- Community activities

## License

[MIT](LICENSE) 