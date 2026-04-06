export const ARTEMIS_II_LIVE_WATCH_URL = 'https://www.youtube.com/watch?v=z-j1uxBmis0';

export function extractYouTubeVideoId(url) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim();
      return id || null;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) {
        return id;
      }

      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const embedIndex = pathParts.indexOf('embed');
      if (embedIndex >= 0 && pathParts[embedIndex + 1]) {
        return pathParts[embedIndex + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function buildYouTubeEmbedUrl(videoId) {
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`;
}

export const ARTEMIS_II_LIVE_VIDEO_ID = extractYouTubeVideoId(ARTEMIS_II_LIVE_WATCH_URL);
export const ARTEMIS_II_LIVE_EMBED_URL = buildYouTubeEmbedUrl(ARTEMIS_II_LIVE_VIDEO_ID);
