# Backend Service Template

A clean, simple Node.js/TypeScript backend service template with TypeORM, Express, and OpenAPI documentation.

## Features

- 🚀 **Express.js** - Fast, minimalist web framework
- 🗄️ **TypeORM** - Object-relational mapping with PostgreSQL
- 📝 **TypeBox** - Schema validation and type safety
- 📚 **OpenAPI/Swagger** - API documentation (Scalar + Swagger UI)
- 📊 **Winston** - Structured logging
- 🔧 **TypeScript** - Type safety and modern JavaScript features

## Project Structure

```
src/
├── config/          # Configuration and database setup
├── controllers/     # Request handlers and business logic
├── docs/           # OpenAPI documentation helpers
├── middlewares/    # Express middleware
├── models/         # TypeORM entities
├── routers/        # Express route definitions
├── schemas/        # TypeBox validation schemas
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server
LISTEN_PORT=8080

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_LOGGING=false

# Development
HTTP_LOGGING=true
HTTP_BODY_LOGGING=false
LOGGING_LEVEL=info

# API Documentation
SPEC_REQUEST_VALIDATION=true
SPEC_RESPONSE_VALIDATION=true
```

## API Documentation

Once the server is running, you can access the API documentation at:

- **Scalar UI**: http://localhost:8080/docs/scalar
- **Swagger UI**: http://localhost:8080/docs/swagger

## Example: Vehicle CRUD API

The template includes a complete example with a Vehicle entity:

- `GET /api/v1/vehicles` - List all vehicles
- `GET /api/v1/vehicles?id=1` - Get vehicle by ID
- `GET /api/v1/vehicles?model=Tesla` - Search by model
- `POST /api/v1/vehicles` - Create a new vehicle
- `PUT /api/v1/vehicles/:id` - Update a vehicle
- `DELETE /api/v1/vehicles/:id` - Delete a vehicle

## Development Workflow

1. **Define the model**: Create a TypeORM entity in `src/models/`
2. **Create schemas**: Add TypeBox validation schemas in `src/schemas/`
3. **Implement controllers**: Add business logic in `src/controllers/`
4. **Define routes**: Create Express routes with OpenAPI docs in `src/routers/`
5. **Update database**: Add new entities to `src/config/dbConnection.ts`

## Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build the project
npm start            # Start production server

# Database
npm run seed         # Seed the database (if seedVehicles.ts exists)

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## Adding New Features

Refer to the `.cursorrules` file for detailed development guidelines and code patterns.

## Template Philosophy

This template is designed to be:

- **Simple**: Minimal complexity, easy to understand
- **Clean**: Well-organized code structure
- **Type-safe**: Full TypeScript support with runtime validation
- **Documented**: Auto-generated API documentation
- **Extensible**: Easy to add new features and entities

## What's Removed

For simplicity, this template does not include:

- Authentication/Authorization
- External service integrations
- Complex caching mechanisms
- Payment processing
- File upload handling
- Email services

These can be easily added based on your specific requirements.

## License

MIT License - see LICENSE file for details.
