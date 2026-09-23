# GIMA Tech Hub

GIMATech — Technology E-Commerce Website

Build a modern, professional, responsive e-commerce website called GIMATech.

1. PROJECT OVERVIEW

GIMATech is a specialized technology e-commerce store that sells technology products, computer equipment, electronics, networking equipment, accessories, and related tech materials.

This is NOT a general marketplace. The website should focus exclusively on technology-related products.

The goal is to create a real-world commercial e-commerce platform that can later be connected to real products, payments, inventory, authentication, and order management.

Do not create only a static visual prototype. Build the project with a scalable structure so functionality can be added progressively.

2. BRAND

Brand Name: GIMATech

Brand positioning:
A modern technology store providing reliable tech products and accessories to students, professionals, businesses, schools, and everyday technology users.

Suggested tagline:

"Your Technology. Our Priority."

The design should feel:

Modern

Professional

Clean

Trustworthy

Fast

Technology-focused

Premium but affordable

Easy to navigate

Do NOT copy the branding, layout, or copyrighted design of Jumia, Amazon, Apple, or other existing stores. Use original UI/UX design.

3. TECHNOLOGY STACK

Use the following frontend technologies:

HTML5

React

TypeScript

JavaScript

Tailwind CSS

Backend requirements:

C++

Supabase services where appropriate

Database requirement:

MySQL

IMPORTANT:

Supabase normally uses PostgreSQL. Do not falsely represent Supabase as a MySQL database.

Keep the application architecture modular so the MySQL database can be connected separately while Supabase can be used for appropriate services such as authentication, storage, or other supported services.

Do not replace the requested technologies with Next.js, Firebase, MongoDB, or another database unless explicitly instructed later.

4. TARGET USERS

The website should support:

Customers

Customers should be able to:

Browse products

Search for products

Filter products

Sort products

View product details

Add products to cart

Remove products from cart

Update quantities

Add products to wishlist

Create an account

Log in

Manage their profile

Manage delivery information

Place orders

View order history

Track order status

Review purchased products

Administrator

The administrator should eventually be able to:

Add products

Edit products

Delete products

Manage product categories

Manage inventory

View customers

View orders

Update order status

Manage discounts

Manage product images

View sales information

Manage website content

Do not build every advanced admin function immediately. Create the architecture so these features can be implemented progressively.

5. PRODUCT CATEGORIES

Create an initial category structure for technology products.

Categories should include:

Laptops

Desktop Computers

Monitors

Keyboards

Mice

Headsets

Earphones

Speakers

Smartphones

Tablets

Chargers & Adapters

Power Banks

Storage Devices

SSDs

Hard Drives

Flash Drives

RAM & Computer Memory

Computer Components

Networking Equipment

Routers

Network Switches

Wi-Fi Adapters

Printers

Scanners

Webcams

Cameras

CCTV & Security Equipment

Cables

Computer Accessories

Other Tech Products

The category system must be expandable.

6. WEBSITE STRUCTURE

Create the following main pages:

Home

Include:

Navigation bar

GIMATech logo

Search bar

Account button

Cart button

Hero section

Featured categories

Featured products

New arrivals

Popular products

Special offers

Why choose GIMATech

Customer testimonials

Newsletter section

Footer

Shop

Include:

Product grid

Search

Category filtering

Price filtering

Brand filtering

Availability filtering

Sorting

Pagination or load-more functionality

Product Details

Display:

Product images

Product name

Price

Discount price where applicable

Availability

Stock quantity/status

Product specifications

Description

Add to cart

Buy now

Wishlist

Related products

Reviews

Cart

Display:

Selected products

Product images

Prices

Quantity controls

Remove buttons

Subtotal

Delivery fee

Total

Checkout button

Checkout

Create a clean multi-step checkout experience:

Customer information

Delivery information

Order summary

Payment

Order confirmation

Authentication

Create:

Sign up

Login

Logout

Forgot password

Reset password

Customer Account

Include:

Profile

Orders

Order details

Wishlist

Saved delivery information

Account settings

About

Explain the GIMATech brand and its purpose.

Contact

Include:

Contact form

Phone

Email

Location

Social media placeholders

Business hours

7. NAVIGATION

Create a responsive navigation bar.

Desktop:

GIMATech logo | Categories | Shop | Deals | About | Contact | Search | Account | Cart

Mobile:

Use a clean hamburger menu and responsive layout.

The navigation must remain easy to use on:

Desktop

Laptop

Tablet

Mobile phone

8. DESIGN SYSTEM

Use Tailwind CSS.

Create a consistent design system for:

