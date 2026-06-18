# Dressencoded Sustainability

This repository is the **Dressencoded Sustainability arm** — the circular-economy and Ethereum blockchain integration layer for the Dressencoded garment network, built out by Cameron's team.

It contains the UI and page composition for the **Circular Couture** initiative: hardware-verified garment passports, responsible lifecycle badges, and the Aquari Node textile drop-off network, in preparation for on-chain verification of garment lifecycle events (donation, recycling, resale) on Ethereum.

## What's here

- `src/app/sustainability/page.js` — the sustainability landing page
- `src/components/sustainability/` — page sections (Navbar, Hero, Pillars, PullQuote, HowItWorks, FlowCards, AquariNode, FooterCTA)
- `src/styles/tokens.js` — shared design tokens (colors, spacing, radius)

## Status

This is an extracted UI seed, split out from the main Dressencoded production app so Cameron's team can build out Ethereum blockchain integration independently. It does not yet include on-chain contracts, a wallet/provider layer, or backend indexing — those will be added as the integration takes shape.

No Firebase config, API keys, or other secrets are present in this repository.
