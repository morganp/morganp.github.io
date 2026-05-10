/* ============================================================
   Fretdrom-compatible SVG renderer.
   Consumes the JSON5 shape documented in morganp/fretdrom:
     { chord: { name, subtitle, tuning, frets, fingers, intervals,
                root_strings, start_fret, barre, config:{skin} } }
     { scale: { name, subtitle, tuning, start_fret, num_frets, grid, config:{skin} } }
     { name, tab:[{name,wave}], config:{bar,skin} }
   Exposes window.FretDrom.renderSVG(input).
   ============================================================ */
(function(){
  const SKINS = {
    'default':     { bg:'#ffffff', fg:'#1f1d1a', mute:'#8a847b', root:'#b94a3a', dot:'#1f1d1a', text:'#1f1d1a', font:'Inter, system-ui, sans-serif', mono:'JetBrains Mono, ui-monospace, monospace', stroke:1.4, wobble:0 },
    'dark':        { bg:'#1c1f24', fg:'#d8d3c8', mute:'#6f6a62', root:'#e85d4a', dot:'#d8d3c8', text:'#ece6d8', font:'Inter, system-ui, sans-serif', mono:'JetBrains Mono, ui-monospace, monospace', stroke:1.4, wobble:0 },
    'sketch':      { bg:'#faf3e6', fg:'#2b2620', mute:'#8a7e6b', root:'#b94a3a', dot:'#2b2620', text:'#2b2620', font:'Caveat, Inter, sans-serif', mono:'JetBrains Mono, monospace', stroke:1.6, wobble:1.2 },
    'sketch-dark': { bg:'#1c1f24', fg:'#e6dec8', mute:'#7a6f5b', root:'#e85d4a', dot:'#e6dec8', text:'#ece6d8', font:'Caveat, Inter, sans-serif', mono:'JetBrains Mono, monospace', stroke:1.6, wobble:1.2 },
  };
  function getSkin(name){ return SKINS[name] || SKINS['default']; }

  function parseFretChar(c){
    if(c==null) return null;
    if(c==='x' || c==='X') return -1;
    if(c==='-' || c==='.') return null;
    if(/[0-9]/.test(c)) return parseInt(c,10);
    if(/[a-z]/i.test(c)) return c.toLowerCase().charCodeAt(0) - 97 + 10;
    return null;
  }

  function svgEl(w,h,skin,extra=''){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="background:${skin.bg};font-family:${skin.font}" ${extra}>`;
  }

  function esc(s){
    return String(s).replace(/[&<>"']/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  /* ============ CHORD ============ */
  function renderChord(d){
    const skin = getSkin((d.config&&d.config.skin) || 'default');
    const fretsArr = Array.isArray(d.frets) ? d.frets : Array.from(d.frets||'');
    const numStrings = fretsArr.length;
    const fingersArr = d.fingers ? (Array.isArray(d.fingers) ? d.fingers : Array.from(d.fingers)) : [];
    const intervals = d.intervals || [];
    const rootStrings = new Set((d.root_strings||[]).map(n=>n));
    const startFret = d.start_fret || 1;

    const numericFrets = fretsArr.map(parseFretChar).filter(v=>v!=null && v>=0);
    const maxFret = Math.max(0, ...numericFrets, (d.barre?d.barre.fret:0));
    let fretsShown = Math.max(4, maxFret - startFret + 1);
    if(startFret > 1) fretsShown = Math.max(fretsShown, 4);
    fretsShown = Math.min(fretsShown, 6);

    const cell = 28;
    const padL = 28, padR = 22, padT = 64, padB = 22;
    const gridW = (numStrings-1) * cell;
    const gridH = fretsShown * cell;
    const W_ = padL + gridW + padR;
    const H_ = padT + gridH + padB + 18;

    let s = svgEl(W_, H_, skin);

    if(d.name !== undefined){
      s += `<text data-role="title" x="${W_/2}" y="22" text-anchor="middle" font-size="16" font-weight="600" fill="${skin.text}">${esc(d.name||'')}</text>`;
    }
    let subtitle = d.subtitle;
    if(subtitle === undefined && intervals.length) subtitle = 'Intervals';
    if(subtitle && subtitle !== false){
      s += `<text x="${W_/2}" y="40" text-anchor="middle" font-size="11" fill="${skin.mute}" font-family="${skin.mono}">${esc(subtitle)}</text>`;
    }

    const nutY = padT;
    if(startFret === 1){
      s += `<rect x="${padL-2}" y="${nutY-4}" width="${gridW+4}" height="4" fill="${skin.fg}"/>`;
    }else{
      s += `<text x="${padL+gridW+8}" y="${nutY+12}" font-size="11" fill="${skin.mute}" font-family="${skin.mono}">${startFret}fr</text>`;
    }

    for(let i=0;i<numStrings;i++){
      const x = padL + i*cell;
      s += `<line x1="${x}" y1="${nutY}" x2="${x}" y2="${nutY+gridH}" stroke="${skin.fg}" stroke-width="${skin.stroke}" stroke-linecap="round"/>`;
    }
    for(let f=0;f<=fretsShown;f++){
      const y = nutY + f*cell;
      s += `<line x1="${padL}" y1="${y}" x2="${padL+gridW}" y2="${y}" stroke="${skin.fg}" stroke-width="${skin.stroke*0.8}" stroke-linecap="round"/>`;
    }

    for(let i=0;i<numStrings;i++){
      const v = parseFretChar(fretsArr[i]);
      const x = padL + i*cell;
      if(v === -1){
        s += `<text x="${x}" y="${nutY-10}" text-anchor="middle" font-size="13" fill="${skin.mute}" font-family="${skin.mono}">×</text>`;
      } else if(v === 0){
        const isRoot = rootStrings.has(i+1) || (intervals[i] === 'R' || intervals[i] === 'r');
        let label = null;
        if(intervals[i] && intervals[i] !== null && intervals[i] !== undefined && intervals[i] !== 'null') label = String(intervals[i]);
        if(label){
          const fill = isRoot ? skin.root : skin.dot;
          s += `<circle cx="${x}" cy="${nutY-12}" r="9" fill="${fill}" stroke="${skin.bg}" stroke-width="1.2"/>`;
          s += `<text x="${x}" y="${nutY-12+3.5}" text-anchor="middle" font-size="${label.length>1?9:10.5}" font-weight="600" fill="${skin.bg}" font-family="${skin.mono}">${esc(label)}</text>`;
        }else{
          s += `<circle cx="${x}" cy="${nutY-10}" r="5" fill="none" stroke="${skin.fg}" stroke-width="${skin.stroke}"/>`;
        }
      }
    }

    if(d.barre){
      const fretIdx = d.barre.fret - startFret;
      if(fretIdx >= 0 && fretIdx < fretsShown){
        const fromI = Math.min(d.barre.from_string, d.barre.to_string) - 1;
        const toI = Math.max(d.barre.from_string, d.barre.to_string) - 1;
        const cx1 = padL + fromI*cell;
        const cx2 = padL + toI*cell;
        const cy = nutY + fretIdx*cell + cell/2;
        s += `<line x1="${cx1}" y1="${cy}" x2="${cx2}" y2="${cy}" stroke="${skin.fg}" stroke-width="9" stroke-linecap="round" opacity="0.85"/>`;
      }
    }

    for(let i=0;i<numStrings;i++){
      const v = parseFretChar(fretsArr[i]);
      if(v == null || v <= 0) continue;
      const fretIdx = v - startFret;
      if(fretIdx < 0 || fretIdx >= fretsShown) continue;
      const cx = padL + i*cell;
      const cy = nutY + fretIdx*cell + cell/2;
      const isRoot = rootStrings.has(i+1) || (intervals[i] === 'R' || intervals[i] === 'r');
      const fill = isRoot ? skin.root : skin.dot;
      s += `<circle cx="${cx}" cy="${cy}" r="10" fill="${fill}" stroke="${skin.bg}" stroke-width="1.2"/>`;
      let label = null;
      if(intervals[i] && intervals[i] !== null && intervals[i] !== undefined && intervals[i] !== 'null') label = String(intervals[i]);
      else if(fingersArr[i] && fingersArr[i] !== '-' && fingersArr[i] !== null) label = String(fingersArr[i]);
      if(label){
        s += `<text x="${cx}" y="${cy+3.5}" text-anchor="middle" font-size="${label.length>1?9:10.5}" font-weight="600" fill="${skin.bg}" font-family="${skin.mono}">${esc(label)}</text>`;
      }
    }

    if(fingersArr.length && !intervals.length){
      for(let i=0;i<numStrings;i++){
        const f = fingersArr[i];
        if(!f || f==='-' || f==='0') continue;
        const x = padL + i*cell;
        const y = nutY + gridH + 14;
        s += `<text x="${x}" y="${y}" text-anchor="middle" font-size="10" fill="${skin.mute}" font-family="${skin.mono}">${esc(f)}</text>`;
      }
    }

    // INTERACTIVE LAYER
    s += `<g class="fd-edit" data-num-strings="${numStrings}" data-frets-shown="${fretsShown}" data-start-fret="${startFret}">`;
    for(let i=0;i<numStrings;i++){
      const x = padL + i*cell;
      s += `<rect class="fd-hit fd-hit-open" data-edit="open" data-i="${i}" x="${x-cell/2}" y="${nutY-26}" width="${cell}" height="22" fill="transparent" style="cursor:pointer"/>`;
    }
    for(let i=0;i<numStrings;i++){
      for(let f=0;f<fretsShown;f++){
        const x = padL + i*cell;
        const y = nutY + f*cell;
        s += `<rect class="fd-hit fd-hit-fret" data-edit="fret" data-i="${i}" data-f="${f}" x="${x-cell/2}" y="${y}" width="${cell}" height="${cell}" fill="transparent" style="cursor:pointer"/>`;
      }
    }
    s += `</g>`;
    return s + '</svg>';
  }

  /* ============ SCALE ============ */
  function renderScale(d){
    const skin = getSkin((d.config&&d.config.skin) || 'default');
    const grid = d.grid || [];
    const numStrings = grid.length;
    const numFrets = d.num_frets || (grid[0] ? grid[0].length : 5);
    const startFret = d.start_fret || 1;

    const cell = 30;
    const padL = 32, padR = 32, padT = 56, padB = 22;
    const gridW = (numStrings-1) * cell;
    const gridH = numFrets * cell;
    const W_ = padL + gridW + padR;
    const H_ = padT + gridH + padB;

    let s = svgEl(W_, H_, skin);

    if(d.name !== undefined) s += `<text data-role="title" x="${W_/2}" y="22" text-anchor="middle" font-size="16" font-weight="600" fill="${skin.text}">${esc(d.name||'')}</text>`;
    const hasIntervals = grid.some(row => row.some(c => {
      const v = String(c);
      return v && v!=='.' && v!=='-' && v!=='x' && v!=='X' && v!=='R' && v!=='r';
    }));
    let subtitle = d.subtitle;
    if(subtitle === undefined && hasIntervals) subtitle = 'Intervals';
    if(subtitle && subtitle !== false){
      s += `<text x="${W_/2}" y="40" text-anchor="middle" font-size="11" fill="${skin.mute}" font-family="${skin.mono}">${esc(subtitle)}</text>`;
    }

    const topY = padT;
    if(startFret === 1){
      s += `<rect x="${padL-2}" y="${topY-4}" width="${gridW+4}" height="4" fill="${skin.fg}"/>`;
    }

    for(let i=0;i<numStrings;i++){
      const x = padL + i*cell;
      s += `<line x1="${x}" y1="${topY}" x2="${x}" y2="${topY+gridH}" stroke="${skin.fg}" stroke-width="${skin.stroke}" />`;
    }
    for(let f=0;f<=numFrets;f++){
      const y = topY + f*cell;
      s += `<line x1="${padL}" y1="${y}" x2="${padL+gridW}" y2="${y}" stroke="${skin.fg}" stroke-width="${skin.stroke*0.8}" />`;
    }

    for(let f=0;f<numFrets;f++){
      const fretNum = startFret + f;
      const y = topY + f*cell + cell/2 + 3.5;
      s += `<text x="${padL-10}" y="${y}" text-anchor="end" font-size="10" fill="${skin.mute}" font-family="${skin.mono}">${fretNum}</text>`;
    }
    const markers = new Set([3,5,7,9,12,15,17,19,21,24]);
    for(let f=0;f<numFrets;f++){
      const fretNum = startFret + f;
      if(markers.has(fretNum)){
        const y = topY + f*cell + cell/2;
        const isDouble = (fretNum%12)===0;
        s += `<circle cx="${padL+gridW+10}" cy="${y}" r="2.4" fill="${skin.mute}"/>`;
        if(isDouble) s += `<circle cx="${padL+gridW+18}" cy="${y}" r="2.4" fill="${skin.mute}"/>`;
      }
    }

    for(let r=0;r<numStrings;r++){
      const row = grid[r] || [];
      for(let c=0;c<row.length;c++){
        const v = String(row[c]);
        if(v==='.' || v==='-' || v==='') continue;
        const cx = padL + r*cell;
        const cy = topY + c*cell + cell/2;
        const isRoot = (v==='R' || v==='r');
        const isMute = (v==='x' || v==='X');
        if(isMute){
          s += `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${skin.mute}" stroke-width="${skin.stroke}"/>`;
          s += `<line x1="${cx-5}" y1="${cy-5}" x2="${cx+5}" y2="${cy+5}" stroke="${skin.mute}" stroke-width="${skin.stroke}"/>`;
          s += `<line x1="${cx-5}" y1="${cy+5}" x2="${cx+5}" y2="${cy-5}" stroke="${skin.mute}" stroke-width="${skin.stroke}"/>`;
          continue;
        }
        const fill = isRoot ? skin.root : skin.dot;
        s += `<circle cx="${cx}" cy="${cy}" r="11" fill="${fill}" stroke="${skin.bg}" stroke-width="1.2"/>`;
        let label = null;
        if(isRoot) label = 'R';
        else if(v && !isMute && v.length<=3 && !/^[xX.\-]$/.test(v)) label = v;
        if(label){
          s += `<text x="${cx}" y="${cy+3.5}" text-anchor="middle" font-size="${label.length>1?9:10.5}" font-weight="600" fill="${skin.bg}" font-family="${skin.mono}">${esc(label)}</text>`;
        }
      }
    }

    s += `<g class="fd-edit-scale" data-num-strings="${numStrings}" data-num-frets="${numFrets}" data-start-fret="${startFret}">`;
    for(let r=0;r<numStrings;r++){
      for(let c=0;c<numFrets;c++){
        const cx = padL + r*cell;
        const cy = topY + c*cell;
        s += `<rect class="fd-hit fd-hit-cell" data-edit="cell" data-r="${r}" data-c="${c}" x="${cx-cell/2}" y="${cy}" width="${cell}" height="${cell}" fill="transparent" style="cursor:pointer"/>`;
      }
    }
    s += `</g>`;
    return s + '</svg>';
  }

  /* ============ TAB ============ */
  function renderTab(d){
    const skin = getSkin((d.config&&d.config.skin) || 'default');
    const lanes = d.tab || [];
    const numLanes = lanes.length;
    if(!numLanes) return svgEl(200,80,skin) + `<text x="100" y="40" text-anchor="middle" fill="${skin.mute}" font-size="12">empty tab</text></svg>`;
    const beats = Math.max(...lanes.map(l => (l.wave||'').length));
    const beatW = 22, laneH = 22;
    const padL = 28, padR = 24, padT = 50, padB = 18;
    const W_ = padL + beats*beatW + padR;
    const H_ = padT + (numLanes-1)*laneH + padB;

    let s = svgEl(W_, H_, skin);
    if(d.name !== undefined) s += `<text data-role="title" x="${W_/2}" y="22" text-anchor="middle" font-size="15" font-weight="600" fill="${skin.text}">${esc(d.name||'')}</text>`;

    for(let i=0;i<numLanes;i++){
      const y = padT + i*laneH;
      s += `<line x1="${padL}" y1="${y}" x2="${padL+beats*beatW}" y2="${y}" stroke="${skin.fg}" stroke-width="${skin.stroke*0.7}"/>`;
      const nm = lanes[i].name || '';
      s += `<text x="${padL-6}" y="${y+3.5}" text-anchor="end" font-size="11" fill="${skin.fg}" font-family="${skin.mono}">${esc(nm)}</text>`;
    }
    s += `<line x1="${padL}" y1="${padT-4}" x2="${padL}" y2="${padT+(numLanes-1)*laneH+4}" stroke="${skin.fg}" stroke-width="${skin.stroke}"/>`;
    s += `<line x1="${padL+beats*beatW}" y1="${padT-4}" x2="${padL+beats*beatW}" y2="${padT+(numLanes-1)*laneH+4}" stroke="${skin.fg}" stroke-width="${skin.stroke}"/>`;

    if(d.config && d.config.bar){
      const bar = d.config.bar;
      for(let b=bar; b<beats; b+=bar){
        const x = padL + b*beatW;
        s += `<line x1="${x}" y1="${padT-4}" x2="${x}" y2="${padT+(numLanes-1)*laneH+4}" stroke="${skin.mute}" stroke-width="${skin.stroke*0.7}"/>`;
      }
    }

    for(let i=0;i<numLanes;i++){
      const wave = lanes[i].wave || '';
      const y = padT + i*laneH;
      for(let b=0;b<wave.length;b++){
        const c = wave[b];
        const x = padL + b*beatW + beatW/2;
        if(c==='.' || c===' '){
          s += `<line x1="${x-4}" y1="${y}" x2="${x+4}" y2="${y}" stroke="${skin.mute}" stroke-width="${skin.stroke*0.6}"/>`;
        }else{
          let label = c;
          if(/[a-z]/i.test(c) && c!=='x' && c!=='X') label = String(c.toLowerCase().charCodeAt(0)-97+10);
          s += `<rect x="${x-7}" y="${y-7}" width="14" height="14" fill="${skin.bg}" />`;
          s += `<text x="${x}" y="${y+3.5}" text-anchor="middle" font-size="11" font-weight="600" fill="${skin.fg}" font-family="${skin.mono}">${esc(label)}</text>`;
        }
      }
    }
    return s + '</svg>';
  }

  function renderSVG(input){
    if(!input || typeof input !== 'object') throw new Error('input must be an object');
    if(input.chord) return renderChord(input.chord);
    if(input.scale) return renderScale(input.scale);
    if(input.tab) return renderTab(input);
    throw new Error('expected one of: chord, scale, tab');
  }

  window.FretDrom = { renderSVG };
})();
