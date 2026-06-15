# Changelog

All notable changes to **Arliz** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
as far as a living, multi-volume work allows: a release marks a milestone in the
*structure, tooling, or documentation* of the project and/or in the *content* of
one or more volumes -- it does not imply that any volume is "finished."

Each volume continues to evolve independently between tagged releases. Compiled
PDFs are named `<YEAR>_ARLIZ_<Volume_Title>_<N>.pdf` and published as assets on
the corresponding [GitHub Release](https://github.com/papyrxis/Arliz/releases).

## [Unreleased]

## [1.0.0-beta-Volume_I] - 2026-06-15

> **This is a structural release, not a content release.** No chapter prose has
> been written for any volume yet -- every chapter in `parts/part01/`,
> `parts/part02/`, and `parts/part03/` currently exists only as a `\chapter{}`
> title with a short, comma-separated outline of the topics it will eventually
> cover. What this release delivers is the complete reorganization of Arliz from
> a single six-part book into three independent, continuously-buildable volumes,
> together with the build pipeline, templates, front matter, documentation, and
> website needed to support that structure going forward. "Volume I" appears in
> the version tag because its front matter (preface, introduction,
> acknowledgments, cover) and build configuration are the most complete of the
> three, and `vol1.pdf` is the first volume to have been built end-to-end as a
> test of the new pipeline.

### Changed -- Restructuring: six parts into three volumes

- Reworked the project from a single book organized into "Part 1" through
  "Part 6" into **three standalone volumes**, each compiling to its own PDF:
  - **Volume I -- *Zero to Bit*** (`parts/part01/part01.tex`, `volumes/vol1.conf`)
    -- representation and encoding, from a voltage difference to bits, numbers,
    characters, and serialization.
  - **Volume II -- *Silicon Horizon*** (`parts/part02/part02.tex`, `volumes/vol2.conf`)
    -- the hardware that executes arrays: logic gates, memory, ISAs, pipelines,
    SIMD, GPUs, and interconnects.
  - **Volume III -- *Array Odyssey*** (`parts/part03/part03.tex`, `volumes/vol3.conf`)
    -- arrays themselves: theory, memory layout, data structures, algorithms,
    parallel/distributed processing, and applications.
- Redistributed the planned content of the former "Part 4 -- Data Structures &
  Algorithms", "Part 5 -- Parallelism & Systems", and "Part 6 -- Synthesis &
  Frontiers" into Volumes I-III, at the points in the voltage-to-tensor
  narrative where each topic naturally belongs (documented as `MERGE NOTES`
  comments at the top of each `partXX.tex`):
  - NUMA architecture, SIMD/vector ISA chapters, GPU architecture/execution/
    memory/programming models, and TPU systolic arrays now sit in **Volume II**,
    immediately after the single-unit hardware topics they extend.
  - Stacks, queues, heaps, hash tables and probabilistic structures, strings and
    pattern matching, suffix structures, tries, graphs, range-query structures
    (segment tree, Fenwick tree, sparse table), dynamic programming, divide &
    conquer, greedy algorithms, backtracking, and streaming/amortized analysis
    now sit in **Volume III** as "structures and algorithms built on arrays".
  - Concurrency fundamentals, performance laws, threads/thread pools, OpenMP,
    synchronization primitives, lock-free structures, GPU array algorithms
    (sort/reduce/scan), and distributed array processing (MPI, MapReduce,
    Spark, PGAS, consensus) now sit in **Volume III** as a "parallel and
    distributed array processing" section.
  - Tensors and ML array operations, attention/transformers, linear algebra
    (BLAS/LAPACK), scientific computing and FFT, image/audio/video/signal
    processing, geospatial and bioinformatics arrays, quantum state vectors,
    array programming languages, and emerging array hardware/paradigms now sit
    in **Volume III** as the closing "arrays in science, machine learning, and
    beyond" section.
- Volume II's outline intentionally **excludes** the consumer-hardware
  repair/diagnostic chapters (motherboard repair, PSU diagnostics, mobile
  device teardown, soldering, etc.) that existed in the old Part 2 plan.
- Volume III's outline **drops** the memory/storage hardware-testing and
  diagnostic chapters (March algorithms for RAM testing, SMART attributes,
  etc.) that were appended to the end of the old Part 3 plan.
- Rewrote `README.md` to describe the three-volume structure, the
  dependency order between volumes, pointers to the new `docs/` guides, and
  the dual-license model (CC BY-SA 4.0 for content, MIT for code/tooling).
- Rewrote the project website (`docs/index.html`, `docs/style.css`,
  `docs/script.js`): new hero section with the ARLIZ acronym breakdown
  (Arrays, Reasoning, Logic, Identity, Zero), a "One Journey, Three Volumes"
  section, live GitHub stats and a contributors grid pulled from the GitHub
  API, and a community/contribution section.

### Added -- Build system and tooling

- New shared LaTeX template `main.tex`, instantiated once per volume via
  token substitution (`@PDF_TITLE@`, `@PDF_TITLE_FRONT@`, `@PDF_COVER_TITLE@`,
  `@PDF_SUBJECT@`, `@PDF_KEYWORDS@`, `@FRONTMATTER_DIR@`, `@MAIN_FRONTMATTER@`,
  `@PARTS@`, `@BACKMATTER@`).
- New per-volume configuration files `volumes/vol1.conf`, `volumes/vol2.conf`,
  and `volumes/vol3.conf`, each describing that volume's PDF metadata, front
  matter directory, list of `\part{}`/`\input{}` files, back matter files,
  volume number/title, and cover image.
- New generation/build/clean scripts under `scripts/volumes/`:
  - `generate.sh <volN>` -- produces `<YEAR>_ARLIZ_<Title>_<N>.tex` from
    `main.tex` + the volume's `.conf` file, for manual compilation (e.g. in
    TeXstudio).
  - `build.sh <volN|all>` -- generates and compiles a volume (or all volumes)
    with `latexmk` (pdflatex + biber, multiple passes), producing
    `build/<YEAR>_ARLIZ_<Title>_<N>.pdf`.
  - `clean.sh` -- removes all generated top-level volume `.tex` files and
    `build/`.
