# NexDine AI

**A white-label, multi-tenant restaurant ordering and management platform** built with React, Node.js, TypeScript and microservices.

NexDine AI is designed for restaurant businesses that want their own branded customer ordering experience, restaurant operations dashboard and delivery-partner mobile app—without operating a public restaurant marketplace.

> **Project status:** Work in progress. This repository is being developed incrementally. The README describes the intended platform and development setup; not every listed module or integration is implemented yet.

## Product vision

Each restaurant client (tenant) can configure its own:

- Brand name, logo, colors, domain and storefront settings
- Menu, categories, dishes, variants, addons and availability
- Opening hours, ordering options, taxes, delivery fees and service areas
- Customers, staff, orders, payments and delivery operations

The platform uses a shared codebase with tenant-scoped data access. Tenant identity must be resolved from a trusted domain or authenticated identity—not trusted from an arbitrary request body or query parameter.

### Applications

| Application | Purpose | Planned technology |
|---|---|---|
| Customer ordering app | Browse a restaurant's menu, customize dishes, checkout and track orders | React, TypeScript, Redux Toolkit, Tailwind CSS |
| Restaurant dashboard | Manage restaurant settings, menu, incoming orders, kitchen workflow and reports | React, TypeScript, Redux Toolkit, Tailwind CSS |
| Delivery-partner app | Go online/offline, accept jobs, navigate, update delivery status and view earnings | React Native, Expo, TypeScript |

### Ordering channels

- Web/customer app
- WhatsApp Business ordering and order-status updates (planned)
- Alexa voice ordering and tracking (planned; subject to Amazon skill and purchase requirements)

All channels are intended to use the same Menu, Order, Payment and Delivery services. Channel integrations must not create a separate order-processing or pricing system.

## Technology stack

| Area | Technology |
|---|---|
| Frontend | React, Hooks, TypeScript, Vite |
| State and API data | Redux Toolkit, RTK Query |
| Styling | Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Validation | Zod |
| Document database | MongoDB, Mongoose |
| Relational database | PostgreSQL, Prisma ORM 7 |
| Messaging | RabbitMQ initially; Kafka as an advanced extension |
| Testing | Jest, Supertest, React Testing Library, Playwright |
| Containers | Docker, Docker Compose |
| Cloud target | AWS (ECR, ECS, RDS, S3, Secrets Manager, CloudWatch) |
| AI target | LLM integration, RAG, MCP and agentic workflows |

## Architecture (target)

The platform is organized around independently deployable services. Each service owns its data and exposes APIs or events; services must not directly read or write another service's database.

| Service | Responsibility | Intended data store |
|---|---|---|
| API Gateway | Routing, request limits, tenant resolution and cross-cutting concerns | None |
| Auth Service | Login, OAuth 2.0 / OpenID Connect, JWT, roles and permissions | PostgreSQL |
| Restaurant/Tenant Service | Tenant profile, branding, business settings and operating hours | MongoDB |
| Menu Service | Categories, food items, customizations and availability | MongoDB |
| Order Service | Checkout, order lifecycle and purchase snapshots | PostgreSQL |
| Payment Service | Payment sessions, provider webhooks and refunds | PostgreSQL |
| Delivery Service | Partner profiles, assignments and delivery tracking | PostgreSQL |
| Notification Service | Email, SMS, push and channel notifications | Provider/event integrations |
| Channel Service | WhatsApp webhooks/conversations and Alexa skill adapter | PostgreSQL/Redis as appropriate |
| AI Service | Restaurant/menu retrieval, assistant tools and agent workflows | Vector store as appropriate |

RabbitMQ is the initial event broker for order, payment, kitchen, delivery and notification events. Kafka may be introduced for higher-throughput event streaming and analytics.

## Repository layout

The workspace is a pnpm monorepo:

```text
nexdine-ai/
├── apps/
│   ├── web/                     # Customer ordering app
│   ├── restaurant-dashboard/    # Restaurant operations UI
│   └── delivery-partner/        # React Native / Expo app
├── services/
│   ├── api-gateway/
│   ├── restaurant-service/
│   ├── menu-service/
│   ├── order-service/
│   ├── auth-service/            # Planned
│   ├── payment-service/         # Planned
│   ├── delivery-service/        # Planned
│   ├── notification-service/    # Planned
│   ├── channel-service/         # Planned
│   └── ai-service/              # Planned
├── packages/
│   ├── contracts/               # Shared API/event contracts
│   ├── shared/                  # Shared utilities and types
│   └── config/                  # Shared tooling configuration
├── infrastructure/
│   ├── docker/
│   └── aws/
├── docs/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

Some directories and services may not exist until their implementation phase. The earlier `product-service` is a legacy e-commerce scaffold and is not part of the target restaurant domain.

## Prerequisites

Install the following on your development machine:

- Git
- Node.js (Node.js 24 is the current development baseline; use the version required by the root package and dependencies)
- pnpm
- Docker Desktop with Docker Compose

Check versions:

```bash
node --version
npm --version
git --version
pnpm --version
docker --version
docker compose version
```

Install pnpm if it is not available:

```bash
npm install --global pnpm
```

Start Docker Desktop before starting the database containers.

## 1. Clone the repository

```bash
git clone https://github.com/riteshk1812/nexdine-ai.git
cd nexdine-ai
```

## 2. Install workspace dependencies

Run this at the repository root:

```bash
pnpm install
```

The root `pnpm-workspace.yaml` should include the workspace globs:

```yaml
packages:
  - "apps/*"
  - "services/*"
  - "packages/*"
