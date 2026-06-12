// ============================================================
//  Student Market Palace — Music Banner  v2.0
//  music.js — Bored? We have a song for you!
// ============================================================
(function () {
  'use strict';

  const css = `
    #smp-music-bar {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 2147483640 !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 20px;
      background: linear-gradient(90deg, #1e0a3c, #3b0764, #1e0a3c);
      background-size: 200% auto;
      border-bottom: 1px solid rgba(168,85,247,0.3);
      box-shadow: 0 2px 20px rgba(124,58,237,0.4);
      animation: smp-bar-slide 0.5s ease, smp-bar-bg 4s linear infinite;
      font-family: sans-serif;
    }

    @keyframes smp-bar-slide {
      from { transform: translateY(-100%); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }

    @keyframes smp-bar-bg {
      0%   { background-position: 0% center; }
      100% { background-position: 200% center; }
    }

    #smp-music-bar .smp-music-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }

    #smp-music-bar .smp-note {
      font-size: 22px;
      animation: smp-note-dance 0.8s ease-in-out infinite alternate;
      flex-shrink: 0;
    }

    @keyframes smp-note-dance {
      from { transform: rotate(-15deg) scale(1); }
      to   { transform: rotate(15deg) scale(1.2); }
    }

    #smp-music-bar .smp-music-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    #smp-music-bar .smp-music-text strong {
      color: white;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #smp-music-bar .smp-music-text span {
      color: rgba(255,255,255,0.5);
      font-size: 11px;
    }

    #smp-music-bar .smp-music-wave {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 20px;
      flex-shrink: 0;
    }

    .smp-bar-wave {
      width: 3px;
      border-radius: 3px;
      background: linear-gradient(to top, #7c3aed, #a855f7);
      animation: smp-wave-bar 0.8s ease-in-out infinite alternate;
    }

    .smp-bar-wave:nth-child(1) { height: 8px;  animation-delay: 0.0s; }
    .smp-bar-wave:nth-child(2) { height: 14px; animation-delay: 0.1s; }
    .smp-bar-wave:nth-child(3) { height: 20px; animation-delay: 0.2s; }
    .smp-bar-wave:nth-child(4) { height: 12px; animation-delay: 0.3s; }
    .smp-bar-wave:nth-child(5) { height: 18px; animation-delay: 0.4s; }
    .smp-bar-wave:nth-child(6) { height: 8px;  animation-delay: 0.5s; }

    @keyframes smp-wave-bar {
      from { transform: scaleY(0.4); opacity: 0.6; }
      to   { transform: scaleY(1);   opacity: 1; }
    }

    #smp-music-bar .smp-watch-btn {
      padding: 7px 16px;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: white;
      text-decoration: none;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      flex-shrink: 0;
      transition: all 0.2s;
      box-shadow: 0 3px 14px rgba(124,58,237,0.5);
      border: 1px solid rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    #smp-music-bar .smp-watch-btn:hover {
      transform: scale(1.06);
      box-shadow: 0 5px 20px rgba(168,85,247,0.7);
      background: linear-gradient(135deg, #6d28d9, #9333ea);
    }

    #smp-music-dismiss {
      background: none;
      border: none;
      color: rgba(255,255,255,0.4);
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      flex-shrink: 0;
      transition: all 0.2s;
      line-height: 1;
    }

    #smp-music-dismiss:hover {
      color: rgba(255,255,255,0.9);
      transform: rotate(90deg);
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const bar = document.createElement('div');
  bar.id = 'smp-music-bar';
  bar.innerHTML = `
    <div class="smp-music-left">
      <div class="smp-note">🎵</div>
      <div class="smp-music-text">
        <strong>Bored ho? Don't worry — we have a song for you!</strong>
        <span>Click to watch &amp; enjoy 🎶</span>
      </div>
    </div>
    <div class="smp-music-wave">
      <div class="smp-bar-wave"></div>
      <div class="smp-bar-wave"></div>
      <div class="smp-bar-wave"></div>
      <div class="smp-bar-wave"></div>
      <div class="smp-bar-wave"></div>
      <div class="smp-bar-wave"></div>
    </div>
    <a class="smp-watch-btn"
       href="https://www.youtube.com/watch?v=ldzV0DSm1KU&list=RDldzV0DSm1KU&start_radio=1"
       target="_blank"
       rel="noopener noreferrer">
      ▶ Watch Now
    </a>
    <button id="smp-music-dismiss" title="Dismiss">✕</button>
  `;

  // Insert at top of body
  document.body.insertBefore(bar, document.body.firstChild);

  document.getElementById('smp-music-dismiss').addEventListener('click', function () {
    bar.style.transition = 'opacity 0.3s, transform 0.3s';
    bar.style.opacity    = '0';
    bar.style.transform  = 'translateY(-100%)';
    setTimeout(function () { bar.remove(); }, 350);
  });

})();
