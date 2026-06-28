import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaSearch, FaTh, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ui/ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { cache } from '../utils/cache';
import { getProducts } from '../utils/api';
import Footer from './Footer';

const categoryIcons = {
  'All': '✨',
  'Traditional': '🏛️',
  'Premium': '💎',
  'Fabrics': '🧵',
  'Casual': '👕',
  'Accessories': '👜'
};

const AllProducts = React.memo(() => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination State (loads in batches of 12)
  const [visibleCount, setVisibleCount] = useState(12);

  const navigate = useNavigate();
  const categories = ['All', 'Traditional', 'Premium', 'Fabrics', 'Casual', 'Accessories'];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset pagination count when search, category, or sorting changes
  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    const cachedProducts = cache.get('products');
    if (cachedProducts) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    try {
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
        cache.set('products', data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
        case 'price-high':
          return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Paginated subset of filtered products
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <div className="pt-20 flex-grow">
        {/* Title bar banner */}
        <div className="bg-white shadow-sm border-b mb-6 sm:mb-8">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Our Collection</h1>
                <p className="text-gray-600 text-sm sm:text-base">Discover premium textiles & quality wear</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Grid View"
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="List View"
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 pb-8">
          {/* Filters, search, and sort container */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 space-y-4">
            {/* Category Pills (Horizontal Scrollable Selector) */}
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x scroll-smooth">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`snap-start px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white border-green-600 shadow-sm scale-[1.02]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-1.5">{categoryIcons[category] || '📦'}</span>
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Sort Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base cursor-pointer bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Active Filter Badges */}
            {(searchTerm !== '' || selectedCategory !== 'All') && (
              <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Active Filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 bg-green-55/10 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200/50">
                    Category: {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory('All')} 
                      className="hover:text-green-900 ml-1 font-bold text-sm cursor-pointer"
                      title="Clear Category"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm !== '' && (
                  <span className="inline-flex items-center gap-1.5 bg-green-55/10 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200/50">
                    Search: "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="hover:text-green-900 ml-1 font-bold text-sm cursor-pointer"
                      title="Clear Search"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchTerm('');
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold underline hover:no-underline ml-auto cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Product Feed Grid / List */}
          {loading ? (
            <div className={`grid gap-4 sm:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 && (
                <div className="mb-4 text-sm text-gray-500 font-medium px-1">
                  Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                </div>
              )}
              
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}>
                {visibleProducts.map((product, index) => (
                  <div 
                    key={product._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(index % 12) * 50}ms` }}
                  >
                    {viewMode === 'grid' ? (
                      <ProductCard product={product} />
                    ) : (
                      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 sm:p-6 cursor-pointer"
                           onClick={() => navigate(`/product/${product._id}`)}>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <div className="w-full sm:w-32 h-48 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            <img 
                              src={product.images?.[0] || product.image || 'https://via.placeholder.com/400x400?text=No+Image'} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-800">{product.name}</h3>
                              <span className="text-xl sm:text-2xl font-bold text-green-600">{product.price}</span>
                            </div>
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                              {product.category}
                            </span>
                            {product.description && (
                              <p className="text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-500">
                              {product.fabricType && <span>• {product.fabricType}</span>}
                              {product.quality && <span>• {product.quality}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {filteredProducts.length > visibleCount && (
                <div className="text-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    className="bg-white hover:bg-gray-50 text-green-600 border border-green-200 px-8 py-3.5 rounded-xl font-bold shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer min-w-[200px]"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty Search / No Results View */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 max-w-4xl mx-auto">
              <div className="max-w-md mx-auto mb-10">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">We couldn't find matches for your search/filter settings.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSortBy('newest');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>

              {/* Popular recommendations on empty search */}
              {products.length > 0 && (
                <div className="border-t border-gray-100 pt-10">
                  <h4 className="text-lg font-bold text-gray-800 mb-6">Popular Picks You Might Like</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.slice(0, 4).map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Global Footer component */}
      <Footer />
    </div>
  );
});

AllProducts.displayName = 'AllProducts';
export default AllProducts;