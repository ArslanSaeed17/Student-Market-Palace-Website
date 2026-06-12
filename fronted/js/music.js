// ============================================================
// Student Market Palace — Floating Music Widget
// Glassmorphism + Glow + YouTube Style
// ============================================================

(function () {
'use strict';

// ---------------- CSS ----------------

const css = `

#smp-music-bar{

position:fixed;

left:20px;
bottom:100px;

z-index:99999;

display:flex;

align-items:center;

gap:14px;

width:300px;

padding:16px;

border-radius:24px;

background:
rgba(20,15,40,.72);

backdrop-filter:
blur(18px);

border:
1px solid rgba(168,85,247,.25);

box-shadow:
0 0 40px rgba(124,58,237,.35);

animation:
smpSlide .5s ease,
smpGlow 4s infinite;

font-family:
Inter,
sans-serif;

}

/* slide */

@keyframes smpSlide{

from{

opacity:0;

transform:
translateX(-40px);

}

to{

opacity:1;

transform:none;

}

}

/* glow */

@keyframes smpGlow{

50%{

box-shadow:
0 0 60px
rgba(168,85,247,.75);

}

}

/* icon */

.smp-note{

font-size:34px;

animation:
smpFloat 1.5s infinite;

flex-shrink:0;

}

@keyframes smpFloat{

50%{

transform:
translateY(-5px);

}

}

.smp-music-text{

display:flex;

flex-direction:column;

gap:5px;

}

/* title */

.smp-music-text strong{

color:white;

font-size:15px;

font-weight:800;

text-shadow:
0 0 14px
#a855f7;

}

/* subtitle */

.smp-music-text span{

color:
rgba(255,255,255,.7);

font-size:12px;

}

/* youtube button */

.smp-watch-btn{

margin-top:8px;

display:inline-flex;

align-items:center;

justify-content:center;

gap:8px;

padding:10px 16px;

background:

linear-gradient(
135deg,
#ff0000,
#ff4d4d
);

border-radius:999px;

color:white;

text-decoration:none;

font-size:13px;

font-weight:700;

transition:.25s;

box-shadow:
0 0 20px
rgba(255,0,0,.45);

}

.smp-watch-btn:hover{

transform:
scale(1.06);

box-shadow:
0 0 35px
rgba(255,0,0,.75);

}

/* close */

#smp-music-dismiss{

position:absolute;

top:10px;

right:10px;

width:28px;

height:28px;

border:none;

border-radius:50%;

background:
rgba(255,255,255,.08);

color:white;

cursor:pointer;

transition:.25s;

}

#smp-music-dismiss:hover{

transform:
rotate(90deg);

background:
rgba(255,255,255,.18);

}

/* mobile */

@media(max-width:700px){

#smp-music-bar{

left:10px;

right:10px;

width:auto;

bottom:85px;

}

}

`;

const style=document.createElement('style');

style.textContent=css;

document.head.appendChild(style);

// ---------------- HTML ----------------

const bar=document.createElement('div');

bar.id='smp-music-bar';

bar.innerHTML=`

<div class="smp-note">

🎵

</div>

<div class="smp-music-text">

<strong>

Need a break?

</strong>

<span>

Watch a song & enjoy 🎶

</span>

<a
class="smp-watch-btn"

href="https://www.youtube.com/watch?v=ldzV0DSm1KU"

target="_blank"

rel="noopener noreferrer">

▶ YouTube

</a>

</div>

<button
id="smp-music-dismiss">

✕

</button>

`;

document.body.appendChild(bar);

// ---------------- Close ----------------

document
.getElementById(
'smp-music-dismiss'
)

.addEventListener(
'click',

function(){

bar.style.transition=
'.35s';

bar.style.opacity='0';

bar.style.transform=
'translateX(-50px)';

setTimeout(
()=>bar.remove(),
350
);

}

);

})();
