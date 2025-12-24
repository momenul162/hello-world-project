# GraphQL API Documentation

## Base URL
```
http://localhost:3300/graphql
```

## Authentication
Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Public Mutations (No Auth Required)

### Register
Create a new user account.

```graphql
mutation Register {
  register(registerInput: {
    name: "John Doe"
    email: "john@example.com"
    password: "password123"
  }) {
    accessToken
    user {
      id
      name
      email
      role
    }
  }
}
```

### Login
Authenticate and get JWT token.

```graphql
mutation Login {
  login(loginInput: {
    email: "john@example.com"
    password: "password123"
  }) {
    accessToken
    user {
      id
      name
      email
      role
    }
  }
}
```

---

## Protected Queries (Auth Required)

### Get Current User
Get the currently authenticated user's information.

```graphql
query Me {
  me {
    id
    name
    email
    role
  }
}
```

### Get All Users
Fetch all users with optional filtering.

```graphql
# Get all users
query GetAllUsers {
  users {
    id
    name
    email
    role
  }
}

# Filter by role
query GetUsersByRole {
  users(role: ADMIN) {
    id
    name
    email
    role
  }
}

# Limit results
query GetLimitedUsers {
  users(limit: 10) {
    id
    name
    email
    role
  }
}

# Combined filters
query GetFilteredUsers {
  users(role: USER, limit: 5) {
    id
    name
    email
    role
  }
}
```

### Get Single User
Fetch a user by ID.

```graphql
query GetUser {
  user(id: 1) {
    id
    name
    email
    role
  }
}
```

---

## Protected Mutations (Auth Required)

### Create User
Create a new user (requires authentication).

```graphql
mutation CreateUser {
  createUser(createUserInput: {
    name: "Jane Doe"
    email: "jane@example.com"
  }) {
    id
    name
    email
    role
  }
}
```

### Update User
Update an existing user.

```graphql
mutation UpdateUser {
  updateUser(updateUserInput: {
    id: 1
    name: "John Updated"
    email: "john.updated@example.com"
    role: ADMIN
  }) {
    id
    name
    email
    role
  }
}
```

### Remove User
Delete a user by ID.

```graphql
mutation RemoveUser {
  removeUser(id: 1)
}
```

---

## Types

### User
```graphql
type User {
  id: Int!
  name: String!
  email: String!
  role: String!
}
```

### AuthResponse
```graphql
type AuthResponse {
  accessToken: String!
  user: User!
}
```

### Role Enum
```graphql
enum Role {
  USER
  ADMIN
}
```

### Input Types
```graphql
input RegisterInput {
  name: String!
  email: String!
  password: String!  # Min 8 characters
}

input LoginInput {
  email: String!
  password: String!
}

input CreateUserInput {
  name: String!
  email: String!
}

input UpdateUserInput {
  id: Int!
  name: String
  email: String
  role: Role
}
```

---

## Example cURL Commands

### Register
```bash
curl -X POST http://localhost:3300/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { register(registerInput: { name: \"John\", email: \"john@example.com\", password: \"password123\" }) { accessToken user { id name } } }"
  }'
```

### Login
```bash
curl -X POST http://localhost:3300/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(loginInput: { email: \"john@example.com\", password: \"password123\" }) { accessToken } }"
  }'
```

### Protected Query (with token)
```bash
curl -X POST http://localhost:3300/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query { me { id name email role } }"
  }'
```

---

## Error Responses

### Unauthorized (No token)
```json
{
  "errors": [
    {
      "message": "Unauthorized"
    }
  ]
}
```

### Invalid Credentials
```json
{
  "errors": [
    {
      "message": "Invalid credentials"
    }
  ]
}
```

### User Already Exists
```json
{
  "errors": [
    {
      "message": "User with this email already exists"
    }
  ]
}
```

### Validation Error
```json
{
  "errors": [
    {
      "message": "Password must be at least 8 characters"
    }
  ]
}
```
