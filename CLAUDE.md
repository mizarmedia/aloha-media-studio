# Aloha Media Studio - Project Instructions

## Project Overview
Marketing website for Aloha Media Studio's podcast production services. Built with Astro, deployed to Cloudflare Pages.

**Live Site:** https://alohamediastudio.com

## Tech Stack
- **Framework:** Astro
- **Styling:** Tailwind CSS
- **Animations:** GSAP + Lenis (smooth scroll)
- **Hosting:** Cloudflare Pages
- **Forms:** FormSubmit.co

## Deployment Process

### 1. Push to GitHub
```bash
git add [files]
git commit -m "message"
git push origin main
```

### 2. Deploy to Cloudflare Pages (Required - Not Automatic)
```bash
npm run build
npx wrangler pages deploy dist --project-name=alohamediastudio
```

**Important:** Cloudflare Pages does NOT auto-deploy from GitHub for this project. You must manually deploy after every push.

## Project Structure
```
src/
├── components/     # Astro components
├── layouts/        # Page layouts
├── pages/          # Routes
│   ├── index.astro         # Homepage
│   ├── studio.astro        # Studio rental page
│   └── the-edit/           # Blog
├── scripts/        # TypeScript (animations.ts)
├── styles/         # Global CSS
└── content/        # Blog content (MDX)
```

## Homepage Section Flow
1. HeroCinematic - Full-screen video hero
2. CredibilityStrip - Trust stats
3. WhoThisIsFor - Target audience self-selection
4. ProblemStatement - Pain points with empathy
5. ProcessOverview - 3-step process
6. Testimonial - Dr. Roger Hall
7. StudioCTA - Modal gallery
8. InvestmentContact - Pricing + contact form

## Color System (CSS Variables)
- `--color-void` - Deep black background
- `--color-charcoal` - Secondary dark background
- `--color-cream` - Light text
- `--color-mist` - Secondary text
- `--color-coral` - Primary accent (CTA buttons)
- `--color-stone` - Muted text

## Animation Guidelines
Keep animations minimal. Currently using only:
- `data-animate="fade-up"` - Primary reveal
- `data-animate="scale-up"` - Price card only
- `data-animate-stagger` + `data-animate-child` - Grids
- `data-magnetic` - CTA buttons only

Respects `prefers-reduced-motion`.

## Common Commands
```bash
npm run dev      # Local dev server
npm run build    # Build for production
npm run preview  # Preview build locally
```
