const CHARS = [
  { name: '角色 A', world: '黑白灰',   bg: '#d8d5cf', id: 'char-a' },
  { name: '角色 B', world: '蓝绿',     bg: '#cfdce0', id: 'char-b' },
  { name: '角色 C', world: '天国列车', bg: '#dedad2', id: 'char-c' },
  { name: '角色 D', world: 'BIBI',     bg: '#d5d0e0', id: 'char-d' },
  { name: '角色 E', world: '赤色',     bg: '#e0d4d2', id: 'char-e' },
  { name: '角色 F', world: '黑白灰',   bg: '#d8d5cf', id: 'char-f' },
  { name: '角色 G', world: '蓝绿',     bg: '#cfdce0', id: 'char-g' },
  { name: '角色 H', world: '天国列车', bg: '#dedad2', id: 'char-h' },
  { name: '角色 I', world: 'BIBI',     bg: '#d5d0e0', id: 'char-i' },
  { name: '角色 J', world: '赤色',     bg: '#e0d4d2', id: 'char-j' },
];
 
const COLS = 7, ROWS = 4;
const FILLED = [
  { col:4, row:0 }, { col:5, row:0 }, { col:6, row:0 },
  { col:4, row:1 }, { col:5, row:1 },
  { col:3, row:2 }, { col:4, row:2 },
  { col:0, row:3 }, { col:2, row:3 }, { col:4, row:3 },
];
 
const icon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
const grid = document.getElementById('grid');
const cur  = document.getElementById('cur');
let state  = {};
FILLED.forEach((p, i) => { state[p.col + ',' + p.row] = CHARS[i]; });
 
function render() {
  grid.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key  = c + ',' + r;
      const cell = document.createElement('div');
      cell.className   = 'cell';
      cell.dataset.key = key;
      const char = state[key] || null;
      if (char) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-img" style="background:${char.bg}">${icon}</div>
          <div class="card-overlay">
            <span class="card-name">${char.name}</span>
            <span class="card-world">${char.world}</span>
          </div>`;
        card.addEventListener('mouseenter', () => cur.classList.add('hover'));
        card.addEventListener('mouseleave', () => cur.classList.remove('hover'));
        card.addEventListener('click', () => { if (!wasDragging) window.location.href = `character.html?id=${char.id}`; });
        card.addEventListener('mousedown', e => startDrag(e, card, char, key));
        cell.appendChild(card);
      } else {
        const em = document.createElement('div');
        em.className = 'empty';
        cell.appendChild(em);
      }
      grid.appendChild(cell);
    }
  }
}
 
let wasDragging = false;
 
function startDrag(e, card, char, fromKey) {
  e.preventDefault();
  wasDragging = false;
  const rect = card.getBoundingClientRect();
  const sz = rect.width;
  const ox = e.clientX - rect.left, oy = e.clientY - rect.top;
  card.style.opacity = '.2';
  cur.classList.remove('hover');
  cur.classList.add('drag');
  const ghost = document.createElement('div');
  ghost.className = 'drag-ghost';
  ghost.style.width  = sz + 'px';
  ghost.style.height = sz + 'px';
  ghost.innerHTML = `<div style="width:100%;height:100%;background:${char.bg};display:flex;align-items:center;justify-content:center">${icon}</div>`;
  document.body.appendChild(ghost);
  let overKey = null, moved = false;
  function move(ev) {
    if (!moved && (Math.abs(ev.clientX-e.clientX)>4||Math.abs(ev.clientY-e.clientY)>4)) { moved=true; wasDragging=true; }
    ghost.style.left = ev.clientX - ox + 'px';
    ghost.style.top  = ev.clientY - oy + 'px';
    document.querySelectorAll('.card').forEach(el => el.style.outline = '');
    const el = document.elementFromPoint(ev.clientX, ev.clientY);
    if (!el) return;
    const tc = el.closest('.cell');
    if (tc && tc.dataset.key !== fromKey) {
      overKey = tc.dataset.key;
      const ch = tc.querySelector('.card');
      if (ch) ch.style.outline = '1.5px solid #bbb';
    } else overKey = null;
  }
  function up(ev) {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    ghost.remove();
    card.style.opacity = '';
    cur.classList.remove('drag');
    document.querySelectorAll('.card').forEach(el => el.style.outline = '');
    if (moved && overKey) {
      const toChar = state[overKey] || null;
      state[overKey] = char;
      if (toChar) state[fromKey] = toChar;
      else delete state[fromKey];
      render();
    }
    setTimeout(() => { wasDragging = false; }, 50);
  }
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
}
 
render();
 
let cx = 0, cy = 0;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
(function loop() { cur.style.left = cx+'px'; cur.style.top = cy+'px'; requestAnimationFrame(loop); })();
 
