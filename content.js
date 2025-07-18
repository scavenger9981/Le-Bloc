// Each YouTube tab listens for global gate commands
let overlay = null;

function buildGate() {
  if (overlay) return;

  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const answer = a + b;

  overlay = document.createElement('div');
  overlay.id = 'ytSharedGate';
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    font: '20px/1.5 "Segoe UI", sans-serif',
    zIndex: 2147483647,
    padding: '20px',
    textAlign: 'center',
    backdropFilter: 'blur(4px)',
    opacity: '0',
    transition: 'opacity 0.5s ease'
  });

  overlay.innerHTML = `
    <div style="font-size:32px; font-weight:600; margin-bottom:16px;">⏱ Time's Up!</div>
    <div style="margin-bottom:12px;">Solve this to unlock all sites:</div>
    <div style="margin:12px 0; font-size:28px;">${a} + ${b} = ?</div>
    <input id="ytAns" type="number" placeholder="Answer"
           style="font-size:24px; padding:8px 12px; border:2px solid #ccc; border-radius:8px; text-align:center; width:120px; outline:none;">
    <button id="ytBtn"
            style="margin-top:16px; background:#00b894; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:20px; cursor:pointer;">
      ✅ Submit
    </button>
    <div id="ytErr"
         style="margin-top:12px; color:#d63031; height:24px; font-weight:bold;"></div>
  `;

  (document.documentElement || document.body).appendChild(overlay);
  requestAnimationFrame(() => { overlay.style.opacity = '1'; });

  const inp = overlay.querySelector('#ytAns');
  const btn = overlay.querySelector('#ytBtn');
  const err = overlay.querySelector('#ytErr');

  function check() {
    if (Number(inp.value.trim()) === answer) {
      overlay.remove();
      overlay = null;
      chrome.runtime.sendMessage({ cmd: 'reset' });
    } else {
      err.textContent = '❌ Try again!';
      inp.select();
    }
  }

  btn.addEventListener('click', check);
  inp.addEventListener('keydown', e => e.key === 'Enter' && check());
  inp.focus();
}


function hideGate() {
  if (overlay) overlay.remove(), overlay = null;
}

// Listen for background commands
chrome.runtime.onMessage.addListener(msg => {
  if (msg.cmd === 'showGate') buildGate();
  if (msg.cmd === 'hideGate') hideGate();
});

// If the tab was opened while the timer had already expired
try {
  chrome.storage.local.get('expired', ({ expired } = {}) => {
    if (expired) buildGate();
  });
} catch (_) {
  /* extension context invalidated — ignore */
}