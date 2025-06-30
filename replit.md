# StudyBuddy - Real-time Chat Application

## Overview

StudyBuddy is a modern real-time chat application built for students to connect and communicate. The application features a React frontend with TypeScript, an Express.js backend, and integrates with CometChat for real-time messaging capabilities. The system uses a PostgreSQL database with Drizzle ORM for data persistence and is styled with Tailwind CSS and shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and React Context for authentication
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time Communication**: CometChat SDK integration
- **Session Management**: In-memory storage with extensible interface for future database integration

### Key Design Decisions
- **CometChat Integration**: Chosen to handle complex real-time messaging features like presence, typing indicators, and message delivery status without building from scratch
- **Drizzle ORM**: Selected for type-safe database operations and excellent TypeScript integration
- **shadcn/ui**: Provides consistent, accessible UI components with Tailwind CSS integration
- **Monorepo Structure**: Shared schema and types between client and server for type safety

## Key Components

### Authentication System
- Simple username-based authentication through CometChat
- AuthContext provides global authentication state management
- Automatic user creation and login flow

### Chat Features
- Real-time messaging with CometChat SDK
- User presence indicators (online/offline status)
- Message history and persistence
- Responsive design for mobile and desktop

### UI Components
- Reusable shadcn/ui components
- Custom chat interface components
- Responsive layout with mobile-first approach
- Loading states and error handling

## Data Flow

1. **Authentication**: User enters username and name → AuthContext → CometChat user creation/login
2. **User Discovery**: Dashboard fetches available users from CometChat
3. **Chat Initiation**: User selection triggers chat interface with message history loading
4. **Real-time Messaging**: Messages sent through CometChat SDK with automatic UI updates
5. **Presence Updates**: Real-time user status updates through CometChat presence system

## External Dependencies

### Primary Services
- **CometChat**: Real-time messaging infrastructure
  - Handles message delivery, presence, and user management
  - Requires APP_ID, REGION, and AUTH_KEY configuration
- **Neon Database**: PostgreSQL hosting for user and session data
- **Replit**: Development and deployment platform

### Key Libraries
- **@cometchat/chat-sdk-javascript**: Real-time chat functionality
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **@radix-ui**: Accessible UI primitives
- **wouter**: Lightweight routing

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with auto-reload using tsx
- Environment variables for CometChat configuration
- Replit-specific plugins for development experience

### Production Build
- Frontend: Vite build to static assets
- Backend: esbuild bundle for Node.js deployment
- Database migrations handled through Drizzle Kit
- Environment variables required: DATABASE_URL, CometChat credentials

### Database Schema
- Users table: id, username, email, password, timestamps
- Chat sessions table: id, user_id, partner_id, timestamps
- Extensible schema design for future features

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```