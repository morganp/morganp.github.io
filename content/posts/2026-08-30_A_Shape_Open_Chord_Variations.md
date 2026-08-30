Title: A-Shape Open Chord Variations
Date: 2026-08-30
Category: Music
Tags: Guitar, Chords, Open Chords, Music Theory
Slug: a-shape-open-chord-variations
Author: morganp
Summary: Every common variation on the open A chord -- sus2, sus4, minor, sevenths, sixth, add9 -- each one a single change from the base shape, with fingering and intervals shown side by side.
Status: published

The open A shape is one of the first chords most guitarists learn, and one of the most flexible: almost every common variation is a single finger moving from the base triad. Each diagram below shows the fingering on the left and the intervals that fingering spells on the right.

<!-- PELICAN_END_SUMMARY -->

## Base shape: A major

A major is the 1-3-5 triad: root, major third, perfect fifth. Four notes sound across five strings, so two of them are doubled. The B string carries the third, and the G string carries a doubled root. Those two strings are where every variation below happens.

```fretdrom
{ chords: [
  { name: "A Major", frets: "x02220", fingers: "--123-", subtitle: "Fingering" },
  { name: "A Major", frets: "x02220", intervals: [null, "R", "5", "R", "3", "5"] }
] }
```

## Suspended: sus2 and sus4

Suspended chords replace the third with the second or fourth -- no major or minor quality, just tension resolving back to the triad. Both moves happen on the B string. Lift the ring finger and the open B gives the second; slide that same finger up one fret and D gives the fourth.

```fretdrom
{ chords: [
  { name: "Asus2", frets: "x02200", fingers: "--12--", subtitle: "Fingering" },
  { name: "Asus2", frets: "x02200", intervals: [null, "R", "5", "R", "2", "5"] }
] }
```

```fretdrom
{ chords: [
  { name: "Asus4", frets: "x02230", fingers: "--123-", subtitle: "Fingering" },
  { name: "Asus4", frets: "x02230", intervals: [null, "R", "5", "R", "4", "5"] }
] }
```

## Minor and minor seventh

Am takes the B string third down one fret to C, the minor third. Am7 then releases the doubled root on the G string to the open G, adding the flat seventh -- one finger fewer than the major shape, not more.

```fretdrom
{ chords: [
  { name: "Am", frets: "x02210", fingers: "--231-", subtitle: "Fingering" },
  { name: "Am", frets: "x02210", intervals: [null, "R", "5", "R", "b3", "5"] }
] }
```

```fretdrom
{ chords: [
  { name: "Am7", frets: "x02010", fingers: "--2-1-", subtitle: "Fingering" },
  { name: "Am7", frets: "x02010", intervals: [null, "R", "5", "b7", "b3", "5"] }
] }
```

## Dominant seventh and major seventh

A7 makes the same move on the G string but against the major third: lift the middle finger, let the G ring open, and the doubled root becomes the flat seventh. The rest of the A major hand does not move. It is the V chord in a blues in D (see the [12-bar blues post]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md)). Amaj7 takes that string down only one fret instead, to G#, a half step below the root, for a jazzier and unresolved colour.

```fretdrom
{ chords: [
  { name: "A7", frets: "x02020", fingers: "--1-3-", subtitle: "Fingering" },
  { name: "A7", frets: "x02020", intervals: [null, "R", "5", "b7", "3", "5"] }
] }
```

```fretdrom
{ chords: [
  { name: "Amaj7", frets: "x02120", fingers: "--213-", subtitle: "Fingering" },
  { name: "Amaj7", frets: "x02120", intervals: [null, "R", "5", "7", "3", "5"] }
] }
```

## Sixth and add9

A6 is the one exception to the single-finger rule. Barre the second fret across the D, G, B and top E strings, and the open high E, a fifth, becomes F#, the sixth. Aadd9 goes back to the G string and stretches it up to the fourth fret, turning the doubled root into B, the ninth. Both keep the third, which is what separates an add chord from a suspension.

```fretdrom
{ chords: [
  { name: "A6", frets: "x02222", fingers: "--1111", subtitle: "Fingering (barre)" },
  { name: "A6", frets: "x02222", intervals: [null, "R", "5", "R", "3", "6"] }
] }
```

```fretdrom
{ chords: [
  { name: "Aadd9", frets: "x02420", fingers: "--142-", subtitle: "Fingering" },
  { name: "Aadd9", frets: "x02420", intervals: [null, "R", "5", "9", "3", "5"] }
] }
```

## Summary table

| Chord | Frets (low to high) | Change from A major |
|-------|----------------------|----------------------|
| A | x02220 | base shape |
| Asus2 | x02200 | B string: 3rd -> 2nd (open) |
| Asus4 | x02230 | B string: 3rd -> 4th |
| Am | x02210 | B string: 3rd -> b3 |
| Am7 | x02010 | Am, plus G string: doubled root -> b7 (open) |
| A7 | x02020 | G string: doubled root -> b7 (open) |
| Amaj7 | x02120 | G string: doubled root -> maj7 |
| A6 | x02222 | top E: 5th -> 6th, barre at fret 2 |
| Aadd9 | x02420 | G string: doubled root -> 9th |

Next in the series: the same treatment for the [D-shape]({filename}/posts/2026-08-31_D_Shape_Open_Chord_Variations.md) and [E-shape]({filename}/posts/2026-09-01_E_Shape_Open_Chord_Variations.md) open chords.
