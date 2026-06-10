// ── cursor ────────────────────────────────────────────────
const cur = document.getElementById('cur');
let cx = 0, cy = 0;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
(function loop(){ cur.style.left = cx+'px'; cur.style.top = cy+'px'; requestAnimationFrame(loop); })();

// ── 角色数据 ──────────────────────────────────────────────
const CHARACTERS = {
  'char-a': {
    name:'角色 A', en:'Character A', world:'黑白灰', bg:'#dbd8d2', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入 · 待填入', bio:'角色简介待填入。',
    float: false,
    items:['🗡️','🩶','🌫️','🕯️','📌','🪡','🧷','⛓️','🖤','🪦'],
  },
  'char-b': {
    name:'角色 B', en:'Character B', world:'蓝绿', bg:'#cfdce0', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入 · 待填入', bio:'角色简介待填入。',
    float: false,
    items:['🌊','🐟','☔','🧃','🌿','💙','🫧','🎐','🍃','🌱'],
  },
  'char-c': {
    name:'角色 C', en:'Character C', world:'天国列车', bg:'#dedad2', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入 · 待填入', bio:'角色简介待填入。',
    float: false,
    items:['🪶','✨','🕊️','☁️','🌙','⭐','🪄','🔔','🌸','💫'],
  },
  'char-d': {
    name:'角色 D', en:'Character D', world:'BIBI', bg:'#d5d0e0', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入 · 待填入', bio:'角色简介待填入。',
    float: true,
    items:['🪐','🌌','👾','🍬','📻','🎀','💜','🌠','🛸','🍭'],
  },
  'char-e': {
    name:'角色 E', en:'Character E', world:'赤色', bg:'#e0d4d2', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入 · 待填入', bio:'角色简介待填入。',
    float: false,
    items:['🌹','🧧','🎋','🪷','🍂','🫀','🏮','🎴','🌺','♦️'],
  },
  'char-f': {
    name:'角色 F', en:'Character F', world:'黑白灰', bg:'#dbd8d2', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入', bio:'角色简介待填入。',
    float: false,
    items:['🗡️','🩶','🌫️','🕯️','📌','🪡','🧷','⛓️','🖤','🪦'],
  },
  'char-g': {
    name:'角色 G', en:'Character G', world:'蓝绿', bg:'#cfdce0', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入', bio:'角色简介待填入。',
    float: false,
    items:['🌊','🐟','☔','🧃','🌿','💙','🫧','🎐','🍃','🌱'],
  },
  'char-h': {
    name:'角色 H', en:'Character H', world:'天国列车', bg:'#dedad2', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入', bio:'角色简介待填入。',
    float: false,
    items:['🪶','✨','🕊️','☁️','🌙','⭐','🪄','🔔','🌸','💫'],
  },
  'char-i': {
    name:'角色 I', en:'Character I', world:'BIBI', bg:'#d5d0e0', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入', bio:'角色简介待填入。',
    float: true,
    items:['🪐','🌌','👾','🍬','📻','🎀','💜','🌠','🛸','🍭'],
  },
  'char-j': {
    name:'角色 J', en:'Character J', world:'赤色', bg:'#e0d4d2', image:'',
    age:'—', height:'—', birth:'—', gender:'—', tags:'待填入', bio:'角色简介待填入。',
    float: false,
    items:['🌹','🧧','🎋','🪷','🍂','🫀','🏮','🎴','🌺','♦️'],
  },
};

// ── 渲染角色资料 ──────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const id     = params.get('id') || 'char-a';
const char   = CHARACTERS[id];

