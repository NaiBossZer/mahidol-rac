# Learning Games — Phase 1 Architecture

The learning games use a domain-first architecture so gameplay rules do not depend on React rendering.

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

React remains responsible for controls, Framer Motion presentation, SVG visualization, and responsive layout.

## Phase 1 rules

1. No Supabase/backend work.
2. No Phaser/Three.js migration is required.
3. No gameplay feature expansion in this phase.
4. Keep existing UI behavior stable while the domain layer is extracted.
5. Future FX should use `requestAnimationFrame` or bounded CSS/Framer Motion effects instead of driving high-frequency visual state through React.
6. Any future particle-heavy effects should use pooling or bounded reuse.

## Next phase

Phase 2 can consume these engines to add the approved gameplay progression without moving the rendering layer into a separate game framework.
