const LIMIT_MS = 5000;
let timerId = null;
let elapsed = 0;

function broadcast(cmd) {
  chrome.tabs.query({
    url: [
      '*://*.youtube.com/*',
      '*://*.instagram.com/*',
      '*://*.tiktok.com/*'
    ]
  }, tabs =>
    tabs.forEach(t => chrome.tabs.sendMessage(t.id, { cmd }).catch(() => {}))
  );
}

function resetTimer() {
  elapsed = 0;
  if (timerId) clearInterval(timerId), timerId = null;
  chrome.storage.local.set({ expired: false });
  broadcast('hideGate');
  startTimer();
}

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    elapsed += 100;
    if (elapsed >= LIMIT_MS) {
      clearInterval(timerId);
      timerId = null;
      chrome.storage.local.set({ expired: true });
      broadcast('showGate');
    }
  }, 100);
}

chrome.runtime.onStartup.addListener(resetTimer);
chrome.runtime.onInstalled.addListener(resetTimer);

chrome.runtime.onMessage.addListener(msg => {
  if (msg.cmd === 'reset') resetTimer();
});
