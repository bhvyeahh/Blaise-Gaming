# BanterBox Day 7 — Room vibes and sharing

Apply this patch on top of Day 6. It changes only the files in this ZIP, not wrangler.jsonc, .env.local, package.json, landing page, or your scroll-behavior fix in src/app/layout.tsx. Back up any personal changes to the changed files first.

## Install and deploy

From the project root on your existing develop/banterbox-mvp branch, extract this ZIP and replace matching files.

1. `cd realtime-worker` then `npm test` and `npm run deploy` then `cd ..`.
2. `npm test` then `npm run build` then `npm run dev` for local verification. Your existing NEXT_PUBLIC_REALTIME_URL and ALLOWED_ORIGINS remain unchanged.
3. Stop the dev server, inspect `git status` and `git diff`, then stage the intended files (never secrets), commit `feat: Day 7 room vibes and sharing` and push to develop/banterbox-mvp.
4. Test the stable preview branch URL after Vercel finishes. Do not merge main yet.

## What's new

- Online lobby sound and music controls, initially off on each page load. Original synthesized Web Audio cues and an optional simple looping melody; no audio downloads or extra dependencies. Browser/device audio availability varies. Sounds occur from authoritative game transitions. Controls remain accessible while in the lobby. Music pauses its note scheduling when the tab is hidden.
- Six authenticated live reactions with a per-connection cooldown; displayed briefly and not saved as chat history. Reactions never expose private gameplay or room credentials.
- Room-lifetime scoreboard, persisted with the server state. Number Rush and Poison Picks wins count by seat; Number Rush ties count separately. Brain Sync counts as a shared match and tracks matched answers rather than competitive wins. Scores persist through reload/reconnect and game switches, and end when the room expires or closes. Older rooms start with zero recorded totals; no historical backfill.
- Completed online games offer a 1080x1080 PNG result card download and native share/copy text. Result cards do not contain names, room IDs, invitation codes, guesses, or secret values. Shared text links to the current origin's /play, not the private invite. Preview links may still require Vercel authentication.
- Host can use the device's native share sheet for a private invitation, with clipboard fallback. Only share invites with intended guests.
- Existing room/rematch flow and all three solo games preserved. Audio and new sharing features apply to the online lobby for this milestone; solo audio is deferred. No AI or changes to the question library.

## Two-device verification

- Create a fresh room and join from a second device; enable sound and music separately and mute each.
- Exchange reactions from both devices; rapidly tapping is throttled. No reaction should appear in an unrelated room.
- Finish Number Rush; check correct scoreboard on both devices. Test a draw if desired.
- Agree to rematch, switch to Poison Picks, and finish; check the scoreboard adds only one result.
- Switch to Brain Sync and finish all five questions. Shared answer totals should increase without giving either player a competitive win.
- Refresh either device. Scores and private room state remain; audio starts off again.
- Export the PNG, share result text, and check no private invitation or player name is included. Test native invitation share from a fresh room.
- Test all three solo games as before. No new env vars or config changes.

## Verification scope

30 frontend and 37 backend Node tests passed locally. Worker transport tests use Cloudflare API doubles, not the deployed runtime. TypeScript syntax transpilation passed for all changed TS/TSX files. Full Next.js build and device/browser testing are not verified in this environment. If working in an old active room, create a new room after deploying to see a clean scoreboard.
