# BanterBox Day 05 — Brain Sync multiplayer

This is an overlay for the working Day 4 project, not a new standalone repository. Extract directly into the repository root (the folder containing `package.json`, `src`, and `realtime-worker`) and replace matching files. No new npm dependencies. The archive intentionally excludes `.env.local`, `wrangler.jsonc`, `package.json`, lockfiles, and unrelated landing/solo files. Your existing Cloudflare origins and Vercel variables stay intact.

## What's implemented
- Number Rush and Brain Sync share the same private authenticated two-player room. Choose the game when creating a room, or switch as host in the lobby. Switching resets readiness.
- Both seats must be connected and ready. Host starts; Cloudflare sends the same prompt to each device after a three-second countdown.
- Five distinct questions chosen from the existing ten-prompt library. Prompts can repeat across matches, intentionally deferred to later work.
- Both players select and lock their actual answers. No bot, fake answers, simulated multiplayer or client-generated scores. The other player's choice is hidden until both lock or the 30-second server deadline expires.
- Shared reveal, match count, six-second reveal stage, automatic next question, final results, and mutual rematch vote (returns both to the same lobby, where the host can select another game).
- Durable Object storage and alarms control the countdown, answer deadline and reveal. Reconnecting restores the current authoritative state. Timers continue while a player is offline; missing answers are recorded as no answer, never fabricated. A round may time out while disconnected. Rooms still expire two hours after creation.
- Existing solo practice and Number Rush remain. Poison Picks multiplayer is not included (Day 6).

## Deploy (Windows PowerShell)
1. Finish or end current multiplayer sessions before updating. From the repository root, verify `git branch --show-current` is `develop/banterbox-mvp`. If not, switch to that branch before extracting. Keep a backup or commit of existing changes.
2. Extract the zip into the repository root, choosing Replace existing files. Do not create a nested Day-05 directory.
3. Test frontend and worker (Node 22.16+ recommended):
   ```powershell
   npm test
   cd realtime-worker
   npm test
   npm run deploy
   cd ..
   ```
   Deploy the Worker first because the new frontend sends the game-selection protocol. Do not overwrite the working `wrangler.jsonc`. No new variables or migrations are required. Do not run `npm install` unless dependencies are missing.
4. From repository root: `npm run build` (with your existing local environment variables). Then inspect `git status` and commit the Day 5 files. Avoid committing secrets or unrelated changes. Suggested commands:
   ```powershell
   git add DAY-05.md src/app/play/lobby/page.tsx src/app/play/page.tsx src/app/play/play.css src/components/games/OnlineBrain.tsx src/lib/banter/online.ts src/lib/banter/catalog.ts realtime-worker/src/engine.mjs realtime-worker/src/index.mjs realtime-worker/src/brain.mjs realtime-worker/tests/brain.test.mjs realtime-worker/tests/transport.test.mjs
   git commit -m "feat: Day 5 real Brain Sync multiplayer"
   git push origin develop/banterbox-mvp
   ```
5. Let Vercel build the development branch preview. Use its stable branch URL (already allowed in your Worker config). Keep NEXT_PUBLIC_REALTIME_URL set in Preview. Do not merge main. If a second phone sees Vercel login, use a shareable preview link or adjust preview deployment protection for testing. Opening the invite on another device must use the same allowed frontend origin.

## Two-device acceptance test
- On `/play`, choose Brain Sync > Play with a friend; create a fresh room. If an old room is restored, end it or forget it first. Open the copied private invite on a second phone or separate browser profile, enter its nickname, and join. No computer opponent is created.
- Both ready; host starts. Both see countdown and identical question. Lock on the first device; second only sees locked status, not the answer. Lock same/different options on second device to verify the shared score. Wait six seconds to next round. Let one answer expire to verify no match. Refresh one device while in a match, in the same tab, and verify reconnection. Finish five questions and verify same result on both. Vote rematch on both; select Number Rush and check the old game. Check solo practice independently.

## Verification performed in this environment
- 27 existing frontend/domain tests passed.
- 25 Worker tests passed (pure engine and mocked HTTP/WebSocket/Durable Object handler tests, including a complete five-question two-seat Brain Sync match with reconnect, timeout, hidden answers and rematch).
- TypeScript/TSX syntax transpile checks passed on all changed frontend files. Full Next.js build, Cloudflare workerd integration, actual deployed browser and physical-device testing were not run here: project dependencies and live account access are unavailable. Run the build and acceptance tests locally before calling Day 5 production-ready.
