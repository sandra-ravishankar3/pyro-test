const display = document.getElementById('display');
let expr = '';

function show() {
  display.textContent = (expr || '0').replace(/\*/g, '×').replace(/\//g, '÷');
}

function evaluate() {
  if (!/^[0-9+\-*/%.\s]+$/.test(expr)) return 'Error';
  try {
    const r = Function('"use strict";return (' + expr.replace(/(\d+\.?\d*)%/g, '($1/100)') + ')')();
    return Number.isFinite(r) ? String(+r.toPrecision(12)) : 'Error';
  } catch { return 'Error'; }
}

function press(v, a) {
  if (expr === 'Error') expr = '';
  if (a === 'clear') expr = '';
  else if (a === 'back') expr = expr.slice(0, -1);
  else if (a === 'eq') { if (expr) expr = evaluate(); }
  else if (v) {
    if (/[+\-*/]/.test(v) && /[+\-*/]$/.test(expr)) expr = expr.slice(0, -1);
    if (/[+\-*/]/.test(v) && !expr) { if (v !== '-') return; }
    expr += v;
  }
  show();
}

document.querySelector('.keys').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b) press(b.dataset.v, b.dataset.a);
});

document.addEventListener('keydown', e => {
  if (/^[0-9+\-*/%.]$/.test(e.key)) press(e.key);
  else if (e.key === 'Enter' || e.key === '=') press(null, 'eq');
  else if (e.key === 'Backspace') press(null, 'back');
  else if (e.key === 'Escape') press(null, 'clear');
});
