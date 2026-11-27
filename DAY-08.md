# Day 08 — Premium Playclub polish

## Install
Extract this patch into the existing project root and replace only matching files. Back up personal changes first. Based on the supplied Day 7 source archive, including the reaction duplicate-key fix. Does not include environment files, Git history, dependencies, build caches or any Worker changes. No new packages. Existing CSS remains; the new `src/app/play/premium.css` layers the Playclub design system on top of it.

Run from the root:

```powershell
npm test
npm run build
npm run dev
```

If build succeeds, inspect `git status`, then commit and push the development branch. No Cloudflare deploy is needed for this patch. Continue using your already whitelisted stable branch URL; do not merge into main yet.

## Design changes
- Refined cream/pastel palette, ink outlines, softer shadows and a clear visual hierarchy. Original four mascots and brand remain.
- Game shelf with custom game art, duration, game type, explicit multiplayer and solo actions. Join-room shortcut opens join mode when no existing room is restored.
- Shared Playclub navigation and readable mobile typography. Room entry uses compact mascot cards and explicit connection feedback.
- Desktop game stage and room score/reaction sidebar; phones and tablets put the game first, with direct links between the game and reaction panel. Compact player cards. Ready and Start together in the lobby. Invite copy/share remain unchanged.
- Number Rush: visible remaining attempts, input and submit button together when space allows. Brain Sync: clear selection, round progress, urgent countdown, staged answer reveal. Poison Picks: large opponent board, compact read-only own board on mobile, clear turn indicators and results/rematch before board history.
- Audio and share controls gain readable labels/icons and more generous touch targets. Scoped entrance, selection, countdown, reaction and celebration animations; reduced-motion preference honored. No new networking logic or game rules.
- Landing page: Playclub CTA prominence, beta cards link to real games, mobile layout tweaks, existing waitlist remains intact. This patch does not publish the production website.

## Research used
- Apple Human Interface Guidelines, Designing for games: https://developer.apple.com/design/human-interface-guidelines/designing-for-games/
- W3C mobile accessibility mapping: https://www.w3.org/TR/mobile-accessibility-mapping/
- web.dev, prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
- Primer mobile checklist: https://primer.style/accessibility/tools-and-resources/checklists/mobile-checklist/

## Verification
- Existing 30 frontend and 37 backend tests passed on the uploaded code with the patch applied.
- All 29 TS/TSX source files parsed without syntax errors; CSS parsed using PostCSS.
- Backend files byte-for-byte unchanged.
- Full Next.js build/type checking, browser screenshots, real-device testing and accessibility conformance not verified here: dependency installation failed and the standalone browser-render check timed out. These are not claimed as passing.

## Device acceptance checklist
- 320/360/390/430 px portrait, tablet portrait/landscape, 1440 px desktop: no horizontal scrolling, readable labels and no clipped controls.
- Create room, copy/share invitation, join from second device, change game, Ready/Start, reconnect and end room.
- Number Rush: keyboard entry, guesses, result, rematch, scoreboard.
- Brain Sync: shared question, private answer, timeout, reveal, five rounds, result, rematch.
- Poison Picks: trap setup, alternating turns, opponent board accessible, own board visible, winner, rematch.
- Send reactions during and after each game; exactly one game board/result should remain mounted. Use reaction jump and Back to game links on phone.
- Audio toggles, result PNG and native sharing, solo practice, guest setup, navigation and landing waitlist.
- Test with OS reduced motion enabled and keyboard-only focus, iOS Safari and Android Chrome. Verify 44px+ actionable targets where practical; the compact inactive own-board tiles are display-only.

## Important
The supplied archive also contained `.env.local` and `.git`. These were deliberately excluded without copying the secrets into the patch. If `.env.local` contains a real Resend key or other sensitive credentials, rotate them and update your local and Vercel environment variables. Do not include them in future archives.
