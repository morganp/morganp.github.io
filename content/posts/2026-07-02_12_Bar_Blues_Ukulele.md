Title: 12-Bar Blues on Ukulele in G, A, and E
Date: 2026-07-02
Category: Music
Tags: Ukulele, Music Theory, Blues, Nashville Number System, Chords
Slug: 12-bar-blues-ukulele-g-a-e
Author: morganp
Summary: The 12-bar blues moved to ukulele: the same 1-4-5 number chart, with chord shapes for the keys of G, A, and E in standard GCEA tuning.
Status: published

The 12-bar blues charts in this series ([the form]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md), [guitar barre chords]({filename}/posts/2026-07-02_12_Bar_Blues_Barre_Chords.md)) are written in numbers, and numbers do not care what instrument you are holding. This post converts the same 1-4-5 chart to ukulele shapes in standard GCEA tuning, for the three keys a uke player is most likely to get called into: G, A, and E.

<!-- PELICAN_END_SUMMARY -->

## The form, unchanged

Twelve bars, three chords, turnaround in bar 12 -- exactly as on guitar:

```text
1  1  1  1
4  4  1  1
5  4  1  1
```

All the variations from the [first post]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md) (quick change, long 5, the shuffle feel) apply as written. Only the shapes below change.

## Key of G

1-4-5 in G is G, C, D -- the friendliest blues key on a ukulele, all three chords in the first three frets:

```fretdrom
{
  tuning: "GCEA",
  config: { low_string: 2 },
  chords: [
    { name: "G (the 1)", frets: "0232", intervals: ["R", "5", "R", "3"] },
    { name: "C (the 4)", frets: "0003", intervals: ["5", "R", "3", "R"] },
    { name: "D (the 5)", frets: "2220", intervals: ["5", "R", "3", "5"] }
  ]
}
```

## Key of A

1-4-5 in A is A, D, E:

```fretdrom
{
  tuning: "GCEA",
  config: { low_string: 2 },
  chords: [
    { name: "A (the 1)", frets: "2100", intervals: ["R", "3", "5", "R"] },
    { name: "D (the 4)", frets: "2220", intervals: ["5", "R", "3", "5"] },
    { name: "E (the 5)", frets: "4442", intervals: ["5", "R", "3", "5"] }
  ]
}
```

E major is famously the ukulele's least favourite chord. The 4442 voicing above is the most reliable of the standard options; if it fights you, use E7 instead -- easier, and the blues actively prefers the 7th sound anyway:

```fretdrom
{ chord: { name: "E7", subtitle: "The easy way out", tuning: "GCEA", frets: "1202", intervals: ["3", "b7", "R", "5"] }, config: { low_string: 2 } }
```

## Key of E

1-4-5 in E is E, A, B. Guitarists love E blues for the open strings; on ukulele it is the workout key, with both the E and B shapes up the neck:

```fretdrom
{
  tuning: "GCEA",
  config: { low_string: 2 },
  chords: [
    { name: "E (the 1)", frets: "4442", intervals: ["5", "R", "3", "5"] },
    { name: "A (the 4)", frets: "2100", intervals: ["R", "3", "5", "R"] },
    { name: "B (the 5)", frets: "4322", intervals: ["R", "3", "5", "R"] }
  ]
}
```

Here too the 7ths are the escape hatch: E7 (1202, above) for the 1 and B7 for the 5 turn the workout key into an easy one. B7 comes in two common voicings -- take your pick:

```fretdrom
{
  tuning: "GCEA",
  config: { low_string: 2 },
  chords: [
    { name: "B7", subtitle: "Open form", frets: "4320", intervals: ["R", "3", "5", "b7"] },
    { name: "B7", subtitle: "Movable barre form", frets: "2322", intervals: ["b7", "3", "5", "R"] }
  ]
}
```

The open form is the easier grab -- fingers walk down 4-3-2 and the open A course rings as the b7. The barre form takes a moment more to set, but it damps cleanly for a choppy shuffle and it moves: slide it up a fret and it is C7, up three and it is D7. Let the hands decide.

## Playing it

Strum with the same shuffle feel as on guitar -- the lopsided long-short eighths from the [first post]({filename}/posts/2026-07-02_12_Bar_Blues_Fable.md#the-shuffle-feel). The ukulele's short sustain suits a damped, percussive shuffle: a light palm or finger mute after each strum stands in for the guitar's palm muting. And since every shape above is fretted with a finger or two, swapping any chord for its dominant 7th costs nothing -- lean on them freely.
