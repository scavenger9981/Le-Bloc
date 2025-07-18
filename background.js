// Shared 5-second wall-clock timer for all YouTube tabs
const LIMIT_MS = 5000;

let timerId   = null;
let elapsed   = 0;

// Broadcast a command to every open YouTube tab
function broadcast(cmd) {
  chrome.tabs.query({ url: '*://*.youtube.com/*' }, tabs =>
    tabs.forEach(t => chrome.tabs.sendMessage(t.id, { cmd }).catch(() => {}))
  );
}

function resetTimer() {
  elapsed = 0;
  if (timerId) clearInterval(timerId), timerId = null;
  chrome.storage.local.set({ expired: false });
  broadcast('hideGate');
  startTimer();   // immediately begin the next 5-second cycle
}

function startTimer() {
  if (timerId) return;          // already running
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

// initial run
chrome.runtime.onStartup.addListener(resetTimer);
chrome.runtime.onInstalled.addListener(resetTimer);

chrome.runtime.onMessage.addListener(msg => {
  if (msg.cmd === 'reset') resetTimer();
});