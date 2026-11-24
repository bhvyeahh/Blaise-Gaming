# BanterBox Day 04 — Online rooms + game shelf polish

Overlay patch for Day 1–3. Keep your original repo, landing page, waitlist route, existing `.env.local`, and existing frontend dependencies. Do not replace the whole repository. Requires Node 22.16+ for the included Node test harness. The worker has its own package.json and dependencies; don't install Wrangler into the frontend.

## What changed
- `/play` redesigned game shelf, clearer solo/online mode, invite CTA.
- `/play/lobby` replaced the pretend lobby with real create/join, private invitation, two seats, online/ready status and Number Rush race.
- All three solo games use a shared result component: win confetti, loss animation, clear rematch CTA, reduced-motion support.
- Separate `realtime-worker/` Cloudflare Worker with one SQLite-backed Durable Object per room, hibernating WebSocket API and rate limit bindings. No separate database account needed for these ephemeral rooms.
- Brain Sync and Poison Picks remain solo-only, explicitly marked. No billing, accounts, rewards or public matchmaking.

## Run locally (two terminals, from your repo)
1. Extract this patch into your existing project, replacing matching files. Use a Git branch and review changes before committing. Add to existing root `.env.local` (do not remove Resend values):

```
NEXT_PUBLIC_REALTIME_URL=http://localhost:8787
```

This URL is public configuration, not a secret. Never place a private token or Resend key in a `NEXT_PUBLIC_` variable. If testing on `127.0.0.1`, use `http://127.0.0.1:8787` instead. Keep the browser frontend port at 3000.

2. Terminal A:
```
cd realtime-worker
npm install
npm test
npm run dev
```
Wrangler uses local emulation for Durable Objects. Use current Wrangler v4 (at least 4.36). This package intentionally has no generated lockfile; commit its package-lock.json after your first install. Local rate limit behavior may differ from production. If a binding fails, inspect the Wrangler error rather than disabling protection in production.

3. Terminal B, in repository root:
```
npm test
npm run build
npm run dev
```
If the frontend dev server is running already, restart it after editing env. Open `http://localhost:3000/play`.

4. Click Play with a friend, enter nickname and mascot, create room. Copy invite. Open the invitation in an incognito window or separate browser profile on the SAME computer (localhost is not reachable on another phone). Join under another nickname, ready both, start as host, guess, rematch. Test refresh and temporary disconnect. A copied invitation does not include the host's session token. It can be used by anyone holding it until the guest seat is occupied; share it privately. Closing a tab disconnects the player but preserves their seat for reconnect while the session survives. Both players can explicitly end the room; it closes for both. Forgetting the session locally is not a server-side leave and cannot reclaim a lost seat. Room TTL is two hours from creation, not a sliding inactivity timer.

## Deploy (only after local verification)
- Sign in to Cloudflare, in `realtime-worker/` run `npx wrangler login`, then `npm run deploy`. Use the actual HTTPS Worker URL printed by Wrangler. Workers Free plan supports SQLite Durable Objects subject to quotas; monitor usage and current pricing. A commercial frontend must use eligible hosting; Vercel Hobby is non-commercial. No claim of unlimited free usage.
- Edit `ALLOWED_ORIGINS` in `realtime-worker/wrangler.jsonc` to include the exact deployed frontend origin, without a path or trailing slash. The existing production origin is included; remove local origins from production config if you won't use the live backend locally. For Preview domains, explicitly allow the specific origin or use localhost; never wildcard CORS. If namespace IDs 71001/71002 collide with other Workers on your account, choose unique positive integer IDs.
- Redeploy Worker after updating config. In Vercel project settings, add `NEXT_PUBLIC_REALTIME_URL` with the HTTPS Worker origin (no path), then redeploy the frontend. Browser will use WSS for HTTPS. A Worker is separate from the Next.js server; just pushing frontend code won't deploy it. Keep secret values out of source and screenshots.
- On real phones use the deployed HTTPS frontend, not localhost. Repeat both-device tests. Do not open public beta until build, mobile testing, deployment and security/load checks pass.

## Model and security boundaries
Client profile is a nickname/mascot, not an authenticated real-world identity. Host creates room by POST; a distinct 256-bit invitation secret is needed for guest join; 256-bit session token is issued for each seat. Tokens and invitation secret are hashed at rest; session credentials live in tab sessionStorage, and WebSocket subprotocol carries the token rather than URL query. Keep secrets out of logs. Room URL fragments carry invitation secret only; fragments are cleared after successful entry. Exact origin allowlist plus CORS, request size limits, message shape validation, per-IP approximate rate limits and per-socket message limits. One socket per seat, two seats maximum. Game secret chosen with Web Crypto, guesses checked server-side, first correct wins, both exhausted draw, no opponent guesses or secret before result. Server serializes mutations, stores state before broadcasting, uses room-scoped view. Both ready and connected required for start, both online required to guess. Reconnect is best effort; sessionStorage cannot restore a token lost when a browser tab is closed. No strict global DDoS limit, bot challenge, authentication of personal identities, production CSP audit, full dependency audit, real latency/load tests or external penetration test. Origin is not an authentication mechanism and non-browser clients can spoof it; possession of room credentials is the actual authorization boundary. A same-origin XSS can access browser storage. Review third-party scripts and enforce an appropriate CSP before public launch. No 100% security claim.

## Verification performed
- 27 existing frontend pure unit tests passed.
- 15 worker tests passed (10 engine tests + 5 transport harness tests using fake Cloudflare storage/socket primitives; no real network).
- Eight modified TS/TSX files syntax transpilation checked, shared online.ts and contracts.ts strict type checked with an environment declaration; Worker JS syntax checked. Full Next.js build could not run here because project dependencies are absent. Wrangler runtime/deployment and browser behavior are NOT verified here.

Official references: https://developers.cloudflare.com/durable-objects/best-practices/websockets/ ; https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ ; https://developers.cloudflare.com/durable-objects/platform/pricing/ .