document.addEventListener('DOMContentLoaded', function () {
  if (!char) return;

  document.title = char.name + ' — OC WORLDS';
  document.getElementById('charName').textContent   = char.name;
  document.getElementById('charEn').textContent     = char.en;
  document.getElementById('charWorld').textContent  = char.world;
  document.getElementById('statAge').textContent    = char.age;
  document.getElementById('statHeight').textContent = char.height;
  document.getElementById('statBirth').textContent  = char.birth;
  document.getElementById('statGender').textContent = char.gender;
  document.getElementById('statTags').textContent   = char.tags;
  document.getElementById('bio').textContent        = char.bio;

  const illust = document.getElementById('illust');
  illust.style.background = char.bg;
  if (char.image) illust.innerHTML = `<img src="${char.image}" alt="${char.name}" style="width:100%;height:100%;object-fit:cover;object-position:top"/>`;

  // ── Physics ──────────────────────────────────────────
  const S    = 52;   // object size px
  const G    = 0.18; // gravity
  const FRIC = 0.992;
  const BOUNCE = 0.42;
  const isFloat = !!char.float;

  const wrap   = document.getElementById('wrap');
  const bodies = [];

  function spawnObj() {
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    const cx = W / 2;
    const gap = 130; // illust half-width buffer

    let x, y, vx, vy;

    if (isFloat) {
      // spawn anywhere, fixed speed in random direction
      x = Math.random() * (W - S);
      y = Math.random() * (H - S);
      const angle = Math.random() * Math.PI * 2;
      const spd   = 0.25 + Math.random() * 0.18;
      vx = Math.cos(angle) * spd;
      vy = Math.sin(angle) * spd;
    } else {
      // spawn above screen, avoid center illust
      if (Math.random() < 0.5) x = Math.random() * Math.max(10, cx - gap - S);
      else                      x = (cx + gap) + Math.random() * Math.max(10, W - cx - gap - S);
      x  = Math.max(0, Math.min(W - S, x));
      y  = -60;
      vx = (Math.random() - 0.5) * 1.2;
      vy = 0;
    }

    const el = document.createElement('div');
    el.className   = 'obj';
    el.textContent = char.items[Math.floor(Math.random() * char.items.length)];
    el.style.left  = x + 'px';
    el.style.top   = y + 'px';
    if (isFloat) el.style.opacity = '0';
    wrap.appendChild(el);

    const b = { el, x, y, vx, vy, drag: false, ox: 0, oy: 0, pvx: 0, pvy: 0 };
    bodies.push(b);

    if (isFloat) {
      let op = 0;
      const fi = setInterval(() => {
        op += 0.04;
        el.style.opacity = String(Math.min(op, 1));
        if (op >= 1) clearInterval(fi);
      }, 40);
    }

    el.addEventListener('mouseenter', () => cur.classList.add('hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
    el.addEventListener('mousedown', e => {
      e.preventDefault();
      b.drag = true;
      cur.classList.add('drag-cur');
      const r = el.getBoundingClientRect();
      b.ox = e.clientX - r.left;
      b.oy = e.clientY - r.top;
      b.pvx = 0; b.pvy = 0;
    });
  }

  document.addEventListener('mousemove', e => {
    bodies.forEach(b => {
      if (!b.drag) return;
      const r  = wrap.getBoundingClientRect();
      const nx = e.clientX - r.left - b.ox;
      const ny = e.clientY - r.top  - b.oy;
      b.pvx = nx - b.x;
      b.pvy = ny - b.y;
      b.x   = nx;
      b.y   = ny;
    });
  });

  document.addEventListener('mouseup', () => {
    bodies.forEach(b => {
      if (!b.drag) return;
      b.drag = false;
      cur.classList.remove('drag-cur');
      if (isFloat) {
        // keep same speed, change direction based on throw
        const throwSpd = Math.sqrt(b.pvx * b.pvx + b.pvy * b.pvy);
        const origSpd  = Math.sqrt(b.vx  * b.vx  + b.vy  * b.vy) || 0.3;
        const spd = throwSpd > 0.05 ? Math.min(throwSpd * 0.5, 0.55) : origSpd;
        const ang = throwSpd > 0.05 ? Math.atan2(b.pvy, b.pvx) : Math.atan2(b.vy, b.vx);
        b.vx = Math.cos(ang) * spd;
        b.vy = Math.sin(ang) * spd;
      } else {
        b.vx = b.pvx * 0.6;
        b.vy = b.pvy * 0.6;
      }
    });
  });

  // AABB collision resolution
  function resolveCollisions() {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j];
        if (a.drag || b.drag) continue;

        const ox = Math.min(a.x + S, b.x + S) - Math.max(a.x, b.x);
        const oy = Math.min(a.y + S, b.y + S) - Math.max(a.y, b.y);
        if (ox <= 0 || oy <= 0) continue; // no overlap

        const fromLeft = b.x >= a.x;
        const fromTop  = b.y >= a.y;

        if (oy < ox) {
          // vertical hit
          const push = oy / 2;
          if (fromTop) { a.y -= push; b.y += push; }
          else         { a.y += push; b.y -= push; }

          if (isFloat) {
            // elastic: swap vy
            const tmp = a.vy; a.vy = b.vy; b.vy = tmp;
          } else {
            const relVy = a.vy - b.vy;
            const cond  = fromTop ? relVy < 0 : relVy > 0;
            if (cond) {
              const imp = relVy * BOUNCE;
              const aS  = Math.abs(a.vy) < 0.3;
              const bS  = Math.abs(b.vy) < 0.3;
              const ra  = bS ? 0.15 : (aS ? 0.85 : 0.5);
              a.vy -= imp * (1 - ra);
              b.vy += imp * ra;
              // roll off
              if (fromTop && Math.abs(relVy) > 0.3) {
                const co = (a.x + S / 2) - (b.x + S / 2);
                b.vx -= co * 0.025;
              }
            }
          }
        } else {
          // horizontal hit
          const push = ox / 2;
          if (fromLeft) { a.x -= push; b.x += push; }
          else          { a.x += push; b.x -= push; }

          if (isFloat) {
            // elastic: swap vx
            const tmp = a.vx; a.vx = b.vx; b.vx = tmp;
          } else {
            const relVx = a.vx - b.vx;
            const cond  = fromLeft ? relVx < 0 : relVx > 0;
            if (cond) {
              const imp = relVx * BOUNCE;
              const aS  = Math.abs(a.vx) < 0.3;
              const bS  = Math.abs(b.vx) < 0.3;
              const ra  = bS ? 0.15 : (aS ? 0.85 : 0.5);
              a.vx -= imp * (1 - ra);
              b.vx += imp * ra;
              a.vy += (b.vy - a.vy) * 0.08;
              b.vy += (a.vy - b.vy) * 0.08;
            }
          }
        }
      }
    }
  }

  function tick() {
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;

    bodies.forEach(b => {
      if (b.drag) {
        b.el.style.left = b.x + 'px';
        b.el.style.top  = b.y + 'px';
        return;
      }

      if (isFloat) {
        // pure inertia — no acceleration
        b.x += b.vx;
        b.y += b.vy;
        if (b.x <= 0)   { b.x = 0;     b.vx =  Math.abs(b.vx); }
        if (b.x >= W-S) { b.x = W - S; b.vx = -Math.abs(b.vx); }
        if (b.y <= 0)   { b.y = 0;     b.vy =  Math.abs(b.vy); }
        if (b.y >= H-S) { b.y = H - S; b.vy = -Math.abs(b.vy); }
      } else {
        b.vy += G;
        b.vx *= FRIC;
        b.x  += b.vx;
        b.y  += b.vy;
        if (b.y >= H - S) {
          b.y   = H - S;
          b.vy *= -BOUNCE;
          b.vx *= 0.82;
          if (Math.abs(b.vy) < 1.2) b.vx *= 0.88;
          if (Math.abs(b.vy) < 0.5) b.vy  = 0;
          if (Math.abs(b.vx) < 0.08) b.vx = 0;
        }
        if (b.x <= 0)   { b.x = 0;     b.vx = -b.vx * BOUNCE * 0.8; }
        if (b.x >= W-S) { b.x = W - S; b.vx = -b.vx * BOUNCE * 0.8; }
      }

      b.el.style.left = b.x + 'px';
      b.el.style.top  = b.y + 'px';
    });

    resolveCollisions();
    requestAnimationFrame(tick);
  }
  tick();

  const total = isFloat ? 8 : 12;
  let count = 0;
  function drop() {
    spawnObj();
    count++;
    if (count < total) {
      const delay = count < 4 ? 100 : (isFloat ? 350 : 280);
      setTimeout(drop, delay + Math.random() * 200);
    }
  }
  drop();
});
