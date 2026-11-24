# Day 2 patch
Apply these files over your working Day 1 project. No dependencies, environment variables or changes to your landing page / waitlist API are needed.

Run `npm test`, `npm run build`, and `npm run dev`.

Visit `/play/setup`, `/play`, `/play/solo`, and `/play/lobby`. Save a nickname first, then open the lobby preview. Simulate joining, toggle both ready buttons, change games (resets readiness), and simulate the partner leaving. The online start button is deliberately disabled. This is a local preview only, with no live room code, invitation, WebSocket, authentication, or server persistence. No new multiplayer security guarantees are implied by the reducer tests.

The 15 unit tests passed using Node 22.16.0. Full Next.js build and browser QA not performed in the patch environment; verify locally before committing. The existing waitlist remains untouched.
