export const TABS = [
  { id: 'nasa-media', label: 'NASA MEDIA' },
  { id: 'live', label: 'LIVE' },
];

export const TAB_ROUTES = {
  'nasa-media': '/nasa-media',
  live: '/live',
};

export const TAB_ROUTE_CONFIG = TABS.map((tab) => ({
  tabId: tab.id,
  path: TAB_ROUTES[tab.id],
}));

export function resolveInitialTab(tabId) {
  return TABS.some((tab) => tab.id === tabId) ? tabId : 'nasa-media';
}

export function getRouteForTab(tabId) {
  return TAB_ROUTES[tabId] || '/media';
}
