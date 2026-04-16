# NextGen Traders Web App

## Project Overview
NextGen Traders is a modern web platform for Sri Lankan vehicle import customers. It combines cost transparency, vehicle discovery, and financing guidance into a single, clean user experience.

The product is designed to support confident purchase decisions through a clear import tax workflow, structured vehicle catalog pages, and a lease/finance planning module.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (planned for data and auth)

## Key Features
- Import Tax Calculator
	- Calculates estimated landed cost and tax breakdown from vehicle inputs
	- Includes policy-sensitive controls such as SSCL toggle support
- Vehicle Catalog
	- Dynamic vehicle pages by slug
	- Grade-level details and side-by-side feature comparison
- Finance Module
	- Lease finance tab with down payment and term controls
	- Monthly rental area scaffolded for finance calculations

## Setup Instructions
### 1. Prerequisites
- Node.js 18+
- npm 9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

## Folder Structure Overview
```text
nextgen-app/
	app/
		about/
		api/
			calculate/
				route.ts
		calculator/
			page.tsx
		process/
		vehicles/
			[slug]/
				page.tsx
			page.tsx
		globals.css
		layout.tsx
		page.tsx
	lib/
		mockVehicles.ts
	public/
	README.md
```

## Notes
- Current data layer uses local mock data for fast iteration.
- Supabase integration is planned for production-grade catalog, pricing workflows, and backend services.
