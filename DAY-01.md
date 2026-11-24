# BanterBox — Day 01 / Local alpha

## Apply this patch
Extract `BanterBox-Day-01.zip` into the root of your current clone, overwriting only the included files. Keep your existing `.env.local`. No new dependencies or database needed. Use Node 22.13+ for the built-in TypeScript test runner.

```sh
git switch -c develop/banterbox-mvp
npm ci
npm test
npm run lint
npm run build
npm run dev
```

Open http://localhost:3000/play. Select a nickname and mascot, then play Number Rush. The original `/` landing page remains and now links to `/play`. The original waitlist route is unchanged; it still requires valid Resend configuration and should be hardened before public launch. The current Next.js root layout uses next/font/google, so a first build may require network access. Test locally and use a preview deployment before merging into production.

## Implemented
- `/play`, `/play/setup`, `/play/solo` with scoped styling and four original SVG mascot concepts, blink/breathe and win/loss reactions; reduced motion supported.
- Device-local nickname/mascot preferences, revalidated on reading. No user identity or authority is derived from localStorage.
- Local number game with seven attempts, hints, duplicate rejection, win/loss, replay. A local secret is inspectable in DevTools; this mode is intentionally untrusted and has no rewards or online scoring.
- Pure TypeScript guest and preliminary client event contracts; eight unit tests. Event parser is not currently attached to a backend.
- No new dependencies. `npm test` ran successfully under Node 22.16. Full build, lint, dependency audit and browser/mobile tests were not run because dependency installation was blocked by uncached packages in this environment.

## Architecture for subsequent days (design only)
Use a separate Cloudflare Worker/Durable Object service with one object per room. Next.js UI remains untrusted. A create/join API will issue cryptographically random room identifiers and per-player session credentials. Room identifiers locate objects; they do not authenticate players. A private invite capability can admit one second player atomically; expire it after use and prevent brute force. Use HTTPS/WSS. Prefer same-site HttpOnly Secure session cookies with explicit Origin checks; if cross-origin, use an authenticated HTTPS exchange for a short-lived one-use connection ticket, never a long-lived session in URLs. Avoid logging tickets, invite secrets, nicknames or private answers. Store credential hashes, bind actions to the authenticated player, and verify each operation server-side. Do not expose hidden game data in snapshots or broadcasts. Use per-player projected state, server-authoritative time and scores, monotonic event sequence, idempotent command IDs, atomic updates and reconnect/recovery logic. Rate limit creates/joins/connections/messages and enforce payload size and room expiry. Reject unknown origins and enforce a strict production origin allowlist. No public chat or user HTML. Add CSP and other security headers with deployment-specific verification before public launch. Test two-device reconnects, unauthorized room access, malformed events, replay/race conditions, load, expiry, and secrets before public multiplayer. No claims of complete security or scalability until tested.

## Remaining baseline risk
The original waitlist route initializes Resend at module scope and ignores returned provider errors. Do not consider it production-verified. Fix and test the route separately, with bounded request body, validation, rate limiting, consent, duplicate handling, verified sender and redacted logs. Keep `.env.local` out of Git. The landing-page game also uses local-only secrets, as intended for a demo.
