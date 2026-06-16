# Roadmap — 404Sleep

## Phase 1: Backend Foundation (Current)

- [x] Express server setup with middleware (helmet, cors, morgan, JSON parser)
- [x] MongoDB connection via Mongoose (`config/db.js`)
- [x] Environment variables in `.env` (PORT, MONGO_URI, JWT_SECRET, NODE_ENV)
- [x] Global error handling middleware
- [x] Logger utility (`utils/logger.js`)
- [x] Directory structure: `routes/`, `controllers/`, `services/`, `models/`, `middleware/`

## Phase 2: Authentication & Authorization

- [ ] Install `bcryptjs` for password hashing
- [ ] Create `auth.controller.js`, `auth.service.js`, `auth.routes.js`
- [ ] `POST /api/auth/register` — hash password, create user, return JWT
- [ ] `POST /api/auth/login` — verify credentials, return JWT
- [ ] `GET /api/auth/profile` — return current user from token
- [ ] Add role-based authorization middleware (`requireRole`)
- [ ] Protect admin-only routes (e.g., `DELETE /api/users/:id`)

## Phase 3: Data Validation & Security

- [ ] Install `joi` or `express-validator` for request validation
- [ ] Create validation schemas for auth & user input
- [ ] Add validation middleware to routes
- [ ] Rate limiting with `express-rate-limit`
- [ ] Input sanitization & XSS protection

## Phase 4: Repository Layer (Separation of Concerns)

- [ ] Create `src/repositories/user.repository.js`
- [ ] Move raw DB queries from services to repositories
- [ ] Services call repositories instead of models directly

## Phase 5: Main Resource CRUD (Products)

- [ ] Create `Product` Mongoose model (`models/product.model.js`)
- [ ] Create `product.repository.js`
- [ ] Create `product.service.js`
- [ ] Create `product.controller.js`
- [ ] Create `product.routes.js` (CRUD + auth-protected)
- [ ] Register product routes in `routes/index.js`

## Phase 6: Additional Resources (Orders / Cart / etc.)

- [ ] Create Order model, repository, service, controller, routes
- [ ] Create Cart model, repository, service, controller, routes
- [ ] Wire all routes into `routes/index.js`

## Phase 7: Swagger API Documentation

- [ ] Install `swagger-jsdoc` and `swagger-ui-express`
- [ ] Define Swagger specification with JSDoc annotations on routes
- [ ] Mount Swagger UI at `/api-docs`
- [ ] Ensure all endpoints are documented with request/response schemas
- [ ] Enable "Try it out" for testable requests

## Phase 8: Error Handling & HTTP Status Codes

- [ ] Create custom error classes (`AppError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ValidationError`)
- [ ] Refactor global error handler to use custom errors
- [ ] Ensure all controllers return proper HTTP codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Add 404 catch-all for unknown routes

## Phase 9: Testing

- [ ] Install testing framework (`jest` + `supertest`)
- [ ] Write unit tests for services & repositories
- [ ] Write integration tests for API endpoints
- [ ] Add test script to `package.json`

## Phase 10: Frontend Integration — Setup & Auth

- [ ] Create `index.html` (Vite requirement)
- [ ] Create `vite.config.ts` with proxy to backend
- [ ] Wire `AuthProvider` into the component tree (`main.tsx` / `App.tsx`)
- [ ] Build out `LoginForm` (email, password, submit, error display)
- [ ] Build out `RegisterForm` (name, email, password, confirm)
- [ ] Create Login page & Register page with routing
- [ ] Create protected route wrapper (`PrivateRoute` component)
- [ ] Redirect to login if unauthenticated
- [ ] Fix `authService.ts` to use shared `api.ts` instance

## Phase 11: Frontend — Dashboard & Main Pages

- [ ] Create layout component (navbar, sidebar, main content area)
- [ ] Create Dashboard page
- [ ] Create Product list page (fetch & display products)
- [ ] Create Product detail page
- [ ] Create Order history page
- [ ] Create Cart page
- [ ] Create Profile/Account page

## Phase 12: Frontend — API Integration

- [ ] Create `features/products/services/productService.ts`
- [ ] Create `features/products/hooks/useProducts.ts`
- [ ] Create `features/orders/services/orderService.ts`
- [ ] Create `features/cart/services/cartService.ts`
- [ ] Connect all pages to real API endpoints

## Phase 13: Frontend — Polish & Deployment

- [ ] Add loading states & error boundaries
- [ ] Responsive design
- [ ] Environment config for production API URL
- [ ] Build & deploy frontend
- [ ] Build & deploy backend
