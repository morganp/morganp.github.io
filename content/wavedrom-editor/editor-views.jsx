// editor-views.jsx — sub-components: Toolbar, Workarea (waveform canvas),
// Drawer, Inspector, SampleModal.

const { useState: uS, useEffect: uE, useMemo: uM, useRef: uR, useCallback: uCB } = React;
const WR = window.WaveRender;

// ── Toolbar ────────────────────────────────────────────────────
function Toolbar(p) {
  return (
    <div className="toolbar">
      <div className="brand"><span className="dot"></span>Wavedrom Editor</div>

      <div className="tb-group">
        <button className="tb-btn" title="Add signal (A)" onClick={p.addSignal}>{window.__WaveEditor.ICONS.add} Signal</button>
        <button className="tb-btn" title="Add group" onClick={p.addGroup}>{window.__WaveEditor.ICONS.group} Group</button>
        <button className="tb-btn" title="Delete (Del)" onClick={p.delSignal}>{window.__WaveEditor.ICONS.trash}</button>
      </div>

      <div className="tb-group">
        <button className="tb-btn" title="Add cycle to all" onClick={p.addCycle}>{window.__WaveEditor.ICONS.cycleAdd} +cycle</button>
        <button className="tb-btn" title="Remove last cycle" onClick={p.removeCycle}>{window.__WaveEditor.ICONS.cycleDel} −cycle</button>
      </div>

      <div className="tb-group">
        <button className="tb-btn" title="Undo (⌘Z)" onClick={p.undo} disabled={!p.canUndo}>{window.__WaveEditor.ICONS.undo}</button>
        <button className="tb-btn" title="Redo (⌘⇧Z)" onClick={p.redo} disabled={!p.canRedo}>{window.__WaveEditor.ICONS.redo}</button>
      </div>

      <div className="tb-group" title="Snap granularity">
        <span style={{ color: 'var(--ink-3)', fontSize: 11, marginRight: 6 }}>Snap</span>
        <select className="tb-select" value={String(p.snap)} onChange={(e) => p.setSnap(parseFloat(e.target.value))}>
          <option value="1">1.0</option>
          <option value="0.5">0.5</option>
          <option value="0.25">0.25</option>
        </select>
      </div>

      <div className="tb-spacer" />

      <div className="tb-group">
        <button className="tb-btn" onClick={p.openSamples}>{window.__WaveEditor.ICONS.samples} Samples</button>
      </div>
      <div className="tb-group">
        <button className="tb-btn" onClick={p.saveJson} title="Download as .json">💾 Save</button>
        <button className="tb-btn" onClick={p.loadJson} title="Open a .json file">📂 Open</button>
        <button className="tb-btn" onClick={p.copyJson} title="Copy JSON to clipboard">⧉ Copy</button>
      </div>
      <div className="tb-group">
        <button className="tb-btn" onClick={p.exportSvg}>{window.__WaveEditor.ICONS.svg} SVG</button>
        <button className="tb-btn" onClick={p.exportPng}>{window.__WaveEditor.ICONS.png} PNG</button>
      </div>
    </div>
  );
}

