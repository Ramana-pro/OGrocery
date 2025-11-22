# Grocery Shopping Website Design Guidelines

## Design Approach
**Reference-Based: Modern Grocery E-commerce**
Drawing inspiration from Instacart, Whole Foods Market, and Thrive Market - prioritizing clean product presentation, trust-building elements, and streamlined checkout flows.

## Core Design Principles
1. **Visual Freshness**: Crisp, clean aesthetics that evoke fresh, quality groceries
2. **Scannable Hierarchy**: Quick product discovery with clear categorization
3. **Trust & Transparency**: Prominent pricing, ratings, and product information
4. **Conversion Focus**: Minimal friction from browse to checkout

---

## Typography System
- **Primary Font**: Inter or DM Sans (Google Fonts) - clean, modern sans-serif
- **Headings**: Font weights 700 (page titles), 600 (section headers), 500 (product names)
- **Body Text**: Font weight 400, line-height 1.6 for readability
- **Pricing**: Font weight 700, slightly larger than product names for emphasis
- **Size Scale**: text-xs (labels), text-sm (descriptions), text-base (body), text-lg (product names), text-2xl to text-4xl (headings)

---

## Layout System
**Spacing Primitives**: Consistently use Tailwind units of **2, 4, 6, 8, 12, 16**
- Component padding: p-4, p-6, p-8
- Section spacing: py-12 (mobile), py-16 (desktop)
- Grid gaps: gap-4 (product grids), gap-6 (category cards)
- Container max-width: max-w-7xl with px-4 padding

**Grid System**:
- Product Grid: grid-cols-2 (mobile), md:grid-cols-3, lg:grid-cols-4
- Category Grid: grid-cols-2 (mobile), md:grid-cols-4
- Cart Layout: Single column (mobile), two-column split on desktop (cart items + summary)

---

## Component Library

### Navigation
- Sticky header with logo, search bar (prominent center placement), cart icon with item count badge
- Category navigation bar below header (horizontal scroll on mobile, full grid on desktop)
- Breadcrumbs for category navigation

### Product Cards
- Square/portrait product image (aspect-ratio-square or 3:4)
- Product name (text-lg, font-medium)
- Price (text-xl, font-bold) with optional strikethrough for sale prices
- Quick add-to-cart button (prominent, always visible)
- Optional: Rating stars, organic/special badges, unit pricing
- Hover: Subtle elevation with shadow-lg transition

### Shopping Cart
- Floating cart button (mobile) or persistent sidebar (desktop)
- Cart items: Product thumbnail, name, quantity selector, price, remove button
- Sticky cart summary with subtotal, estimated tax, total
- Prominent checkout CTA button
- Empty cart state with browse suggestions

### Category Sections
- Large category cards with representative images
- Clear category labels overlaid on images with backdrop-blur
- Grid layout with consistent spacing

### Search & Filters
- Autocomplete search with product suggestions
- Filter sidebar: Categories, dietary preferences, price ranges, brands
- Active filter chips with clear/remove options

### Checkout Flow
- Multi-step progress indicator
- Form sections: Delivery details, payment method, order review
- Order summary sidebar (persistent on desktop)
- Trust indicators: Secure checkout badge, accepted payment methods

---

## Page Layouts

### Homepage
1. **Hero Section**: Large banner with seasonal produce imagery, primary CTA ("Start Shopping"), search bar integration
2. **Category Grid**: 6-8 main categories with engaging images
3. **Featured Products**: "This Week's Deals" with 4-column product grid
4. **Popular Items**: "Bestsellers" section with scrollable product carousel
5. **Trust Section**: Delivery guarantees, freshness promise, customer testimonials
6. **Newsletter Signup**: Email capture with discount incentive

### Product Listing Page
- Category header with image and description
- Filters sidebar (desktop) / drawer (mobile)
- Product grid (responsive columns)
- Pagination or infinite scroll
- Results count and sorting options

### Product Detail Page
- Large product image gallery (with zoom capability)
- Product title, price, unit price
- Quantity selector and add-to-cart button
- Product description, nutritional info, ingredients
- Related products section

### Cart & Checkout
- Cart: Full item list, quantity controls, subtotal
- Checkout: Step-by-step form with progress indicator
- Order confirmation: Summary with order number, estimated delivery

---

## Images
**Critical Image Placements**:
- **Hero Section**: YES - Large hero image featuring fresh produce, vibrant farmers market aesthetic, or seasonal groceries (1920x800px)
- **Category Cards**: Representative images for each category (fruits, vegetables, dairy, bakery, etc.) - 600x600px
- **Product Images**: High-quality product photos on white/transparent backgrounds - 800x800px minimum
- **Trust Section**: Customer testimonial photos, delivery vehicle, fresh produce close-ups

**Image Treatment**:
- Crisp, well-lit product photography
- Consistent white backgrounds for product shots
- Category images with subtle overlay for text legibility
- Hero images with backdrop-blur buttons for CTAs

---

## Interaction Patterns
- Smooth add-to-cart animations (item flies to cart icon)
- Quantity selectors with + / - buttons
- Cart count badge updates with subtle bounce animation
- Hover states: Gentle elevation on cards, underline on text links
- Loading states: Skeleton screens for product grids
- Toast notifications for cart updates

---

## Responsive Behavior
- **Mobile**: Single-column layouts, hamburger menu, bottom cart button, collapsible filters
- **Tablet**: 2-3 column grids, persistent search, category bar
- **Desktop**: 4-column product grids, sidebar filters, persistent cart summary

This design creates a fresh, trustworthy grocery shopping experience with emphasis on product discovery, clear pricing, and frictionless purchasing.