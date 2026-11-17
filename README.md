# Anti-Idle web port

원본 v1853에서 추출한 캐릭터·배경을 사용한 JavaScript 포팅 작업본입니다.

## 실행

Node.js 20 이상으로 `npm test`, `npm run build`를 실행합니다. 의존 패키지 설치는 필요 없습니다.
`python -m http.server 8080 --directory dist`를 실행한 뒤 http://localhost:8080 을 엽니다.

## GitHub Pages 게시

1. 이 폴더의 내용을 GitHub 저장소의 루트에 넣습니다. 숨김 폴더 `.github`도 포함합니다.
2. 저장소 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 선택합니다.
3. `main` 브랜치에 push하거나 Actions → Deploy game to GitHub Pages → Run workflow를 실행합니다.
4. 성공한 workflow의 github-pages deployment URL에서 외부 접속할 수 있습니다.

기본 브랜치가 main이 아니면 `.github/workflows/pages.yml`의 branches를 바꿉니다.
HTML, JS, CSS, 원본 이미지, 글꼴이 모두 상대 경로로 연결되어 /repository-name/ 경로에서도 작동하도록 구성했습니다.
계정 로그인이나 서버 API 없이 실행되며 저장은 브라우저 localStorage에 남습니다.
다른 기기 또는 localhost에서 Pages로 이동할 때는 Stats → Export Save / Import Save로 옮깁니다.
실제 GitHub 저장소 게시 및 호스팅 URL 생성은 아직 실행하지 않았습니다.

## 복원 자료

- 캐릭터: main.house.arena.hero.body → DefineSprite 1292, frame 1.
- 배경: main.house.arena의 첫 번째 배경 → DefineSprite 3870, frame 1, Ye Olde Pub.
- PNG는 JPEXS FFDec 내보내기 결과를 그대로 복사했습니다. 배경의 투명 여백은 SVG viewBox로 제외합니다.
- 주점의 Mission Kommander와 Robacon은 원본 배경 프레임에 포함된 정적 그림입니다. 해당 NPC와 이동 화살표는 현재 상호작용하지 않습니다.
- 보상 획득 시 캐릭터의 짧은 점프는 웹 UI에서 추가한 효과이며 원본 애니메이션 복원이라고 주장하지 않습니다.
- 원본 자산 해시는 ASSET-PROVENANCE.json에 기록했습니다. 원본 게임 및 자산의 권리는 원권리자에게 있습니다.

## 구현 범위

진행 바, 초기 보상, 경험치와 초기 레벨 업, 부스트, 임시 강화 상점, 방치 보상, 브라우저 저장 및 JSON 가져오기/내보내기를 구현했습니다.
요구 경험치·진행 속도 등의 핵심 함수는 추출 코드에서 이식했습니다. 전체 보상 배율·이벤트·승천·장비·커리어는 아직 연결되지 않았습니다.
전투, 이동, NPC 상호작용, 정원, 아케이드와 전체 게임의 완전한 재구현은 이 패키지 범위에 포함되지 않습니다.
현재 보상 루프는 고레벨 8998 이전의 프로토타입이며, 상점 비용은 임시 밸런스입니다.

## 검증

- 핵심 계산 함수 2,870개 비교 사례 및 기본 검증 통과.
- 초기 5회 보상 → 레벨 2, 재화, 강화, 저장 복원, 방치 보상, 부스트 상한 검증 통과.
- 정적 자산 경로, DOM id 연결, 원본 PNG 해시, 배경 표시 영역 검증 통과.
- 배포된 Sites 버전에서 원본 캐릭터와 Ye Olde Pub 배경 표시를 실제 브라우저로 확인했습니다.
- 원격 미리보기: https://anti-idle-v1853-remote-preview.honey-crane-2766.chatgpt.site (본인 계정 접근).

공식 Pages 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages


