# node-ts-mongo-starter-kit

A production-ready Node.js starter kit built with TypeScript, Express, and MongoDB.
Follows a **Modular Monolith** architecture — vertically sliced by feature, layered internally, and structured to scale.

---

## Tech Stack

- **Runtime** — Node.js >= 20 with TypeScript (`nodenext` module resolution)
- **Framework** — Express.js
- **Database** — MongoDB via Mongoose
- **Logging** — Winston (console + file + MongoDB transport)
- **Rate Limiting** — `express-rate-limit`
- **Code Quality** — ESLint (flat config), Prettier, Commitlint, Husky, Commitizen

---

## Architecture

### What is a Modular Monolith?

A **Modular Monolith** is a single deployable application divided into self-contained, vertical feature slices. Each module owns everything it needs — routes, controller, service, model, and validation — with no cross-cutting layer jumping.

It is not a stepping stone to microservices. It is a legitimate production architecture used by companies like Shopify, Stack Overflow, and Basecamp at massive scale.

```
One deployed app (monolith)
│
├── modules/auth/     ← fully self-contained vertical slice
├── modules/user/     ← fully self-contained vertical slice
└── modules/health/   ← fully self-contained vertical slice
```

If you ever need to extract a module into its own microservice, everything you need is already in one folder — the boundaries are already clean.

### Architectural Influences

This project combines ideas from several well-known patterns:

| Pattern                  | How it influences this project                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **Modular Monolith**     | Top-level structure — one folder per feature, vertical slicing                                |
| **Layered / N-Tier**     | Applied _inside_ each module — routes → controller → service → model                          |
| **MVC**                  | Controller/Model separation, no View layer (API only)                                         |
| **Clean Architecture**   | `infrastructure/` isolated from business logic, `shared/` has no module dependencies          |
| **Domain-Driven Design** | `ErrorCode` uses domain prefixes (`AUTH_`, `ACCESS_`), exceptions named after domain concepts |

### Philosophy

Each **feature** owns all of its own code — routes, controller, service, model, and validation live together in one folder. There are no cross-cutting layers to navigate. When you work on `auth`, you stay inside `modules/auth/`.

```
src/
│
├── modules/                        # Feature modules (one folder per domain feature)
│   │
│   ├── auth/                       # Authentication feature
│   │   ├── auth.routes.ts          # Route definitions → maps URLs to controller methods
│   │   ├── auth.controller.ts      # Request handlers → parse req, call service, send res
│   │   ├── auth.service.ts         # Business logic → all auth rules live here
│   │   ├── auth.model.ts           # Mongoose schema + model for auth/user persistence
│   │   └── auth.validation.ts      # Zod schemas → validate incoming request bodies
│   │
│   ├── user/                       # User profile feature
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.model.ts
│   │   └── user.validation.ts
│   │
│   └── health/                     # Health check feature
│       ├── health.routes.ts
│       └── health.controller.ts    # No service needed — just status checks
│
├── infrastructure/                 # External concerns (no business logic here)
│   │
│   ├── database/                   # MongoDB connection management
│   │   ├── connectDatabase.ts      # Connect + reconnect on disconnect
│   │   └── models/
│   │       └── log.model.ts        # Mongoose model for Winston log storage
│   │
│   └── logger/                     # Winston logger setup
│       ├── index.ts                # Logger instance export
│       ├── logger.ts               # Transport configuration
│       └── mongoTransport.ts       # Custom Winston → MongoDB transport
│
├── interfaces/                     # HTTP adapter layer
│   │
│   └── http/
|       ├── routes/
│       |    └──index.ts            # Single route registry — all versioned routes registered here
│       └── middleware/
│           ├── notFound.middleware.ts      # 404 handler for unmatched routes
│           ├── errorHandler.middleware.ts  # Global error handler
│           ├── requestLogger.middleware.ts # Morgan → Winston HTTP request logging
│           └── authenticate.middleware.ts  # JWT verification guard
│
├── common/                         # Utilities shared across all modules
│   │
│   ├── constants/
│   │   └── index.ts                # APP_LOG_MESSAGE, ENVIRONMENTS, HTTP status codes
│   │
│   ├── enums/
│   │   └── errorCode.enum.ts       # ErrorCode — domain-prefixed error identifiers
│   │
│   ├── errors/
│   │   ├── AppError.ts             # Base error class — statusCode, errorCode, isOperational
│   │   └── errorException.ts       # HttpException, NotFoundException, BadRequestException, etc.
│   │
│   ├── utils/
│   │   ├── asyncHandler.ts         # Wraps async controllers — eliminates try/catch
│   │   └── response.ts             # successResponse, errorResponse, TApiResponse
│   │
│   └── types/
│       └── express.d.ts            # Extends Express Request (e.g. req.user)
│
├── config/                         # App-level configuration
│   ├── app.ts                      # Express app factory — registers middleware + routes
│   ├── env.config.ts               # dotenv loader + environment variable validation
│   └── rateLimiter.config.ts       # express-rate-limit configuration
│
└── index.ts                        # Bootstrap — validates env, connects DB, starts server
```

