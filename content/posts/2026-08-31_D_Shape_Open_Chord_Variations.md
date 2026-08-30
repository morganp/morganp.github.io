Title: D-Shape Open Chord Variations
Date: 2026-08-31
Category: Music
Tags: Guitar, Chords, Open Chords, Music Theory
Slug: d-shape-open-chord-variations
Author: morganp
Summary: Every common variation on the open D chord -- sus2, sus4, minor, sevenths, sixth, add9 -- each one a single change from the base shape, with fingering and intervals shown side by side.
Status: published

D major only uses four strings, which makes it the easiest open shape to hear a single finger move clearly against the others. This post works through the same set of variations as the [A-shape post]({filename}/posts/2026-08-30_A_Shape_Open_Chord_Variations.md), applied to D. Each diagram shows the fingering on the left and the intervals that fingering spells on the right.

<!-- PELICAN_END_SUMMARY -->

## Base shape: D major

The D shape splits its work neatly across two strings. The top E string carries the third, so every suspension and the minor happen there. The B string carries a doubled root, so every seventh, the sixth and the add9 happen there instead.

```fretdrom
{ chords: [
  { name: "D Major", frets: "xx0232", fingers: "---123", subtitle: "Fingering" },
  { name: "D Major", frets: "xx0232", intervals: [null, null, "R", "5", "R", "3"] }
] }
```

## Suspended: sus2 and sus4

Both suspensions move the top string alone, the string carrying the third in the base shape. Lift the ring finger and the open E gives the second; slide that same finger up one fret instead and G gives the fourth.

```fretdrom
{ chords: [
  { name: "Dsus2", frets: "xx0230", fingers: "---12-", subtitle: "Fingering" },
  { name: "Dsus2", frets: "xx0230", intervals: [null, null, "R", "5", "R", "2"] }
] }
```

```fretdrom
{ chords: [
  { name: "Dsus4", frets: "xx0233", fingers: "---123", subtitle: "Fingering" },
  { name: "Dsus4", frets: "xx0233", intervals: [null, null, "R", "5", "R", "4"] }
] }
```

## Minor and minor seventh

Dm takes that same top string down one fret to F, the minor third. Dm7 then moves the B string doubled root down two frets to C, the flat seventh, which puts both fretted notes on the first fret under a single index finger.

```fretdrom
{ chords: [
  { name: "Dm", frets: "xx0231", fingers: "---231", subtitle: "Fingering" },
  { name: "Dm", frets: "xx0231", intervals: [null, null, "R", "5", "R", "b3"] }
] }
```

```fretdrom
{ chords: [
  { name: "Dm7", frets: "xx0211", fingers: "---211", subtitle: "Fingering (index barre)" },
  { name: "Dm7", frets: "xx0211", intervals: [null, null, "R", "5", "b7", "b3"] }
] }
```

## Dominant seventh and major seventh

D7 makes the same B string move against the major third: doubled root down to C, the flat seventh. It is the shape most players learn first for a dominant chord, useful as the V in a blues in G (see the [12-bar blues post]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md)). Dmaj7 stops one fret higher at C#, a half step below the root.

```fretdrom
{ chords: [
  { name: "D7", frets: "xx0212", fingers: "---213", subtitle: "Fingering" },
  { name: "D7", frets: "xx0212", intervals: [null, null, "R", "5", "b7", "3"] }
] }
```

```fretdrom
{ chords: [
  { name: "Dmaj7", frets: "xx0222", fingers: "---123", subtitle: "Fingering" },
  { name: "Dmaj7", frets: "xx0222", intervals: [null, null, "R", "5", "7", "3"] }
] }
```

## Sixth and add9

D6 opens the B string, so the doubled root becomes the sixth and the third on the top string stays. Dadd9 moves that same B string the other way, from fret 3 to fret 5, turning the doubled root into the ninth. Both keep the third, which is what separates an add chord from a suspension.

```fretdrom
{ chords: [
  { name: "D6", frets: "xx0202", fingers: "---1-3", subtitle: "Fingering" },
  { name: "D6", frets: "xx0202", intervals: [null, null, "R", "5", "6", "3"] }
] }
```

```fretdrom
{ chords: [
  { name: "Dadd9", frets: "xx0252", fingers: "---142", subtitle: "Fingering" },
  { name: "Dadd9", frets: "xx0252", intervals: [null, null, "R", "5", "9", "3"] }
] }
```

## Summary table

| Chord | Frets (low to high) | Change from D major |
|-------|----------------------|----------------------|
| D | xx0232 | base shape |
| Dsus2 | xx0230 | top E: 3rd -> 2nd (open) |
| Dsus4 | xx0233 | top E: 3rd -> 4th |
| Dm | xx0231 | top E: 3rd -> b3 |
| Dm7 | xx0211 | Dm, plus B string: doubled root -> b7 |
| D7 | xx0212 | B string: doubled root -> b7 |
| Dmaj7 | xx0222 | B string: doubled root -> maj7 |
| D6 | xx0202 | B string: doubled root -> 6th (open) |
| Dadd9 | xx0252 | B string: doubled root -> 9th |

Next in the series: the [E-shape open chord variations]({filename}/posts/2026-09-01_E_Shape_Open_Chord_Variations.md).
