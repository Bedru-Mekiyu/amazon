# Contributing to Amazon E-Commerce

Thank you for considering contributing! This project follows industry-standard practices to keep the codebase clean, secure, and collaborative.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/amazon.git
   cd amazon
   ```
3. **Install dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. **Start development**:
   ```bash
   # Terminal 1 — backend
   cd backend && npm run dev
   # Terminal 2 — frontend
   cd frontend && npm run dev
   ```

## Development Workflow

### Branch Convention
- Use descriptive kebab-case branch names: `feat/order-cancellation`, `fix/cart-total`, `docs/api-readme`
- Branch from `main`, never commit directly to `main`

### Commit Convention
We follow conventional commits:
```
<type>(<scope>): concise description

- feat: new feature
- fix: bug fix
- docs: documentation only
- refactor: code change that neither fixes nor adds
- test: adding or fixing tests
- chore: build, CI, dependencies
```

Bad: `fixed stuff`, `update`, `wip`
Good: `feat(checkout): add promo code field with validation`

### Pull Request Process
1. Create a branch and make your changes.
2. Ensure tests pass:
   ```bash
   cd backend && npm test
   cd ../frontend && npm test
   ```
3. Ensure lint passes:
   ```bash
   cd frontend && npm run lint
   ```
4. Push your branch and open a PR against `main`.
5. The PR title should follow the commit convention.
6. CI must pass before merge.
7. Two approvals recommended for complex changes.

### Running Tests
```bash
# Backend (15 tests — API endpoints)
cd backend && npm test

# Frontend (5 tests — React components)
cd frontend && npm test
```

### Code Style
- **Backend**: ES modules (`import`/`export`), async/await, Express-validator for input validation
- **Frontend**: React 19 with hooks, functional components, Context API for state
- **CSS**: Responsive grid layout, no CSS frameworks (keeping it lightweight)
- **JavaScript**: No TypeScript (yet), but JSDoc annotations encouraged for complex functions

## Security
- Never commit secrets, `.env` files, or API tokens.
- All input is validated server-side with express-validator.
- CORS is origin-aware in production.
- Rate limiting protects all API routes.
- Helmet sets secure HTTP headers.

## Questions?
Open a GitHub Discussion or issue. We're friendly!
