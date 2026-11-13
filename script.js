// ---- Math game (Zetamac-style) ----
const DURATION = 120;
const answerEl = document.getElementById('answer');
const problemEl = document.getElementById('problem');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
let score = 0, timeLeft = DURATION, timer = null, current = null;

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function newProblem() {
  const t = rnd(0, 3);
  let a, b;
  if (t === 0) { a = rnd(2, 100); b = rnd(2, 100); current = { q: `${a} + ${b}`, ans: a + b }; }
  else if (t === 1) { a = rnd(2, 100); b = rnd(2, 100); current = { q: `${a + b} − ${a}`, ans: b }; }
  else if (t === 2) { a = rnd(2, 12); b = rnd(2, 100); current = { q: `${a} × ${b}`, ans: a * b }; }
  else { a = rnd(2, 12); b = rnd(2, 100); current = { q: `${a * b} ÷ ${a}`, ans: b }; }
  problemEl.textContent = current.q;
  answerEl.value = '';
}

function endGame() {
  clearInterval(timer);
  current = null;
  answerEl.disabled = true;
  problemEl.textContent = `Score: ${score}`;
  startBtn.disabled = false;
  startBtn.textContent = 'Play again';
}

function startGame() {
  score = 0; timeLeft = DURATION;
  scoreEl.textContent = score; timeEl.textContent = timeLeft;
  startBtn.disabled = true;
  answerEl.disabled = false;
  newProblem();
  answerEl.focus();
  timer = setInterval(() => {
    timeEl.textContent = --timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

startBtn.addEventListener('click', startGame);
answerEl.addEventListener('input', () => {
  if (current && answerEl.value.trim() === String(current.ans)) {
    scoreEl.textContent = ++score;
    newProblem();
  }
});

// ---- Calculator ----
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
  if (e.target === answerEl) return;
  if (/^[0-9+\-*/%.]$/.test(e.key)) press(e.key);
  else if (e.key === 'Enter' || e.key === '=') press(null, 'eq');
  else if (e.key === 'Backspace') press(null, 'back');
  else if (e.key === 'Escape') press(null, 'clear');
});
