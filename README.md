# SANDIKALE STORE

Independent storefront MVP for SANDIKALE custom apparel.

## Current direction

- Hybrid storefront: premium fashion editorial + practical e-commerce navigation
- Industrial premium visual identity, mobile-first for Android
- Product catalog for ready styles and custom services
- Search and category filters
- Custom Lab with color, size, front/back mockup view, text and local artwork preview
- Cart-style order summary and WhatsApp handoff
- Responsive layout and reduced-motion support
- No backend credentials, payment processing, or connection to existing KASIR/CLUB systems

## Preview branch

Current UI/UX implementation: `catalog-hybrid-mvp`

The branch is intentionally isolated from `main`. No changes are made to KASIR or SANDIKALE CLUB.

## Deployment

Cloudflare Pages target:
- Framework preset: None
- Build command: leave empty
- Build output directory: `/`
- Production branch: `main`

A branch preview is available only if the Cloudflare Pages project is connected and branch deploy previews are enabled. Do not assume a preview URL until the deployment reports success.

## Current MVP scope

Included:
1. Homepage and brand introduction
2. Ready-style and custom-service catalog
3. Search and category filtering
4. Interactive customizer preview
5. Cart summary and WhatsApp order handoff
6. Responsive mobile/desktop UI

Not included yet:
- Admin authentication and dashboard
- Persistent product database
- Server-side artwork upload/storage
- Payment processing
- Automatic stock management

These require a separate backend decision. The previous Supabase Free projects for KASIR and CLUB must remain untouched. Do not add their credentials or database connection details to this repository.

## Next development stages

1. Deploy and verify this isolated frontend preview
2. Browser QA on Android and desktop
3. Decide a separate Rp0 backend strategy for catalog/admin data
4. Add protected admin catalog management
5. Add secure artwork storage and validated order snapshots
6. Consider KASIR integration only after STORE is stable and separately approved
