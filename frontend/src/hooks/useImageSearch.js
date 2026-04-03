import { useState, useCallback, useEffect, useRef } from 'react';
import { normaliseImageSearch, normaliseAssetFiles } from '../utils/normalise';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheSet, cacheKey, TTL } from '../utils/cache';

export function useImageSearch(initialQuery = 'moon') {
  const PAGE_SIZE = 6;
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetFiles, setAssetFiles] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const latestAssetRequestIdRef = useRef(0);

  const searchMedia = useCallback(async (searchQuery = query, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const key = cacheKey('search', { q: searchQuery, page, page_size: PAGE_SIZE });
      const cached = cacheGet(key);
      if (cached) {
        setResults(cached.items);
        setTotalResults(cached.resultCount);
        setTotalPages(Math.ceil(cached.resultCount / PAGE_SIZE));
        setCurrentPage(page);
        setLoading(false);
        return;
      }

      const response = await fetch(buildApiUrl(`/api/images/search?q=${searchQuery}&page=${page}&page_size=${PAGE_SIZE}`));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const normalized = normaliseImageSearch(data);
      cacheSet(key, normalized, TTL.IMAGE_SEARCH);
      setResults(normalized.items);
      setTotalResults(normalized.resultCount);
      setTotalPages(Math.ceil(normalized.resultCount / PAGE_SIZE));
      setCurrentPage(page);
    } catch {
      setError('Failed to search NASA media library');
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadAsset = useCallback(async (nasa_id) => {
    latestAssetRequestIdRef.current += 1;
    const requestId = latestAssetRequestIdRef.current;

    setSelectedAsset(nasa_id);
    setAssetFiles([]);
    setMetadata(null);

    const assetKey = cacheKey('asset', { id: nasa_id });
    const cachedAsset = cacheGet(assetKey);
    if (cachedAsset) {
      if (requestId === latestAssetRequestIdRef.current) {
        setAssetFiles(cachedAsset);
      }
    } else {
      try {
        const assetRes = await fetch(buildApiUrl(`/api/images/asset?nasa_id=${nasa_id}`));
        if (!assetRes.ok) {
          throw new Error(`HTTP error! status: ${assetRes.status}`);
        }
        const assetData = await assetRes.json();
        const normalized = normaliseAssetFiles(assetData);
        cacheSet(assetKey, normalized.items, TTL.ASSET);
        if (requestId === latestAssetRequestIdRef.current) {
          setAssetFiles(normalized.items);
        }
      } catch {
        console.error('Error loading asset files');
      }
    }

    const metaKey = cacheKey('metadata', { id: nasa_id });
    const cachedMeta = cacheGet(metaKey);
    if (cachedMeta) {
      if (requestId === latestAssetRequestIdRef.current) {
        setMetadata(cachedMeta);
      }
    } else {
      try {
        const metaRes = await fetch(buildApiUrl(`/api/images/metadata?nasa_id=${nasa_id}`));
        if (!metaRes.ok) {
          throw new Error(`HTTP error! status: ${metaRes.status}`);
        }
        const metaData = await metaRes.json();
        cacheSet(metaKey, metaData, TTL.METADATA);
        if (requestId === latestAssetRequestIdRef.current) {
          setMetadata(metaData);
        }
      } catch {
        console.error('Error loading asset metadata');
      }
    }
  }, []);

  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    searchMedia(query, 1);
  }, [query, searchMedia]);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      searchMedia(query, page);
    }
  }, [query, searchMedia, totalPages]);

  useEffect(() => {
    searchMedia(initialQuery);
  }, [searchMedia, initialQuery]);

  return {
    query,
    results,
    loading,
    selectedAsset,
    assetFiles,
    metadata,
    error,
    handleQueryChange,
    handleSubmit,
    loadAsset,
    searchMedia,
    currentPage,
    totalPages,
    totalResults,
    handlePageChange,
  };
}

export default useImageSearch;