```

List workspace packages:

```bash
pnpm list -r --depth -1
```

If a workspace filter does not match, use the list command to check the actual package names.

## 3. Configure local environment variables

Never commit real `.env` files, passwords, access tokens, OAuth secrets, payment secrets or private keys. Copy the relevant `.env.example` file when one is provided, then fill in your local values.

Check the environment files available in the repository:

```bash
find apps services -name ".env.example" -o -name ".env.*.example"
```

### Docker Compose credentials

If `docker-compose.yml` uses variable substitutions, create a root `.env` file with values matching the variable names referenced in that Compose file. For example:

```env
MONGO_ROOT_USERNAME=replace_with_local_username
MONGO_ROOT_PASSWORD=replace_with_local_password
POSTGRES_USER=replace_with_local_username
POSTGRES_PASSWORD=replace_with_local_password
POSTGRES_DB=nexcommerce
RABBITMQ_DEFAULT_USER=replace_with_local_username
RABBITMQ_DEFAULT_PASS=replace_with_local_password
```

The names above are examples. **The variable names in the root `.env` must match the names actually referenced by `docker-compose.yml`.** Do not overwrite an existing working database user's credentials casually: the official database images use initialization variables when initializing a fresh data directory, not as an automatic password-reset mechanism for an existing volume.

### Service environment examples

Use the actual environment keys read by each service's `src/config/env.ts`. Typical local values are shown below; replace credentials and keep database names consistent with your Docker Compose setup.

**Restaurant Service — `services/restaurant-service/.env`**

```env
NODE_ENV=development
PORT=4001
MONGODB_URI=mongodb://<username>:<URL_ENCODED_PASSWORD>@127.0.0.1:27017/nexcommerce_restaurants?authSource=admin
LOG_LEVEL=debug
```

**Menu Service — `services/menu-service/.env`**

```env
NODE_ENV=development
PORT=4005
MONGODB_URI=mongodb://<username>:<URL_ENCODED_PASSWORD>@127.0.0.1:27017/nexcommerce_menus?authSource=admin
RESTAURANT_SERVICE_URL=http://localhost:4001
LOG_LEVEL=debug
```

**Order Service — `services/order-service/.env`**

```env
NODE_ENV=development
PORT=4002
DATABASE_URL="postgresql://<username>:<URL_ENCODED_PASSWORD>@127.0.0.1:5432/<database_name>?schema=public"
PRODUCT_SERVICE_URL=http://localhost:4001
LOG_LEVEL=debug
TAX_RATE_BPS=0
SHIPPING_FEE_MINOR=0
```

The Order Service is being adapted from the earlier e-commerce scaffold. Update its service-to-service URL and request/response contracts to the Menu Service as the restaurant-order workflow is implemented. Do not assume the old Product Service contract is the final restaurant contract.

**API Gateway — `services/api-gateway/.env`**

```env
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=debug
```

**Customer app — `apps/web/.env.development`**

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

Vite variables prefixed with `VITE_` are exposed to browser code. Never put secrets in frontend environment variables.

If your local Compose or service configuration uses different variable names, use those actual names. Do not copy example credentials into a public repository.

## 4. Start infrastructure with Docker

From the repository root:

```bash
docker compose config
docker compose up -d
docker compose ps
```

The local infrastructure is intended to provide:

| Component | Default host port | Use |
|---|---:|---|
| MongoDB | 27017 | Restaurant and menu documents |
| PostgreSQL | 5432 | Orders and relational data |
| RabbitMQ AMQP | 5672 | Asynchronous service events |
| RabbitMQ management UI | 15672 | Local queue/exchange inspection |

Check container logs:

```bash
docker compose logs --tail=100
docker compose logs -f mongodb
docker compose logs -f postgres
docker compose logs -f rabbitmq
```

Container service names in `docker compose logs` must match the service names in your Compose file.

Stop containers without deleting persistent data:

```bash
docker compose down
```

Do not use `docker compose down -v` unless you intentionally want to delete database volumes and all data stored in them.

## 5. Prepare the PostgreSQL database and Prisma Client

The Order Service uses Prisma 7 with a PostgreSQL driver adapter and a generated client. After its `.env` is configured and PostgreSQL is running:

```bash
cd services/order-service
pnpm exec prisma validate
pnpm exec prisma migrate status
```

For a new local database with no existing migration history, apply the checked-in initial migration or create the initial migration during development:

```bash
pnpm exec prisma migrate dev --name init
```

Generate Prisma Client:

```bash
pnpm exec prisma generate
```

Return to the repository root:

```bash
cd ../..
```

For subsequent schema changes, create a new migration with a descriptive name:

```bash
cd services/order-service
pnpm exec prisma migrate dev --name describe_the_change
pnpm exec prisma generate
cd ../..
```

Do not run `migrate dev` against production. Production deployment should use `prisma migrate deploy` after reviewing the migration files.

## 6. Run the applications and services

Run each service in a separate terminal while developing. Start Docker first and configure each service's `.env` file.

### Customer React app

```bash
pnpm --filter web dev
```

Vite usually serves the app at:

```text
http://localhost:5173
```

### API Gateway

```bash
pnpm --filter @nexcommerce/api-gateway dev
```

Expected local port: `4000`.

### Restaurant Service

```bash
pnpm --filter @nexdine/restaurant-service dev
```

Expected local port: `4001`.

### Menu Service

```bash
pnpm --filter @nexdine/menu-service dev
```

Expected local port: `4005`.

### Order Service

```bash
pnpm --filter @nexcommerce/order-service dev
```

Expected local port: `4002`.

If a service package has not yet been created in your checkout, skip that command until the service is implemented. Confirm exact package names with `pnpm list -r --depth -1`.

## 7. Verify local services

The initial services expose health endpoints when implemented:

```bash
curl http://localhost:4000/api/v1/health
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4005/health
```

A successful health check should return HTTP 200 and a JSON response indicating the service is up. A database readiness check should also verify the service's database connection.

## 8. Useful development commands

Run from the repository root unless otherwise noted.

```bash
# Install dependencies
pnpm install

