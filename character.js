// ── 角色数据库 ──────────────────────────────
// 在这里填入所有角色资料，之后只需改这个文件
const CHARACTERS = {
  'char-a': {
    name:   '角色 A',
    en:     'Character A',
    world:  '黑白灰',
    bg:     '#dbd8d2',
    age:    '—',
    height: '—',
    role:   '—',
    tags:   ['待填入', '待填入', '待填入'],
    bio:    '角色简介待填入。可以写性格、背景、故事起点……',
    images: [], // 填图片路径，如 'assets/images/char-a-1.jpg'
  },
  'char-b': {
    name:   '角色 B',
    en:     'Character B',
    world:  '蓝绿',
    bg:     '#cfdce0',
    age:    '—',
    height: '—',
    role:   '—',
    tags:   ['待填入', '待填入'],
    bio:    '角色简介待填入。',
    images: [],
  },
  'char-c': {
    name:   '角色 C',
    en:     'Character C',
    world:  '天国列车',
    bg:     '#dedad2',
    age:    '—',
    height: '—',
    role:   '—',
    tags:   ['待填入'],
    bio:    '角色简介待填入。',
    images: [],
  },
  'char-d': {
    name:   '角色 D',
    en:     'Character D',
    world:  'BIBI',
    bg:     '#d5d0e0',
    age:    '—',
    height: '—',
    role:   '—',
    tags:   ['待填入'],
    bio:    '角色简介待填入。',
    images: [],
  },
  'char-e': {
    name:   '角色 E',
    en:     'Character E',
    world:  '赤色',
    bg:     '#e0d4d2',
    age:    '—',
    height: '—',
    role:   '—',
    tags:   ['待填入'],
    bio:    '角色简介待填入。',
    images: [],
  },
  'char-f': {
    name:   '角色 F',
    en:     'Character F',
    world:  '黑白灰',
    bg:     '#dbd8d2',
    age:    '—', height: '—', role: '—',
    tags:   ['待填入'], bio: '角色简介待填入。', images: [],
  },
  'char-g': {
    name:   '角色 G',
    en:     'Character G',
    world:  '蓝绿',
    bg:     '#cfdce0',
    age:    '—', height: '—', role: '—',
    tags:   ['待填入'], bio: '角色简介待填入。', images: [],
  },
  'char-h': {
    name:   '角色 H',
    en:     'Character H',
    world:  '天国列车',
    bg:     '#dedad2',
    age:    '—', height: '—', role: '—',
    tags:   ['待填入'], bio: '角色简介待填入。', images: [],
  },
  'char-i': {
    name:   '角色 I',
    en:     'Character I',
    world:  'BIBI',
    bg:     '#d5d0e0',
    age:    '—', height: '—', role: '—',
    tags:   ['待填入'], bio: '角色简介待填入。', images: [],
  },
  'char-j': {
    name:   '角色 J',
    en:     'Character J',
    world:  '赤色',
    bg:     '#e0d4d2',
    age:    '—', height: '—', role: '—',
    tags:   ['待填入'], bio: '角色简介待填入。', images: [],
  },
};

// ── 读取 URL 参数 & 渲染 ────────────────────
const params = new URLSearchParams(window.location.search);
const id     = params.get('id') || 'char-a';
const char   = CHARACTERS[id];

if (char) {
  document.title = char.name + ' — OC WORLDS';
  document.getElementById('charName').textContent  = char.name;
  document.getElementById('charEn').textContent    = char.en;
  document.getElementById('charWorld').textContent = char.world;
  document.getElementById('statAge').textContent    = char.age;
  document.getElementById('statHeight').textContent = char.height;
  document.getElementById('statRole').textContent   = char.role;
  document.getElementById('bio').textContent        = char.bio;

  // portrait bg
  document.getElementById('portraitImg').style.background = char.bg;

  // tags
  const tagsEl = document.getElementById('tags');
  char.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    tagsEl.appendChild(span);
  });

  // gallery
  const galleryEl = document.getElementById('gallery');
  const imgIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;
  const count = char.images.length || 3;
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'gallery-thumb';
    if (char.images[i]) {
      div.innerHTML = `<img src="${char.images[i]}" alt=""/>`;
    } else {
      div.innerHTML = imgIcon;
    }
    galleryEl.appendChild(div);
  }
}

// ── main.js の card click は character.html?id=xxx に飛ぶ ──
// (main.js 側で url を character.html?id=char-a にする)

// cursor
const cur = document.getElementById('cur');
let cx = 0, cy = 0;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
(function loop(){ cur.style.left = cx+'px'; cur.style.top = cy+'px'; requestAnimationFrame(loop); })();
