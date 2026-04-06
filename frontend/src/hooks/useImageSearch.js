import { useState, useCallback, useEffect, useRef } from 'react';
import { normaliseImageSearch, normaliseAssetFiles } from '../utils/normalise';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheSet, cacheKey, TTL } from '../utils/cache';

export function useImageSearch(initialQuery = 'moon') {
  const PAGE_SIZE = 8;
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
  const latestSearchRequestIdRef = useRef(0);
  const searchAbortControllerRef = useRef(null);
  const assetAbortControllerRef = useRef(null);
  const metadataAbortControllerRef = useRef(null);

  const searchMedia = useCallback(async (searchQuery, page = 1) => {
    const effectiveQuery = (searchQuery ?? '').trim();
    if (!effectiveQuery) {
      setError('Please enter a search query');
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
      setCurrentPage(1);
      return;
    }

    latestSearchRequestIdRef.current += 1;
    const requestId = latestSearchRequestIdRef.current;

    setLoading(true);
    setError(null);
    try {
      const key = cacheKey('search', { q: effectiveQuery, page, page_size: PAGE_SIZE });
      const cached = cacheGet(key);
      if (cached) {
        if (requestId !== latestSearchRequestIdRef.current) {
          return;
        }

        setResults(cached.items);
        setTotalResults(cached.resultCount);
        setTotalPages(Math.ceil(cached.resultCount / PAGE_SIZE));
        setCurrentPage(page);
        return;
      }

      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }

      const controller = new AbortController();
      searchAbortControllerRef.current = controller;

      const response = await fetch(
        buildApiUrl(`/api/images/search?q=${effectiveQuery}&page=${page}&page_size=${PAGE_SIZE}`),
        { signal: controller.signal },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const normalized = normaliseImageSearch(data);
      cacheSet(key, normalized, TTL.IMAGE_SEARCH);

      if (requestId !== latestSearchRequestIdRef.current) {
        return;
      }

      setResults(normalized.items);
      setTotalResults(normalized.resultCount);
      setTotalPages(Math.ceil(normalized.resultCount / PAGE_SIZE));
      setCurrentPage(page);

      if (searchAbortControllerRef.current === controller) {
        searchAbortControllerRef.current = null;
      }
    } catch (err) {
      if (err.name === 'AbortError' || requestId !== latestSearchRequestIdRef.current) {
        return;
      }

      setError('Failed to search NASA media library');
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      if (requestId === latestSearchRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadAsset = useCallback(async (nasa_id) => {
    latestAssetRequestIdRef.current += 1;
    const requestId = latestAssetRequestIdRef.current;

    if (assetAbortControllerRef.current) {
      assetAbortControllerRef.current.abort();
    }

    if (metadataAbortControllerRef.current) {
      metadataAbortControllerRef.current.abort();
    }

    const assetController = new AbortController();
    const metadataController = new AbortController();
    assetAbortControllerRef.current = assetController;
    metadataAbortControllerRef.current = metadataController;

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
        const assetRes = await fetch(
          buildApiUrl(`/api/images/asset?nasa_id=${nasa_id}`),
          { signal: assetController.signal },
        );
        if (!assetRes.ok) {
          throw new Error(`HTTP error! status: ${assetRes.status}`);
        }
        const assetData = await assetRes.json();
        const normalized = normaliseAssetFiles(assetData);
        cacheSet(assetKey, normalized.items, TTL.ASSET);
        if (requestId === latestAssetRequestIdRef.current) {
          setAssetFiles(normalized.items);
        }
      } catch (err) {
        if (err.name === 'AbortError' || requestId !== latestAssetRequestIdRef.current) {
          return;
        }
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
        const metaRes = await fetch(
          buildApiUrl(`/api/images/metadata?nasa_id=${nasa_id}`),
          { signal: metadataController.signal },
        );
        if (!metaRes.ok) {
          throw new Error(`HTTP error! status: ${metaRes.status}`);
        }
        const metaData = await metaRes.json();
        cacheSet(metaKey, metaData, TTL.METADATA);
        if (requestId === latestAssetRequestIdRef.current) {
          setMetadata(metaData);
        }
      } catch (err) {
        if (err.name === 'AbortError' || requestId !== latestAssetRequestIdRef.current) {
          return;
        }
        console.error('Error loading asset metadata');
      }
    }
  }, []);

  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    searchMedia(query, 1);
  }, [query, searchMedia]);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      searchMedia(query, page);
    }
  }, [query, searchMedia, totalPages]);

  // Perform initial search on mount
  useEffect(() => {
    setQuery(initialQuery);
    searchMedia(initialQuery, 1);
  }, [searchMedia, initialQuery]);

  useEffect(() => () => {
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }
    if (assetAbortControllerRef.current) {
      assetAbortControllerRef.current.abort();
    }
    if (metadataAbortControllerRef.current) {
      metadataAbortControllerRef.current.abort();
    }
  }, []);

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
