# Roadmap — 404Sleep

## Phase 0: Backend Audit & Mongoose Removal (Completed)

- [x] Removed MongoDB/Mongoose entirely — migrated User model to Prisma/MySQL
- [x] Rewrote user.service.js, auth.controller.js, user.controller.js for Prisma
- [x] Deleted `user.model.js`, `config/db.js`, removed `mongoose` from package.json
- [x] Regenerated Prisma client with User model and FK relations to all child tables

- [x] Fix `src/app.js` — removed undefined `adminRoute` reference (was not imported, would crash on startup)
- [x] Create `src/lib/prisma.js` — Prisma client singleton (was missing, `adminRoute.js` required it)
- [x] Fix `prisma/schema.prisma` — added `isSuspended` field to User model, `createdAt` to Organization model
- [x] Fix `.env` — removed duplicate `JWT_SECRET` and `PORT` entries, cleaned up prisma-init comments
- [x] Fix role mismatch — simplified to a flat admin model (`admin` is sole privileged role, not publicly registerable)

## Phase 1: Backend Foundation (Completed)

- [x] Express server setup with middleware (helmet, cors, morgan, JSON parser)
- [x] MySQL database via Prisma ORM (single database — no more MongoDB/Mongoose)
- [x] Environment variables in `.env`
- [x] Global error handling middleware
- [x] Logger utility (`utils/logger.js`)
- [x] Directory structure: `routes/`, `controllers/`, `services/`, `middleware/`, `lib/`
- [x] Prisma schema with full data models (User, Organization, Project, Application, Survey, ContentReport, SavedProject)
- [x] Prisma client singleton (`src/lib/prisma.js`)

## Phase 2: Authentication & Authorization (Completed)

- [x] User registration (`POST /api/auth/register`) — hashed passwords, JWT returned
- [x] User login (`POST /api/auth/login`) — credential verification, JWT returned
- [x] Profile endpoints (`GET/PUT /api/auth/profile`, `PUT /api/auth/password`)
- [x] JWT auth middleware (`auth.middleware.js`)
- [x] Role-based admin middleware (`requireAdmin.js` — `admin` role only)
- [x] Admin routes with role guard (stats, org approval, user suspend)

## Phase 3: User & Organization Management (Completed)

- [x] User CRUD (`GET/POST/PUT/DELETE /api/users`)
- [x] Organization self-registration (`POST /api/orgs/register`)
- [x] Organization profile (`GET /api/orgs/:id`, `PUT /api/orgs/:id`, `GET /api/orgs/my`)
- [x] Admin org approval workflow (`GET /api/admin/orgs/pending`, `PATCH approve/reject`)
- [x] Admin user management (`GET /api/admin/users`, `PATCH suspend`)

## Phase 4: Opportunity Lifecycle (Completed)

- [x] Create opportunity (`POST /api/opportunities`) — title, description, skills, location, deadline
- [x] List opportunities with search & filters (`GET /api/opportunities`)
  - Search by title/description (`?search=`)
  - Filter by skill (`?skill=`), location (`?location=`), organization (`?orgId=`)
  - Pagination (`?page=&limit=`)
- [x] Get opportunity details (`GET /api/opportunities/:id`)
- [x] Update / delete opportunity (`PUT/DELETE /api/opportunities/:id`)
- [x] Save / unsave opportunity (`POST/DELETE /api/opportunities/:id/save`)
- [x] List saved opportunities (`GET /api/opportunities/saved`)

## Phase 5: Application Lifecycle (Completed)

- [x] Submit application (`POST /api/applications`) — with optional message
- [x] List user's applications (`GET /api/applications/mine`)
- [x] List applications for a project (`GET /api/applications/project/:projectId`)
- [x] Accept / reject application (`PATCH /api/applications/:id/review`)
- [x] Prevents duplicate applications (unique constraint on userId + projectId)

## Phase 6: Surveys (Completed)

- [x] Create survey (`POST /api/surveys`) — title, description, questions (JSON)
- [x] List surveys with response counts (`GET /api/surveys`)
- [x] Get survey details with responses (`GET /api/surveys/:id`)
- [x] Submit survey response (`POST /api/surveys/:id/respond`)
- [x] Prevents duplicate responses (one response per user per survey)

## Phase 7: Content Moderation (Completed)

- [x] Report content (`POST /api/moderation`) — targetType, targetId, reason, description
- [x] List reports with optional status filter (`GET /api/moderation?status=`)
- [x] Get report details (`GET /api/moderation/:id`)
- [x] Review report — dismiss or resolve (`PATCH /api/moderation/:id/review`)

## Phase 8: Admin Dashboard (Completed)

- [x] Stats endpoint (`GET /api/admin/stats`) — total users, orgs, projects, applications
- [x] Org approval workflow
- [x] User management (list, suspend)

## Phase 10: Frontend — Auth & Navigation (Completed)

- [x] Vite + React + TailwindCSS + React Router setup with backend proxy
- [x] Auth context (`AuthContext.jsx`) — JWT token management, profile fetch, login/logout
- [x] Axios API service with interceptor (auto-attach Bearer token, handle 401)
- [x] Login page — form validation, calls `POST /api/auth/login`, stores JWT
- [x] Register page — form with validation, calls `POST /api/auth/register`
- [x] Role selection page — pick volunteer or organization path
- [x] Protected route wrapper — redirects to login if unauthenticated
- [x] Header — nav links, search input, user avatar dropdown, login/signup CTA
- [x] Footer — links to all sections, social placeholders
- [x] Toast notification system

## Phase 11: Frontend — Pages (Completed)

- [x] Home page — hero, stats, category filter, opportunity cards, featured orgs, how-it-works
- [x] About Us page — mission, story, values, team
- [x] Opportunities listing page — category filter, search, pagination, save/unsave toggle (connected to API)
- [x] Opportunity detail page — full info, skills, org bio, apply + save buttons (connected to API)
- [x] Apply success page — confirmation with summary (uses navigation state)
- [x] Profile page — account info, applications list, saved list, password change (all connected to API)
- [x] Interest Survey page — fetch surveys from API, answer questions, submit response
- [x] Organization registration page — two-step form with org details, calls auth + org APIs
- [x] Organization dashboard — view applications per opportunity, accept/reject
- [x] Create opportunity form — title, description, skills, location, deadline (calls POST /api/opportunities)

## Phase 12: Frontend — API Service Layer (Completed)

- [x] `services/api.js` — shared Axios instance with auth interceptor
- [x] `services/opportunityService.js` — list, getById, create, update, delete, save, unsave, getSaved
- [x] `services/applicationService.js` — submit, getMine, getByProject, review
- [x] `services/surveyService.js` — list, getById, create, respond
- [x] `services/orgService.js` — register, getAll, getById, update
- [x] `features/auth/services/authService.js` — login, register, getProfile, updateProfile, changePassword
- [x] `utils/formatDate.js` — date formatting utility

## Phase 13: Planned Improvements

- [ ] Admin dashboard frontend (manage users, orgs, content reports)
- [x] Opportunity creation form for organizations (`/org/opportunities/new`)
- [x] Application review UI for organizations (`/org/applications`)
- [ ] Content moderation UI
- [ ] Email notifications
- [ ] File uploads (profile images, org logos)
- [ ] Input validation (`joi` or `express-validator`)
- [ ] Rate limiting (`express-rate-limit`)
- [ ] Swagger API documentation
- [ ] Custom error classes
- [ ] Unit & integration tests (jest + supertest)
- [ ] Password reset flow