Colors

Typography

Buttons

Cards

Inputs

Badges

Alerts

Modals

Navigation

Product components

The visual identity should communicate technology without becoming overly futuristic or cluttered.

Use clean spacing, subtle shadows, rounded cards, strong typography, and professional product presentation.

Avoid excessive gradients, excessive animations, or visual noise.

9. PRODUCT CARD

Create a reusable product card component.

Each product card should support:

Product image

Product name

Category

Brand

Price

Discount price

Discount badge

Stock status

Rating

Wishlist button

Add to cart button

View details button

The component must be reusable throughout the website.

10. RESPONSIVE DESIGN

The website must be fully responsive.

Test the layout conceptually for:

320px mobile

375px mobile

425px mobile

Tablet

Laptop

Desktop

Large desktop

No horizontal scrolling should occur on normal screen sizes.

11. CODE QUALITY

Use:

Reusable React components

TypeScript interfaces/types

Clean folder structure

Separation of concerns

Reusable UI components

Meaningful variable names

Meaningful component names

Proper error handling

Loading states

Empty states

Responsive components

Avoid putting the entire application inside a few large files.

Keep components modular.

12. INITIAL PROJECT STRUCTURE

Organize the project approximately like this:

src/

├── components/
│ ├── layout/
│ ├── navigation/
│ ├── products/
│ ├── cart/
│ ├── checkout/
│ ├── forms/
│ └── ui/

├── pages/

├── types/

├── services/

├── hooks/

├── utils/

├── data/

├── assets/

└── styles/

Keep the structure flexible if the framework requires a different organization.

13. SAMPLE PRODUCTS

Create realistic sample technology products for development purposes.

Examples:

HP Laptop

Dell Laptop

Lenovo ThinkPad

Wireless Keyboard

Wireless Mouse

USB-C Charger

Power Bank

512GB SSD

1TB External Hard Drive

TP-Link Wi-Fi Router

Network Switch

USB Flash Drive

Bluetooth Headset

Webcam

Computer Monitor

Clearly mark sample products as development/demo data.

Do not claim that these products are actually available for sale.

14. SEARCH EXPERIENCE

Create a functional frontend search experience.

Users should be able to search by:

Product name

Brand

Category

Product description

Display an appropriate empty state when no products match.

Example:

"No products found. Try another search."

15. CART ARCHITECTURE

Create a reusable cart system.

The cart should support:

Add product

Remove product

Increase quantity

Decrease quantity

Calculate subtotal

Calculate total

Preserve cart state where appropriate

Do not implement fake payment processing.

Payment integration will be added in a later development phase.

16. SECURITY FOUNDATION

Design the project with security in mind.

Do not expose:

Database credentials

API secrets

Private keys

Authentication secrets

Use environment variables for sensitive configuration.

Validate user input.

Do not trust frontend validation alone.

Keep authentication and authorization separate.

Admin functionality must not be accessible simply because a user manually enters an admin URL.

17. PERFORMANCE

Optimize the frontend for:

Fast loading

Efficient image usage

Reusable components

Minimal unnecessary rendering

Responsive layouts

Good user experience

Use lazy loading where appropriate.

18. SEO FOUNDATION

Create basic SEO-friendly structure:

Meaningful page titles

Meta descriptions

Semantic HTML

Proper heading hierarchy

Descriptive image alt text

Clean URLs

19. IMPORTANT DEVELOPMENT RULE

Do NOT attempt to build every backend, payment, authentication, inventory, and admin feature in one generation.

First create a high-quality frontend foundation and project architecture.

Make the following functional first:

Home page

Navigation

Product categories

Product listing

Product cards

Product details

Search

Filtering

Cart

Responsive design

Use clean mock/demo data initially.

The project must be structured so we can progressively add:

MySQL database

C++ backend/API

Supabase services

Authentication

Admin dashboard

Inventory

Orders

Payment gateway

Notifications

Reviews

Analytics

Do not generate fake backend functionality and present it as production-ready.

20. FIRST DEVELOPMENT TASK

Start by creating the GIMATech frontend foundation only.

Build:

Project structure

Global styling

Design system

Navigation

Homepage

Category section

Product grid

Product cards

Product details page

Search interface

Cart interface

Footer

Responsive mobile navigation

Use realistic demo data.

Make the result look like a professional technology e-commerce business rather than a generic AI-generated template.

After completing this phase, stop and wait for the next instruction.

Do not proceed to the database, payment system, authentication, or advanced backend until instructed.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://gimagoods-tech-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8fbbf651-eb05-44bc-b5a3-518ea2219138).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
