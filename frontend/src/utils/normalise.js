// Normalise APOD response data.

export function normaliseApodData(data) {
  if (!data) return null;
  
  return {
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
    media_type: data.media_type || 'image',
    url: data.url || data.thumbnail_url || '',
    explanation: data.explanation || 'No description available',
    copyright: data.copyright || null,
    hdurl: data.hdurl || null,
  };
}

// Normalise NASA image search response data.

export function normaliseImageSearch(data) {
  if (!data || !data.collection || !data.collection.items) {
    return { items: [], resultCount: 0, totalPages: 0, currentPage: 1 };
  }
  
  const metadata = data.collection.metadata || {};
  const links = data.collection.links || [];
  
  return {
    items: data.collection.items.map(item => ({
      nasa_id: item.data?.[0]?.nasa_id,
      title: item.data?.[0]?.title || 'Untitled',
      description: item.data?.[0]?.description || '',
      media_type: item.data?.[0]?.media_type || 'unknown',
      center: item.data?.[0]?.center || 'NASA',
      keywords: item.data?.[0]?.keywords || [],
      thumbnail: item.links?.[0]?.href || '',
      date_created: item.data?.[0]?.date_created || null,
    })) || [],
    resultCount: metadata.total_hits || 0,
    totalPages: Math.ceil((metadata.total_hits || 0) / 20), // Assuming page_size=20
    currentPage: parseInt(links.find(link => link.rel === 'self')?.href?.split('page=')[1]?.split('&')[0] || '1'),
  };
}

// Normalise asset files response

export function normaliseAssetFiles(data) {
  if (!data || !data.collection || !data.collection.items) {
    return { items: [] };
  }
  
  return {
    items: data.collection.items.map(item => ({
      href: item.href,
      rel: item.rel,
      title: item.title || '',
    })) || [],
  };
}

export default {
  normaliseApodData,
  normaliseImageSearch,
  normaliseAssetFiles,
};
