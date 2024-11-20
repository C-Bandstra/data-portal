// context/EnvelopeCacheContext.js
import React, { createContext, useContext, useState } from 'react';

const EnvelopeCacheContext = createContext();

export const EnvelopeCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(new Map());

  const addToCache = (id, details) => {
    setCache((prev) => new Map(prev).set(id, details));
  };

  const getFromCache = (id) => {
    return cache.get(id);
  };

  const hasInCache = (id) => {
    return cache.has(id);
  };

  return (
    <EnvelopeCacheContext.Provider value={{ addToCache, getFromCache, hasInCache }}>
      {children}
    </EnvelopeCacheContext.Provider>
  );
};

export const useEnvelopeCache = () => {
  return useContext(EnvelopeCacheContext);
};
