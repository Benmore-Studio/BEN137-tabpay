# BEN-137 TabPay

Casino ordering Progressive Web App (PWA) for mobile beverage and food ordering.

## Project Overview

TabPay is a mobile-first PWA that enables casino guests to order drinks and food from their mobile devices while on the casino floor. This project is part of a 3.5-month development engagement with Potawatomi Casino, integrating with their IGT Advantage CMS.

**Current Phase**: Month 1 - Frontend Prototyping
**Budget**: $18,000
**Timeline**: 3.5 months with weekly client syncs

## Monorepo Structure

```
BEN137-tabpay/
├── frontend/           # React + Vite PWA
│   ├── src/
│   ├── public/
│   ├── vite.config.ts
│   └── package.json
├── backend/            # Node.js + Express API (Month 2+)
│   └── package.json
├── .gitignore
└── README.md
```

## Technology Stack

### Frontend (Month 1 Focus)
- **Framework**: React 18.x with TypeScript
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa + Workbox
- **Styling**: TailwindCSS (to be added)
- **State Management**: Context API / Redux (TBD)
- **QR Code**: react-qr-code
- **UI Components**: Custom components + Radix UI

### Backend (Month 2+)
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **Payment**: Stripe (test mode)
- **Integration**: IGT Advantage CMS

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The development server will start at `http://localhost:5173`

### Building for Production

```bash
cd frontend
npm run build
npm run preview
```

## Development Workflow

### Month 1 - Frontend Prototyping
- ✅ Repository and project setup
- ✅ PWA configuration
- 🔄 Core UI/UX components
- 🔄 QR code integration
- 🔄 Menu browsing interface
- 🔄 Shopping cart functionality
- 🔄 Checkout flow mockups
- 🔄 Order confirmation screens

### Month 2 - Backend Development
- Database schema design
- API endpoints
- Authentication system
- Stripe integration (test mode)

### Month 3 - Integration
- IGT Advantage CMS integration
- End-to-end testing
- Performance optimization
- User acceptance testing

### Month 3.5 - Production Preparation
- Production environment setup
- Documentation
- Client handoff
- Final testing and launch preparation

## Key Features

### Guest Experience
- Scan QR code to access menu
- Browse menu by category
- Add items to cart
- Enter location (table/machine number)
- Checkout with payment
- Real-time order tracking
- Order history

### Staff Experience (Future)
- Order management dashboard
- Real-time order notifications
- Fulfillment tracking
- Analytics and reporting

## Project Management

- **Repository**: https://github.com/Benmore-Studio/BEN137-tabpay
- **Project Board**: [To be created]
- **Client**: Potawatomi Casino
- **Point of Contact**: [Client contact info]

## Contributing

This is a client project under Benmore Studio. Development follows the agreed-upon timeline and deliverables outlined in the project quote.

## License

Proprietary - Benmore Studio © 2025
