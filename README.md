# TRACE Museum Discovery Demo

Playable experimental museum discovery scanner for the **Montréal Museum of Fine Arts (MMFA)** and **Pérez Art Museum Miami (PAMM)**.

**Launch the demo:** https://jamesBenja.github.io/trace-museum-demo/

**Open the artwork test sheet:** https://jamesBenja.github.io/trace-museum-demo/artwork-test-sheet.html

## How to play
1. Open the demo and select **Montréal · MMFA** or **Miami · PAMM**.
2. Start a quest. Examine the visual clue and read the story prompt.
3. Choose **Scan artwork**. Give the browser camera permission or use **Take / Upload Photo**.
4. Show the test sheet on a second screen and photograph the corresponding work. A built-in **Test photo match** option also exercises the recognition algorithm without two devices.
5. Unlock the educational story and quiz; your progress and optional photos are stored locally in the browser.

**Camera permission:** Requires a secure site (HTTPS, provided by GitHub Pages). Webcam access and image recognition depend on the visitor's browser and image loading.

## Prototype limitations
- This is a small artwork-matching proof of concept, not a general-purpose artwork recognition system.
- Six real collection artworks are referenced, three per museum. They have **not** been confirmed to be physically on display.
- The app loads external artwork images; those resources can be unavailable or blocked by cross-origin restrictions. The Guide tab supports manually importing reference images.
- No user photos are uploaded to a TRACE server. Discoveries and optional photos are saved in this browser. Remote sources may receive normal image requests.
- The demo has not been endorsed or approved by either museum. Art reproductions may require permission for further use, especially wider public or commercial release. The test is intended for internal evaluation and institutional pitch review.

## Hosting
The site is an ordinary static `index.html` at the repository root. Enable GitHub Pages using **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**. GitHub will provide HTTPS automatically.

## IP
Copyright © 2026 TRACE prototype contributors. All rights reserved. No open-source license is granted for this repository. External artwork rights remain with the respective rights holders.
