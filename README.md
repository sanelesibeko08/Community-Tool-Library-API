# Community Tool Library API

A REST API for a community tool library. Members can browse and add tools to the
shared inventory, authenticate with email and password, and borrow and return
tools through loan records.

## Features

- Tool inventory with category, condition, and availability filtering.
- Loan creation, listing, and return operations.
- JWT bearer-token authentication for loan routes.
- Bcrypt password-hash verification for member login.
- Consistent JSON error responses and request logging.
- Interactive API documentation powered by Swagger UI.
- In-memory seed data for tools and a configurable demo member.

## Requirements

- Node.js 18 or later
- npm

## Run locally

Install dependencies and start the server:

```sh
npm install
npm start
```

By default, the API listens on `http://localhost:4001`. Swagger UI is available
at [http://localhost:4001/api-docs](http://localhost:4001/api-docs), and the
OpenAPI document is in [`docs/openapi.json`](./docs/openapi.json).

## Configuration

The application loads environment variables from `.env` using `dotenv`.
Configuration options are:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4001` | HTTP port |
| `JWT_SECRET` | Development-only fallback | Secret used to sign and verify JWTs. Set a strong value outside local development; it is required when `NODE_ENV=production`. |
| `DEMO_MEMBER_ID` | `member-1` | ID assigned to the seeded member |
| `DEMO_MEMBER_USERNAME` | `member1` | Username retained on the seeded member |
| `DEMO_MEMBER_EMAIL` | `member1@example.com` | Email accepted by the login endpoint |
| `DEMO_MEMBER_PASSWORD` | `password123` | Password hashed for the seeded member at startup |

For example:

```dotenv
PORT=4001
JWT_SECRET=replace-with-a-long-random-secret
DEMO_MEMBER_ID=member-1
DEMO_MEMBER_EMAIL=member1@example.com
DEMO_MEMBER_PASSWORD=change-this-password
```

The defaults are for local development only. Configure a private JWT secret
and non-default demo credentials when appropriate.

## API overview

All successful responses use a `data` property. Error responses use the shape
`{"error":"CODE","message":"description"}`.

### Tools

| Method and path | Description |
| --- | --- |
| `GET /api/tools` | List tools. Optional `available=true` or `available=false` filters by availability. |
| `POST /api/tools` | Add a tool. Requires `name`, `category`, and `condition`. |

Tool categories are `Power Tools`, `Hand Tools`, and `Garden`; conditions are
`good`, `fair`, and `poor`. New tools are available by default.

Example request:

```json
{
  "name": "Cordless Drill",
  "category": "Power Tools",
  "condition": "good"
}
```

### Authentication

| Method and path | Description |
| --- | --- |
| `POST /api/auth/login` | Authenticate with `email` and `password`; returns a JWT that expires after 24 hours. |

Example request:

```json
{
  "email": "member1@example.com",
  "password": "password123"
}
```

Successful login returns:

```json
{
  "data": {
    "token": "<jwt>"
  }
}
```

Send the token to protected endpoints in the header:

```text
Authorization: Bearer <jwt>
```

### Loans

All loan endpoints require a valid bearer token.

| Method and path | Description |
| --- | --- |
| `GET /api/loans` | List the loans held in the in-memory store. |
| `POST /api/loans` | Borrow an available tool using `toolId` and `dueDate`. The member ID comes from the authenticated token. |
| `DELETE /api/loans/{id}` | Mark the loan returned and make its tool available again. |

The create request uses a `toolId` and a due date (for example,
`2026-12-01`). A returned loan has `returnedAt` set to the return date.

## Data and persistence

Tools and loans are stored in memory in `src/data/store.js`. The store starts
with sample tools and a demo member; loans start empty. Changes made through
the API are not persisted and are lost when the process restarts. The demo
member's password is hashed with bcrypt when the store is initialized.

## Project layout

```text
.
├── app.js                    # Express app, middleware, routes, Swagger UI
├── index.js                  # Starts the HTTP server
├── docs/
│   ├── api-contract.json     # API contract
│   └── openapi.json          # OpenAPI 3 specification
└── src/
    ├── config.js             # Environment-based configuration
    ├── data/store.js         # In-memory tools, loans, members, and ID helper
    ├── middleware/
    │   ├── auth.js           # JWT verification
    │   ├── errorHandler.js   # Centralized error responses
    │   └── logging.js        # Request/response timing logs
    ├── routes/
    │   ├── auth.js           # Login
    │   ├── loans.js          # Loan management
    │   └── tools.js          # Tool inventory
    └── utils/
        └── errorResponse.js  # Standard error response helpers
```

## Dependencies and scripts

The project uses Express for HTTP routing, `jsonwebtoken` for JWTs, `bcrypt`
for password verification, `dotenv` for environment configuration, and
`swagger-ui-express` to serve the interactive API documentation.

- `npm start` starts the API.
- The current `npm test` script is a placeholder and does not run an automated
  test suite.