## 0.4 훈련장 전투
원본 캐릭터·훈련장·더미 3종을 사용하며 수동/자동 공격, HP, 처치 보상, 재출현, 패배 후 여관 회복과 저장을 지원합니다. 적 기본 수치와 기본 피해 계산을 이식했습니다. 장비·스킬·상태 효과는 미구현이며 시작 장비 수치와 공격 간격은 임시값입니다.


## 0.5 Equipment
Newbie Stick / Tree Stick / Enchanted Tree Stick: original attack, rank requirements and pixel recipe costs from frame_4/DoAction.as:5334-5336. Original sprite 543 frames 101-103. Crafting, ownership, equipping, weapon display and damage are saved. Rank thresholds use the original normal-mode formula; the prototype feeds base enemy EXP into rank progress. Weapon speed, critical hits, bonus abilities, dexterity, equipment enhancement, and original recipe availability rules are not yet implemented. Swing motion is CSS, not the original Flash timeline. Existing saves receive Newbie Stick.


## 0.6 Combat speed and critical hits
Basic attack cooldown now follows original delay 175 reduced by weapon speed per 40 Hz frame (sprite 4817 frame1 child 4794_42; sprite 5992 lines 2131-2160, 5548). Speed 13 yields 14 frames / 0.35 seconds. Critical chance is floor(accuracy/1000) + weapon crit, capped at 95%; base critical damage is 100%, not 200% (5992 lines 2344-2384, 4029-4036). Current sticks have 10% crit. Modifiers from skills, armor, allies, combo and buffs remain unimplemented. Critical hit display and persistent attack/critical/best-hit statistics added. Manual G/Space keys supported. Player base stats and enemy attack interval remain provisional.


## 0.7 Rank growth
Normal-mode baseline uses the original reset values (frame_5/DoAction.as:5279-5284): HP 500, attack/defense 100, accuracy/evasion 50. Each rank through 500 adds the source stat increments and Pixel/Crafting Material/SP/Battle Point rewards (sprite 5992 lines 5725-5738). Rank 2 has HP 760, attack/defense 126. Existing pre-growth saves retain HP percentage and receive previous rank rewards exactly once. New rank increases do not heal current HP. Rank now affects damage, defense, accuracy and evasion; Enchanted Tree Stick dexterity adds 25% accuracy. SP and Craft balances are stored but their spending menus are not implemented. Rank-500 excess EXP rewards, mana, skill/armor modifiers, career effects, and the full original economy remain outside this slice. Enemy timing and pub recovery are still prototype values.


## 0.8 Local-only passive skills
Added Strength Enhancement (rank 10, max 10), Weapon Booster (rank 80, max 20), Critical Force (rank 90, max 30), Critical Chance (rank 100, max 10). Source: sprite 5444 frames 2/7; max levels use the normal skill table in frame_5 line 2961. Cost min(next level,10), refund min(current level,10), from sprite 5420. Learned levels affect actual attack/defense, attack speed and critical chance/damage, and persist in saves. Other passive/active skills remain unimplemented. This version is local-only, with automated tests; browser visual verification has not been run.


Progress reward interaction: the persistent right-side bar now claims completed rewards without changing the current content. Removed the standalone claim button. Upgrade access remains in the shop. Reward feedback appears beside the bar. Keyboard activation of the focused bar works during arena play. Local-only update; browser verification not run.


## 0.9 Local-only regions
Advanced Training Zone (rank 5): Living/Healer/Dark Dummy. Mystic Forest (rank 10): Green/Blue Snail. Source rank gates: sprite 3870 frame2 child3327_5 and frame3 child3327_5. Base enemy data from frame_4 addArenaEnemy rows 11-13/16-17. Source backgrounds 3870 frames3/4 and enemy sprite4652 frames11-13/16-17. Area selection, rank gates, cyclic zone-specific spawns, rewards, return-to-pub and saved region/pool validation implemented. Existing training saves retain enemy indices. This is a subset of each original area: rare/boss monsters, healing/enrage/status abilities and original weighted spawn rules remain unimplemented. Timing retains prototype cadence. Local-only, no deployment or browser visual QA.


