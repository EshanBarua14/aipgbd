// Google Analytics 4 — loads dynamically, ID from config
let gaLoaded = false;

export function initGA(gaId) {
  if (!gaId || gaLoaded || typeof window === 'undefined') return;
  gaLoaded = true;
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', gaId, { send_page_view: false });
}

export function trackPage(path, title) {
  if (!window.gtag) return;
  window.gtag('event', 'page_view', { page_path: path, page_title: title });
}

export function trackEvent(action, category, label, value) {
  if (!window.gtag) return;
  window.gtag('event', action, { event_category: category, event_label: label, value });
}
