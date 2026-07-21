# Amazon E-Commerce — Project Roadmap

## Project Overview
Full-stack Amazon e-commerce clone (React 19 + Express + Sequelize + SQLite). Currently functional but needs hardening for production readiness.

## Current State
- ✅ Product catalog with search
- ✅ Shopping cart CRUD (add/remove/update quantity)
- ✅ Delivery options (3 tiers)
- ✅ Order placement and history
- ✅ Payment summary with tax calculation
- ✅ Delivery tracking with visual progress
- ✅ Database reset endpoint
- ✅ 5 test cases across 3 files (not runnable — missing test script)
- ⚠️ Axios has 15+ high-severity vulnerabilities
- ⚠️ Backend deps have known vulnerabilities
- ❌ No CI/CD pipeline

## Roadmap

### Phase 1 — Foundation Fixes (current)
- [ ] Add test script to frontend package.json
- [ ] Run existing tests, fix any failures
- [ ] Fix critical security vulnerabilities (axios update)
- [ ] Set up GitHub Actions CI (lint + test + build)

### Phase 2 — Quality & Polish
- [ ] Add backend test infrastructure (Vitest for Node)
- [ ] Write integration tests for all API endpoints
- [ ] Replace prop drilling with React Context (cart state)
- [ ] Add loading states and error boundaries
- [ ] Implement proper error handling in frontend

### Phase 3 — Production Hardening
- [ ] Add rate limiting to API
- [ ] Configure security headers (helmet)
- [ ] Input validation on all API endpoints
- [ ] Add health check endpoint
- [ ] Structured logging (winston/pino)

### Phase 4 — Developer Experience
- [ ] Add Docker setup for local dev
- [ ] Add CONTRIBUTING.md and issue templates
- [ ] Set up Dependabot for automated dependency updates
- [ ] Add pre-commit hooks (lint-staged)

### Phase 5 — Features (if scope expands)
- [ ] User authentication (demo login)
- [ ] Checkout form (address, payment mock)
- [ ] Order status management (admin)
- [ ] Pagination for product catalog
- [ ] Image optimization and lazy loading

## Trust Tiers (this project)
- All changes start at **Tier 2** (human approval required by default) until track record is established.
- Tier 3 auto-merge applies after ~50 merged PRs or 3 weeks.
- Tier 1 items (auth, payments, DB schema, security config, deploys) always require explicit human approval.

## Decision Log
*(to be recorded in docs/decisions/)*
