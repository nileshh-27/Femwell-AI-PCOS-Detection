# FemWell AI - PCOS Detection & Women's Health Platform

## Overview

FemWell AI is a modern, responsive web application for AI-powered PCOS (Polycystic Ovary Syndrome) detection and women's health management. The platform provides risk assessment tools, symptom tracking, lifestyle insights, and educational resources designed to help young women make informed decisions about their hormonal health.

The application features a multi-step assessment form that collects health data (age, BMI, menstrual cycle regularity, symptoms, family history, lifestyle factors) and returns an AI-generated risk score with personalized recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and UI animations
- **Charts**: Recharts for data visualization (risk score displays)
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe request/response validation
- **Build System**: Vite for frontend, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema migrations (`db:push` command)
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Management**: Express sessions with PostgreSQL store
- **User Storage**: Users table in PostgreSQL with automatic upsert on login
- **Fallback**: Mock authentication for development (admin@femwell.ai / admin)

### Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui + custom)
│   │   ├── pages/        # Route pages (Home, Assessment, Results, etc.)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and query client
├── server/               # Backend Express application
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Database operations
│   ├── db.ts             # Database connection
│   └── replit_integrations/  # Replit Auth integration
├── shared/               # Shared code between frontend/backend
│   ├── schema.ts         # Drizzle database schemas
│   ├── routes.ts         # API route definitions with Zod schemas
│   └── models/           # Shared type definitions
```

### Key Design Patterns
- **Type-Safe API Contracts**: Routes defined in `shared/routes.ts` with Zod schemas ensure type safety across frontend and backend
- **Monorepo Structure**: Single repository with client, server, and shared directories
- **Path Aliases**: `@/` for client source, `@shared/` for shared code
- **Component Library**: shadcn/ui components in `client/src/components/ui/`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Required Environment Variables**: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`, `DATABASE_URL`

### Frontend Libraries
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **recharts**: Data visualization
- **react-hook-form**: Form management
- **zod**: Schema validation

### UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI primitives (dialogs, dropdowns, forms, etc.)

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **TypeScript**: Type checking across the entire codebase