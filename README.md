# Compute Frontier — AI Infrastructure Atlas

A polished, static, GitHub Pages-ready interactive website about frontier AI compute: why efficiency and GPU concentration rise together, how MoE changes the bottleneck, who is building the largest training fabrics, and how model design maps to FLOPs, accelerator-hours, power and cost.

## Pages

- `index.html` — narrative explainer: efficiency paradox, real training runs, cluster concentration and MoE routing
- `atlas.html` — interactive infrastructure atlas for Google, Microsoft, AWS, xAI, Meta and OpenAI/Stargate
- `hardware.html` — accelerator timeline from A100/H100 through Blackwell, Rubin, Trillium and Ironwood, plus a rack-scale calculator
- `lab.html` — interactive compute simulator with presets, wall-clock scaling chart, cost/energy estimates, and dense-vs-MoE comparison

## Features

- animated particle fabric and responsive visual system
- original vector / CSS graphics; no stock-image hotlinks
- interactive company explorer and schematic rack “city”
- hardware generation timeline with vendor-sourced specifications
- training FLOP, GPU-hour, checkpoint-size, electricity and rental-equivalent calculations
- dense vs MoE comparison
- idealized wall-clock scaling chart from 8K to 1M accelerators
- accessible reduced-motion mode
- mobile/tablet layouts
- no framework, package manager or build step

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Copy this folder into the repository root.
3. Push to the `main` branch.
4. In **Settings → Pages**, select **GitHub Actions** as the source.
5. The included `.github/workflows/pages.yml` publishes the static site.

## Methodology

The simulator uses a deliberately simple planning approximation:

`training FLOPs ≈ 6 × active parameters × training tokens`

`accelerator-hours = FLOPs / (effective FLOP/s per accelerator × 3600)`

The site labels disclosed figures separately from estimates. MoE active-parameter approximations omit some non-expert compute; real distributed scaling is sub-linear; power calculations exclude or separately approximate networking, CPU, storage and facility overhead.

## Primary sources

Primary links are embedded directly in each page, including Meta model cards, the DeepSeek-V3 technical report, Google TPU documentation and I/O disclosures, Microsoft Fairwater, AWS Project Rainier, xAI Colossus, OpenAI Stargate and NVIDIA accelerator documentation.

## License / reuse

The site code and original diagrams in this folder can be adapted for your own GitHub Pages project. Third-party names and trademarks remain property of their respective owners.
