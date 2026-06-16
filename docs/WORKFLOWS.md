# Workflows

Day-to-day commands for building, generating, and cleaning Arliz.

For the why behind the structure, see `ARCHITECTURE.md`. For where content goes, see `VOLUMES.md`. For how to submit changes, see `CONTRIBUTING.md`.

## Prerequisites

- TeX Live (or equivalent) with `pdflatex`, `latexmk`, and `biber` on `PATH`. A full TeX Live install covers all required packages.
- `bash` — the build scripts use bash-specific syntax.
- `make` — optional, wraps the scripts with short target names.

Clone with submodules:

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
make vol1      # Volume I  — Zero to Bit
make vol2      # Volume II — Silicon Horizon
make vol3      # Volume III — Array Odyssey
make volumes   # all three
```

Each target cleans the previous build for that volume, generates the `.tex` file, runs `latexmk` (pdflatex + biber, multiple passes), and writes the PDF to `build/`.

Output for Volume I in 2026:

```
build/2026_ARLIZ_Zero_to_Bit_Volume_1.pdf
```

## Generating Without Compiling

If you want to compile manually (e.g. in TeXstudio), generate the `.tex` file without running latexmk:

```bash
make generate-vol1
make generate-vol2
make generate-vol3
```

Or call the script directly:

```bash
bash scripts/volumes/generate.sh vol1
```

Open the generated file in your editor and compile with `pdflatex` + `biber`, two or three passes.

> Do not edit the generated `.tex` file. It is a build artifact and gets overwritten on every build. Edit the source files under `volumes/`, `frontmatter/`, `backmatter/`, etc.

## Cleaning

```bash
make clean         # remove build/ and all stray .aux/.log/.toc/... files
make clean-vols    # remove all generated volume .tex files and build/
make clean-vol1    # remove only Volume I artifacts
make clean-vol2
make clean-vol3
```

`make volN` already runs `clean-volN` first, so a normal build always starts from a clean state for that volume.

## Quick Build Test

```bash
make test
```

Runs `make clean` then `make build` and reports success or failure. For volume-specific changes, prefer `make volN` directly.

## Adding a Chapter

1. Decide which volume the chapter belongs to (see `VOLUMES.md`).
2. Optionally scaffold it with the generator:

   ```bash
   make chapter ARGS='-p 1 -c 3 -t "Chapter Title"'
   ```

   `-p` = volume number, `-c` = chapter number, `-t` = title. This creates the chapter file under `volumes/volN/chapterNN/` using the standard skeleton.

3. Add an `\input{}` reference in `volumes/volN/volN.tex` at the right position.
4. Run `make volN` and confirm it compiles with no new warnings.

## Adding a New Volume

1. Create `configs/volumes/volN.conf` (copy an existing one as a starting point).
2. Fill in all variables: `PDF_TITLE`, `PDF_TITLE_FRONT`, `PDF_COVER_TITLE`, `PDF_SUBJECT`, `PDF_KEYWORDS`, `FRONTMATTER_DIR`, `MAIN_FRONTMATTER`, `CHAPTERS`, `BACKMATTER`, `VOLUME_NUM`, `VOLUME_TITLE`, `VOLUME_DISPLAY_TITLE`, `COVER_IMAGE`.
3. Create `frontmatter/volN/` with `cover.tex`, `preface.tex`, `introduction.tex`, and `acknowledgments.tex`.
4. Create `backmatter/volN/` with at least `backmatter.tex` and `note.tex`.
5. Add Makefile targets following the `vol1`/`vol2`/`vol3` pattern.
6. Run `make volN` — it should produce `build/<YEAR>_ARLIZ_<VOLUME_TITLE>_Volume_<N>.pdf`.

## Syncing the Workspace Preset

After changing `workspace.yml` or anything under `configs/`:

```bash
make sync
```

This regenerates `.pxis/preset.tex`. Never edit that file by hand.

## Regenerating the Cover

```bash
make cover
```

Regenerates cover art based on `workspace.yml` and the `COVER_IMAGE` path in the volume config.

## Troubleshooting

**`error: unknown volume 'volX'`** — check that the volume name matches a file in `configs/volumes/` exactly (`vol1`, `vol2`, `vol3`).

**`VOLUME_NUM not set` / `VOLUME_TITLE not set`** — the `.conf` file is missing one of these variables.

**Undefined references / missing `.bbl`** — run the build again. `latexmk -bibtex` handles multi-pass compilation, but a first-time build sometimes needs an extra pass.

**Missing images** — confirm new images are placed under the correct path and referenced relative to the chapter file, not the root.