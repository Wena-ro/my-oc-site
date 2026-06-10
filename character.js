// ── cursor ────────────────────────────────────────────────
const cur = document.getElementById('cur');
let cx = 0, cy = 0;
document.addEventListener('mousemove', e => { cx=e.clientX; cy=e.clientY; });
(function loop(){ cur.style.left=cx+'px'; cur.style.top=cy+'px'; requestAnimationFrame(loop); })();

// ── 角色数据 ──────────────────────────────────────────────
// 填入角色资料，images 填图片路径（放在 assets/images/ 里）
// items 是掉落的小物件，可以换成跟角色主题相关的 emoji
const CHARACTERS = {
  'char-a': {
    name: '角色 A', en: 'Character A', world: '黑白灰',
    bg: '#dbd8d2', image: '',
    age: '—', height: '—', birth: '—', gender: '—',
    tags: '待填入 · 待填入',
    bio: '角色简介待填入。',
    items: ['🗡️','🩶','🌫️','🕯️','📌','🪡','🧷','⛓️','🖤','🪦'],
  },
  'char-b': {
    name: '角色 B', en: 'Character B', world: '蓝绿',
    bg: '#cfdce0', image: '',
    age: '—', height: '—', birth: '—', gender: '—',
    tags: '待填入 · 待填入',
    bio: '角色简介待填入。',
    items: ['🌊','🐟','☔','🧃','🌿','💙','🫧','🎐','🍃','🌱'],
  },
  'char-c': {
    name: '角色 C', en: 'Character C', world: '天国列车',
    bg: '#dedad2', image: '',
    age: '—', height: '—', birth: '—', gender: '—',
    tags: '待填入 · 待填入',
    bio: '角色简介待填入。',
    items: ['🪶','✨','🕊️','☁️','🌙','⭐','🪄','🔔','🌸','💫'],
  },
  'char-d': {
    float: true,
    name: '角色 D', en: 'Character D', world: 'BIBI',
    bg: '#d5d0e0', image: '',
    age: '—', height: '—', birth: '—', gender: '—',
    tags: '待填入 · 待填入',
    bio: '角色简介待填入。',
    items: ['🪐','🌌','👾','🍬','📻','🎀','💜','🌠','🛸','🍭'],
  },
  'char-e': {
    name: '角色 E', en: 'Character E', world: '赤色',
    bg: '#e0d4d2', image: '',
    age: '—', height: '—', birth: '—', gender: '—',
    tags: '待填入 · 待填入',
    bio: '角色简介待填入。',
    items: ['🌹','🧧','🎋','🪷','🍂','🫀','🏮','🎴','🌺','♦️'],
  },
  'char-f': {
    name: '角色 F', en: 'Character F', world: '黑白灰', bg: '#dbd8d2', image: '',
    age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',
    items:['🗡️','🩶','🌫️','🕯️','📌','🪡','🧷','⛓️','🖤','🪦'],
  },
  'char-g': {
    name: '角色 G', en: 'Character G', world: '蓝绿', bg: '#cfdce0', image: '',
    age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',
    items:['🌊','🐟','☔','🧃','🌿','💙','🫧','🎐','🍃','🌱'],
  },
  'char-h': {
    name: '角色 H', en: 'Character H', world: '天国列车', bg: '#dedad2', image: '',
    age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',
    items:['🪶','✨','🕊️','☁️','🌙','⭐','🪄','🔔','🌸','💫'],
  },
  'char-i': {
    float: true,
    name: '角色 I', en: 'Character I', world: 'BIBI', bg: '#d5d0e0', image: '',
    age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',
    items:['🪐','🌌','👾','🍬','📻','🎀','💜','🌠','🛸','🍭'],
  },
  'char-j': {
    name: '角色 J', en: 'Character J', world: '赤色', bg: '#e0d4d2', image: '',
    age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',
    items:['🌹','🧧','🎋','🪷','🍂','🫀','🏮','🎴','🌺','♦️'],
  },
};

