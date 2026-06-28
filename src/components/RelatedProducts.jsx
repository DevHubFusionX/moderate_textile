import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/api';
import { cache } from '../utils/cache';
import ProductCard from './ui/ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RelatedProducts = ({ currentProductId, category }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        let allProducts = cache.get('products');
        if (!allProducts) {
          allProducts = await getProducts();
          if (allProducts && allProducts.length > 0) {
            cache.set('products', allProducts);
          }
        }
        
        if (Array.isArray(allProducts)) {
          // Filter products in the same category, excluding the current one
          const filtered = allProducts.filter(
            (p) => p.category === category && p._id !== currentProductId
          );
          
          // If not enough related products in category, get some general ones
          if (filtered.length < 4) {
            const extra = allProducts.filter(
              (p) => p._id !== currentProductId && p.category !== category
            );
            setRelated([...filtered, ...extra].slice(0, 8));
          } else {
            setRelated(filtered.slice(0, 8));
          }
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId && category) {
      fetchRelated();
    }
  }, [currentProductId, category]);

  const scrollLeft = () => {
    const container = document.getElementById('related-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('related-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Related Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-2xl p-4 sm:p-6 shadow-sm relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Related Products</h3>
          <p className="text-sm text-gray-500">More from the {category} collection</p>
        </div>
        
        {related.length > 4 && (
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-full transition-all"
              aria-label="Scroll left"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              onClick={scrollRight}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-full transition-all"
              aria-label="Scroll right"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div
        id="related-container"
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-100"
        style={{ scrollbarWidth: 'thin' }}
      >
        {related.map((product) => (
          <div 
            key={product._id} 
            className="w-[240px] sm:w-[260px] md:w-[280px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
