## Packages
framer-motion | Page transitions and entrance animations
recharts | Data visualization for risk scores and charts
clsx | Utility for conditional classes (often used with tailwind-merge)
tailwind-merge | Utility for merging tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
API endpoints defined in shared/routes.ts should be used for all data fetching.
