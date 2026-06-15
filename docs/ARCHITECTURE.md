# Architecture

This document explains how the Arliz repository is organized: the directory layout, the LaTeX template/generation system, the Papyrxis workspace preset, and how the three volumes are produced from one shared source tree.

## High-Level Layout

```
.
main.tex                  # Shared template for all volumes (token-based)
Makefile                  # Entry points: make vol1 / vol2 / vol3 / volumes / clean...
workspace.yml             # Papyrxis workspace configuration (.pxis/ preset source)
.pxis/                    # Auto-generated workspace preset (DO NOT EDIT)
configs/                  # Local override copies of selected .pxis components
frontmatter/              # Shared + per-volume front matter
parts/                     # The actual book content, one directory per volume
backmatter/                # Per-volume back matter (glossary, bibliography, reflections)
references/                # .bib files (e.g. references/part01.bib)
covers/                     # Cover art (e.g. covers/cover-vol1.jpg)
volumes/                    # One .conf file per volume — see "Volume Configs" below
scripts/            # Build tooling 
build/                       # Build output (gitignored)
docs/                         # This documentation, CONTRIBUTING.md, GitHub pages site
```

## The Template + Config Pattern

Arliz is **one shared LaTeX template** (`main.tex`) instantiated three times, once per volume. `main.tex` is not compiled directly — it contains placeholder tokens like `@PDF_TITLE@`, `@FRONTMATTER_DIR@`, `@PARTS@`, and `@BACKMATTER@`. A generation step substitutes these tokens using a per-volume `.conf` file to produce a real, compilable `.tex` file.

This means:

- **All three volumes share the same document structure** (title page, copyright, table of contents, bibliography, index) defined once in `main.tex`.
- **Each volume supplies its own**: PDF metadata, front matter directory, list of `\part{}` files to include, and list of back matter files to include.
- Adding a fourth volume in the future would mean adding one new `volumes/volN.conf` file — no changes to `main.tex` or the build scripts.

### Volume Configs (`volumes/volN.conf`)

Each config is a small bash file (sourced, not executed) defining:

| Variable | Purpose |
|---|---|
| `PDF_TITLE` | Full PDF title metadata, e.g. `"Arliz: Zero to Bit"` |
| `PDF_TITLE_FRONT` | Short running-header title, e.g. `"Arliz Vol. I"` |
| `PDF_COVER_TITLE` | Cover title text |
| `PDF_SUBJECT` | PDF subject metadata |
| `PDF_KEYWORDS` | PDF keywords metadata |
| `FRONTMATTER_DIR` | Per-volume front matter directory (e.g. `frontmatter/vol1`) |
| `MAIN_FRONTMATTER` | Shared front matter directory (`frontmatter`) |
| `PARTS` | Bash array of `\input{}` paths for this volume's part(s) |
| `BACKMATTER` | Bash array of `\input{}` paths for this volume's back matter |
| `VOLUME_NUM` | Numeric volume number, e.g. `1` |
| `VOLUME_TITLE` | Volume title with underscores instead of spaces, e.g. `Zero_to_Bit` |
| `COVER_IMAGE` | Cover image path (used by the cover generator) |

`VOLUME_NUM` and `VOLUME_TITLE` together determine the **output filename** for that volume (see "Output Naming" below).
