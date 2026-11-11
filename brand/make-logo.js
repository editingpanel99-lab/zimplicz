// Generates the Zimplicz logo SVGs (run: node make-logo.js). Letters are drawn as
// round-capped strokes so the logo needs no font files.
const fs = require('fs');
const path = require('path');

const C = { ink: '#0c0a12', paper: '#f6f1e9', pink: '#ff2e88', yellow: '#ffd23f', cyan: '#22d3ee', lime: '#b8f53a' };
const SW = 26; // stroke width

// ---- mark: 4-colour rounded tile with a Z ----
function mark(x, y, s, zColor) {
  const h = s / 2, r = s * 0.2;
  return `
  <g transform="translate(${x},${y})">
    <path d="M0,${r} A${r},${r} 0 0 1 ${r},0 H${h} V${h} H0 Z" fill="${C.pink}"/>
    <path d="M${h},0 H${s - r} A${r},${r} 0 0 1 ${s},${r} V${h} H${h} Z" fill="${C.yellow}"/>
    <path d="M0,${h} H${h} V${s} H${r} A${r},${r} 0 0 1 0,${s - r} Z" fill="${C.cyan}"/>
    <path d="M${h},${h} H${s} V${s - r} A${r},${r} 0 0 1 ${s - r},${s} H${h} Z" fill="${C.lime}"/>
    <path d="M${s * .29},${s * .29} H${s * .71} L${s * .29},${s * .71} H${s * .71}" fill="none" stroke="${zColor}" stroke-width="${s * .15}" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
}

// ---- wordmark: x-height 100..200, ascender 40, descender 250 ----
function wordmark(x0, color) {
  const g = [];
  const z = x => `M${x},100 H${x + 80} L${x},200 H${x + 80}`;
  const i = (x, dot) => { g.push(`<circle cx="${x}" cy="58" r="17" fill="${dot}"/>`); return `M${x},100 V200`; };
  const m = x => `M${x},100 V200 M${x},200 V130 A30,30 0 0 1 ${x + 60},130 V200 M${x + 60},130 A30,30 0 0 1 ${x + 120},130 V200`;
  const p = x => `M${x},100 V250 M${x + 49},101 A49,49 0 1 1 ${x + 49},199 A49,49 0 1 1 ${x + 49},101`;
  const l = x => `M${x},40 V200`;
  const c = x => `M${x + 85.4},114.6 A50,50 0 1 0 ${x + 85.4},185.4`;
  let x = x0; const d = [];
  d.push(z(x)); x += 128;
  d.push(i(x, C.pink)); x += 48;
  d.push(m(x)); x += 168;
  d.push(p(x)); x += 146;
  d.push(l(x)); x += 48;
  d.push(i(x, C.cyan)); x += 48;
  d.push(c(x)); x += 133;
  d.push(z(x)); x += 80;
  g.push(`<circle cx="${x + 38}" cy="186" r="17" fill="${C.pink}"/>`);
  return { svg: `<path d="${d.join(' ')}" fill="none" stroke="${color}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>\n  ${g.join('\n  ')}`, right: x + 55 };
}

function full(textColor, zColor) {
  const w = wordmark(250, textColor);
  const W = w.right + 30, H = 290;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${mark(20, 27, 186, zColor)}
  ${w.svg}
</svg>`;
}

function icon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">${mark(16, 16, 480, C.ink)}
</svg>`;
}

const out = __dirname;
fs.writeFileSync(path.join(out, 'zimplicz-logo-on-dark.svg'), full(C.paper, C.ink));
fs.writeFileSync(path.join(out, 'zimplicz-logo-on-light.svg'), full(C.ink, C.ink));
fs.writeFileSync(path.join(out, 'zimplicz-icon.svg'), icon());
console.log('written');
