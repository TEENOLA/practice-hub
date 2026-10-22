# Practice Hub

A quiz app for primary school pupils (Nursery & KG to Primary 6). React, TypeScript, Tailwind, Vite.
No accounts and no database: scores are shown on screen and never saved.

## Run it

```bash
npm install
npm run dev      # develop
npm test         # checks every generated question (hundreds of runs)
npm run build    # production files go in dist/ (host anywhere, e.g. a subdomain)
```

## Change the school name

Edit `src/config.ts` (`schoolName`, `schoolSiteUrl`, quiz length).

## Add questions

Topics live in `src/engine/curriculum.ts`. A topic without a `build` shows as "Coming soon".

- **Maths, generated:** write a function in `src/engine/generators/` that returns `Question[]`
  (copy `rounding.ts` as a starting point), then set it as the topic's `build`.
  `npm test` will check it.
- **English, Science and anything hand-written:** add a JSON file in `src/content/`.
  Each entry needs a `prompt`, the right `answer`, three `wrong` answers and an `explanation`
  (one string per step). Copy `science-p5-forces.json`. Have a teacher check every question.
  Then point a topic at it with `buildFromBank`.

## Class levels

`YEAR_OPTIONS` in `curriculum.ts` pairs Primary 1 to 6 with Year 1 to 6 and Nursery & KG with Reception.
Change it if your school offsets them.

## Early years (Nursery to Primary 2)

Set a topic's `ui` to `'early'` for the big-button picture screen with audio and gentle retries.
Currently built for counting, using the `objects` visual in `src/components/visuals.tsx`.
# practice-hub
