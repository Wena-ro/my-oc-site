<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OC WORLDS</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400&family=Noto+Serif+SC:wght@300;400;700&family=Space+Mono&display=swap" rel="stylesheet"/>
  <style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;overflow:hidden;cursor:none;background:#fff;font-family:'Noto Serif SC',serif;color:#111}
  .cursor{position:fixed;pointer-events:none;z-index:9999;width:11px;height:11px;border:1.5px solid #333;border-radius:50%;transform:translate(-50%,-50%);transition:width .18s,height .18s}
  .cursor.hover{width:19px;height:19px;border-color:#888}
  .back{position:fixed;top:20px;left:24px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.2em;color:#bbb;text-decoration:none;z-index:100}
  .back:hover{color:#555}

  /* physics canvas — fullscreen behind everything */
  #physCanvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none}

  /* mouse layer for Matter.js dragging */
  #mouseLayer{position:fixed;top:0;left:0;width:100%;height:100%;z-index:3}

  /* emoji labels */
  #labels{position:fixed;top:0;left:0;pointer-events:none;z-index:2}
  .label{position:absolute;font-size:26px;transform:translate(-50%,-50%);pointer-events:none;line-height:1}

  /* character content — above physics */
  .content{position:fixed;top:0;left:0;width:100%;height:100%;z-index:4;pointer-events:none}

  .illust{
    position:absolute;left:50%;top:50%;
    transform:translate(-50%,-50%);
    width:200px;height:75vh;
    border-radius:12px;
    display:flex;align-items:center;justify-content:center;
    overflow:hidden;pointer-events:none;
  }
  .illust img{width:100%;height:100%;object-fit:cover;object-position:top}
  .illust svg{opacity:.18}

  .profile{
    position:absolute;left:50%;top:50%;
    transform:translate(130px,-50%);
    width:210px;pointer-events:none;
  }
  .pl{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.22em;color:#bbb;border-bottom:1.5px solid #111;padding-bottom:8px;margin-bottom:16px}
  .wt{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;color:#bbb;margin-bottom:3px}
  .cn{font-size:28px;font-weight:700;line-height:1;margin-bottom:3px}
  .ce{font-family:'Playfair Display',serif;font-style:italic;font-size:13px;color:#aaa;margin-bottom:18px}
  .row{display:grid;grid-template-columns:60px 1fr;padding:9px 0;border-bottom:0.5px solid #e8e8e8;align-items:baseline}
  .rl{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.1em;color:#bbb}
  .rv{font-size:14px;font-weight:700}
  .rv.s{font-size:12px;font-weight:400;color:#777;line-height:1.8}
  </style>
</head>
<body>
  <div class="cursor" id="cur"></div>
  <a class="back" href="index.html" style="pointer-events:all;z-index:10;position:fixed">← index</a>

  <canvas id="physCanvas"></canvas>
  <div id="labels"></div>
  <div id="mouseLayer"></div>

  <div class="content">
    <div class="illust" id="illust">
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width=".8"><circle cx="12" cy="7" r="5"/><path d="M2 22c0-6 4.5-10 10-10s10 4 10 10"/></svg>
    </div>
    <div class="profile">
      <div class="pl">PROFILE</div>
      <div class="wt" id="charWorld"></div>
      <div class="cn" id="charName"></div>
      <div class="ce" id="charEn"></div>
      <div class="row"><span class="rl">年龄</span><span class="rv" id="statAge"></span></div>
      <div class="row"><span class="rl">身高</span><span class="rv" id="statHeight"></span></div>
      <div class="row"><span class="rl">生日</span><span class="rv" id="statBirth"></span></div>
      <div class="row"><span class="rl">性别</span><span class="rv" id="statGender"></span></div>
      <div class="row"><span class="rl">关键词</span><span class="rv s" id="statTags"></span></div>
      <div class="row"><span class="rl">简介</span><span class="rv s" id="bio"></span></div>
    </div>
  </div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
<script>
// ── cursor ──────────────────────────────────────
var cur=document.getElementById('cur');
var cx=0,cy=0;
document.addEventListener('mousemove',function(e){cx=e.clientX;cy=e.clientY;});
(function loop(){cur.style.left=cx+'px';cur.style.top=cy+'px';requestAnimationFrame(loop);})();

// ── character data ───────────────────────────────
var CHARS={
  'char-a':{name:'角色 A',en:'Character A',world:'黑白灰',bg:'#dbd8d2',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入 · 待填入',bio:'角色简介待填入。',float:false,items:['🗡️','🩶','🌫️','🕯️','📌','🪡','🧷','⛓️','🖤','🪦']},
  'char-b':{name:'角色 B',en:'Character B',world:'蓝绿',bg:'#cfdce0',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入 · 待填入',bio:'角色简介待填入。',float:false,items:['🌊','🐟','☔','🧃','🌿','💙','🫧','🎐','🍃','🌱']},
  'char-c':{name:'角色 C',en:'Character C',world:'天国列车',bg:'#dedad2',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入 · 待填入',bio:'角色简介待填入。',float:false,items:['🪶','✨','🕊️','☁️','🌙','⭐','🪄','🔔','🌸','💫']},
  'char-d':{name:'角色 D',en:'Character D',world:'BIBI',bg:'#d5d0e0',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入 · 待填入',bio:'角色简介待填入。',float:true,items:['🪐','🌌','👾','🍬','📻','🎀','💜','🌠','🛸','🍭']},
  'char-e':{name:'角色 E',en:'Character E',world:'赤色',bg:'#e0d4d2',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入 · 待填入',bio:'角色简介待填入。',float:false,items:['🌹','🧧','🎋','🪷','🍂','🫀','🏮','🎴','🌺','♦️']},
  'char-f':{name:'角色 F',en:'Character F',world:'黑白灰',bg:'#dbd8d2',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',float:false,items:['🗡️','🩶','🌫️','🕯️','📌','🪡','🧷','⛓️','🖤','🪦']},
  'char-g':{name:'角色 G',en:'Character G',world:'蓝绿',bg:'#cfdce0',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',float:false,items:['🌊','🐟','☔','🧃','🌿','💙','🫧','🎐','🍃','🌱']},
  'char-h':{name:'角色 H',en:'Character H',world:'天国列车',bg:'#dedad2',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',float:false,items:['🪶','✨','🕊️','☁️','🌙','⭐','🪄','🔔','🌸','💫']},
  'char-i':{name:'角色 I',en:'Character I',world:'BIBI',bg:'#d5d0e0',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',float:true,items:['🪐','🌌','👾','🍬','📻','🎀','💜','🌠','🛸','🍭']},
  'char-j':{name:'角色 J',en:'Character J',world:'赤色',bg:'#e0d4d2',image:'',age:'—',height:'—',birth:'—',gender:'—',tags:'待填入',bio:'角色简介待填入。',float:false,items:['🌹','🧧','🎋','🪷','🍂','🫀','🏮','🎴','🌺','♦️']}
};

var id=(new URLSearchParams(window.location.search)).get('id')||'char-a';
var char=CHARS[id]||CHARS['char-a'];

document.title=char.name+' — OC WORLDS';
document.getElementById('charWorld').textContent=char.world;
document.getElementById('charName').textContent=char.name;
document.getElementById('charEn').textContent=char.en;
document.getElementById('statAge').textContent=char.age;
document.getElementById('statHeight').textContent=char.height;
document.getElementById('statBirth').textContent=char.birth;
document.getElementById('statGender').textContent=char.gender;
document.getElementById('statTags').textContent=char.tags;
document.getElementById('bio').textContent=char.bio;
var illust=document.getElementById('illust');
illust.style.background=char.bg;
if(char.image) illust.innerHTML='<img src="'+char.image+'" alt="'+char.name+'">';

// ── Matter.js physics ────────────────────────────
var W=window.innerWidth, H=window.innerHeight;
var canvas=document.getElementById('physCanvas');
canvas.width=W; canvas.height=H;
var ctx=canvas.getContext('2d');

var Engine=Matter.Engine,Bodies=Matter.Bodies,Body=Matter.Body;
var World=Matter.World,Events=Matter.Events;
var Mouse=Matter.Mouse,MouseConstraint=Matter.MouseConstraint;

var engine=Engine.create({gravity:{x:0,y:char.float?0:1.2}});
var world=engine.world;

// static walls
var floor=Bodies.rectangle(W/2,H+25,W,50,{isStatic:true,friction:0.8,restitution:0.1});
var wallL=Bodies.rectangle(-25,H/2,50,H,{isStatic:true,friction:0.5});
var wallR=Bodies.rectangle(W+25,H/2,50,H,{isStatic:true,friction:0.5});
var ceil =Bodies.rectangle(W/2,-25,W,50,{isStatic:true});
World.add(world,[floor,wallL,wallR,ceil]);

var labelMap={};
var objBodies=[];
var labelsEl=document.getElementById('labels');

function addObj(){
  var cx2=W/2, gap=130, s=52, x, y;
  if(char.float){
    x=gap+Math.random()*(W-gap*2-s);
    y=50+Math.random()*(H-100-s);
  } else {
    if(Math.random()<0.5) x=20+Math.random()*Math.max(10,cx2-gap-s);
    else x=(cx2+gap)+Math.random()*Math.max(10,W-cx2-gap-s);
    x=Math.max(20,Math.min(W-20-s,x));
    y=-70;
  }

  var b=Bodies.rectangle(x+s/2,y+s/2,s,s,{
    friction:0.7,
    frictionAir:char.float?0.005:0.008,
    restitution:0.15,
    density:0.002,
  });

  if(char.float){
    var ang=Math.random()*Math.PI*2;
    var spd=0.4+Math.random()*0.3;
    Body.setVelocity(b,{x:Math.cos(ang)*spd,y:Math.sin(ang)*spd});
  }

  World.add(world,b);
  objBodies.push(b);

  var el=document.createElement('div');
  el.className='label';
  el.textContent=char.items[objBodies.length%char.items.length];
  labelsEl.appendChild(el);
  labelMap[b.id]=el;
}

// mouse drag — attach to mouseLayer so it doesn't block UI
var mouse=Mouse.create(document.getElementById('mouseLayer'));
mouse.pixelRatio=window.devicePixelRatio||1;
var mc=MouseConstraint.create(engine,{
  mouse:mouse,
  constraint:{stiffness:0.15,damping:0.1,render:{visible:false}}
});
World.add(world,mc);

// for float mode — keep objects in bounds by bouncing off walls naturally
// (walls already handle this)

function renderLoop(){
  Engine.update(engine,1000/60);
  ctx.clearRect(0,0,W,H);

  objBodies.forEach(function(b){
    var pos=b.position, angle=b.angle, s=26;
    ctx.save();
    ctx.translate(pos.x,pos.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.roundRect(-s,-s,s*2,s*2,10);
    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.fill();
    ctx.strokeStyle='#e0e0e0';
    ctx.lineWidth=1;
    ctx.stroke();
    ctx.restore();

    var el=labelMap[b.id];
    if(el){
      el.style.left=pos.x+'px';
      el.style.top=pos.y+'px';
      el.style.transform='translate(-50%,-50%) rotate('+angle+'rad)';
    }
  });

  requestAnimationFrame(renderLoop);
}
renderLoop();

var total=char.float?8:12, count=0;
function drop(){
  addObj(); count++;
  if(count<total){
    var delay=count<4?120:(char.float?350:280);
    setTimeout(drop,delay+Math.random()*200);
  }
}
requestAnimationFrame(function(){requestAnimationFrame(drop);});
</script>
</body>
</html>
