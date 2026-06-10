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
  const wrap   = document.getElementById('wrap');
  const bodies = [];
  const ITEMS  = char.items;
  const R = S / 2; // radius for collision

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
    // float: slow fixed speed in one direction, never changes unless collision
    const spd = isFloat ? 0.25 + Math.random() * 0.2 : 0;
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
      if (isFloat) {
        // restore original speed after throw, just change direction
        const throwSpd = Math.sqrt(b.pvx*b.pvx + b.pvy*b.pvy);
        const origSpd  = Math.sqrt(b.vx*b.vx + b.vy*b.vy) || 0.3;
        const spd = throwSpd > 0.1 ? Math.min(throwSpd * 0.5, 0.6) : origSpd;
        const ang = throwSpd > 0.1 ? Math.atan2(b.pvy, b.pvx) : Math.atan2(b.vy, b.vx);
        b.vx = Math.cos(ang) * spd;
        b.vy = Math.sin(ang) * spd;
      } else {
        b.vx = b.pvx * 0.6; b.vy = b.pvy * 0.6;
      }
    });
  });

  function resolveCollisions() {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j];
        if (a.drag || b.drag) continue;

        // AABB overlap (square boxes)
        const overlapX = (a.x + S) - b.x;
        const overlapY = (a.y + S) - b.y;
        const overlapX2 = (b.x + S) - a.x;
        const overlapY2 = (b.y + S) - a.y;

        if (overlapX > 0 && overlapX2 > 0 && overlapY > 0 && overlapY2 > 0) {
          // find minimum penetration axis
          const penX = Math.min(overlapX, overlapX2);
          const penY = Math.min(overlapY, overlapY2);

          // which side is b relative to a
          const fromLeft = b.x > a.x;
          const fromTop  = b.y > a.y;

          // settled ratio — lower/slower object resists more
          const aSettled = Math.abs(a.vy) < 0.3 && Math.abs(a.vx) < 0.3;
          const bSettled = Math.abs(b.vy) < 0.3 && Math.abs(b.vx) < 0.3;
          const aRatio = bSettled ? 0.15 : (aSettled ? 0.85 : 0.5);

          if (penY < penX) {
            // vertical collision (stacking)
            const pen = penY;
            if (fromTop) {
              a.y -= pen * (1 - aRatio);
              b.y += pen * aRatio;
            } else {
              a.y += pen * (1 - aRatio);
              b.y -= pen * aRatio;
            }
            // velocity exchange on Y
            const relVy = a.vy - b.vy;
            if ((fromTop && relVy < 0) || (!fromTop && relVy > 0)) {
              if (isFloat) {
                // zero-g elastic: swap vy components fully
                const tmp = a.vy; a.vy = b.vy; b.vy = tmp;
              } else {
                const restitution = 0.35;
                const imp = relVy * restitution;
                a.vy -= imp * (1 - aRatio);
                b.vy += imp * aRatio;
                if (fromTop && Math.abs(relVy) > 0.3) {
                  const centerOffset = (a.x + S/2) - (b.x + S/2);
                  b.vx -= centerOffset * 0.025;
                }
              }
            }
          } else {
            // horizontal collision
            const pen = penX;
            if (fromLeft) {
              a.x -= pen * (1 - aRatio);
              b.x += pen * aRatio;
            } else {
              a.x += pen * (1 - aRatio);
              b.x -= pen * aRatio;
            }
            const relVx = a.vx - b.vx;
            if ((fromLeft && relVx < 0) || (!fromLeft && relVx > 0)) {
              if (isFloat) {
                // zero-g elastic: swap vx components fully
                const tmp = a.vx; a.vx = b.vx; b.vx = tmp;
              } else {
                const restitution = 0.38;
                const imp = relVx * restitution;
                a.vx -= imp * (1 - aRatio);
                b.vx += imp * aRatio;
                a.vy += (b.vy - a.vy) * 0.08;
                b.vy += (a.vy - b.vy) * 0.08;
              }
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
        // pure inertia — no acceleration, constant velocity
        b.x += b.vx; b.y += b.vy;
        // elastic wall bounce — preserve speed exactly
        if (b.x <= 0)   { b.x=0;   b.vx=Math.abs(b.vx); }
        if (b.x >= W-S) { b.x=W-S; b.vx=-Math.abs(b.vx); }
        if (b.y <= 0)   { b.y=0;   b.vy=Math.abs(b.vy); }
        if (b.y >= H-S) { b.y=H-S; b.vy=-Math.abs(b.vy); }
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
