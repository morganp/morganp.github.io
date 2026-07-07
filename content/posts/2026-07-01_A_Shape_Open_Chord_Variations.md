Title: A-Shape Open Chord Variations
Date: 2026-07-01
Category: Music
Tags: Guitar, Chords, Open Chords, Music Theory
Slug: a-shape-open-chord-variations
Author: morganp
Summary: Every common variation on the open A chord -- sus2, sus4, minor, sevenths, sixth, add9 -- shown as a one-finger change from the base shape, with fretdrom diagrams for each.
Status: draft

The open A shape is one of the first chords most guitarists learn, and one of the most flexible: nearly every common variation is a single finger moving from the base triad. This post works through those variations one finger-move at a time.

<!-- PELICAN_END_SUMMARY -->

## Base shape: A major

A major is the 1-3-5 triad: root, major third, perfect fifth.

```fretdrom
{ chord: { name: "A Major", frets: "x02220", fingers: "-123-", root_strings: [5] } }
```

## Suspended: sus2 and sus4

Suspended chords replace the third with the second or fourth -- no major or minor quality, just tension resolving back to the triad.

```fretdrom
{ chord: { name: "Asus2", frets: "x02200", fingers: "-134-", subtitle: "3rd -> 2nd" } }
```

```fretdrom
{ chord: { name: "Asus4", frets: "x02230", fingers: "-124-", subtitle: "3rd -> 4th" } }
```

From the base A shape: sus2 lifts the middle finger off the third; sus4 shifts it up one fret. Both resolve naturally back to A major.

## Minor and minor seventh

```fretdrom
{ chord: { name: "Am", frets: "x02210", fingers: "-231-", subtitle: "Major 3rd -> minor 3rd" } }
```

```fretdrom
{ chord: { name: "Am7", frets: "x02010", fingers: "-2-1-", subtitle: "Am, drop a finger" } }
```

Am7 is Am with the note on the D string lifted -- one less finger than the major shape, not more.

## Dominant seventh and major seventh

```fretdrom
{ chord: { name: "A7", frets: "x02020", fingers: "-1-2-", intervals: [null, "R", "5", "b7", "3", null] } }
```

```fretdrom
{ chord: { name: "Amaj7", frets: "x02120", fingers: "-213-", intervals: [null, "R", "5", "7", "3", null] } }
```

A7 pulls the third's neighbour down to add the flat seventh -- the chord used for the V in a blues in D (see the [12-bar blues post]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md)). Amaj7 instead adds a half-step below the octave, a jazzier, unresolved colour.

## Sixth and add9

```fretdrom
{ chord: { name: "A6", frets: "x02222", fingers: "-1222", intervals: [null, "R", "5", "6", "3", null] } }
```

```fretdrom
{ chord: { name: "Aadd9", frets: "x02420", fingers: "-134-", intervals: [null, "R", "5", "9", "3", null] } }
```

A6 barres the top three strings at the second fret to add the sixth degree without removing anything. Aadd9 stacks a ninth above the third for a bright, open colour without the suspended chord's lack of a third.

## Summary table

| Chord | Frets (low to high) | Change from A major |
|-------|----------------------|----------------------|
| A | x02220 | base shape |
| Asus2 | x02200 | remove 3rd |
| Asus4 | x02230 | 3rd -> 4th |
| Am | x02210 | major 3rd -> minor 3rd |
| Am7 | x02010 | Am, drop a finger |
| A7 | x02020 | add b7 |
| Amaj7 | x02120 | add maj7 |
| A6 | x02222 | add 6th |
| Aadd9 | x02420 | add 9th |

Next in the series: the same treatment for the [D-shape]({filename}/posts/2026-07-01_D_Shape_Open_Chord_Variations.md) and [E-shape]({filename}/posts/2026-07-01_E_Shape_Open_Chord_Variations.md) open chords.
