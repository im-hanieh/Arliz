# The Volumes of Arliz

Arliz follows one continuous path — from a voltage difference across a transistor to a tensor — divided into three volumes. Each volume is a complete, independently readable stage of that path, but the dependencies run in one direction: later volumes assume the vocabulary and models built in earlier ones.

This document describes what each volume covers, how they connect, and where new content should go. Use it before adding a new chapter so it lands in the right volume.

## Volume I — *Zero to Bit*

**Source:** `parts/part01/part01.tex` and its chapter subdirectories under `parts/part01/`
**Config:** `volumes/vol1.conf`
**Output:** `<YEAR>_ARLIZ_Zero_to_Bit_Volume_1.{tex,pdf}`

The foundational question: how is information encoded in digital systems at all, starting from nothing but a voltage difference? By the end of Volume I, the reader has every representational tool needed for Volume II (how hardware stores and moves these encodings) and Volume III (how arrays organize them).

## Volume II — *Silicon Horizon*

**Source:** `parts/part02/part02.tex` and its chapter subdirectories under `parts/part02/`
**Config:** `volumes/vol2.conf`
**Output:** `<YEAR>_ARLIZ_Silicon_Horizon_Volume_2.{tex,pdf}`

The hardware that turns encoded information (Volume I) into computation. This volume assumes the representational vocabulary of Volume I and is, in turn, assumed by Volume III. This volume deliberately **excludes** consumer-hardware repair/diagnostic content; everything here is about understanding *why code runs the way it does*, which feeds directly into Volume III's performance discussions.

## Volume III — *Array Odyssey*

**Source:** `parts/part03/part03.tex` and its chapter subdirectories under `parts/part03/`
**Config:** `volumes/vol3.conf`
**Output:** `<YEAR>_ARLIZ_Array_Odyssey_Volume_3.{tex,pdf}`

The destination of the whole work: arrays themselves, in full, grounded in the representational model of Volume I and the hardware model of Volume II.

## Adding New Content

When proposing a new chapter or section:

1. Decide which volume it belongs to using the summaries above. As a rule of thumb: *encoding and representation* → Volume I; *hardware and execution* → Volume II; *the array data structure itself, algorithms on it, or its applications* → Volume III.
2. Add the chapter file under the appropriate `parts/partXX/chapterYY/` directory (see [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) for the directory layout).
3. Reference it from the corresponding `parts/partXX/partXX.tex` file in the right position — chapters are ordered to build on one another, so insert new material where its prerequisites are already established.
4. If the addition is large enough to be its own discussion, open a [Discussion & Ideas issue](../.github/ISSUE_TEMPLATE/discussion_ideas.yml) first.