// ── 渲染角色资料 ──────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const id     = params.get('id') || 'char-a';
const char   = CHARACTERS[id];

document.addEventListener('DOMContentLoaded', function() {
if (char) {
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
  if (char.image) {
    illust.innerHTML = `<img src="${char.image}" alt="${char.name}"/>`;
  }

  // ── 掉落物理 ──────────────────────────────────────────
  const isFloat = !!char.float;
  const S = 52; // object size
  // gravity physics constants
  const G = 0.18, BOUNCE = 0.45, FRIC = 0.992;
  // float physics constants — slow drift with one directional pull
  const FLOAT_DRIFT = 0.0006; // very gentle constant pull direction (like slow solar wind)
  const FLOAT_FRIC  = 0.9992;
  const FLOAT_MAX   = 0.55;   // speed cap — slow and dreamy

  const wrap   = document.getElementById('wrap');
  const bodies = [];
  const ITEMS  = char.items;
  const R = S / 2; // radius for collision

  // pick a single drift direction for this session (simulates one gravity vector)
  const driftAngle = Math.random() * Math.PI * 2;
  const driftAx = Math.cos(driftAngle) * FLOAT_DRIFT;
  const driftAy = Math.sin(driftAngle) * FLOAT_DRIFT;

  function spawnPos() {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    const cx = W / 2, half = 120;
    let x;
    if (Math.random() < 0.5) x = Math.random() * Math.max(0, cx - half - S);
    else x = (cx + half) + Math.random() * Math.max(0, W - cx - half - S);
    return { x: Math.max(0, Math.min(W - S, x)), y: isFloat ? Math.random() * (H - S) : -60 };
  }

  function spawn() {
    const pos = spawnPos();
    const el = document.createElement('div');
    el.className = 'obj';
    el.textContent = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    el.style.left = pos.x + 'px';
    el.style.top  = pos.y + 'px';
    if (isFloat) el.style.opacity = '0';
    wrap.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const spd   = isFloat ? 0.1 + Math.random() * 0.2 : 0;
    const b = {
      el,
      x: pos.x, y: pos.y,
      vx: isFloat ? Math.cos(angle) * spd : (Math.random() - 0.5) * 1.2,
      vy: isFloat ? Math.sin(angle) * spd : 0,
      drag: false, ox: 0, oy: 0, pvx: 0, pvy: 0,
    };
    bodies.push(b);

    if (isFloat) {
      let op = 0;
      const fi = setInterval(() => { op += 0.04; el.style.opacity = Math.min(op, 1); if (op >= 1) clearInterval(fi); }, 40);
    }

    el.addEventListener('mouseenter', () => cur.classList.add('hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
    el.addEventListener('mousedown', e => {
      e.preventDefault();
      b.drag = true; cur.classList.add('drag-cur');
      const r = el.getBoundingClientRect();
      b.ox = e.clientX - r.left; b.oy = e.clientY - r.top;
      b.vx = 0; b.vy = 0;
    });
  }

  document.addEventListener('mousemove', e => {
    bodies.forEach(b => {
      if (!b.drag) return;
      const r = wrap.getBoundingClientRect();
      const nx = e.clientX - r.left - b.ox;
      const ny = e.clientY - r.top  - b.oy;
      b.pvx = nx - b.x; b.pvy = ny - b.y;
      b.x = nx; b.y = ny;
    });
  });
  document.addEventListener('mouseup', () => {
    bodies.forEach(b => {
      if (!b.drag) return;
      b.drag = false; cur.classList.remove('drag-cur');
      b.vx = b.pvx * 0.6; b.vy = b.pvy * 0.6;
    });
  });

  function resolveCollisions() {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j];
        if (a.drag || b.drag) continue;
        const dx = (b.x + R) - (a.x + R);
        const dy = (b.y + R) - (a.y + R);
        const dist = Math.sqrt(dx*dx + dy*dy);
        const minDist = S * 0.95;
        if (dist < minDist && dist > 0.01) {
          const nx = dx / dist, ny = dy / dist;
          // positional correction — push apart fully
          const overlap = (minDist - dist);
          // heavier object (lower = more settled) moves less
          const aRatio = b.vy < a.vy ? 0.3 : 0.7;
          a.x -= nx * overlap * (1 - aRatio);
          a.y -= ny * overlap * (1 - aRatio);
          b.x += nx * overlap * aRatio;
          b.y += ny * overlap * aRatio;
          // elastic collision along normal
          const dvx = a.vx - b.vx, dvy = a.vy - b.vy;
          const dot = dvx*nx + dvy*ny;
          if (dot > 0) {
            const restitution = isFloat ? 0.65 : 0.42;
            const friction    = isFloat ? 1.0  : 0.78; // tangential friction on impact
            const tx = -ny, ty = nx; // tangent
            const tdot = dvx*tx + dvy*ty;
            a.vx -= (dot * nx * restitution + tdot * tx * (1-friction)) * (1-aRatio);
            a.vy -= (dot * ny * restitution + tdot * ty * (1-friction)) * (1-aRatio);
            b.vx += (dot * nx * restitution + tdot * tx * (1-friction)) * aRatio;
            b.vy += (dot * ny * restitution + tdot * ty * (1-friction)) * aRatio;
          }
          // if nearly at rest on top of each other, add tiny roll nudge
          if (!isFloat) {
            const relSpd = Math.sqrt(dvx*dvx+dvy*dvy);
            if (relSpd < 0.8 && dy < -S*0.3) {
              // top object rolls off slightly based on overlap offset
              const rollDir = dx > 0 ? 1 : -1;
              b.vx += rollDir * 0.15;
            }
          }
        }
      }
    }
  }

  function tick() {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    bodies.forEach(b => {
      if (b.drag) { b.el.style.left=b.x+'px'; b.el.style.top=b.y+'px'; return; }
      if (isFloat) {
        // one consistent directional drift — like zero-g with a gentle push
        b.vx += driftAx; b.vy += driftAy;
        b.vx *= FLOAT_FRIC; b.vy *= FLOAT_FRIC;
        // speed cap
        const spd = Math.sqrt(b.vx*b.vx + b.vy*b.vy);
        if (spd > FLOAT_MAX) { b.vx *= FLOAT_MAX/spd; b.vy *= FLOAT_MAX/spd; }
        b.x += b.vx; b.y += b.vy;
        // bounce off edges (no wrap — real physics)
        if (b.x <= 0)   { b.x=0;   b.vx*=-0.6; }
        if (b.x >= W-S) { b.x=W-S; b.vx*=-0.6; }
        if (b.y <= 0)   { b.y=0;   b.vy*=-0.6; }
        if (b.y >= H-S) { b.y=H-S; b.vy*=-0.6; }
      } else {
        b.vy += G; b.vx *= FRIC;
        b.x += b.vx; b.y += b.vy;
        if (b.y >= H-S) {
          b.y=H-S;
          b.vy*=-BOUNCE;
          b.vx*=0.82;
          // rolling friction when nearly settled
          if(Math.abs(b.vy)<1.2) b.vx*=0.88;
          if(Math.abs(b.vy)<0.5) b.vy=0;
          if(Math.abs(b.vx)<0.08) b.vx=0;
        }
        if (b.x <= 0)   { b.x=0;   b.vx*=-BOUNCE*0.8; }
        if (b.x >= W-S) { b.x=W-S; b.vx*=-BOUNCE*0.8; }
      }
      b.el.style.left = b.x+'px';
      b.el.style.top  = b.y+'px';
    });
    resolveCollisions();
    requestAnimationFrame(tick);
  }
  tick();

  const total = isFloat ? 8 : 12;
  const delay = isFloat ? 400 : 300;
  let count = 0;
  function drop() {
    spawn(); count++;
    if (count < total) setTimeout(drop, (count < 4 ? 100 : delay) + Math.random() * 300);
  }
  drop();


});
