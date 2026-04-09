const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const baseUrl = rawBaseUrl.replace(/\/+$/, '');

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

export default buildApiUrl;