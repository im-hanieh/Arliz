# ARLIZ

**Arrays, Reasoning, Logic, Identity, Zero**

**Arliz** is a book about arrays. Not just how to use them — but how they *work*, where they come from, and why they matter.

It started as a personal attempt to understand arrays beyond syntax and surface-level use: *what is an array, really?* Following that question seriously turned a familiar programming topic into a much larger inquiry — one that runs from a voltage difference across a transistor all the way to tensor cores and quantum state vectors.

That path is long enough that it no longer fits in a single book. Arliz is organized as **one continuous work in three volumes**, each a complete stage of the same journey, readable on its own but part of one larger whole.

## The Three Volumes

| Volume | Title | Status | Covers |
|---|---|---|---|
| **I** | *Zero to Bit* | Living draft | How information is encoded at all: voltage and binary switching, Boolean algebra, number systems, integers, floating point, characters, endianness, bit manipulation, alignment, media encodings, pointers, and serialization. |
| **II** | *Silicon Horizon* | In progress | The hardware that turns encoded information into computation: semiconductor physics, logic gates, memory cells and hierarchies, processors, pipelines, ISAs, SIMD, GPUs, and interconnects. |
| **III** | *Array Odyssey* | In progress | Arrays themselves, in full: theory, memory layout, every major variant, the data structures and algorithms built on top of them, and the parallel/distributed systems and application domains that use them today. |

Each volume assumes the ones before it: Volume II assumes the representational vocabulary built in Volume I, and Volume III assumes both. See [`docs/VOLUMES.md`](./docs/VOLUMES.md) for the full breakdown of what each volume contains and how they connect.

## Read the Book

Each volume compiles to its own standalone PDF, named:

```
<YEAR>_ARLIZ_<Volume Title>_Volume_<N>.pdf
```

For example, Volume I currently builds as `2026_ARLIZ_Zero_to_Bit_Volume_1.pdf`.

- [Browse LaTeX source](./volumes/)
- Compiled PDFs are published under [Releases](https://github.com/papyrxis/Arliz/releases) and on the [project site](https://github.com/papyrxis/Arliz/tree/main/docs)

## Contributing

Contributions — corrections, clarifications, new examples, diagrams, or whole chapters — are welcome. Start with:

- [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) — how to report issues, open PRs, and the editorial/LaTeX standards
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — how the repository, build system, and workspace presets fit together
- [`docs/WORKFLOWS.md`](./docs/WORKFLOWS.md) — concrete day-to-day commands for building, generating chapters, and cleaning artifacts
- [`docs/VOLUMES.md`](./docs/VOLUMES.md) — what each volume covers, so you know where new content belongs

## License

- **Book content** (chapters, explanations, diagrams, prose) is licensed under **CC BY-SA 4.0**.
- **Source code, build scripts, and LaTeX tooling** are licensed under the **MIT License** (see [`LICENSE`](./LICENSE)).

See [`frontmatter/copyright.tex`](./frontmatter/copyright.tex) for the full copyright and citation notice.