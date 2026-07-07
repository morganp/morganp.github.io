Title: D-Shape Open Chord Variations
Date: 2026-07-01
Category: Music
Tags: Guitar, Chords, Open Chords, Music Theory
Slug: d-shape-open-chord-variations
Author: morganp
Summary: Every common variation on the open D chord -- sus2, sus4, minor, sevenths, sixth, add9 -- shown as a one-finger change from the base shape, with fretdrom diagrams for each.
Status: draft

D major only uses four strings, which makes it the easiest open shape to hear a single finger move clearly against the others. This post works through the same set of variations as the [A-shape post]({filename}/posts/2026-07-01_A_Shape_Open_Chord_Variations.md), applied to D.

<!-- PELICAN_END_SUMMARY -->

## Base shape: D major

```fretdrom
{ chord: { name: "D Major", frets: "xx0232", fingers: "--132", root_strings: [4] } }
```

## Suspended: sus2 and sus4

```fretdrom
{ chord: { name: "Dsus2", frets: "xx0230", fingers: "--123", subtitle: "3rd -> 2nd" } }
```

```fretdrom
{ chord: { name: "Dsus4", frets: "xx0233", fingers: "--123", subtitle: "3rd -> 4th" } }
```

Both suspensions here move only the top string, the string carrying the third in the base shape -- the clearest possible illustration of what "suspended" means.

## Minor and minor seventh

```fretdrom
{ chord: { name: "Dm", frets: "xx0231", fingers: "--231", subtitle: "Major 3rd -> minor 3rd" } }
```

```fretdrom
{ chord: { name: "Dm7", frets: "xx0211", fingers: "--211", subtitle: "Dm, drop a finger" } }
```

## Dominant seventh and major seventh

```fretdrom
{ chord: { name: "D7", frets: "xx0212", fingers: "--121", intervals: [null, null, "R", "5", "b7", "3"] } }
```

```fretdrom
{ chord: { name: "Dmaj7", frets: "xx0222", fingers: "--123", intervals: [null, null, "R", "5", "7", "3"] } }
```

D7 is the shape most players learn first for a dominant chord -- useful as the V in a blues in G (see the [12-bar blues post]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md)).

## Sixth and add9

```fretdrom
{ chord: { name: "D6", frets: "xx0202", fingers: "--1-2-", intervals: [null, null, "R", "5", "6", "3"] } }
```

```fretdrom
{ chord: { name: "Dadd9", frets: "xx0230", fingers: "--123", subtitle: "shares shape with Dsus2 + open D bass" } }
```

D6 lifts the third's neighbour to add the sixth. Dadd9's most common open voicing shares fingering with Dsus2 -- the difference on paper is whether the third from a lower voicing is implied by the bass notes ringing under it in a full mix.

## Summary table

| Chord | Frets (low to high) | Change from D major |
|-------|----------------------|----------------------|
| D | xx0232 | base shape |
| Dsus2 | xx0230 | remove 3rd |
| Dsus4 | xx0233 | 3rd -> 4th |
| Dm | xx0231 | major 3rd -> minor 3rd |
| Dm7 | xx0211 | Dm, drop a finger |
| D7 | xx0212 | add b7 |
| Dmaj7 | xx0222 | add maj7 |
| D6 | xx0202 | add 6th |
| Dadd9 | xx0230 | add 9th |

Next in the series: the [E-shape open chord variations]({filename}/posts/2026-07-01_E_Shape_Open_Chord_Variations.md).
