# AlohaMediaStudio - Project Rules

## Project Type
Static marketing website (Astro)

## Architecture
None - simple static site, no formal architecture needed.

## Tech Stack
- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS 4.x
- **Animation:** GSAP
- **Smooth Scroll:** Lenis

## Commands
```bash
npm run dev      # Dev server at localhost:4321
npm run build    # Production build to ./dist/
npm run preview  # Preview production build
```

## File Structure
```
src/
├── components/   # Astro components
├── layouts/      # Page layouts
├── pages/        # Routes
├── styles/       # Global CSS
└── scripts/      # JS utilities
```

## Deployment
```bash
npm run build
npx wrangler pages deploy dist --project-name=alohamediastudio
```
Hosted on Cloudflare Pages at alohamediastudio.com
