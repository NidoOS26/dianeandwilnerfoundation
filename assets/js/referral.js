(() => {
  const textLink = document.querySelector('[data-share-text]');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (textLink && isIOS) {
    textLink.href = textLink.getAttribute('href').replace('sms:?body=', 'sms:&body=');
  }
})();