---

### Layer Responsibilities

#### `modules/[feature]/`

Each module is fully self-contained. The data flow through a module is always:

```
Request → Route → Middleware → Controller → Service → Model → Database
                                    ↓
Response ←──────────────────── Controller
```

| File              | Responsibility                                                       | Must NOT                                    |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------- |
| `*.routes.ts`     | Map HTTP verbs + paths to controllers. Apply route-level middleware. | Contain logic or DB calls                   |
| `*.controller.ts` | Parse `req`, call service, send `res`. Handle HTTP concerns only.    | Contain business rules or direct DB access  |
| `*.service.ts`    | All business logic. Calls the model. Throws `ApiError` on failure.   | Know about `req`/`res` or HTTP status codes |
| `*.model.ts`      | Mongoose schema, indexes, virtuals, instance methods.                | Contain HTTP or business logic              |
| `*.validation.ts` | Zod schemas for request body/params/query.                           | Contain logic beyond schema definition      |

#### `infrastructure/`

Wires up external dependencies. Code here has no knowledge of features or business rules.

#### `interfaces/http/middleware/`

Express middleware that applies across modules — auth guards, error handling, request logging. Not feature-specific.

#### `shared/`

Pure utilities with zero dependencies on modules or infrastructure. Safe to import from anywhere.

#### `config/`

Environment loading, Express app factory, and global config. Imported only by `index.ts` and `app.ts`.

---

### Data Flow Example — `POST /api/v1/auth/register`

