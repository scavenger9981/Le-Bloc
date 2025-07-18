const keys = ['youtube', 'instagram', 'tiktok'];

function loadSettings() {
  chrome.storage.local.get(keys, (data) => {
    keys.forEach(k => {
      document.getElementById(k).checked = data[k] ?? true;
    });
  });
}

function refreshMatchingTabs() {
  const patterns = {
    youtube: '*://*.youtube.com/*',
    instagram: '*://*.instagram.com/*',
    tiktok: '*://*.tiktok.com/*'
  };

  keys.forEach(key => {
    if (document.getElementById(key).checked !== undefined) {
      chrome.tabs.query({ url: patterns[key] }, (tabs) => {
        for (const tab of tabs) {
          chrome.tabs.reload(tab.id);
        }
      });
    }
  });
}

function saveSettings() {
  const updated = {};
  keys.forEach(k => {
    updated[k] = document.getElementById(k).checked;
  });
  chrome.storage.local.set(updated, () => {
    refreshMatchingTabs();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  keys.forEach(k => {
    document.getElementById(k).addEventListener('change', saveSettings);
  });
});
