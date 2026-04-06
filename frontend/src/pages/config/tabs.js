export const TABS = [
  { id: 'apod', label: 'APOD' },
  { id: 'nasa-media', label: 'NASA MEDIA' },
  { id: 'neo', label: 'NEO' },
  { id: 'mars', label: 'MARS' },
  { id: 'live', label: 'LIVE' },
];

export const TAB_ROUTES = {
  apod: '/apod',
  'nasa-media': '/nasa-media',
  neo: '/neo',
  mars: '/mars',
  live: '/live',
};

export function resolveInitialTab(tabId) {
  return TABS.some((tab) => tab.id === tabId) ? tabId : 'apod';
}

export function getRouteForTab(tabId) {
  return TAB_ROUTES[tabId] || '/apod';
}
