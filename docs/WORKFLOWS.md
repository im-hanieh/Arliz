# Workflows

Concrete, day-to-day commands for building, generating, and cleaning Arliz. For the *why* behind these commands, see [`ARCHITECTURE.md`](./ARCHITECTURE.md); for *what content goes where*, see [`VOLUMES.md`](./VOLUMES.md); for *how to submit changes*, see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Prerequisites

- A TeX Live (or equivalent) distribution with `pdflatex`, `latexmk`, and `biber` available on `PATH`.
- The packages referenced in `.pxis/components/` (amsmath, amssymb, tcolorbox, tikz, listings, biblatex, etc.) — a "full" TeX Live install covers all of these.
- `bash` (the build scripts use bash-specific syntax — arrays, `source`, process substitution).
- `make` (optional convenience wrapper around `scripts/volumes/*.sh`).

Clone with submodules, since `.pxis/` is generated from the `workspace` submodule:

```bash
git clone --recurse-submodules https://github.com/papyrxis/Arliz.git
cd Arliz
```

If you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

## Building a Volume

```bash
make vol1      # Volume I  -- Zero to Bit
make vol2      # Volume II -- Silicon Horizon
make vol3      # Volume III -- Array Odyssey
make volumes   # all three, one after another
```

Each target:

1. Cleans that volume's previous build artifacts.
2. Generates `<YEAR>_ARLIZ_<Title>_Volume_<N>.tex` from `main.tex` + `volumes/volN.conf`.
3. Runs `latexmk` (pdflatex + biber, multiple passes).
4. Produces `build/<YEAR>_ARLIZ_<Title>_Volume_<N>.pdf`.

Example, for Volume I in 2026:

```
build/2026_ARLIZ_Zero_to_Bit_Volume_1.pdf
build/vol1/2026_ARLIZ_Zero_to_Bit_Volume_1.pdf   # latexmk's own output dir, plus .aux/.log/etc.
```

## Generating Without Compiling (TeXstudio / manual editing)

If you prefer to compile manually (e.g. in TeXstudio, for faster iteration with partial compiles), generate the volume's `.tex` file without running latexmk:

```bash
make generate-vol1   # writes 2026_ARLIZ_Zero_to_Bit_Volume_1.tex to the repo root
make generate-vol2
make generate-vol3
```

Or call the script directly:

```bash
bash scripts/volumes/generate.sh vol1
```

Open the generated file in your editor and compile as you would any LaTeX document (`xelatex`/`pdflatex` + `biber`, two or three passes for cross-references).

> Note: the generated top-level `.tex` files are build artifacts, not source files. Edit the chapter files under `parts/`, `frontmatter/`, `backmatter/`, etc. — never the generated `<YEAR>_ARLIZ_*.tex` file itself, since it will be overwritten on the next generate/build.

## Cleaning

```bash
make clean         # remove build/ and all stray .aux/.log/.toc/... files repo-wide
make clean-vols    # remove every generated <YEAR>_ARLIZ_*.tex file and build/
make clean-vol1    # remove only Volume I's generated .tex, its build/vol1/, and its PDF
make clean-vol2
make clean-vol3
```

`make vol1` / `vol2` / `vol3` already call the matching `clean-volN` first, so a normal build is always from a clean slate for that volume.

## Quick Smoke Test

```bash
make test
```

Runs `make clean` then `make build` (the Papyrxis workspace default build) and reports success/failure. Useful as a fast sanity check before opening a PR — but for volume-specific changes, prefer `make vol1` / `vol2` / `vol3` directly, since `make build` uses the workspace sync pipeline rather than the per-volume scripts.

## Adding a New Chapter

1. Decide which volume the chapter belongs to (see [`VOLUMES.md`](./VOLUMES.md)).
2. Optionally scaffold it with the generator:

   ```bash
   make chapter ARGS='-p 1 -c 3 -t "Chapter Title"'
   ```

   (`-p` = part/volume number, `-c` = chapter number, `-t` = title.) This creates the chapter file under the matching `parts/partXX/chapterYY/` directory using the project's standard chapter skeleton.
3. Reference the new chapter from `parts/partXX/partXX.tex` with `\chapter{...}`, placed where its prerequisites are already covered.
4. Build that volume (`make volN`) and confirm it compiles cleanly with no new warnings about undefined references.

## Adding a New Part/Volume

Scaffolding a new top-level part:

```bash
make part ARGS='-n 4 -t "Part Title"'
```

To make a new volume buildable end-to-end:

1. Create `volumes/volN.conf` (copy an existing one as a starting point) and fill in `PDF_TITLE`, `PDF_TITLE_FRONT`, `PDF_COVER_TITLE`, `PDF_SUBJECT`, `PDF_KEYWORDS`, `FRONTMATTER_DIR`, `MAIN_FRONTMATTER`, `PARTS`, `BACKMATTER`, `VOLUME_NUM`, `VOLUME_TITLE`, and `COVER_IMAGE`.
2. Create `frontmatter/volN/` with `cover.tex`, `preface.tex`, `introduction.tex`, and `acknowledgments.tex`.
3. Create `backmatter/volN/` with at least `backmatter.tex`.
4. Add a Makefile target following the `vol1`/`vol2`/`vol3` pattern (clean + `build.sh volN`), plus a matching `generate-volN` and `clean-volN` target.
5. `make volN` should now produce `build/<YEAR>_ARLIZ_<VOLUME_TITLE>_Volume_<N>.pdf` with no other changes to `main.tex` or the shared scripts.

## Regenerating the Cover

```bash
make cover
```

Regenerates cover art based on `workspace.yml` and the `COVER_IMAGE` path configured per volume.

## Syncing the Workspace Preset

If you've changed `workspace.yml` or files under `.pxis/components/` / `configs/`:

```bash
make sync
```

This regenerates `.pxis/preset.tex`. Never hand-edit `.pxis/preset.tex` directly — it is overwritten on every sync.

## Troubleshooting

- **`error: unknown volume 'volX' (no .../volumes/volX.conf)`** — check the volume name matches an existing `volumes/volX.conf` file exactly (`vol1`, `vol2`, `vol3`, …).
- **`error: VOLUME_NUM not set in ...`** / **`VOLUME_TITLE not set in ...`** — the `.conf` file is missing one of these two variables, which are required for the `<YEAR>_ARLIZ_<Title>_Volume_<N>` output name.
- **Undefined references / missing `.bbl`** — run the build again; `latexmk` with `-bibtex` should handle multi-pass compilation and bibliography generation automatically, but a first-time build sometimes needs an extra pass.
- **Missing images/figures** — confirm new images are under `book/images/` (or the volume-appropriate images directory) and referenced with a path relative to the chapter file, per [`CONTRIBUTING.md`](./CONTRIBUTING.md).