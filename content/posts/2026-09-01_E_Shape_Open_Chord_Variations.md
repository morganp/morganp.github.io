Title: E-Shape Open Chord Variations
Date: 2026-09-01
Category: Music
Tags: Guitar, Chords, Open Chords, Music Theory
Slug: e-shape-open-chord-variations
Author: morganp
Summary: Every common variation on the open E chord -- sus4, minor, sevenths, sixth, add9 -- each one a single change from the base shape, with fingering and intervals side by side, and a note on how this shape becomes the movable E-shape barre chord.
Status: published

E major is the full six-string open shape, and the same shape barred at any fret becomes the movable "E-shape" chord used throughout the [I-IV-V fretboard map]({filename}/posts/2026-07-01_Diatonic_Chords.md). This post closes the open-chord series started with [A]({filename}/posts/2026-08-30_A_Shape_Open_Chord_Variations.md) and [D]({filename}/posts/2026-08-31_D_Shape_Open_Chord_Variations.md). Each diagram shows the fingering on the left and the intervals that fingering spells on the right.

<!-- PELICAN_END_SUMMARY -->

## Base shape: E major

All six strings sound, so with only three distinct notes in the triad there is plenty of doubling. The G string carries the third, and the D string carries a doubled root. Those two strings take almost every variation below.

```fretdrom
{ chords: [
  { name: "E Major", frets: "022100", fingers: "-231--", subtitle: "Fingering" },
  { name: "E Major", frets: "022100", intervals: ["R", "5", "R", "3", "5", "R"] }
] }
```

## Suspended: sus4

The G string third moves up one fret to A, the fourth. An open Esus2 is not practical in standard tuning without muting or a stretch that defeats the point of an open chord, so sus4 is the one suspension that stays in the family of easy moves.

```fretdrom
{ chords: [
  { name: "Esus4", frets: "022200", fingers: "-234--", subtitle: "Fingering" },
  { name: "Esus4", frets: "022200", intervals: ["R", "5", "R", "4", "5", "R"] }
] }
```

## Minor and minor seventh

Em lifts the index finger and the open G string gives the minor third. Em7 then releases the doubled root on the D string as well, adding the flat seventh: one fretted note and five open strings, the simplest full chord shape on the guitar.

```fretdrom
{ chords: [
  { name: "Em", frets: "022000", fingers: "-23---", subtitle: "Fingering" },
  { name: "Em", frets: "022000", intervals: ["R", "5", "R", "b3", "5", "R"] }
] }
```

```fretdrom
{ chords: [
  { name: "Em7", frets: "020000", fingers: "-2----", subtitle: "Fingering" },
  { name: "Em7", frets: "020000", intervals: ["R", "5", "b7", "b3", "5", "R"] }
] }
```

## Dominant seventh and major seventh

E7 makes the same D string move against the major third: release the doubled root to the open D for the flat seventh. It is the I chord in a blues in E (see the [12-bar blues post]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md)). Emaj7 takes that string down only one fret instead, to D#, a half step below the root.

```fretdrom
{ chords: [
  { name: "E7", frets: "020100", fingers: "-2-1--", subtitle: "Fingering" },
  { name: "E7", frets: "020100", intervals: ["R", "5", "b7", "3", "5", "R"] }
] }
```

```fretdrom
{ chords: [
  { name: "Emaj7", frets: "021100", fingers: "-211--", subtitle: "Fingering (index barre)" },
  { name: "Emaj7", frets: "021100", intervals: ["R", "5", "7", "3", "5", "R"] }
] }
```

## Sixth and add9

E6 is the one variation that leaves both the third and the doubled root alone. It adds the pinky on the B string at the second fret, so a fifth becomes C#, the sixth. Eadd9 goes back to the D string and stretches it up to the fourth fret, turning the doubled root into F#, the ninth.

```fretdrom
{ chords: [
  { name: "E6", frets: "022120", fingers: "-2314-", subtitle: "Fingering" },
  { name: "E6", frets: "022120", intervals: ["R", "5", "R", "3", "6", "R"] }
] }
```

```fretdrom
{ chords: [
  { name: "Eadd9", frets: "024100", fingers: "-241--", subtitle: "Fingering" },
  { name: "Eadd9", frets: "024100", intervals: ["R", "5", "9", "3", "5", "R"] }
] }
```

## Summary table

| Chord | Frets (low to high) | Change from E major |
|-------|----------------------|----------------------|
| E | 022100 | base shape |
| Esus4 | 022200 | G string: 3rd -> 4th |
| Em | 022000 | G string: 3rd -> b3 (open) |
| Em7 | 020000 | Em, plus D string: doubled root -> b7 (open) |
| E7 | 020100 | D string: doubled root -> b7 (open) |
| Emaj7 | 021100 | D string: doubled root -> maj7 |
| E6 | 022120 | B string: 5th -> 6th |
| Eadd9 | 024100 | D string: doubled root -> 9th |

## From open shape to movable barre

Barre the whole E major shape at any fret and the root moves with it while every relationship above stays intact. An F major barre at the first fret is the open E shape shifted up one. This is the shape behind the "E-shape root on the 6th string" reference in the I-IV-V fretboard map: learn the variations here and the same finger patterns are available anywhere on the neck once barred.
