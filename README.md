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

## Current scope — 0.20.0

- Dragon of Wisdom is the default starting screen, with original scene artwork, a next-feature goal, feeding from best level 50, source feeding costs, blue coin payout, daily reset, Friday meter bonus, discovered speeches, Dragon Boost, and level rewards.
- Feature Shop uses the current v1853 costs and gates: Idle Mode Lv.2 / 500 Y; Boost Generator Lv.4 / 2,000 Y; Garden Lv.12 / 10,000 Y; Battle Arena Lv.25 / 50,000 Y; Arcade Lv.80 / 750,000 Y. These features require purchase, not just reaching the level.
- Arcade Pack requires Arcade and 750 B, unlocking MindSweeper, MMRX and Balance 3. Other five Normal games are included in the base Arcade.
- Persistent right Progress Bar, claim rewards, level growth, boost, local saves and JSON export/import.
- Early Battle Arena: 33 monsters, four bosses, three training/forest zones and Pub, ten weapons, five armor slots/25 recipes, active/passive skills, MP, growth and bestiary.
- Garden: eight trees, 25 plots, timed repeat harvest, expansion and offline expiry.
- Eight Normal Arcade games: Whack-a-greg, Math Master, Pong, Ultimate Avoidance, MindSweeper, Balance 3, Triangle Count and MMRX.

Legacy saves retain used content based on actual Arena/Garden/Arcade records. Empty auto-created state does not unlock content. Existing progress and currency are preserved. New saves begin with features locked. Save data is per browser and origin; use Stats Export / Import to transfer from localhost or another device.

## Remaining work

The full original Newbie Tasks sequence, Button Machine, careers, pets, ascension and other late features are not implemented. The Dragon's first-feature goal is a small guide, not the complete original tutorial. The Sword of Ascendant and associated boss flow are not usable. Dragon cards, boxes and materials are recorded in the rewards ledger; their consumption systems are not yet implemented. Dragon 1.5x EXP/Coin time rewards are recorded, but their timers/multipliers are not connected yet. Original account-name speech uses Player. MMRX has visual timing without soundtrack. Arcade difficulty/rating/unranked systems and shops remain unported. Some combat timing and Progress Bar upgrade prices remain prototype values.

## Verification and sources

`npm test` covers core differential cases, gameplay, save validation, payouts, UI wiring, level/currency boundaries, purchase prerequisites, legacy migration, and Dragon feeding/reward boundaries. The core comparison uses decompiled AS-compatible JavaScript, not a running Flash VM. Browser smoke checks verify the actual Dragon start screen, locked-content routing and Feature Shop. Tests do not establish full Flash equivalence.

ASSET-PROVENANCE.json records original art hashes; SCRIPT-PROVENANCE.json records source calculations and adapters. The Dragon scene PNGs are unmodified images embedded in original shape 7421. Original game and asset rights belong to their respective owners.
