const runtimeBaseUrl = globalThis.__APP_API_BASE_URL__ || process.env.VITE_API_BASE_URL || '';
const rawBaseUrl = String(runtimeBaseUrl).trim();
const baseUrl = rawBaseUrl.replace(/\/+$/, '');

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

export default buildApiUrl;