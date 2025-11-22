# FreshMart - Grocery Shopping Website

## Overview

FreshMart is a modern grocery e-commerce platform that enables users to browse fresh produce, add items to their cart, and prepare for checkout. The application features a clean, scannable interface inspired by contemporary grocery platforms like Instacart and Whole Foods Market, with a focus on visual freshness and minimal friction in the shopping experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing - a lightweight alternative to React Router that provides simple declarative routing without the complexity of larger routing libraries.

**State Management**: 
- TanStack Query (React Query) for server state management, handling data fetching, caching, and synchronization
- Local React state (useState) for UI state like cart visibility, category filters, and search queries
- No global state management library needed due to React Query's built-in caching

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible, customizable components following the "New York" style variant. All components use Tailwind CSS for styling with a consistent design system.

**Styling Approach**: 
- Tailwind CSS with custom configuration for spacing, colors, and typography
- Custom CSS variables for theme colors supporting light/dark modes
- Design system emphasizes visual hierarchy with Inter/DM Sans font families
- Responsive grid layouts: 2 columns (mobile) → 3 columns (tablet) → 4 columns (desktop)

**Key Design Patterns**:
- Component composition with separation of presentational and container components
- Custom hooks for reusable logic (useToast, useIsMobile)
- Mutations for data updates with optimistic UI updates via query invalidation

### Backend Architecture

**Runtime**: Node.js with Express.js framework running in ESM (ES Modules) mode.

**API Design**: RESTful API with the following endpoints:
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Retrieve single product
- `GET /api/cart` - Retrieve cart items with populated product data
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart

**Data Storage Strategy**: Currently using in-memory storage (MemStorage class) for development. The storage interface (IStorage) abstracts the data layer to allow easy migration to database persistence.

**Validation**: Zod schemas derived from Drizzle ORM table definitions for request validation, ensuring type safety between database schema and API contracts.

**Development Setup**: 
- Vite middleware integration for HMR (Hot Module Replacement) during development
- Custom logging middleware for API request/response tracking
- Raw body parsing for potential webhook integrations

### Data Schema

**Database ORM**: Drizzle ORM configured for PostgreSQL with the following schema:

**Products Table**:
- UUID primary key with auto-generation
- Name, description, category, image URL
- Decimal price field for precise monetary calculations
- Unit (lb, oz, etc.) for product measurement
- Stock tracking with integer inStock field

**Cart Items Table**:
- UUID primary key
- Foreign key reference to productId
- Integer quantity field
- No user association (currently session-based, single-cart system)

**Schema Migration**: Uses Drizzle Kit for schema management with migrations stored in `/migrations` directory.

### External Dependencies

**Database**: PostgreSQL via Neon serverless driver (@neondatabase/serverless), enabling connection pooling and edge-compatible database access.

**UI Framework Dependencies**:
- Radix UI component primitives for accessibility-compliant interactive components
- Lucide React for consistent iconography
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for dynamic className handling

**Development Tools**:
- TypeScript for type safety across frontend and backend
- ESBuild for backend bundling in production
- Vite plugins for development experience (error overlay, cartographer, dev banner)

**Session Management**: Prepared for connect-pg-simple for PostgreSQL-backed sessions (dependency present but not yet implemented).

**Form Handling**: React Hook Form with Hookform Resolvers for integration with Zod validation schemas.

**Asset Management**: Static images stored in `/attached_assets/generated_images/` directory, served through Vite's static asset handling.

### Architectural Decisions

**Monorepo Structure**: Single repository with `/client`, `/server`, and `/shared` directories for type sharing between frontend and backend, reducing duplication and ensuring consistency.

**Type Safety**: Shared TypeScript types generated from Drizzle schemas, ensuring database schema, API contracts, and frontend expectations remain synchronized.

**Storage Abstraction**: IStorage interface allows switching from in-memory storage to database persistence without changing business logic, supporting rapid prototyping before database provisioning.

**Component Library Choice**: shadcn/ui over pre-built component libraries provides full control over component implementation while maintaining accessibility standards through Radix UI.

**Build Strategy**: Separate build processes for client (Vite) and server (ESBuild), with client built to `/dist/public` and server to `/dist`, enabling efficient deployment and clear separation of concerns.
