# HAEUN.dev Development Guide

## Architecture

- Next.js 15 App Router with TypeScript. Public routes live under `src/app/[locale]`; `/` redirects to Korean (`/ko`).
- Shared shell components live in `src/components/layout`; localization messages and locale validation are in `src/lib/i18n`.
- Server Components are the default. Client components will be added only for interactive controls such as the command terminal, filters, and forms.
- Planned domain modules: `src/features/{auth,projects,blog,experience,messages,media}`; Firebase browser and Admin SDK setup will be isolated under `src/lib/firebase`.
- Admin pages will live under `src/app/admin` and use server-verified Firebase session cookies plus an allow-listed admin role. Client state alone will never authorize access.

## Setup

1. Install Node.js 20 or newer and npm.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in Firebase values when Firebase is configured.
4. Run `npm run dev`, then open `http://localhost:3000` (redirects to `/ko`).
5. Run `npm run typecheck` and `npm run build` before deployment.

## Environment variables

See `.env.example`. `NEXT_PUBLIC_*` values are browser Firebase configuration and public site URL only. Firebase Admin credentials must remain server-only and must never use a `NEXT_PUBLIC_` prefix.

## Firebase and data model

Firestore collections: `users`, `profile`, `projects`, `experiences`, `posts`, `messages`, and `siteSettings`. Public content uses separate `ko` and `en` localized fields. Timestamps use Firestore `Timestamp`; server writes set `createdAt` once and update `updatedAt` on every edit. Private message documents are never readable by unauthenticated clients.

Indexes should be committed in `firestore.indexes.json` alongside the queries that require them. Security rules are deny-by-default for writes; public reads are limited to published content. Storage uploads are restricted to verified admins and validated image MIME type and size.

## Security configuration

- Firebase Admin SDK is server-only.
- Admin authorization is checked against a verified session and server-side role/allow-list, never client-submitted claims alone.
- Public inquiry writes go through a validated, rate-limited server endpoint with a honeypot field.
- Markdown is rendered without enabling raw HTML by default.
- Secrets are excluded from source control; `.env.example` contains names only.

## Progress

- Phase 1: application foundation, locale route shell, responsive navigation, dark design tokens, and initial landing page implemented.
- Phase 2: public content routes, functional terminal, project catalogue/detail, and persistent locale switching are next.
- Phase 3: Firebase, authentication, CMS, and media management.
- Phase 4: blog, inquiries, SEO assets, and security rules.
- Phase 5: verification and deployment readiness.

## Known issues

- No Firebase project credentials or verified employment history/social profile URLs were provided. Content and links must be confirmed before publication; project seed entries remain drafts.
- Dependency installation and build verification are pending package registry access.
