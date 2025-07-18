const keys = ['youtube', 'instagram', 'tiktok'];

function loadSettings() {
  chrome.storage.local.get(keys, (data) => {
    keys.forEach(k => {
      document.getElementById(k).checked = data[k] ?? true;
    });
  });
}

function saveSettings() {
  const updated = {};
  keys.forEach(k => {
    updated[k] = document.getElementById(k).checked;
  });
  chrome.storage.local.set(updated);
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  keys.forEach(k => {
    document.getElementById(k).addEventListener('change', saveSettings);
  });
});
