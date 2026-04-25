Title: Fretboard Diagrams in Pelican
Date: 2026-04-25
Category: Music
Tags: Guitar, Pelican, Plugin, SVG, Chord, Tab, Music Theory
Slug: fretboard-diagrams-in-pelican
Author: morganp
Summary: A walkthrough of the pelican-fretboard plugin -- chord charts, scale boxes, and tab rendered as SVGs directly from fenced code blocks, with a comparison of finger-number and interval-label views.
Status: published

For a long time my guitar diagrams lived on paper -- annotated chord boxes and scale grids scribbled in notebooks. When it came to writing them up digitally I found the process time consuming and the results inconsistent: different posts would use different styles, sizes, or notation conventions with no easy way to keep them in sync. This post introduces [pelican-fretboard](https://github.com/morganp/pelican-fretboard), a plugin that renders chord charts, scale boxes, and tab directly from fenced code blocks in Markdown. Diagrams are generated as SVGs, cached on disk, and served as static files -- nothing to install on the reader's side.

<!-- PELICAN_END_SUMMARY -->

---

## The problem with ASCII diagrams

The classic way to notate a chord in plain text looks like this:

```text
E Major

e ---0---
B ---0---
G ---1---
D ---2---
A ---2---
E ---0---

Fingers: - 2 3 1 - -
```

It works, but it is fragile to copy-paste, hard to scan at a glance, and carries no colour or visual hierarchy to distinguish the root note from the rest of the chord.

---

## Chord diagrams

The plugin renders a `chord` block into a standard box diagram. The `frets` array runs low string to high (E A D G B e for standard tuning). `x` means muted, `0` is open.

### Fingers view

Add a `fingers` array and each fretted dot shows the finger number:

````markdown
```chord
name: E Major
frets: [0, 2, 2, 1, 0, 0]
fingers: [-, 2, 3, 1, -, -]
```
````

```chord
name: E Major
frets: [0, 2, 2, 1, 0, 0]
fingers: [-, 2, 3, 1, -, -]
```

Open strings show a small circle above the nut; the first fret is drawn as a thicker nut line.

### Intervals view

Supply a `harmony` array instead and each dot shows its interval relative to the root. Root strings are highlighted in purple and the subheading changes to *Intervals*:

````markdown
```chord
name: E Major
frets: [0, 2, 2, 1, 0, 0]
harmony: [R, 5, R, 3, 5, R]
```
````

```chord
name: E Major
frets: [0, 2, 2, 1, 0, 0]
harmony: [R, 5, R, 3, 5, R]
```

Both arrays can coexist in one block. `harmony` is shown by default; add `show: fingers` to flip to the fingering view:

````markdown
```chord
name: E Major
frets: [0, 2, 2, 1, 0, 0]
fingers: [-, 2, 3, 1, -, -]
harmony: [R, 5, R, 3, 5, R]
show: fingers
```
````

```chord
name: E Major
frets: [0, 2, 2, 1, 0, 0]
fingers: [-, 2, 3, 1, -, -]
harmony: [R, 5, R, 3, 5, R]
show: fingers
```

Comparing the two views of the same chord makes it easy to see which finger lands on which interval -- useful when discussing voicings or substitutions.

---

## A seventh chord

G7 is a good test because it includes four distinct intervals. The `harmony` view makes the b7 on the high e string immediately visible:

````markdown
```chord
name: G7
frets: [3, 2, 0, 0, 0, 1]
harmony: [R, 5, 3, R, 5, b7]
```
````

```chord
name: G7
frets: [3, 2, 0, 0, 0, 1]
harmony: [R, 5, 3, R, 5, b7]
```

The same shape in fingers mode:

````markdown
```chord
name: G7
frets: [3, 2, 0, 0, 0, 1]
fingers: [3, 2, -, -, -, 1]
```
````

```chord
name: G7
frets: [3, 2, 0, 0, 0, 1]
fingers: [3, 2, -, -, -, 1]
```

---

## Barre chords

The `barre` key draws the barre bar. `from_string` and `to_string` are 1-indexed, low string to high:

````markdown
```chord
name: F Major (barre)
frets: [1, 1, 2, 3, 3, 1]
fingers: [1, 1, 2, 3, 4, 1]
root_strings: [1, 6]
barre: {fret: 1, from_string: 1, to_string: 6}
```
````

```chord
name: F Major (barre)
frets: [1, 1, 2, 3, 3, 1]
fingers: [1, 1, 2, 3, 4, 1]
root_strings: [1, 6]
barre: {fret: 1, from_string: 1, to_string: 6}
```

---

## Scale diagrams

The `scale` block renders a fretboard grid. Each row is a string (low E first), each column is a fret starting at `start_fret`. Cell values: `R` = root (purple), `x` = scale note (charcoal), `.` = empty.

````markdown
```scale
name: A Minor Pentatonic
start_fret: 5
num_frets: 5
grid:
  - "R . . x ."
  - "x . x . ."
  - "x . R . ."
  - "x . x . ."
  - "x . . x ."
  - "R . . x ."
```
````

```scale
name: A Minor Pentatonic
start_fret: 5
num_frets: 5
grid:
  - "R . . x ."
  - "x . x . ."
  - "x . R . ."
  - "x . x . ."
  - "x . . x ."
  - "R . . x ."
```

Fret numbers are shown on the left so the position on the neck is always clear.

---

## Tab

Standard ASCII tab syntax works inside a `tab` block. Barlines become light vertical rules; note numbers sit on the string lines with the line knocked out behind them so they remain readable:

````markdown
```tab
name: E String Blues Riff
tab: |
  e|----------------|
  B|----------------|
  G|----------------|
  D|----------------|
  A|----------------|
  E|0--3-5-3--0-----|
```
````

```tab
name: E String Blues Riff
tab: |
  e|----------------|
  B|----------------|
  G|----------------|
  D|----------------|
  A|----------------|
  E|0--3-5-3--0-----|
```

---

## Any fretted instrument

Set `tuning` to match your instrument and the string count adjusts automatically:

````markdown
```chord
name: E (bass)
tuning: EADG
frets: [0, 2, 2, 1]
fingers: [-, 2, 3, 1]
root_strings: [1]
```
````

```chord
name: E (bass)
tuning: EADG
frets: [0, 2, 2, 1]
fingers: [-, 2, 3, 1]
root_strings: [1]
```

The same syntax works for ukulele (`GCEA`), five-string bass (`BEADG`), mandola (`CGDAE`), or any open tuning.

---

## How it works

The plugin registers a Markdown preprocessor that intercepts `chord`, `scale`, and `tab` fenced blocks before they reach the syntax highlighter. Each block is parsed as YAML, rendered to an SVG, and saved to `content/images/fretboard/` using a SHA-256 hash of the block content as the filename. The fenced block is replaced inline with a `<figure><img /></figure>` tag. The SVG cache persists across `make clean` -- diagrams are only regenerated when their source content changes.

Source and installation instructions are at [github.com/morganp/pelican-fretboard](https://github.com/morganp/pelican-fretboard).
