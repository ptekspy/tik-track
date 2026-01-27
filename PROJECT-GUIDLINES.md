# Project Guidelines

Stack: Next.js (App Router), TypeScript, Tailwind CSS v4

These rules are mandatory. If a change violates them, it is incorrect.

---

## Styling

- Tailwind CSS v4 only
- No inline styles unless absolutely unavoidable
- No CSS files except Tailwind config, global base styles, and extremely rare custom utilities
- No CSS modules
- No CSS-in-JS
- No styled-components

If styling cannot be expressed cleanly in Tailwind:

- extract a named Tailwind utility class
- document why it exists

---

## File and folder structure

- One function or one component per file
- One function or component per folder
- Tests must be co-located with the implementation
- No files exporting multiple unrelated things

---

## Folder organisation

- Organise folders by domain/responsibility
- Do not organise by technical type
- Avoid dumping grounds like utils, helpers, common
- Folder names must describe intent

---

## Exports

- Always use named exports
- Use `export const`, never `export function`
- Default exports are forbidden

Only exceptions:

- `page.tsx`
- `route.tsx`

---

## Imports (TypeScript)

- Types must be imported explicitly using `type`
- Separate runtime value imports from type imports
- Do not rely on implicit type elision

Examples:

- `import type { User } from "..."`
- `import { type Session } from "next-auth"`

---

## Barrel files

- No barrel files
- No `index.ts` re-exporting
- Imports must reference the source file directly

---

## React components

- Components must be small and focused
- Prefer pure components
- Behaviour must be explicit via props
- No side effects during render
- Client components only when strictly required
- `"use client"` should be rare and justified

---

## Next.js (App Router)

- Server Components by default
- Client Components only when browser APIs or unavoidable interactivity are required
- No data fetching in Client Components unless unavoidable
- All mutations go through Server Actions
- All GET requests go through API routes

---

## State and effects

- Prefer server state over client state
- Avoid global client state unless necessary
- Effects must be minimal and explicit

If an effect exists, it must be explainable in one sentence.

---

## TypeScript rules

- `any` is forbidden
- Prefer explicit types at boundaries
- Infer internally
- Avoid type assertions (`as`) unless unavoidable and documented
- Do not accidentally export inferred types

---

## Testing

- No code is complete without tests
- Tests must be co-located with implementation

---

## Naming

- Components: PascalCase
- Component folders: PascalCase
- Non-component files: camelCase
- Functions: verbs
- Components: nouns

Names must describe responsibility, not implementation details.

---

## Anti-patterns (forbidden)

- Inline styles
- CSS modules
- CSS-in-JS
- Default exports outside `page.tsx` and `route.tsx`
- Barrel files
- God components
- Multi-purpose utility files
- Implicit side effects
- Hidden dependencies
- Client components “just in case”
- Mixing data access with rendering logic

If any of these appear, the change is invalid.

---

## Quality bar

- Code should be readable without explanation
- Structure should make incorrect usage difficult
- PRs should be easy to review
- Boring code is correct code
