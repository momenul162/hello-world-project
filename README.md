# Hello World Project

A NestJS GraphQL API with user management functionality.

## Features

- GraphQL API with Apollo Server
- User CRUD operations
- Role-based access (USER/ADMIN)
- REST endpoint for hello world
- TypeScript & input validation

## Tech Stack

- NestJS v11
- GraphQL (Apollo Server)
- TypeScript
- Jest (testing)
- pnpm

## Quick Start

```powershell
# Install dependencies
pnpm install

# Start development server
pnpm start:dev

# Run tests
pnpm test
```

**URLs:**

- REST API: http://localhost:3000
- GraphQL Playground: http://localhost:3000/graphql

## GraphQL Examples

**Get all users:**

```graphql
query {
  users {
    id
    name
    email
    role
  }
}
```

**Create user:**

```graphql
mutation {
  createUser(createUserInput: { name: "John Doe", email: "john@example.com" }) {
    id
    name
    email
    role
  }
}
```

**Filter users:**

```graphql
query {
  users(role: ADMIN, limit: 5) {
    id
    name
    role
  }
}
```

## Available Scripts

- `pnpm start:dev` - Development mode
- `pnpm build` - Build project
- `pnpm test` - Run tests
- `pnpm lint` - Lint code

## Project Structure

```
src/
├── main.ts              # App entry point
├── app.module.ts        # Root module
├── app.controller.ts    # REST controller
└── user/               # User module
    ├── user.resolver.ts # GraphQL resolver
    ├── user.service.ts  # Business logic
    └── user.type.ts     # GraphQL types
```

## Sample Data

Pre-loaded with 6 test users (1 admin, 5 regular users).

## Notes

- In-memory storage (no database)
- No authentication required
- Auto-generated GraphQL schema
