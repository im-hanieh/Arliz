# Volumes

Arliz is one continuous work split into three volumes. The path runs from a voltage difference across a transistor all the way to tensor cores and quantum state vectors. Each volume is a self-contained stage of that path, but the dependency goes one way: later volumes assume what earlier ones build.

## Volume I — Zero to Bit

**Source:** `volumes/vol1/vol1.tex` and chapter files under `volumes/vol1/`  
**Config:** `configs/volumes/vol1.conf`  
**Output:** `<YEAR>_ARLIZ_Zero_to_Bit_Volume_1.pdf`

The starting question: how does a computer encode information at all, starting from a voltage? This volume covers everything from binary switching and boolean algebra up through integers, floating-point, characters, byte ordering, bitwise operations, memory alignment, pointers, error detection, media encodings, and serialization.

By the end of Volume I, the reader has every representational tool needed to understand Volume II (what hardware does with these encodings) and Volume III (how arrays organize them).

**Assumes:** basic programming familiarity, some discrete math  
**Required by:** Volume II and Volume III

## Volume II — Silicon Horizon

**Source:** `volumes/vol2/vol2.tex` and chapter files under `volumes/vol2/`  
**Config:** `configs/volumes/vol2.conf`  
**Output:** `<YEAR>_ARLIZ_Silicon_Horizon_Volume_2.pdf`

The hardware that turns encoded information into computation. This volume covers semiconductor physics, logic gates, SRAM and DRAM, memory hierarchies, cache coherence, ISAs (x86, ARM, RISC-V), pipelining, out-of-order execution, SIMD and vector units, GPU architecture, and interconnects.

Volume II explains *why code runs the way it does* at the hardware level. That understanding feeds directly into Volume III's performance discussion.

**Assumes:** Volume I  
**Required by:** Volume III

Note: this volume does not cover consumer hardware repair, diagnostics, or physical teardowns. The focus is on understanding execution, not on servicing hardware.

## Volume III — Array Odyssey

**Source:** `volumes/vol3/vol3.tex` and chapter files under `volumes/vol3/`  
**Config:** `configs/volumes/vol3.conf`  
**Output:** `<YEAR>_ARLIZ_Array_Odyssey_Volume_3.pdf`

Arrays themselves, covered in full. This volume starts with the mathematical definition of an array and works through memory layout, every major array variant (dynamic, multidimensional, sparse, bit arrays, circular buffers), searching and sorting, in-place manipulation, the data structures and algorithms built on arrays (stacks, queues, heaps, hash tables, segment trees, etc.), parallel and distributed array processing, and applications in machine learning, linear algebra, signal processing, and beyond.

**Assumes:** Volume I and Volume II

## Reading Order

You can read any volume on its own, but they build on each other:

- Volume II assumes the representational vocabulary of Volume I.
- Volume III assumes both.

If something in Volume III is unclear at the performance level, Volume II is where that answer lives. If something in Volume II is unclear at the encoding level, Volume I is where that answer lives.

## Adding New Content

When adding a chapter or section, decide which volume it belongs to:

- **Encoding and representation** (how data is stored as bits) → Volume I
- **Hardware and execution** (how the machine processes those bits) → Volume II
- **The array data structure itself, algorithms on it, or its applications** → Volume III

Steps:

1. Add the chapter file under the matching `volumes/volN/` directory.
2. Reference it from `volumes/volN/volN.tex` in the right position — chapters are ordered so that each one's prerequisites are already covered.
3. Build the volume (`make volN`) and confirm it compiles without undefined references.
4. If the addition is large or changes existing structure, open a Discussion issue first.