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
- winning-line detection
- winning-cell selectors
- accuracy calculation
- timer formatting
- question selection
- answer scoring and streak rules
- line bonuses and full-board bonus
- game phases
- leaderboard state transitions
- reset transitions

`features/bingo/engine/useLacBingoEngine.ts` is the React controller. UI code consumes named controller actions rather than dispatching domain actions directly.

React remains responsible for presentation, sound, confetti, dialogs, and DOM lifecycle.

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

Phase 2 can consume these engines to add the approved gameplay progression without moving the rendering layer into a separate game framework.
