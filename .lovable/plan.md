# GIMATech Admin Foundation

## Goal
Add a separate, secure administration area to the existing storefront. The first release establishes `SUPER_ADMIN` and `ADMIN`, granular backend-enforced permissions, protected admin pages, real-data analytics, and tamper-resistant audit logging without implementing the future management modules.

## Secure accounts and access
- Keep customer accounts unchanged and store administrator roles in dedicated role tables, never in customer profiles or browser storage.
- Add `/admin/login` with Username and Password. Admin usernames map internally to non-public authentication identifiers, so contacts are not exposed or queried from the browser.
- Seed the two supplied administrator accounts once through a temporary server-side bootstrap using private environment secrets. Passwords will never enter source files, migrations, frontend bundles, API responses, or dashboard content; temporary bootstrap code and password secrets will be removed after successful creation.
- Require both seeded administrators to change their temporary password after first login before accessing the admin area.
- Add secure password change and logout flows. Record successful login, failed login, logout, and password change events.
- Keep all admin pages under a client-aware protected layout, while independently authorizing every private server operation.

## Roles and permissions
- Create separate `user_roles`, `permissions`, `role_permissions`, and per-admin override tables.
- Seed the complete granular permission catalogue and the requested baseline role matrix.
- `SUPER_ADMIN` receives all permissions. `ADMIN` receives only the stated operational permissions; deletion, publishing, refunds, staff, role management, security, system settings, and audit deletion remain forbidden.
- Add centralized database functions for `has_role` and `has_permission`, plus a reusable authenticated server permission guard.
- Protect role and permission records with row-level rules. Normal admins cannot write roles, permissions, overrides, or audit records through direct database requests.
- Generate the sidebar from server-verified permissions. Direct restricted URLs return an “Access Restricted” page without exposing protected data.

## Admin interface
- Add a responsive GIMATech admin shell with the official logo, charcoal surfaces, white/silver text, lime active states, desktop sidebar, tablet drawer, role badge, account menu, refresh action, and first-login password-change screen.
- Add `/admin/dashboard` and `/admin/analytics` as working modules.
- Add permission-aware placeholder pages for future navigation destinations so every visible link works, while clearly stating that management functionality is not implemented yet.
- Super Admin navigation includes all requested sections. Normal Admin navigation includes Dashboard, Analytics, Products, Inventory, Orders, Customers, Reviews, and WhatsApp only.

## Real-data analytics
- Add Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month, This Year, and Custom Range filters with previous-equivalent-period calculations.
- Query only current database data through protected server functions. Existing customer registration and wishlist data can provide total/new customers, customer trend, wishlist adoption, recent customers, and most-saved products.
- Render the requested revenue, orders, average order value, inventory, profit, stock, category sales, top-selling, order-status, payment, and recent-order areas as explicit unavailable/empty states until those business tables exist. No zeroes, percentages, sales, stock, or payment facts will be invented.
- Every panel supports loading, success, empty, and error states. Refresh invalidates and refetches current data; the query structure remains ready for future order, product, inventory, and payment tables.

## Audit-log foundation
- Create an append-only `audit_logs` table storing administrator identity, role snapshot, action, resource, optional resource ID, timestamp, and safe metadata.
- Only protected server functions may append logs. Super Admin may view them; no browser role may delete them. Normal Admin receives no audit-log access in this phase.
- Add reusable audit helpers so future product, inventory, order, customer, staff, permission, and settings modules can record actions consistently.

## Validation
- Verify database security rules and permission functions.
- Test both seeded accounts: login, forced password change, dashboard, analytics, permitted navigation, logout, and role badge.
- Test Normal Admin direct access to Staff, Security, Settings, and Audit Logs and confirm both the page and server reject access.
- Test Super Admin access to every currently exposed admin destination.
- Test desktop, laptop, and tablet layouts, including drawer navigation, cards, charts, tables, loading/empty/error states, and overflow.
- Confirm existing storefront routes and customer functionality remain available.

## Boundaries
- Products remain demo catalogue data; checkout still creates no order or payment. This phase will not fabricate business analytics.
- Product, category, inventory, order, customer, payment, finance, discount, review, delivery, staff, content, and settings management remain future modules; only their secure navigation/authorization foundations are added.
- The future C++/MySQL application-data architecture is not replaced. Lovable Cloud continues to handle authentication, authorization, administrator metadata, and audit foundations until those modules connect to their designated data source.
