# Anti-Idle web port

Play: https://sibeet.github.io/anti-idle-theweb/

Original v1853 assets and calculations are being ported to JavaScript. This is a partial recreation, not the complete original game.

## Run

Node.js 20 or later; no dependencies to install:

```sh
npm test
npm run build
python -m http.server 8080 --directory dist
```

Open http://localhost:8080/. Relative paths support the GitHub Pages repository subdirectory. The main-branch workflow tests, builds and deploys to GitHub Pages.

## Current scope — 0.23.0

- Dragon of Wisdom is the default starting screen, with original scene artwork, a next-feature goal, feeding from best level 50, source feeding costs, blue coin payout, daily reset, Friday meter bonus, discovered speeches, Dragon Boost, and level rewards.
- Feature Shop uses the current v1853 costs and gates: Idle Mode Lv.2 / 500 Y; Boost Generator Lv.4 / 2,000 Y; Garden Lv.12 / 10,000 Y; Battle Arena Lv.25 / 50,000 Y; Button Machine Lv.40 / 150,000 Y; Money Printer Lv.60 / 300,000 Y; Arcade Lv.80 / 750,000 Y. These features require purchase, not just reaching the level.
- Arcade Pack requires Arcade and 750 B, unlocking MindSweeper, MMRX and Balance 3. Other five Normal games are included in the base Arcade.
- Persistent right Progress Bar with hover collection (including when it fills under a stationary cursor), touch/click/keyboard fallback, claim rewards, level growth, boost, local saves and JSON export/import.
- Early Battle Arena: 33 monsters, four bosses, three training/forest zones and Pub, ten weapons, five armor slots/25 recipes, active/passive skills, MP, growth and bestiary.
- Garden: eight trees, 25 plots, timed repeat harvest, expansion and offline expiry.
- Eight Normal Arcade games: Whack-a-greg, Math Master, Pong, Ultimate Avoidance, MindSweeper, Balance 3, Triangle Count and MMRX.

Legacy saves retain used content based on actual Arena/Garden/Arcade records. Empty auto-created state does not unlock content. Existing progress and currency are preserved. New saves begin with features locked. Save data is per browser and origin; use Stats Export / Import to transfer from localhost or another device.

## Remaining work

The full original Newbie Tasks sequence, careers, pets, ascension and other late features are not implemented. The Dragon's first-feature goal is a small guide, not the complete original tutorial. The Sword of Ascendant and associated boss flow are not usable. Dragon cards, boxes and materials are recorded in the rewards ledger; their consumption systems are not yet implemented. Dragon 1.5x EXP/Coin time rewards are recorded, but their timers/multipliers are not connected yet. Original account-name speech uses Player. MMRX has visual timing without soundtrack. Arcade difficulty/rating/unranked systems and shops remain unported. Some combat timing remains approximate.

## Verification and sources

`npm test` covers core differential cases, gameplay, save validation, payouts, UI wiring, level/currency boundaries, purchase prerequisites, legacy migration, and Dragon feeding/reward boundaries. The core comparison uses decompiled AS-compatible JavaScript, not a running Flash VM. Browser smoke checks verify the actual Dragon start screen, locked-content routing and Feature Shop. Tests do not establish full Flash equivalence.

ASSET-PROVENANCE.json records original art hashes; SCRIPT-PROVENANCE.json records source calculations and adapters. The Dragon scene PNGs are unmodified images embedded in original shape 7421. Original game and asset rights belong to their respective owners.

## Rendering update — 0.20.1

The progress fill draws on each animation frame, interpolating the original 25ms simulation steps; game calculation speed is unchanged. Hidden Arcade boards no longer repaint. Running offscreen games continue their timers/simulation and settle once. The detailed UI is refreshed only for the current feature, and the offscreen Garden expiry/readiness check runs once per second.

A 120-frame DOM-adapter benchmark on the idle Dragon screen reduced setAttribute calls from38,820 to160, with120 progress-fill draws and zero hidden MMRX/MindSweeper tile attribute writes. This is a synthetic DOM-work regression check, not a measured browser FPS guarantee. Input tests cover mouse entry/readiness, continued hover, leaving/blur, touch/click fallback, duplicate payouts and preserving the current feature.

## Navigation update — 0.20.2

The feature tabs above the game and duplicate bottom content links have been replaced by the right-side World menu beside the Progress Bar. Dragon, Progress Bar, Garden, Battle Arena, Arcade, Shop/Upgrades and Stats share one menu with the current view highlighted. Level/purchase requirements and hover collection remain active. On screens700px wide or narrower, World starts collapsed and closes after choosing a feature. Desktop and390px browser checks verified navigation and mobile collapse.

Button Machine: original Lv40 / Y150,000 unlock, aiming grades, 15-perfect chain guard, durability/repair, Purple shop and online Grandpas. Original sprites 6021 and 149. Crate drops are recorded; opening crates, Elite mode, careers/pets/events, boost-freeze/depletion and offline Grandpas are not implemented.

## Money Printer — 0.22.0

Original passive coin printing, 80 initial charges, recharge to 160 for 2 G, printer upgrades through Lv400 with best-level gates, critical Green Coin prints, Super Battery (750 B) and recharge to 200 from any feature. Printer continues while other content is open; battery/progress/counters persist. Online ticking only; quest/achievement hooks, Epic skills and Battery Charger consumables remain pending.

## Progress modes — 0.22.1

Original base speeds: Manual 100%, Idle 30%. Separate +1% upgrades use B (Manual, cap 500%) and G (Idle, cap 200%) with original tiered costs. Manual uses the larger purchased speed; Idle uses its own speed. Normal per-claim EXP/Y are equal; Manual pays 200 G versus Idle 100 G and has a 10% +1 B chance. First five claims keep the original tutorial bonuses/acceleration. The Progress screen compares both speeds, current estimated cycle durations and rewards; the shared rail shows the current mode/speed/cycle. Known legacy prototype speed pairs migrate once from the incorrect 100/100 base, retaining purchased +25 increments up to original caps; currency/progress are preserved. Original progressUp differential tests and mode/shop/save/UI tests pass.

## Arena travel — 0.23.0

Scene arrows and keyboard directions follow original adjacent paths while the region selector remains available. Main path extends through Night Forest, The Sky, Deadlands, Danger Zone, Desert and Beach. The Sky branches to Polluted Sky; Danger Zone leads to Dark Portal, then Secret Beach. Two side areas are hidden from the selector until discovered, with persistent discovery and rank checks. There are 99 original base enemy entries including the base Guardian. Danger Zone has no random encounters. Original 25% player damage applies in the two side areas. This does not implement every original stage, NPC mission, rare/Hardcore variants or full Guardian/Finalizer phases.