```
POST /api/v1/auth/register
        │
        ▼
[ rateLimiter ]              ← blocks if IP exceeds limit
        │
        ▼
[ requestLogger ]            ← logs method, path, status, response time
        │
        ▼
[ auth.routes.ts ]           ← matches POST /register
        │
        ▼
[ validateRequest(schema) ]  ← Zod parses + validates req.body
        │
        ▼
[ auth.controller.ts ]       ← extracts validated body, calls service
        │
        ▼
[ auth.service.ts ]          ← checks email exists, hashes password,
        │                       creates user, signs JWT, returns token
        ▼
[ auth.model.ts ]            ← Mongoose reads/writes MongoDB
        │
        ▼
[ auth.controller.ts ]       ← wraps result in ApiResponse, sends 201
        │
        ▼
     Response

     ── on any thrown ApiError ──────────────────────────▶ [ errorHandler.middleware.ts ]
                                                                      │
                                                              structured error response
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone https://github.com/RahulProgX/node-ts-mongo-starter-kit.git
cd node-ts-mongo-starter-kit
pnpm install
or
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

| Variable     | Description                     | Required |
| ------------ | ------------------------------- | -------- |
| `PORT`       | Port the HTTP server listens on | ✓        |
| `NODE_ENV`   | `development` or `production`   | ✓        |
| `MONGO_URI`  | MongoDB connection string       | ✓        |
| `APP_ORIGIN` | Allowed CORS origin             | ✓        |
| `JWT_SECRET` | Secret key for signing JWTs     | ✓        |

### Development

```bash
pnpm dev
or
npm run dev
```

Uses `tsx watch` — no build step, restarts on file change.

### Production

```bash
pnpm  build   # tsc + tsc-alias
pnpm start       # node dist/index.js
or
npm run build
npm start
```

---

## Scripts

| Script              | Description                                     |
| ------------------- | ----------------------------------------------- |
| `pnpm dev`          | Start dev server with hot reload                |
| `pnpm build`        | Compile TypeScript + resolve `@/*` path aliases |
| `pnpm start`        | Run compiled production build                   |
| `pnpm lint`         | Run ESLint                                      |
| `pnpm lint:fix`     | Run ESLint with auto-fix                        |
| `pnpm format`       | Format all files with Prettier                  |
| `pnpm format:check` | Check formatting without writing                |
| `pnpm commit`       | Interactive conventional commit via Commitizen  |
| `pnpm changelog`    | Append to CHANGELOG.md from commit history      |

---

## Logging

Three Winston transports run simultaneously on every `logger.*()` call:

| Transport | Levels | Format    | Active           |
| --------- | ------ | --------- | ---------------- |
| Console   | info+  | Colorized | Development only |
| File      | info+  | JSON      | Always           |
| MongoDB   | info+  | Document  | Always           |

**File:** `logs/application.log`

**MongoDB collection:** `logs`

```js
db.logs.find({ level: "ERROR" }).sort({ timestamp: -1 });
db.logs.find({ level: "WARN" }).limit(20);
```

---

## Rate Limiting

Global rate limiter applied before all routes:

- **Window** — 15 minutes
- **Limit** — 100 requests per IP
- **Headers** — `RateLimit` (IETF draft-8)

Configure in `src/config/rateLimiter.config.ts`.

---

## Path Aliases

```typescript
import logger from "@/infrastructure/logger/index.js";
import { ApiError } from "@/shared/utils/ApiError.js";
import envConfig from "@/config/env.config.js";
```

Resolved at compile time via `tsc-alias`.

---

## Commit Convention

```bash
pnpm  commit   # Commitizen interactive prompt
or
npm run commit
```

Enforced via `commitlint` + Husky on `commit-msg` hook.

**Types:** `feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `build` `ci` `revert`

---

## Project Status

| Feature                            | Status |
| ---------------------------------- | ------ |
| Express app setup                  | ✅     |
| MongoDB connection + reconnect     | ✅     |
| Winston logger (3 transports)      | ✅     |
| Environment validation             | ✅     |
| Global rate limiting               | ✅     |
| Path aliases (`@/*`)               | ✅     |
| Graceful shutdown (SIGTERM/SIGINT) | ✅     |
| ESLint flat config + Prettier      | ✅     |
| Commitlint + Husky + Commitizen    | ✅     |
| ErrorCode enum                     | ✅     |
| AppError + exception classes       | ✅     |
| asyncHandler                       | ✅     |
| successResponse / errorResponse    | ✅     |
| Error handling middleware          | ✅     |
| 404 not found middleware           | ✅     |
| Health check endpoint              | ✅     |
| Security hardening (helmet, hpp)   | ✅     |
| HTTP request logging (morgan)      | ✅     |
| Auth module (JWT register/login)   | 🔲     |
| Input validation (Zod)             | 🔲     |

---

# 🤝 Contributing

Pull requests are welcome.

If you want to improve:

- build system
- deployment
- developer experience

feel free to contribute.

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**RahulProgX**

🚀 Full-Stack Engineer | TypeScript Enthusiast | System Design Learner
