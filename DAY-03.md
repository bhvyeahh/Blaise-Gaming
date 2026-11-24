# BanterBox — Day 03

Apply this patch on top of Day 01 and Day 02. Back up/commit your current branch first, then extract at project root. It changes only the files in the ZIP; existing landing page, waitlist, player setup, solo number game and lobby preview are untouched. No new dependencies or env variables.

## Try it locally

```sh
npm test
npm run build
npm run dev
```

- `/play`: all three game cards are playable in solo mode.
- `/play/solo`: existing Number Rush.
- `/play/brain-sync`: five randomized distinct prompts, four choices per prompt, computer choice locked at start, one point per match, final score and restart.
- `/play/poison-picks`: each side has nine cupcakes with one trap; choose your trap, then pick from the computer's board. The computer randomly picks an unused cupcake on your board after each safe pick. First trap hit loses. The human goes first in this practice version.
- `/play/lobby`: remains a local simulated lobby, not an online invitation flow.

## Design and architecture

Reusable PracticeFrame shares mascot reactions, nickname and computer opponent presentation. New game-rule modules separate pure reducers from UI and random setup. The game catalog provides typed game identifiers and fixed navigation paths. Character preferences remain in local storage. No server or AI API is needed for local practice.

## Checks and limitations

27/27 Node unit tests passed (12 new tests). Strict TypeScript check of the new game-rule and catalog modules passed. TSX transpilation reported zero diagnostics on changed TSX files. Full Next.js build cannot be verified in the working environment because dependencies are not installed (`next: not found`); run it locally with your existing dependencies. Browser rendering, touch interactions and integration QA are pending. Local practice game state is inspectable/modifiable through DevTools, and does not confer online scores, rewards, or security guarantees. The new engines are local-only; server-safe state projections, authenticated room actions and server-side randomness are future work. The computer selects uniformly at random, not with an AI model.

## Next: Day 04

Implement real room creation/join with invitation links, server-controlled identity, WebSockets, two-player limits, room expiry and authorization. Integrate the game engines one at a time after that transport works. Do not deploy the local lobby as if it were online multiplayer.
