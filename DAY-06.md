# Day 6 — Poison Picks multiplayer

This is an incremental patch for the Day 5 project, not a new Next.js project. Extract into the project root and replace the listed files. No dependencies, secrets, environment variables, or Wrangler configuration changes are needed. The existing Cloudflare Durable Object and authenticated WebSocket room transport are reused unchanged.

## Install and verify (PowerShell)

1. Check `git branch --show-current` is `develop/banterbox-mvp`; check `git status` and back up any edits to the files this patch replaces.
2. Extract the ZIP into the root `D:\VS\BanterBox\Blaise-Gaming`.
3. From the root: `cd realtime-worker`, `npm test`, `npm run deploy`, `cd ..`.
4. Run `npm test`, then `npm run build` in the frontend root. For local testing, `npm run dev` with the existing deployed Worker URL in `.env.local`.
5. Inspect `git status` / `git diff`. Stage intended changes only; never commit `.env.local` or unrelated secrets. Commit and push `develop/banterbox-mvp`. Open the existing allowed branch preview URL when Vercel finishes. Do not merge main yet.

## Gameplay

Choose Poison Picks -> Play with a friend -> Create room; join from a second device using its invitation. Both ready, host starts. Each player chooses a hidden trap on their own nine-cell board and locks it. The server waits for both; players take turns picking the other board. Hitting their trap loses. No bots, automatic picks or question library. The first seat alternates based on the room's overall round number (including other games). The server rejects stale round/move numbers, wrong turns, repeat cells, changes to locked traps and cross-game actions. Other player's trap is absent from their public view until the match finishes (safe picks naturally eliminate possibilities). On disconnect, moves are blocked until both reconnect; no turn timer, and existing room expiry remains two hours from creation. Both players vote rematch to return to the same lobby, where they may switch games. Solo Poison Picks is retained, sharing only the cupcake illustration.

## Validation

27 existing frontend Node tests and 33 backend Node tests passed with Node 22.16.0 (60 total). Backend tests include the Worker request/WebSocket handler harness with in-memory Cloudflare API doubles, not actual workerd or a deployed network. Changed TS/TSX files passed TypeScript transpilation syntax checks; no full Next.js build, browser or actual Cloudflare runtime test was performed here. Verify those locally before launch. Test two phones, private trap selection, both possible winners, refresh/reconnect in setup and playing, rematch and switching to Number Rush/Brain Sync.

No changes to `wrangler.jsonc`, `.env.local`, package.json, production branch, or landing page. The patch assumes the original Day 5 files; review before overwriting any additional local edits.