## 0.10 Local-only enemy behavior
Original passive Heal: 1% roll per 40 Hz frame, floor((0.8+random)*heal), capped at maximum HP. Healer Dummy has heal 30. Green/Blue Snail rampage strictly below 25% HP once: speed x1.2; attack, defense, accuracy, evasion floor x1.5. Source sprite5992/frame1/PlaceObject2_4653_2720 enterFrame lines340-362; original enemy fields frame4. Enemy ally-active Buff: Enrage is not a monster attack. State persists across saves and resets on travel/spawn. Enemy attack interval is still provisional, accelerated by 1.2 during rampage; movement and range damage remain unimplemented. Automated tests only; no deployment.


## 0.11 Early combat milestone completion (local-only)
The agreed early-combat slice now includes all 33 base monsters (IDs 2-34), four bosses, normal pools (9/14/19), 10 weapons and 25 armor recipes, five armor slots, both Pixel/Crafting costs, MP and Basic/Quick/Power/Heal actions, passive training/refund, healing guard, gear-derived offense/defense/speed/crit, source rank growth/regen, ranged hits/explosion partial rewards, bestiary and boss clear records. Legacy enemy indices and saves are retained. See ../COMBAT-STATUS.md for audit boundaries and checks. No hosting operation was performed.


## 0.12 Garden (local-only)
New independent Garden view with 8 original tree types, the original growing/ready art, 1 initial plot expandable to 25, planting fees, timed repeat harvesting, expiry, Garden Points/EXP and plot grades, batch actions and clear mode. Source seed stats: sprite3315 frame1 child3159 loads; plots/growth: sprite3137/frame2; payouts: frame3 harvestTree. Free Tree harvests every30 seconds and expires315 seconds after planting. Expansion costs capacity²×500000 Y plus original GP table. Basic payout includes the original level factor, base Garden EXP/GP, Green/Blue coins; career/pet/event multipliers, random drops/fruit, fertilizer and Another Gardens are not implemented. Wall-clock deadlines continue while other content is open and through reload; no automatic offline harvesting. Feature unlock purchase is omitted to make this layer immediately accessible in the port. Progress reward bar stays usable throughout. Open /#garden locally. Automated tests/DOM event adapter passed; no browser visual QA or deployment.


v0.13.0: Added the first Arcade game, Whack-a-greg (Normal), with original 12×6 grid/art, score/life/special tiles, Progress Bar bonuses, rewards and persisted records. Other Arcade games and modifier systems remain unported. Local package update only.


v0.14.0: Arcade selector and Math Master Normal: all three original question types, 60-second timer, wrong-answer penalties, speed bonuses, multiplier, progress-bar rewards and separately saved records. Local package only.


v0.15.0: Added Pong Normal: original ball/paddle artwork, 40 Hz movement and paddle acceleration, AI, goals, extra life, 7-minute survival bonus, three Normal-mode powers, progress rewards and saved records. Keyboard plus drag/touch controls. Local update only.


v0.16.0: Ultimate Avoidance Normal added: original beam/player/pickup art, pointer tracking plus keyboard fallback, four progressively enabled beams, field rotation, multipliers, rechargeable shield, extra life/grace period, white coins and saved records. Collision uses a geometric approximation of Flash shape hitTest. Local update only.


v0.17.0: MindSweeper Normal core gameplay: original 20×10 board and tile art, directional/distance/nearby clues, goal/stage progression, time/turn pickups, flags, first two original scan powers, rewards and separate records. Other original Mind powers remain unported. Local update only.


v0.18.0: All nine MindSweeper power slots (17 context-dependent variants) implemented with source costs, conditions, target masks, conversions, turn bonuses and goal reveal. Automatic reveals now preserve the selected clue. Local update only.


v0.19.0: Balance 3, Triangle Count and MMRX Normal are playable. Static source adapters preserve decompiled calculations, moving shapes, chart generation and judgement; Flash display calls are replaced by SVG/HTML controls. All eight Arcade games have separate records and payouts. Original assets and script provenance are included. No GitHub repository or deployment has been created yet.