# List all workspace packages
pnpm list -r --depth -1

# Run the frontend
pnpm --filter web dev

# Type-check the frontend
pnpm --filter web exec tsc --noEmit

# Type-check services
pnpm --filter @nexdine/restaurant-service typecheck
pnpm --filter @nexdine/menu-service typecheck
pnpm --filter @nexcommerce/order-service typecheck

# Build services
pnpm --filter @nexdine/restaurant-service build
pnpm --filter @nexdine/menu-service build
pnpm --filter @nexcommerce/order-service build

# Inspect Compose services
docker compose ps

# Follow all container logs
docker compose logs -f

# Stop local infrastructure (preserves named volumes)
docker compose down
```

Root-level scripts such as `pnpm dev`, `pnpm build`, `pnpm test` and `pnpm lint` depend on the scripts configured in each workspace package and the root Turbo configuration.

## 9. Testing

The intended testing stack is:

- Jest for unit tests
- Supertest for backend HTTP integration tests
- React Testing Library for component tests
- Playwright for end-to-end browser tests

As test scripts are added to each workspace, run them with the corresponding package filter. For example:

```bash
pnpm --filter @nexdine/restaurant-service test
pnpm --filter @nexdine/menu-service test
pnpm --filter @nexcommerce/order-service test
```

Playwright tests should be run from the app or test workspace that owns the Playwright configuration.

## 10. Git workflow

Use a feature branch for each change. Keep `main` stable.

```bash
# Check current state
git status

# Update local main
git checkout main
git pull --rebase origin main

# Create a feature branch
git checkout -b feature/short-description

# Stage and review changes
git add .
git status
git diff --cached --check

# Commit
git commit -m "feat: describe the change"

# Push the feature branch
git push -u origin feature/short-description
```

Open a Pull Request on GitHub to merge the feature branch into `main` (or the project's integration branch, if one is introduced).

## Security and operational notes

- Never commit `.env`, credentials, private keys, database dumps or access tokens.
- Use separate credentials for local development, testing and production.
- Store production secrets in AWS Secrets Manager or an equivalent secret manager.
- Resolve tenant identity from a trusted hostname or verified authentication claims. Do not trust tenant IDs supplied only by the client.
- Enforce tenant scope in every read and write query.
- Verify payment webhooks using the provider's signature verification mechanism.
- Use idempotency keys for order creation and payment operations.
- Validate WhatsApp webhook signatures and deduplicate provider message IDs.
- Restrict delivery location access to authorized customers, restaurant staff and assigned delivery partners.
- Use TLS for production traffic and secure cookies for browser authentication.
- Never expose database ports publicly in production.

## Roadmap

- [x] Initial React/Vite, Express, Docker and database development foundation
- [ ] White-label tenant configuration and branding
- [ ] Tenant-scoped Restaurant and Menu services
- [ ] Customer cart, checkout and order workflow
- [ ] Authentication, OAuth 2.0, JWT and role-based access control
- [ ] Restaurant management dashboard and kitchen workflow
- [ ] Delivery Service and React Native delivery-partner app
- [ ] Payment gateway integration and verified webhooks
- [ ] RabbitMQ events, retries, dead-letter queues and Saga workflows
- [ ] WhatsApp ordering, notifications and tracking
- [ ] Alexa voice ordering and tracking (subject to platform requirements)
- [ ] Jest, Supertest, React Testing Library and Playwright coverage
- [ ] AWS deployment and CI/CD
- [ ] RAG, MCP and agentic restaurant assistant

## License

No license has been added yet. Until a license is selected, the repository remains under the default copyright rules.
