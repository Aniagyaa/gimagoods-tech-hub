# GIMATech Customer Journey Update

## Goal
Refine the existing dark storefront into a clearer charcoal, silver, white, and official lime experience, then connect every visible shopping action through a working customer journey without adding payment processing, inventory, or admin features.

## What will change

### Shared storefront and navigation
- Keep the official logo and existing visual identity, while separating the header, page bands, cards, and footer with distinct charcoal shades, brighter headings, silver supporting text, and subtle lime accents.
- Rework the four trust benefits into compact, distinct tiles that scroll cleanly on small screens.
- Replace homepage-only anchors with real navigation for Home, Shop, Categories, Deals, About, Contact, Account, Wishlist, and Cart.
- Keep search prominent on desktop and mobile; submit searches to the Shop page and show matching product suggestions.
- Add a live cart quantity badge and signed-in account menu.

### Shopping journey
- Add a Shop page with URL-based search, category, brand, availability, rating, price, product-type, and sorting controls.
- Make category cards open Shop with that category selected, and make Deals show only demo products that truly have a previous price.
- Add product-detail pages with the existing imagery, pricing, demo availability, specifications, quantity, wishlist, Add to Cart, Buy Now, and related products.
- Add a persistent browser cart with product ID, image, name, price, and quantity; support increase, decrease, remove, subtotal, delivery estimate, and total.
- Add success notifications without moving shoppers away from the page.
- Add a checkout-preparation page for customer details, Ghana delivery details, summary, and payment-method selection. It will clearly stop before payment confirmation because payment processing is deferred.

### Secure customer accounts
- Use phone number and password for real customer sign-in through Lovable Cloud; keep Full Name, Contact, Username, Password, and Confirm Password in registration, and Username, Contact, and Password in login as requested.
- Normalize Ghana phone numbers to international format, validate all fields, add show/hide controls, and display plain-language errors.
- Store usernames and customer profile details separately from encrypted authentication credentials; passwords remain managed securely and are never stored in app tables.
- Add phone verification when required by the configured phone service.
- Add account state, logout, and account-area placeholders for orders, addresses, and settings without inventing order data.
- Persist wishlist items per signed-in customer with private access rules; signed-out visitors receive Login and Create Account actions.

### Functional audit
- Make homepage CTAs, category links, product actions, deals, newsletter, footer navigation, and WhatsApp entry either work, navigate correctly, or show a truthful configuration message.
- Replace unavailable social/contact destinations with non-interactive labels rather than misleading links.
- Verify the full flow on desktop and mobile: Home → Shop → Product → Add to Cart → Cart → Create Account/Login → Checkout.

## Technical details
- Add shared cart/auth/wishlist providers beneath the existing root route; browser persistence hydrates only after mount to avoid mismatches.
- Add routes for `/shop`, `/products/$productId`, `/cart`, `/wishlist`, `/login`, `/register`, `/account`, `/checkout`, `/about`, and `/contact`.
- Add private `profiles` and `wishlist_items` tables with row-level access rules so each customer can only read and change their own data.
- Keep products as clearly labeled demo data and preserve the existing modular data layer for the planned C++/MySQL product backend.
- Add unique page metadata to every new content route.

## Boundaries
- No fake payment success, completed orders, live stock, delivery guarantee, social profile, phone number, or business address.
- No admin dashboard, inventory system, payment gateway, or MySQL/C++ integration in this update.
- Phone account creation depends on a working SMS verification service in Lovable Cloud; the UI will surface a clear setup message if that service is not configured.
