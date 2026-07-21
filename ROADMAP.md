# Amazon E-Commerce — ROADMAP

## ✅ Phase 1: Foundation
- [x] Test infrastructure (`npm test` scripts, Vitest configs)
- [x] Dependency vulnerabilities resolved (0 vulns across both packages)
- [x] GitHub Actions CI (lint, test, build on push/PR to main)
- [x] Dependabot (weekly npm + actions updates)
- [x] Production hardening (Helmet, rate limiting, CORS, health check)

## ✅ Phase 2: Architecture
- [x] React Context for cart state (replaced prop drilling)
- [x] Backend API integration tests (13 endpoint tests)
- [x] Frontend tests clean (5 tests, no act() warnings)

## 🔜 Phase 3: Developer Experience
- [ ] `.env.example` files for frontend and backend
- [ ] Dockerfile + docker-compose for one-command setup
- [ ] Pre-commit hooks (Husky + lint-staged)
- [ ] EditorConfig

## 🔜 Phase 4: Quality & Reliability
- [ ] Error boundary component
- [ ] Loading states / skeleton screens for async operations
- [ ] Request validation middleware (express-validator or zod)
- [ ] Rate limit test coverage

## 🔜 Phase 5: Production Readiness
- [ ] Health check integration in CI
- [ ] Sentry or error tracking integration
- [ ] Render.com deployment config
- [ ] e2e tests (Playwright)
