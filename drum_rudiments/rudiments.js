// rudiments.js — All 40 PAS International Drum Rudiments
(function () {
  const R = (o = {}) => ({ h: 'R', ...o });
  const L = (o = {}) => ({ h: 'L', ...o });
  const fR = (o = {}) => ({ h: 'R', grace: 'L', ...o });
  const fL = (o = {}) => ({ h: 'L', grace: 'R', ...o });
  const dR = (o = {}) => ({ h: 'R', drag: 'LL', ...o });
  const dL = (o = {}) => ({ h: 'L', drag: 'RR', ...o });

  window.RUDIMENTS = [
    // ── ROLLS ────────────────────────────────────────────────────────────────
    {
      id: 1, name: 'Single Stroke Roll', category: 'Rolls',
      description: 'The foundation of all drumming. Alternating single strokes between hands at speed creates a smooth, even roll.',
      tips: ['Keep both hands at equal rebound heights for even volume', 'Start at 40 BPM and increase tempo gradually', 'Listen for perfect evenness — any unintended accent means one hand is stronger', 'Practice with eyes closed to develop internal consistency'],
      pattern: [R(), L(), R(), L(), R(), L(), R(), L()],
      subdivision: 4
    },
    {
      id: 2, name: 'Single Stroke Four', category: 'Rolls',
      description: 'Four alternating strokes. The essential building block of fills and grooves.',
      tips: ['Often used as a fill starting on beat 4', 'Practice leading with both right and left hands', 'Keep strokes controlled and deliberate'],
      pattern: [R(), L(), R(), L()],
      subdivision: 4
    },
    {
      id: 3, name: 'Single Stroke Seven', category: 'Rolls',
      description: 'Seven alternating strokes. Creates interesting rhythmic phrasing that crosses the barline.',
      tips: ['Often played over two beats in a measure', 'Practice leading with both R and L', 'Great for jazz and fusion applications'],
      pattern: [R(), L(), R(), L(), R(), L(), R()],
      subdivision: 4
    },
    {
      id: 4, name: 'Multiple Bounce Roll', category: 'Rolls',
      description: 'Also called the buzz roll. Allow the stick to bounce multiple times per stroke for a seamless, sustained sound.',
      tips: ['Squeeze the stick lightly to control the buzz', 'Each hand should produce an equal number of bounces', 'Practice each hand separately first', 'Goal: a seamless, even, sustained sound'],
      pattern: [{ h: 'R', buzz: true }, { h: 'L', buzz: true }, { h: 'R', buzz: true }, { h: 'L', buzz: true }],
      subdivision: 2
    },
    {
      id: 5, name: 'Triple Stroke Roll', category: 'Rolls',
      description: 'Three strokes per hand. Bridges the gap between double strokes and multiple bounce rolls.',
      tips: ['Allow the stick to naturally bounce for strokes 2 and 3', 'Keep the triplet groupings even and fluid', 'Accent the first stroke of each three-note group'],
      pattern: [R({ accent: true }), R(), R(), L({ accent: true }), L(), L()],
      subdivision: 4
    },
    {
      id: 6, name: 'Double Stroke Open Roll', category: 'Rolls',
      description: 'Two strokes per hand. One of the most important rudiments — the foundation of all roll techniques.',
      tips: ['Let the stick bounce naturally for the second stroke', 'Keep the bounce even: same height, same volume', 'Practice slowly: think R-bounce L-bounce', 'The open roll is the basis for all press rolls'],
      pattern: [R({ accent: true }), R(), L({ accent: true }), L(), R({ accent: true }), R(), L({ accent: true }), L()],
      subdivision: 4
    },
    {
      id: 7, name: 'Five Stroke Roll', category: 'Rolls',
      description: 'Double-double-single. Starts and ends on alternating hands with an accent on the last note.',
      tips: ['Accent the final single stroke', 'Keep the four double-stroke notes even and quiet', 'Practice both RRLL+R and LLRR+L versions'],
      pattern: [R(), R(), L(), L(), R({ accent: true }), L(), L(), R(), R(), L({ accent: true })],
      subdivision: 4
    },
    {
      id: 8, name: 'Six Stroke Roll', category: 'Rolls',
      description: 'Single-double-double. Creates a swinging, lilting feel with accents on notes 1 and 6.',
      tips: ['Accents fall on notes 1 and 6', 'Creates a natural shuffle feel', 'On the drumset: accent on snare, inner notes on hi-hat'],
      pattern: [R({ accent: true }), L(), L(), R(), R(), L({ accent: true })],
      subdivision: 4
    },
    {
      id: 9, name: 'Seven Stroke Roll', category: 'Rolls',
      description: 'Double-double-double-single. Accent lands on the 7th stroke.',
      tips: ['Count the doubles: 1e+a 2e+a ACCENT', 'Keep all double strokes perfectly even', 'Accent the final note with authority'],
      pattern: [R(), R(), L(), L(), R(), R(), L({ accent: true })],
      subdivision: 4
    },
    {
      id: 10, name: 'Nine Stroke Roll', category: 'Rolls',
      description: 'Four doubles plus one accented single. A classic fill into a downbeat.',
      tips: ['Eight even strokes then the accent', 'Commonly used to fill into beat 1', 'Focus on the accent landing solidly'],
      pattern: [R(), R(), L(), L(), R(), R(), L(), L(), R({ accent: true })],
      subdivision: 4
    },
    {
      id: 11, name: 'Ten Stroke Roll', category: 'Rolls',
      description: 'Double-double-double-double-single-single with accents on both ends.',
      tips: ['Accents land on notes 1 and 10', 'Keep inner notes very quiet for maximum contrast', 'Practice targeting specific downbeats'],
      pattern: [R({ accent: true }), R(), L(), L(), R(), R(), L(), L(), R(), L({ accent: true })],
      subdivision: 4
    },
    {
      id: 12, name: 'Eleven Stroke Roll', category: 'Rolls',
      description: 'Five doubles plus one accented single.',
      tips: ['Count five pairs of doubles then the final accent', 'Very common in marching percussion', 'Maintain a consistent rebound height throughout'],
      pattern: [R(), R(), L(), L(), R(), R(), L(), L(), R(), R(), L({ accent: true })],
      subdivision: 4
    },
    {
      id: 13, name: 'Thirteen Stroke Roll', category: 'Rolls',
      description: 'Six doubles plus one accented single. Fills nearly two full beats.',
      tips: ['Think of it as three pairs of doubles per side', 'The accent should feel like a natural resolution', 'Often used in rudimental snare solos'],
      pattern: [R(), R(), L(), L(), R(), R(), L(), L(), R(), R(), L(), L(), R({ accent: true })],
      subdivision: 4
    },
    {
      id: 14, name: 'Fifteen Stroke Roll', category: 'Rolls',
      description: 'Seven doubles plus one accented single. Fills a full measure of 4/4 in 16th notes.',
      tips: ['Seven pairs of doubles then one accent', 'Fills a complete measure of 4/4', 'Focus on the accent at the very end'],
      pattern: [R(), R(), L(), L(), R(), R(), L(), L(), R(), R(), L(), L(), R(), R(), L({ accent: true })],
      subdivision: 4
    },
    {
      id: 15, name: 'Seventeen Stroke Roll', category: 'Rolls',
      description: 'Eight doubles plus one accented single. The longest of the roll rudiments.',
      tips: ['Eight pairs of doubles ending with an accent', 'Requires exceptional endurance and evenness', 'Work up speed very gradually', 'Perfect for extended musical phrases'],
      pattern: [R(), R(), L(), L(), R(), R(), L(), L(), R(), R(), L(), L(), R(), R(), L(), L(), R({ accent: true })],
      subdivision: 4
    },

    // ── DIDDLES ──────────────────────────────────────────────────────────────
    {
      id: 16, name: 'Single Paradiddle', category: 'Diddles',
      description: 'RLRR LRLL — the most versatile rudiment. Builds hand independence and creates natural accent shifts.',
      tips: ['Accent falls on the first stroke of each group', 'Learn to move the accent to any note in the pattern', 'Invaluable for drumset beats and fills', 'Practice leading with both R and L'],
      pattern: [R({ accent: true }), L(), R(), R(), L({ accent: true }), R(), L(), L()],
      subdivision: 4
    },
    {
      id: 17, name: 'Double Paradiddle', category: 'Diddles',
      description: 'RLRLRR LRLRLL — a paradiddle with an extra alternating pair at the start.',
      tips: ['Think: single-single-paradiddle', 'Fits naturally into a 12/8 or triplet feel', 'Great for moving around the drumkit'],
      pattern: [R({ accent: true }), L(), R(), L(), R(), R(), L({ accent: true }), R(), L(), R(), L(), L()],
      subdivision: 4
    },
    {
      id: 18, name: 'Triple Paradiddle', category: 'Diddles',
      description: 'RLRLRLRR LRLRLRLL — three alternating singles before the diddle.',
      tips: ['Count: 1-2-3-diddle per group', 'Fits into a full 4/4 measure as 16th notes', 'Keep the singles light and even'],
      pattern: [R({ accent: true }), L(), R(), L(), R(), L(), R(), R(), L({ accent: true }), R(), L(), R(), L(), R(), L(), L()],
      subdivision: 4
    },
    {
      id: 19, name: 'Paradiddle-diddle', category: 'Diddles',
      description: 'RLRRLL — single-double-double. A 6-note pattern perfect for triplet applications.',
      tips: ['Fits perfectly into a 12/8 triplet feel', 'Accent the first note of each group', 'Useful for jazz drumming and hi-hat patterns'],
      pattern: [R({ accent: true }), L(), R(), R(), L(), L()],
      subdivision: 3
    },

    // ── FLAMS ─────────────────────────────────────────────────────────────────
    {
      id: 20, name: 'Flam', category: 'Flams',
      description: 'A quiet grace note played just before the main stroke, creating a fuller, fatter sound.',
      tips: ['Grace note should be very quiet and close to the drum head (about 1 inch)', 'Main stroke comes from 6–8 inches for full volume', 'Both notes should sound almost (but not quite) simultaneous', 'Accent the main note — the grace is just decoration'],
      pattern: [fR({ accent: true }), fL({ accent: true })],
      subdivision: 2
    },
    {
      id: 21, name: 'Flam Accent', category: 'Flams',
      description: 'lRLR — flam on beat 1, then two alternating strokes. Played as a triplet.',
      tips: ['Triplet feel: 1-trip-let', 'The flam gives beat 1 a strong, accented character', 'Alternate starting hand: lR then rL'],
      pattern: [fR({ accent: true }), L(), R(), fL({ accent: true }), R(), L()],
      subdivision: 3
    },
    {
      id: 22, name: 'Flam Tap', category: 'Flams',
      description: 'lRR lLL — a flam followed by a tap on the same hand, alternating each group.',
      tips: ['The tap is a quieter stroke on the same hand as the flam main stroke', 'Creates a great hand independence challenge', 'Focus on keeping the tap quieter than the flam'],
      pattern: [fR({ accent: true }), R(), fL({ accent: true }), L()],
      subdivision: 4
    },
    {
      id: 23, name: 'Flamacue', category: 'Flams',
      description: 'lRLRR — a flam followed by three single strokes, with an accent on the last note.',
      tips: ['The accent falls on the 4th note, not on the flam itself', 'Practice as a 5-note group per hand', 'Common in rudimental snare solos'],
      pattern: [fR(), L(), R(), R({ accent: true }), fL(), R(), L(), L({ accent: true })],
      subdivision: 4
    },
    {
      id: 24, name: 'Flam Paradiddle', category: 'Flams',
      description: 'lRLRR rLRLL — a paradiddle with a flam on the first note of each group.',
      tips: ['Combines flam technique with the paradiddle sticking', 'Keep the grace note quiet and controlled', 'Lead with alternating flams: lR then rL'],
      pattern: [fR({ accent: true }), L(), R(), R(), fL({ accent: true }), R(), L(), L()],
      subdivision: 4
    },
    {
      id: 25, name: 'Single Flammed Mill', category: 'Flams',
      description: 'lRLRL rLRLR — a flam followed by four alternating strokes, with the flam alternating each group.',
      tips: ['5-note grouping with alternating flams each repetition', 'Keep all five notes even and flowing', 'Master flam placement before adding speed'],
      pattern: [fR({ accent: true }), L(), R(), L(), R(), fL({ accent: true }), R(), L(), R(), L()],
      subdivision: 4
    },
    {
      id: 26, name: 'Flam Paradiddle-diddle', category: 'Flams',
      description: 'lRLRRLL — a flam combined with the paradiddle-diddle sticking.',
      tips: ['7-note pattern: flam + paradiddle-diddle', 'Accent the flam strongly', 'Interesting in 7/8 time signatures'],
      pattern: [fR({ accent: true }), L(), R(), R(), L(), L()],
      subdivision: 3
    },
    {
      id: 27, name: 'Pataflafla', category: 'Flams',
      description: 'lRLLrLRR — two flams separated by two taps.',
      tips: ['Think: flam-tap-tap-flam', 'The two inner notes are straight taps, not flams', 'Keep tap notes quieter between the flams'],
      pattern: [fR({ accent: true }), L(), L(), fL({ accent: true }), R(), R()],
      subdivision: 3
    },
    {
      id: 28, name: 'Swiss Army Triplet', category: 'Flams',
      description: 'lRLR — a flam followed by two single strokes, played as a triplet.',
      tips: ['The flam lands on the triplet downbeat', 'Very common in jazz and rudimental drumming', "Count 1-trip-let, flam on '1'"],
      pattern: [fR({ accent: true }), L(), R(), fL({ accent: true }), R(), L()],
      subdivision: 3
    },
    {
      id: 29, name: 'Inverted Flam Tap', category: 'Flams',
      description: 'rLL lRR — the flam is inverted: the grace note leads to a tap on the same hand.',
      tips: ['Mirror image of the Flam Tap', 'The grace note is the same hand as the following tap', 'Tricky hand-crossing motion — practice very slowly'],
      pattern: [{ h: 'L', grace: 'R' }, L({ accent: true }), { h: 'R', grace: 'L' }, R({ accent: true })],
      subdivision: 4
    },
    {
      id: 30, name: 'Flam Drag', category: 'Flams',
      description: 'lRllR rLrrL — a flam followed immediately by a drag, alternating hands.',
      tips: ['Combines two advanced techniques: flam and drag', 'Master flams and drags separately before combining', 'The most complex flam rudiment — slow practice is essential'],
      pattern: [fR({ accent: true }), dR(), fL({ accent: true }), dL()],
      subdivision: 4
    },

    // ── DRAGS ─────────────────────────────────────────────────────────────────
    {
      id: 31, name: 'Drag', category: 'Drags',
      description: 'Two quick grace notes (the drag or ruff) played just before the main stroke.',
      tips: ['The two grace notes should be very quick and quiet', 'Think of it as a double grace note', 'Keep the grace notes close to the drum head', 'The main note carries all the rhythmic weight'],
      pattern: [dR({ accent: true }), dL({ accent: true })],
      subdivision: 2
    },
    {
      id: 32, name: 'Single Drag Tap', category: 'Drags',
      description: 'llR L — a drag followed by a tap on the other hand.',
      tips: ['2-note primary: drag + tap', 'The tap should match the volume of the drag main stroke', 'Practice leading with both hands'],
      pattern: [dR({ accent: true }), L(), dL({ accent: true }), R()],
      subdivision: 4
    },
    {
      id: 33, name: 'Double Drag Tap', category: 'Drags',
      description: 'llR llR L — two drags followed by a single tap.',
      tips: ['3-note primary: drag-drag-tap', 'Keep both drags even and controlled', 'The tap lands on the beat'],
      pattern: [dR(), dR({ accent: true }), L(), dL(), dL({ accent: true }), R()],
      subdivision: 3
    },
    {
      id: 34, name: 'Lesson 25', category: 'Drags',
      description: 'llR R L — a drag followed by two single strokes. Named from historical method books.',
      tips: ['3-note primary: drag-single-single', 'The second R is a full stroke, not a grace note', "Named 'Lesson 25' from old rudimental method books"],
      pattern: [dR({ accent: true }), R(), L(), dL({ accent: true }), L(), R()],
      subdivision: 3
    },
    {
      id: 35, name: 'Single Dragadiddle', category: 'Drags',
      description: 'RR llR L — a paradiddle with a drag replacing the third note.',
      tips: ['Think: single-single-drag-single', 'The drag adds weight and character to the paradiddle', 'Accent the first note'],
      pattern: [R({ accent: true }), R(), dR(), L(), L({ accent: true }), L(), dL(), R()],
      subdivision: 4
    },
    {
      id: 36, name: 'Drag Paradiddle #1', category: 'Drags',
      description: 'R llR L R R — a single stroke, drag, then a paradiddle ending.',
      tips: ['5-note primary: single-drag-single-double', 'Accent the first note', 'The drag creates a syncopated, heavier feel'],
      pattern: [R({ accent: true }), dR(), L(), R(), R(), L({ accent: true }), dL(), R(), L(), L()],
      subdivision: 4
    },
    {
      id: 37, name: 'Drag Paradiddle #2', category: 'Drags',
      description: 'R llR llR L R R — two drags in an extended paradiddle phrase.',
      tips: ['6-note primary: single-drag-drag-single-double', 'Two drags before the final resolution', 'Very slow practice is essential here'],
      pattern: [R({ accent: true }), dR(), dR(), L(), R(), R(), L({ accent: true }), dL(), dL(), R(), L(), L()],
      subdivision: 4
    },
    {
      id: 38, name: 'Single Ratamacue', category: 'Drags',
      description: 'llR L R L — a drag followed by three alternating single strokes, played as a triplet.',
      tips: ['4-note primary: drag-single-single-single', 'Fits into a triplet feel naturally', "The word 'ratamacue' suggests the rhythm it creates"],
      pattern: [dR({ accent: true }), L(), R(), L(), dL({ accent: true }), R(), L(), R()],
      subdivision: 3
    },
    {
      id: 39, name: 'Double Ratamacue', category: 'Drags',
      description: 'llR llR L R L — two drags then the ratamacue three-stroke ending.',
      tips: ['Two drag strokes before the final three singles', 'Keep both drags even and clean', 'A great wrist control exercise'],
      pattern: [dR(), dR({ accent: true }), L(), R(), L(), dL(), dL({ accent: true }), R(), L(), R()],
      subdivision: 3
    },
    {
      id: 40, name: 'Triple Ratamacue', category: 'Drags',
      description: 'llR llR llR L R L — three drags then the ratamacue ending. The longest drag rudiment.',
      tips: ['Three drag strokes before the final three singles', 'Focus on even drag technique throughout', 'An impressive display of control and endurance'],
      pattern: [dR(), dR(), dR({ accent: true }), L(), R(), L(), dL(), dL(), dL({ accent: true }), R(), L(), R()],
      subdivision: 3
    }
  ];

  window.CATEGORIES = {
    Rolls:   { color: '#4a9eff', desc: 'Form the foundation of drum technique — single, double, and multiple bounce strokes creating smooth, sustained sounds.' },
    Diddles: { color: '#ff9b7a', desc: 'Include the paradiddle family — patterns of singles and doubles that build hand independence and natural accent shifts.' },
    Flams:   { color: '#e8a020', desc: 'Incorporate a quiet grace note just before the main stroke for a fuller, more resonant sound.' },
    Drags:   { color: '#7ec87e', desc: 'Use a double grace note (the drag or ruff) before the main stroke, adding weight and complexity.' }
  };
})();
