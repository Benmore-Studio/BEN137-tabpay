# GEMINI.md - TabPay Project

This document provides a comprehensive overview of the TabPay project, its structure, and development conventions to be used as instructional context for future interactions.

## Project Overview

TabPay is a mobile-first Progressive Web App (PWA) designed for casino guests to order beverages and food directly from their mobile devices. The project is currently in the frontend prototyping phase, with a focus on building a responsive and intuitive user interface using React, Vite, and Tailwind CSS.

The backend is planned to be a Node.js and Express application, which will be developed in a later phase.

## Technology Stack

### Frontend

- **Framework**: React 18.x with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Animations**: Framer Motion
- **PWA**: vite-plugin-pwa

### Backend (Planned)

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **Payment**: Stripe (test mode)

## Project Structure

The project is organized as a monorepo with two main directories:

- `frontend/`: Contains the React-based PWA.
- `backend/`: Will contain the Node.js API.

The `frontend/src` directory is structured as follows:

- `components/`: Reusable UI components.
- `context/`: React context providers for global state management.
- `data/`: Mock data for development.
- `hooks/`: Custom React hooks.
- `pages/`: Top-level page components.
- `routes/`: Application routing configuration.
- `types/`: TypeScript type definitions.
- `utils/`: Utility functions.

## Building and Running

### Frontend

To run the frontend application in development mode:

```bash
cd frontend
npm install
npm run dev
```

The development server will be available at `http://localhost:5173`.

To build the application for production:

```bash
cd frontend
npm run build
```

To preview the production build:

```bash
cd frontend
npm run preview
```

### Backend

The backend is not yet implemented.

## Development Conventions

- **Styling**: Use Tailwind CSS for all styling.
- **Components**: Create reusable components in the `src/components` directory.
- **State Management**: Use React Context API for global state.
- **Routing**: All routes are defined in `src/routes/index.tsx`.
- **Types**: Define all custom types in the `src/types` directory.
- **Linting**: Run `npm run lint` to check for code quality issues.