- New top-level `Makefile` with targets: `vol1`, `vol2`, `vol3`, `volumes`,
  `generate-vol1`/`generate-vol2`/`generate-vol3`, `clean-vol1`/`clean-vol2`/
  `clean-vol3`, `clean-vols`, `sync`, `build`, `watch`, `part`, `chapter`,
  `cover`, `test`, `version`, and `help`.
- First end-to-end build of **Volume I** (`vol1.pdf`) produced as a test of the
  new modular pipeline.
- Regenerated the per-volume `.tex` and `.pdf` outputs for all three volumes
  against the finalized `volumes/*.conf` files and directory layout.

### Added -- Front matter and shared content

- New per-volume front matter for Volume I under `frontmatter/vol1/`:
  `cover.tex`, `preface.tex`, `Introduction.tex`, and `acknowledgments.tex`.
- New shared front matter: `frontmatter/title.tex` (title page),
  `frontmatter/copyright.tex` (copyright notice and dual-license terms,
  preferred citation, and contact information), and `frontmatter/about_author.tex`
  (a new "About the Author" chapter, including the author photo).
- New shared back matter content (glossary placeholder, bibliography section,
  and a closing "Reflections at the End" / author's notes section).
- Added the `wrapfig` package to the graphics configuration
  (`.pxis/components/graphics.tex` and `configs/graphics.tex`) to support the
  author-photo layout used in "About the Author".
- Added and customized the `hyperref` setup
  (`.pxis/components/hyperref.tex`) with PDF metadata (title, author, subject,
  keywords) and link styling, wired up via `\PDFTitle`, `\PDFAuthor`, and
  related macros in `main.tex`.

### Added -- Documentation

- New `docs/ARCHITECTURE.md` explaining the repository layout, the
  template-plus-per-volume-config pattern, the volume config variables, and
  how the three volumes are produced from one shared source tree.
- New `docs/VOLUMES.md` describing what each volume covers, the one-directional
  dependency order between volumes (I -> II -> III), and where new chapters
  should be added.
- New `docs/WORKFLOWS.md` with concrete day-to-day commands for building,
  generating, and cleaning each volume, plus a troubleshooting section.
- New `docs/CONTRIBUTING.md` covering local setup, issue reporting (using the
  templates below), the pull-request process, branching strategy, semantic
  commit-message conventions, source-documentation rules, LaTeX coding
  standards, and editorial guidelines.
- New `docs/CHANGELOG.md` (this file).
- New GitHub issue templates under `.github/ISSUE_TEMPLATE/`: `bug_report.yml`,
  `feature_request.yml`, `documentation_update.yml`, `discussion_ideas.yml`,
  and `general_inquiry.yml`, adapted to Arliz's volume/part terminology and the
  two-digit `book/parts/partNN/` referencing convention.
- New `.github/ISSUE_TEMPLATE/config.yml` pointing contributors to the README
  and `docs/CONTRIBUTING.md` instead of generic placeholder links.
- New `.github/PULL_REQUEST_TEMPLATE.md` with a structured checklist covering
  LaTeX content changes, macros, figures/tables, structural changes, and build
  verification steps (`xelatex`/`biber` passes).

### Added -- Repository hygiene

- New `.gitignore` covering LaTeX build byproducts (`*.aux`, `*.log`, `*.out`,
  `*.toc`, `*.bbl`, `*.bcf`, `*.blg`, `*.synctex.gz`, `*.fdb_latexmk`, `*.fls`,
  index/glossary artifacts, etc.), the `build/` and `.backups` directories, and
  generated top-level volume files (`/vol*.tex`, `*_ARLIZ_*.tex`).
- New `.gitattributes` marking `*.tex` files as not linguist-detectable.

### Removed

- Removed "Part 4", "Part 5", and "Part 6" as independent top-level parts of
  the book. No planned content was deleted outright -- it was relocated into
  Volumes I-III and re-outlined as described above.

### Fixed

- Fixed `make watch` not correctly invoking the watch-mode build script.

### Notes -- naming history

- Volume I went through the working title **"BIT GENESIS"** during early
  restructuring before being finalized as **"Zero to Bit"**.
- Volume II was finalized as **"Silicon Horizon"** in the same naming pass.
- Volume III's title, **"Array Odyssey"**, was set as part of the initial
  three-volume split and has not changed since.

[Unreleased]: https://github.com/papyrxis/Arliz/compare/v1.0.0-beta-Volume_I...HEAD
[1.0.0-beta-Volume_I]: https://github.com/papyrxis/Arliz/releases/tag/v1.0.0-beta-Volume_I