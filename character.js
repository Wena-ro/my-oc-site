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
  const G=0.18, BOUNCE=0.45, FRIC=0.992, S=52;
  const wrap   = document.getElementById('wrap');
  const bodies = [];
  const ITEMS  = char.items;

  function spawn() {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    let x, y;
    if (isFloat) {
      x = Math.random() * (W - S);
      y = Math.random() * (H - S);
    } else {
      const cx = W / 2;
      if (Math.random() < 0.5) x = Math.random() * (cx - 110 - S);
      else x = (cx + 110) + Math.random() * (W - cx - 110 - S);
      x = Math.max(0, Math.min(W - S, x));
      y = -60;
    }

    const el = document.createElement('div');
    el.className = 'obj';
    el.textContent = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    if (isFloat) el.style.opacity = '0';
    wrap.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const speed = isFloat ? 0.3 + Math.random() * 0.4 : 0;
    const b = {
      el, x, y,
      vx: isFloat ? Math.cos(angle)*speed : (Math.random()-.5)*1.2,
      vy: isFloat ? Math.sin(angle)*speed : 0,
      drag:false, ox:0, oy:0, pvx:0, pvy:0,
      // gentle drift for float mode
      ax: isFloat ? (Math.random()-.5)*0.008 : 0,
      ay: isFloat ? (Math.random()-.5)*0.008 : 0,
    };
    bodies.push(b);

    if (isFloat) {
      // fade in
      let op = 0;
      const fadeIn = setInterval(() => {
        op += 0.05;
        el.style.opacity = Math.min(op, 1);
        if (op >= 1) clearInterval(fadeIn);
      }, 30);
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
      b.drag = false;
      cur.classList.remove('drag-cur');
      b.vx = b.pvx * (isFloat ? 0.5 : 0.7);
      b.vy = b.pvy * (isFloat ? 0.5 : 0.7);
    });
  });

  function tick() {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    bodies.forEach(b => {
      if (b.drag) { b.el.style.left=b.x+'px'; b.el.style.top=b.y+'px'; return; }
      if (isFloat) {
        // gentle random drift
        b.ax += (Math.random()-.5)*0.003;
        b.ay += (Math.random()-.5)*0.003;
        b.ax = Math.max(-0.012, Math.min(0.012, b.ax));
        b.ay = Math.max(-0.012, Math.min(0.012, b.ay));
        b.vx += b.ax; b.vy += b.ay;
        // soft speed cap
        const spd = Math.sqrt(b.vx*b.vx+b.vy*b.vy);
        if (spd > 0.9) { b.vx*=0.98; b.vy*=0.98; }
        b.x += b.vx; b.y += b.vy;
        // wrap edges
        if (b.x < -S)  b.x = W;
        if (b.x > W)   b.x = -S;
        if (b.y < -S)  b.y = H;
        if (b.y > H)   b.y = -S;
      } else {
        b.vy += G; b.vx *= FRIC;
        b.x  += b.vx; b.y += b.vy;
        if (b.y >= H-S) { b.y=H-S; b.vy*=-BOUNCE; b.vx*=0.88; if(Math.abs(b.vy)<0.5) b.vy=0; }
        if (b.x <= 0)   { b.x=0;   b.vx*=-BOUNCE; }
        if (b.x >= W-S) { b.x=W-S; b.vx*=-BOUNCE; }
      }
      b.el.style.left = b.x+'px';
      b.el.style.top  = b.y+'px';
    });
    requestAnimationFrame(tick);
  }
  tick();

  const total = isFloat ? 16 : 12;
  const delay = isFloat ? 150 : 350;
  let count = 0;
  function drop() {
    spawn(); count++;
    if (count < total) setTimeout(drop, (count < 4 ? 80 : delay) + Math.random() * (isFloat ? 150 : 300));
  }
  drop(); // start immediately


});
