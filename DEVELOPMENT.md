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

- Phase 1: application foundation, locale route shell, responsive navigation, dark design tokens, and landing page implemented.
- Phase 2: public content routes, interactive terminal with history, live Firestore project catalogue/detail, locale switching, blog search/Markdown rendering, experience timeline implemented.
- Phase 3: Firebase client/Admin setup, email allow-list session authentication, protected admin routes, typed Zod-backed CRUD APIs, CMS preview, media library, messages, settings, and draft seed import implemented.
- Phase 4: contact form and server validation, Firestore rate limiting, SEO metadata/canonicals/sitemap/robots, Firestore and Storage rules implemented.
- Phase 5: typecheck and production build pass. Firebase-backed behavior still needs an authenticated manual smoke check against the configured Firebase project; deployment is not performed from this workspace.

## Known issues

- Employment history and social profile URLs were not supplied. The site does not invent these; add verified values through the CMS before publication.
- Initial project documents are unpublished and use an `unknown` status until reviewed.
- Firebase service configuration is expected from the ignored local `.env` file. Never copy its contents into source control or chat.
- Firestore read behavior, Auth login, and Storage uploads still need a manual smoke check with a Firebase administrator account.
