Title: 12-Bar Blues on Irish Bouzouki in G, A, and E
Date: 2026-07-02
Category: Music
Tags: Irish Bouzouki, Music Theory, Blues, Nashville Number System, Chords
Slug: 12-bar-blues-irish-bouzouki-g-a-e
Author: morganp
Summary: The 12-bar blues on Irish bouzouki in GDAD tuning: the same 1-4-5 number chart with chord shapes for the keys of G, A, and E, plus the modal drone options the instrument does best.
Status: published

Same series, different instrument again: the 12-bar blues ([the form]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md), [guitar barre chords]({filename}/posts/2026-07-02_12_Bar_Blues_Barre_Chords.md)) converted to Irish bouzouki. Shapes below are for **GDAD** tuning, the most common Irish setup; each pair of strings is a unison course, so the diagrams show four strings for four courses. Keys covered: G, A, and E.

<!-- PELICAN_END_SUMMARY -->

## The form, unchanged

Twelve bars, three chords, turnaround in bar 12:

```text
1  1  1  1
4  4  1  1
5  4  1  1
```

Quick change, long 5, and the shuffle feel all carry over from the [first post]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md) untouched. Only the shapes change -- and on bouzouki, how much of each chord you actually play is a stylistic choice, covered at the end.

## Key of G

1-4-5 in G is G, C, D. GDAD is practically built for the key of G -- the 1 chord is two open courses and one finger:

<style>
.chord-row { display: flex; flex-wrap: wrap; gap: 0.75em; justify-content: center; align-items: flex-start; }
.chord-row p { margin: 0; }
.chord-row img { max-width: 100%; height: auto; }
</style>

<div class="chord-row" markdown="1">

```fretdrom
{ chord: { name: "G (the 1)", tuning: "GDAD", frets: "0020", intervals: ["R", "5", "3", "5"] } }
```

```fretdrom
{ chord: { name: "C (the 4)", tuning: "GDAD", frets: "0232", intervals: ["5", "3", "R", "3"] } }
```

```fretdrom
{ chord: { name: "D (the 5)", tuning: "GDAD", frets: "2004", intervals: ["5", "R", "5", "3"] } }
```

</div>

The C voicing keeps the open G course ringing underneath (technically C/G); on a droning instrument that is a feature, not a compromise.

## Key of A

1-4-5 in A is A, D, E:

<div class="chord-row" markdown="1">

```fretdrom
{ chord: { name: "A (the 1)", tuning: "GDAD", frets: "2242", intervals: ["R", "5", "3", "5"] } }
```

```fretdrom
{ chord: { name: "D (the 4)", tuning: "GDAD", frets: "2004", intervals: ["5", "R", "5", "3"] } }
```

```fretdrom
{ chord: { name: "E (the 5)", tuning: "GDAD", frets: "1222", intervals: ["3", "R", "5", "R"] } }
```

</div>

## Key of E

1-4-5 in E is E, A, B. The B is the A shape from the key of A slid two frets up -- the same "same shape, two frets" move the [guitar barre post]({filename}/posts/2026-07-02_12_Bar_Blues_Barre_Chords.md) uses for every 4-to-5 change:

<div class="chord-row" markdown="1">

```fretdrom
{ chord: { name: "E (the 1)", tuning: "GDAD", frets: "1222", intervals: ["3", "R", "5", "R"] } }
```

```fretdrom
{ chord: { name: "A (the 4)", tuning: "GDAD", frets: "2242", intervals: ["R", "5", "3", "5"] } }
```

```fretdrom
{ chord: { name: "B (the 5)", subtitle: "A shape, two frets up", tuning: "GDAD", frets: "4464", start_fret: 4, intervals: ["R", "5", "3", "5"], barre: { fret: 4, from_string: 1, to_string: 4 } } }
```

</div>

Drop the 3rd (the fret-6 note) and the barre alone gives 4-4-x-4 style bare fifths -- a B5 that drives just as well. Which leads to the real bouzouki move:

## Drones, dyads, and the 7th

Irish bouzouki accompaniment leans modal: two- and three-note shapes, no 3rd, open courses droning. That vocabulary works on a blues too -- the 3rd of each chord is optional when the melody or the singer is supplying the blue notes, and 1-4-5 played as bare fifths with a shuffle drives just as hard as the full chords. Drop the labelled 3 from any diagram above and what remains is the modal version of the same chord.

For the bluesier colour the series keeps returning to, the 7th is one lifted or added finger away here too. The best of them falls out of the tuning for free in the key of E: lower the top course of the E shape to open and the open D course *is* the b7 --

```fretdrom
{ chord: { name: "E7", subtitle: "Open top course = b7", tuning: "GDAD", frets: "1220", intervals: ["3", "R", "5", "b7"] } }
```

Play the 12-bar grid in E with that shape as the 1 and the form starts sounding like it grew up on this instrument after all.
