Here is the updated and expanded Product Requirements Document (PRD), integrating the dedicated "Import Process" and "About Us" pages alongside the core features. 

---

# PRD: NextGen Traders Web App (v1.0)
**Project:** 1st Anniversary Launch Platform  
**Objective:** Digitize the customer acquisition funnel via an interactive tax calculator, dynamic vehicle catalog, and build trust through transparent process documentation and company background.

## 1. System Architecture & Tech Stack
To ensure high performance, SEO visibility, and ease of deployment, the application will use a modern React-based stack.
* **Framework:** Next.js (App Router) for Server-Side Rendering (SSR) and superior SEO.
* **Styling:** Tailwind CSS and Shadcn UI for a clean, professional aesthetic.
* **State Management:** React Hooks (`useState`, `useMemo`) for instant calculator recalculations.
* **Database/Backend:** Supabase (PostgreSQL) for storing vehicle catalogs and tax configurations.
* **Hosting:** Vercel (seamless Next.js integration).

---

## 2. Core Features & Functional Specs

### Feature A: The Landed Cost Calculator
A client-side utility that calculates the exact landing cost of a vehicle instantly as the user adjusts inputs.
* **User Inputs:** CIF Value (JPY), Exchange Rate (LKR), Vehicle Category, Fuel Type, Engine Capacity (CC).
* **Calculation Logic:** Converts CIF to LKR, applies Customs Duty (CID + Surcharge), calculates Excise Duty based on CC, applies Luxury Tax thresholds, and adds VAT + SSCL. Output displays the final estimated Landed Cost.

### Feature B: Vehicle Model Library
A dynamic catalog showcasing popular imports to drive lead generation.
* **List View:** Grid of cards displaying Make, Model, Fuel Type, and thumbnail.
* **Detail View:** Image gallery, specifications, and a "Calculate Import Cost" button that deep-links to the calculator with pre-filled vehicle parameters. Includes a direct WhatsApp integration CTA.

### Feature C: The Import Process Page (`/process`)
A visual, step-by-step roadmap explaining the end-to-end journey of importing a Japanese vehicle to Sri Lanka.
* **Step-by-Step Timeline:** 1. **Consultation & Deposit:** Discussing requirements and placing the refundable deposit.
    2. **Auction Sourcing:** Analyzing auction sheets, setting budgets, and live bidding.
    3. **LC Opening:** Guiding the customer through opening the Letter of Credit (including mandatory TIN requirements).
    4. **Shipping & Transit:** Transporting the vehicle to the Japanese port and shipping to Hambantota/Colombo.
    5. **Customs Clearance:** Handling the paperwork, tax payments, and port clearing.
    6. **Handover:** Final vehicle inspection and delivery to the customer.
* **FAQ Section:** Address common bottlenecks (e.g., "Why do I need a TIN?", "How long does shipping take?", "What if we lose the auction bid?").

### Feature D: Simple About Us Page (`/about`)
A trust-building page dedicated to the company's background and mission.
* **Company Story:** A brief narrative about NextGen Traders, highlighting the 1-year anniversary milestone and the transition from a startup to a trusted import partner.
* **Our Promise:** Focus on core values: transparency (no hidden fees), quality (strict auction sheet verification), and hassle-free service.
* **Contact Information:** Clear display of physical location, WhatsApp numbers, email, and social media links.

---

## 3. Database Schema Design (Relational Model)

**Table: `tax_brackets`**
Stores the rules extracted from your Excel sheet.
* `id` (UUID, PK)
* `category` (String) 
* `fuel_type` (String) 
* `min_cc` (Int)
* `max_cc` (Int) 
* `excise_rate_per_cc` (Float)
* `luxury_tax_threshold_lkr` (Float)
* `luxury_tax_rate` (Float)

**Table: `vehicles`**
Stores the catalog data.
* `id` (UUID, PK)
* `make` (String) 
* `model` (String) 
* `slug` (String, Unique) 
* `fuel_type` (String)
* `engine_cc` (Int)
* `thumbnail_url` (String)

---

## 4. Next.js Routing Structure
Setting up the `app` directory for clean navigation and separation of concerns:

```text
/src
  /app
    page.tsx                 # Landing page (Hero, Calculator Teaser, Trending Vehicles)
    /calculator
      page.tsx               # Main Tax Calculator interface
    /vehicles
      page.tsx               # Full grid of all available models
      /[slug]
        page.tsx             # Dynamic route for specific vehicle details
    /process
      page.tsx               # Timeline of the import process and LC/TIN FAQs
    /about
      page.tsx               # Company story, 1st Anniversary info, contact details
  /components
    /ui                      # Reusable UI elements (Buttons, Inputs, Cards, Timeline)
    CalculatorForm.tsx       # Client-side component for handling tax logic
    VehicleCard.tsx          # Reusable card component for the grid
    TimelineProcess.tsx      # Component for rendering the step-by-step import journey
  /lib
    taxCalculator.ts         # Pure functions containing the math logic 
```

---

## 5. Implementation Phases

**Phase 1: Foundation & Data Rules (Days 1-3)**
* Initialize Next.js project with Tailwind.
* Translate the Excel tax sheet into a structured JSON/Database format.
* Write pure utility functions in `taxCalculator.ts` to process inputs against the rules.

**Phase 2: The Calculator UI & Core Routing (Days 4-7)**
* Build the interactive calculator form using React state.
* Wire up the UI to the calculator utility functions.
* Scaffold the routing structure for `/vehicles`, `/process`, and `/about`.

**Phase 3: Content, Process, and About Pages (Days 8-10)**
* Build the `/process` page, utilizing a vertical timeline component for the 6-step import journey.
* Draft and build the `/about` page, integrating the 1-year anniversary messaging and contact details.

**Phase 4: The Catalog & Polish (Days 11-14)**
* Build the dynamic `/vehicles` routes and populate initial vehicle data.
* Ensure mobile responsiveness across all components (crucial for WhatsApp lead generation).
* Deploy to Vercel and configure the production domain.