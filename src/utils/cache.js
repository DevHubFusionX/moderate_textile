const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const cache = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (!parsed || typeof parsed !== 'object') {
        localStorage.removeItem(key);
        return null;
      }

      const { data, timestamp } = parsed;
      if (!timestamp || Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn(`Error reading cache for key "${key}":`, error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      const item = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(item));

      // Preload first few product images for faster display
      if (key === 'products' && Array.isArray(data)) {
        data.slice(0, 6).forEach(product => {
          if (product?.images?.[0]) {
            const img = new Image();
            img.src = product.images[0];
          }
        });
      }
    } catch (error) {
      console.warn(`Error setting cache for key "${key}":`, error);
    }
  },

  clear: (key) => {
    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        // Clear all cache items
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k === 'products' || k === 'combos') {
            localStorage.removeItem(k);
          }
        });
      }
    } catch (error) {
      console.warn(`Error clearing cache for key "${key}":`, error);
    }
  }
};
