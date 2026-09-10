# Learning Games — Phase 1 Architecture

Phase 1 is complete. The learning games use a domain-first architecture so gameplay rules do not depend on React rendering.

## Layers

```text
Game UI (React)
      |
      v
Game Controller / Hook
      |
      v
Pure Game Engine
  - state
  - actions
  - reducer
  - selectors
  - calculations
      |
      v
Content / Data
```

## Lac Bingo

`features/bingo/engine/LacBingoEngine.ts` owns the deterministic gameplay domain:

- 4x4 board generation and Fisher-Yates shuffle
- winning-line detection for 4 rows + 4 columns + 2 diagonals
- winning-cell selectors
- accuracy calculation
- timer formatting and victory timer stop
- question selection from unmarked tiles only
- answer scoring and streak rules
- line bonuses and full-board bonus
- game phases and victory lock
- leaderboard state transitions
- reset transitions
- content integrity validation helpers

### Production rules

1. A marked tile cannot open another question.
2. A question can only target a tile that still exists and is unmarked.
3. Answers outside the option range are ignored.
4. Once all 16 tiles are marked, the game enters `victory` and no further questions or timer ticks are accepted.
5. Leaderboard saving is only allowed after full bingo.
6. Team names are normalized and capped at 60 characters.
7. The board is a fixed 4x4 game with 10 possible winning lines.
8. The question deck is designed as one learning question per bingo keyword.

`features/bingo/engine/useLacBingoEngine.ts` is the React controller. UI code consumes named controller actions rather than dispatching domain actions directly.

React remains responsible for presentation, sound, confetti, dialogs, and DOM lifecycle.

## Bingo verification

`scripts/smoke.mjs` includes static integrity checks for the Bingo module:

- required Bingo files exist
- board rules remain 4x4 / 16 tiles
- 10 winning lines remain defined
- question deck contains 16 target mappings
- question targets are unique
- keyword pool contains 16 unique IDs
- marked-tile question protection remains present
- victory stops the timer
- leaderboard save remains locked until victory

Run locally with:

```bash
npm run smoke
npm run lint
npm run build
```

The smoke checks are intentionally independent of Vercel so Bingo can be verified without repeatedly triggering deployments.

## Sobprab Lac Lab

`features/sobprab/engine/SobprabLacLabEngine.ts` owns the simulation domain:

- host-tree configuration
- season configuration
- temperature and biocontrol clamping
- field yield and purity calculation
- pH-to-color interpolation
- mordant effects
- BCG scoring and tiers
- simulation state transitions

`features/sobprab/engine/useSobprabLacLabEngine.ts` is the React controller. `SobprabLacLabGame.tsx` now consumes controller state, derived calculations, and named actions without owning simulation state or calculation logic.

React remains responsible for controls, Framer Motion presentation, SVG visualization, and responsive layout.

## Phase 1 completion criteria

1. Pure domain engines exist for both current learning games.
2. Both games expose React controller hooks.
3. UI components do not call game reducers directly.
4. Derived calculations remain outside React rendering logic.
5. Existing gameplay behavior and presentation are preserved while moving state transitions behind controller actions.
6. No Supabase/backend work was introduced.
7. No Phaser/Three.js migration was introduced.
8. No Phase 2 gameplay progression was mixed into the architecture extraction.

## Engineering rules carried forward

1. Keep game rules in pure engines and controllers.
2. Keep educational content/data separate from rendering code.
3. Do not put network/database calls in the render/update loop.
4. Future FX should use `requestAnimationFrame` or bounded CSS/Framer Motion effects instead of high-frequency React state.
5. Any future particle-heavy effects should use pooling or bounded reuse.

## Next phase

Lac Bingo is now treated as a self-contained production learning game. Further changes should improve its learning content, feedback, classroom UX, accessibility, and polish without coupling it to Sobprab Lac Lab, Lac Learning Room, Supabase, or other game engines.
