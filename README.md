# Ripple Exchange Platform

Ripple is a web application that helps facilitate the communal recognition of labor. The system is inspired by Becky Chambers' "Monk and Robot" series, in which the concept of "pebs" was first introduced.

## Are pebs a currency?

**No.** Pebs are not a currency. Currency creates barriers to access for resources. Pebs don't work like this.

## So if they aren't currency... what are they?

Pebs acknowledge the many ways we all benefit from the labor of those in our community. As Dex explains:

> *"The farmer feeds the musician, who brings music to the village. The technician who took a break to enjoy the music now has the energy to go fix the communications tower. The communications tower enables the meteorologist to deliver the weather report, which helps the farmer grow more apples."*

The goal of pebs is to ritualize the process of recognizing how we benefit from others' labor and giving thanks for it. When you benefit from someone's labor, you give them pebs—saying "thank you, I see you." When you provide something to others, you receive pebs for the same reason.

## What happens if your account goes negative?

Becky Chambers said it best through sibling Dex:
> *"Nobody should be barred from necessities or comforts just because they don't have the right number next to their name... Everybody has a negative balance from time to time, for lots of reasons. That's fine. That's part of the ebb and flow. But if someone had a huge negative... well, that says they need help. Maybe they're sick. Or stuck. Maybe they've got something going on at home. Or maybe it's just one of those times when they need other people to carry them for a while. That's okay. Everybody ends up there sometimes. If I saw a friend's balance and it was way in the red, I'd make a point of checking in."*

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Containerization**: Docker
- **Styling**: Tailwind CSS

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

This will start four containers:
- Frontend (Next.js) - accessible at http://localhost:3000
- Backend (Express API) - accessible at http://localhost:3001
- MongoDB - running on port 27017
- Mongo Express (Database UI) - accessible at http://localhost:8081

2. View logs:

```bash
# View logs from all services
docker-compose logs -f

# View logs from a specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb
docker-compose logs -f mongo-express
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
- Send and receive PEBS (community currency)
- Public exchange ledger
- User profiles with customizable avatars
- Real-time notifications
- System health monitoring
- Responsive design with modern UI
- Glassmorphic design elements
- Secure session management

## Project Structure

```
ripple/
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/       # Next.js app directory
│   │   │   ├── components/# Reusable components
│   │   │   ├── context/   # React context providers
│   │   │   ├── styles/    # Global styles
│   │   │   └── utils/     # Utility functions
│   │   └── public/        # Static assets
│   ├── backend/           # Express backend application
│   │   ├── src/          # Source code
│   │   │   ├── routes/       # API routes
│   │   │   └── scripts/      # Utility scripts
│   └── docker-compose.yml # Docker configuration
```

## License

[MIT](LICENSE) 