// ── Workarea ───────────────────────────────────────────────────
function Workarea({ spec, rows, cycles, cw, rowH, snap, selectedId, setSelectedId,
                    setWave, patchSig, setTip, reorderSignal }) {
  const totalW = cycles * cw;
  const [dragRow, setDragRow] = uS(null); // {id, y}
  const [dropTarget, setDropTarget] = uS(null); // {id, position}

  // drag-reorder a row
  const beginRowDrag = (e, id) => {
    e.preventDefault();
    setDragRow({ id });
    const onMove = (ev) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const rowEl = el && el.closest && el.closest('.row[data-id]');
      if (rowEl) {
        const tid = rowEl.getAttribute('data-id');
        if (tid && tid !== id) {
          const r = rowEl.getBoundingClientRect();
          const pos = ev.clientY < r.top + r.height / 2 ? 'above' : 'below';
          setDropTarget({ id: tid, position: pos });
          return;
        }
      }
      setDropTarget(null);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setDragRow((cur) => {
        setDropTarget((dt) => {
          if (cur && dt) reorderSignal(cur.id, dt.id, dt.position);
          return null;
        });
        return null;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="work">
      <div className="wave-host" style={{ '--cw': cw + 'px' }}>
        {/* sticky label column */}
        <div className="label-col">
          <div className="lc-head">Signals</div>
          {rows.map((r, i) => (
            <RowLabel key={(r.sig && r.sig.__id) || ('row-' + i)} r={r} h={rowH}
              selected={selectedId === (r.sig && r.sig.__id)}
              dragging={dragRow && dragRow.id === (r.sig && r.sig.__id)}
              dropAbove={dropTarget && dropTarget.id === (r.sig && r.sig.__id) && dropTarget.position === 'above'}
              dropBelow={dropTarget && dropTarget.id === (r.sig && r.sig.__id) && dropTarget.position === 'below'}
              onSelect={() => r.sig && r.sig.__id && setSelectedId(r.sig.__id)}
              onName={(name) => r.sig && r.sig.__id && patchSig(r.sig.__id, { name })}
              beginDrag={(e) => r.sig && r.sig.__id && beginRowDrag(e, r.sig.__id)}
            />
          ))}
        </div>

        {/* canvas column */}
        <div className="canvas-col" style={{ width: totalW }}>
          <div className="cc-head" style={{ width: totalW }}>
            {Array.from({ length: cycles }).map((_, i) => (
              <div key={i} className={'tick' + (i % 4 === 0 ? ' major' : '')}>{i}</div>
            ))}
          </div>
          <div className="cc-body">
            {rows.map((r, i) => (
              <WaveRow key={(r.sig && r.sig.__id) || ('w-' + i)}
                r={r} h={rowH} cw={cw} cycles={cycles} totalW={totalW} snap={snap}
                selected={selectedId === (r.sig && r.sig.__id)}
                onSelect={() => r.sig && r.sig.__id && setSelectedId(r.sig.__id)}
                setWave={(w) => r.sig && r.sig.__id && setWave(r.sig.__id, w)}
                patchSig={(p) => r.sig && r.sig.__id && patchSig(r.sig.__id, p)}
                setTip={setTip}
              />
            ))}
            <EdgeLayer spec={spec} rows={rows} cw={cw} rowH={rowH} />
          </div>
        </div>
      </div>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6"
                   patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-3)" strokeWidth="1.2" />
          </pattern>
        </defs>
      </svg>
    </div>
  );
}

// ── Row label ──────────────────────────────────────────────────
function RowLabel({ r, h, selected, dragging, dropAbove, dropBelow, onSelect, onName, beginDrag }) {
  const cls = ['row', r.kind === 'group' ? 'group' : '', r.depth > 0 ? 'child' : '',
    selected ? 'selected' : '', dragging ? 'dragging' : '',
    dropAbove ? 'drop-above' : '', dropBelow ? 'drop-below' : ''].filter(Boolean).join(' ');
  if (r.kind === 'group') {
    return (
      <div className={cls} style={{ height: h }} onClick={onSelect}>
        <div className="label">
          <div className="grip" onMouseDown={beginDrag} />
          <div className="name" contentEditable suppressContentEditableWarning
               onBlur={(e) => onName(e.currentTarget.textContent)}>{r.name}</div>
        </div>
      </div>
    );
  }
  if (r.kind === 'spacer' || r.kind === 'empty') {
    return <div className={cls} style={{ height: h }}><div className="label" /></div>;
  }
  const sig = r.sig;
  const meta = (sig.period && sig.period !== 1 ? `×${sig.period} ` : '')
             + (sig.phase ? `φ${sig.phase}` : '');
  return (
    <div className={cls} style={{ height: h }} data-id={sig.__id} onClick={onSelect}>
      <div className="label">
        <div className="grip" onMouseDown={beginDrag} />
        <div className="name" contentEditable suppressContentEditableWarning
             onBlur={(e) => onName(e.currentTarget.textContent)}>{sig.name || ''}</div>
        {meta && <span className="meta">{meta}</span>}
      </div>
    </div>
  );
}

// ── Wave row (svg with drag handles) ──────────────────────────
function WaveRow({ r, h, cw, cycles, totalW, snap, selected, onSelect, setWave, patchSig, setTip }) {
  const svgRef = uR(null);

  if (r.kind !== 'signal') {
    return <div className={'row ' + (r.kind === 'group' ? 'group' : '')}
                style={{ height: h }} data-id={r.sig && r.sig.__id} />;
  }
  const sig = r.sig;
  const period = sig.period || 1;
  const phase = sig.phase || 0;
  const segs = uM(() => WR.parseWave(sig.wave || ''), [sig.wave]);
  const data = sig.data ? (Array.isArray(sig.data) ? sig.data : sig.data.split(' ')) : [];
  const { els, transitions } = uM(
    () => WR.renderWave(segs, { cw, period, h, pad: Math.max(6, h * 0.18), phase, dataLabels: data }),
    [segs, cw, period, h, phase, data.join('|')]
  );

  // render React elements from element tuples — default stroke for line/path
  const svgChildren = els.map((el, i) => {
    const [tag, props, ...kids] = el;
    let p = props;
    if (tag === 'line' || tag === 'path') {
      p = Object.assign({ stroke: 'currentColor', strokeWidth: 1.4, fill: 'none' }, props);
    }
    return React.createElement(tag, p, ...kids);
  });

  // ── interactions ──
  const wave = sig.wave || '';

  // Click/cycle: rewrite at the click position (creating a new segment if needed).
  // Cycles loop 0 → 1 → x → z → = → 0 …
  const onCycleClick = (cycleIdx) => {
    if (cycleIdx < 0 || cycleIdx >= wave.length) return;
    // walk back through dots/gaps to find the current value at this position
    let lookup = cycleIdx;
    while (lookup > 0 && (wave[lookup] === '.' || wave[lookup] === '|')) lookup--;
    const curCh = wave[lookup] || '0';
    const nxt = WR.nextValue(curCh);
    const newWave = WR.setCharAt(wave, cycleIdx, nxt);
    setWave(newWave);
    setTip(`cycle ${cycleIdx} → ${nxt}`); setTimeout(() => setTip(null), 800);
  };

  // Begin drag of a transition handle
  const beginTransitionDrag = (tr, evt) => {
    evt.stopPropagation(); evt.preventDefault();
    const startX = evt.clientX;
    const originCharIdx = tr.charIndex;
    // Track current state across move events — the wave string and the char's
    // position both shift as the user drags. Without this, the closure keeps
    // pointing at the original index, which becomes a '.' after the first move
    // and prevents dragging back.
    let curWave = wave;
    let curCharIdx = originCharIdx;
    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dCells = Math.round(dx / (cw * snap)) * snap;
      const targetCharIdx = Math.max(0, Math.min(curWave.length - 1,
        Math.round(originCharIdx + dCells / period)));
      const result = WR.moveTransition(curWave, curCharIdx, targetCharIdx);
      if (result.wave !== curWave) {
        curWave = result.wave;
        curCharIdx = result.idx;
        setWave(curWave);
      }
      setTip(`edge → cycle ${curCharIdx}`);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setTip(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Phase handle: drag entire signal horizontally
  const beginPhaseDrag = (evt) => {
    evt.stopPropagation(); evt.preventDefault();
    const startX = evt.clientX;
    const startPhase = phase;
    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dCycles = -dx / cw; // dragging right reduces phase (which shifts left in wavedrom)
      const newPhase = Math.round((startPhase + dCycles) / snap) * snap;
      patchSig({ phase: newPhase === 0 ? 0 : newPhase });
      setTip(`phase ${newPhase.toFixed(2)}`);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setTip(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Period handle: drag the right-edge to change period multiplier
  const beginPeriodDrag = (evt) => {
    evt.stopPropagation(); evt.preventDefault();
    const startX = evt.clientX;
    const startPeriod = period;
    const totalChars = wave.length;
    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const desiredTotalPx = startPeriod * totalChars * cw + dx;
      let newPeriod = desiredTotalPx / (totalChars * cw);
      // snap to 0.5
      newPeriod = Math.max(0.25, Math.round(newPeriod / 0.25) * 0.25);
      patchSig({ period: newPeriod });
      setTip(`period ×${newPeriod}`);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setTip(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // hit areas
  const phaseHandleW = 6;
  const phaseHandleX = -phase * cw;
  const offset = -phase * cw;

  return (
    <div className={'row' + (selected ? ' selected' : '')} style={{ height: h }} data-id={sig.__id}
         onClick={onSelect}>
      <svg ref={svgRef} className={'wave-svg' + (cw >= 28 ? ' major-grid' : '')}
           width={totalW} height={h} style={{ color: 'var(--ink)' }}>
        {svgChildren}

        {/* cycle hit areas — must render *after* the wave shapes so they capture
            clicks that would otherwise be eaten by bus polygons / hatched x fills */}
        {Array.from({ length: cycles }).map((_, i) => {
          const x = i * cw;
          if (i >= wave.length) return null;
          return (
            <rect key={'hit-' + i} className="cycle-hit"
              x={x} y={0} width={cw} height={h} fill="transparent"
              onClick={(e) => { e.stopPropagation(); onCycleClick(i); }}
            />
          );
        })}

        {/* transition handles */}
        {transitions.map((tr, i) => {
          const x = -phase * cw + tr.charIndex * cw * period;
          return (
            <rect key={'tr-' + i}
              className="handle transition"
              x={x - 5} y={2} width={10} height={h - 4}
              onMouseDown={(e) => beginTransitionDrag(tr, e)}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setTip(`drag edge — cycle ${tr.charIndex}`)}
              onMouseLeave={() => setTip(null)}
            />
          );
        })}

        {/* phase handle (left edge of signal) */}
        {phase !== 0 || true ? (
          <rect className="phase-handle"
            x={offset - phaseHandleW/2} y={3} width={phaseHandleW} height={h - 6}
            onMouseDown={beginPhaseDrag}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setTip('drag phase (φ)')}
            onMouseLeave={() => setTip(null)}
          />
        ) : null}

        {/* period handle (right edge of signal) */}
        <rect className="period-handle-rect"
          x={offset + wave.length * cw * period - 4} y={3} width={8} height={h - 6}
          onMouseDown={beginPeriodDrag}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setTip('drag period (×)')}
          onMouseLeave={() => setTip(null)}
        />
      </svg>
    </div>
  );
}

// ── Edge layer (arrows between signals) ─────────────────────────
function EdgeLayer({ spec, rows, cw, rowH }) {
  // Wavedrom edges look like ['a~>b label', 'c->d label'] with node names declared
  // via signal.node string e.g. node: '.a..b'.
  // Build nodeMap from rows
  const nodeMap = {};
  rows.forEach((r, rowIdx) => {
    if (r.kind !== 'signal') return;
    const sig = r.sig;
    const nodes = sig.node || '';
    const period = sig.period || 1;
    const phase = sig.phase || 0;
    for (let i = 0; i < nodes.length; i++) {
      const c = nodes[i];
      if (c && c !== '.' && c !== ' ') {
        const x = (-phase + i * period) * cw;
        // EdgeLayer is positioned inside .cc-body, so coords are relative to
        // the body — no header offset needed.
        const y = rowIdx * rowH + rowH / 2;
        nodeMap[c] = { x, y, sig: sig.__id, charIdx: i };
      }
    }
  });
  const edges = (spec.edge || []).map((e, i) => {
    // Format: "<from><op><to> [label]"; ops: -, ->, <->, ~>, ~, -|>, etc.
    const m = String(e).match(/^([^\s\-~<|>]+)([\-~<>|]+)([^\s]+)\s*(.*)$/);
    if (!m) return null;
    const [, from, op, to, label] = m;
    const a = nodeMap[from], b = nodeMap[to];
    if (!a || !b) return null;
    return { i, from, to, op, label, a, b };
  }).filter(Boolean);

  if (!edges.length) return null;

  const totalW = rows.length ? Math.max(...rows.map((r, i) => r.kind === 'signal'
    ? ((r.sig.wave || '').length * (r.sig.period || 1) - (r.sig.phase || 0)) * cw : 0)) : 0;
  const totalH = 32 + rows.length * rowH;

  return (
    <svg className="edge-svg" width={totalW + 24} height={totalH}>
      {edges.map((e) => {
        const { a, b, op, label, i } = e;
        const isCurve = op.includes('~');
        const dx = b.x - a.x, dy = b.y - a.y;
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        const d = isCurve
          ? `M ${a.x} ${a.y} Q ${cx} ${cy - Math.abs(dy)/2} ${b.x} ${b.y}`
          : `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
        return (
          <g key={i}>
            <path className="edge-path" d={d} markerEnd={op.includes('>') ? 'url(#arrow)' : undefined} />
            <circle className="edge-node" cx={a.x} cy={a.y} r="2.5" />
            <circle className="edge-node" cx={b.x} cy={b.y} r="2.5" />
            <circle className="edge-handle" cx={a.x} cy={a.y} r="5" />
            <circle className="edge-handle" cx={b.x} cy={b.y} r="5" />
            {label && <text className="edge-label" x={cx} y={cy - 6} textAnchor="middle">{label}</text>}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--warn)" />
        </marker>
      </defs>
    </svg>
  );
}

// ── JSON drawer ────────────────────────────────────────────────
function Drawer({ open, setOpen, text, setText, apply, error }) {
  const [local, setLocal] = uS(text);
  uE(() => setLocal(text), [text]);
  const onChange = (v) => { setLocal(v); apply(v); };
  return (
    <div className={'drawer' + (open ? '' : ' collapsed')}>
      <div className="drawer-head" onClick={() => setOpen(!open)}>
        <span className="chev">▼</span> JSON
        <span className="drawer-tools" onClick={(e) => e.stopPropagation()}>
          {error
            ? <span className="json-status bad">parse error: {error}</span>
            : <span className="json-status">live · syncs to canvas</span>}
        </span>
      </div>
      <div className="drawer-body">
        <textarea className={'json-area' + (error ? ' bad' : '')} spellCheck={false}
          value={local} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

// ── Inspector ──────────────────────────────────────────────────
function Inspector({ spec, id, patchSig, setWave, close, deleteSignal }) {
  // find sig
  let sig = null;
  const visit = (n) => {
    if (sig) return;
    if (Array.isArray(n)) { for (let i = 1; i < n.length; i++) visit(n[i]); return; }
    if (n && typeof n === 'object' && n.__id === id) sig = n;
  };
  if (Array.isArray(spec.signal)) spec.signal.forEach(visit);
  if (!sig) return null;
  const period = sig.period || 1;
  const phase = sig.phase || 0;
  const data = sig.data ? (Array.isArray(sig.data) ? sig.data.join(' ') : sig.data) : '';

  return (
    <div className="inspector" onClick={(e) => e.stopPropagation()}>
      <h4>Signal · {sig.name}</h4>
      <div className="insp-row"><label>Name</label>
        <input value={sig.name || ''} onChange={(e) => patchSig(id, { name: e.target.value })} />
      </div>
      <div className="insp-row"><label>Wave</label>
        <input className="wave-input" value={sig.wave || ''}
          onChange={(e) => setWave(id, e.target.value)} spellCheck={false} />
      </div>
      <div className="insp-row"><label>Phase</label>
        <div className="stepper">
          <button onClick={() => patchSig(id, { phase: phase - 0.25 })}>−</button>
          <input type="number" step="0.25" value={phase}
            onChange={(e) => patchSig(id, { phase: parseFloat(e.target.value) || 0 })} />
          <button onClick={() => patchSig(id, { phase: phase + 0.25 })}>+</button>
        </div>
      </div>
      <div className="insp-row"><label>Period</label>
        <div className="stepper">
          <button onClick={() => patchSig(id, { period: Math.max(0.25, period - 0.25) })}>−</button>
          <input type="number" step="0.25" min="0.25" value={period}
            onChange={(e) => patchSig(id, { period: Math.max(0.25, parseFloat(e.target.value) || 1) })} />
          <button onClick={() => patchSig(id, { period: period + 0.25 })}>+</button>
        </div>
      </div>
      <div className="insp-row"><label>Data</label>
        <input value={data} placeholder="bus labels (space-sep)"
          onChange={(e) => patchSig(id, { data: e.target.value.split(/\s+/).filter(Boolean) })} />
      </div>
      <div className="insp-row"><label>Node</label>
        <input value={sig.node || ''} placeholder="e.g. .a..b" spellCheck={false}
          onChange={(e) => patchSig(id, { node: e.target.value })} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <button className="tb-btn" onClick={() => deleteSignal(id)} style={{ color: '#b13a3a' }}>
          {window.__WaveEditor.ICONS.trash} Delete
        </button>
        <button className="tb-btn" onClick={close}>Close</button>
      </div>
    </div>
  );
}

// ── Sample modal ───────────────────────────────────────────────
function SampleModal({ close, load }) {
  return (
    <div className="dim-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Load a sample</h3>
        <div className="sample-list">
          {window.WAVEDROM_SAMPLES.map((s) => (
            <button key={s.id} onClick={() => load(s.id)}>
              <span>{s.label}</span>
              <span className="sub">{s.sub}</span>
            </button>
          ))}
        </div>
        <div className="modal-foot">
          <button className="ghost" onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// expose
Object.assign(window, { Toolbar, Workarea, Drawer, Inspector, SampleModal,
  WaveRow, RowLabel, EdgeLayer });
