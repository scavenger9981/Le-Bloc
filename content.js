// Each YouTube tab listens for global gate commands
let overlay = null;

function buildGate() {
  if (overlay) return;          // already shown
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const answer = a + b;

  overlay = document.createElement('div');
  overlay.id = 'ytSharedGate';
  Object.assign(overlay.style, {
    position: 'fixed', inset: 0, background: '#111', color: '#eee',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', font: '24px/1.4 system-ui, sans-serif',
    zIndex: 2147483647
  });
  overlay.innerHTML = `
    <div>Global 5-second limit reached!</div>
    <div style="margin:12px 0">${a} + ${b} = ?</div>
    <input id="ytAns" type="number" placeholder="Answer"
           style="font-size:24px;width:100px;text-align:center">
    <button id="ytBtn" style="margin-top:12px;font-size:20px">Submit</button>
    <div id="ytErr" style="margin-top:8px;color:#ff6b6b;height:24px"></div>
  `;
  (document.documentElement || document.body).appendChild(overlay);

  const inp = overlay.querySelector('#ytAns');
  const btn = overlay.querySelector('#ytBtn');
  const err = overlay.querySelector('#ytErr');

  function check() {
    if (Number(inp.value.trim()) === answer) {
      overlay.remove();
      overlay = null;
      chrome.runtime.sendMessage({ cmd: 'reset' });
    } else {
      err.textContent = 'Try again';
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