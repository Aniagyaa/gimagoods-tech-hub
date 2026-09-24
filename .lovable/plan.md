# GIMATech Official Brand & Landing Page Update

## Goal
Apply the uploaded GIMATech logo as the official identity and restyle the existing storefront into a premium black, lime, and silver technology shopping experience without changing its data model or adding backend features.

## What will change
- Preserve the uploaded logo unchanged and use it in the header and footer through the project asset flow.
- Create favicon and app-icon crops from the recognizable logo symbol, plus a web app manifest for supported devices.
- Replace the approximate green and light storefront styling with logo-sampled neon lime, deep black/charcoal, metallic silver/white, and restrained amber/red status colors.
- Redesign the homepage hero as a dark, full-bleed technology scene with the supplied headline, supporting copy, and two clear actions.
- Restyle categories, product cards, trust content, deals, promotional signup, navigation, mobile menu, footer, and WhatsApp entry in one consistent visual language.
- Add subtle lift, image zoom, lime border/glow, link, and button interactions while respecting reduced-motion settings.
- Keep all current demo labels, search behavior, responsive layout, product data, and section anchors intact.

## Assets
- Generate one original dark technology hero image featuring a balanced mix of laptop, phone, router, keyboard, mouse, and headphones.
- Do not embed the uploaded screenshot as page content; only the official logo itself will be used as branding.

## Responsive and quality checks
- Verify desktop, tablet, and mobile navigation, category grids, product scrollers, readable text, and zero horizontal overflow.
- Confirm the official logo remains undistorted, the favicon resolves, interactions work, and the project reports no loading or build errors.

## Scope note
Only the `/` storefront route currently exists. No dashboard, shop, product, cart, checkout, account, or authentication routes are present to restyle, so this pass will establish shared brand tokens for those future pages rather than fabricate missing functionality.

## Technical details
- Keep TanStack Start, React, TypeScript, Tailwind v4, existing components, routes, and data structures.
- Store the uploaded logo as a CDN-backed project asset; keep only properly resized real icon files under `public/`.
- Continue using semantic design tokens and the existing reusable Button component.
