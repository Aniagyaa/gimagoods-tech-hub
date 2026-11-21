<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep administrator identities, roles, permission grants, and overrides separate from customer profiles because this prevents privilege escalation and supports centralized authorization.
- Treat current product, order, payment, finance, and inventory analytics as unavailable unless backed by connected business records because fabricated dashboard figures are prohibited.
- Validate password rotation and operational access in server functions, using shared tested guards, because client redirects alone cannot enforce first-login security.
- Customer registration and identity login use fresh publishable auth clients in server functions; username-to-email resolution is private, throttled and server-only, and sessions require an active CUSTOMER profile with no administrator role.
- Customer signup creates a profile and fixed CUSTOMER membership atomically in an Auth trigger; the registration marker never grants privileges, legacy administrator signup is skipped, and only editable display fields receive customer UPDATE grants.
- Keep shared business contact values and validation in one module; contact writes use a validated public server function with an insert-only publishable client, and administrator reads require operational readiness plus customers.view, so visitors cannot read submissions.
- Use the light semantic theme globally and a scoped dark-band palette on deliberate charcoal sections, so storefront and administrator pages retain readable contrast.

- Share customer form layout through AuthForm; public recovery routes consume only Auth-issued recovery sessions, so reset cannot bypass password proof or administrator authorization.
