import React, { useState, useEffect } from 'react';
import { FaSearch, FaTh, FaList, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ComboCard from './ui/ComboCard';
import ProductSkeleton from './ProductSkeleton';
import { cache } from '../utils/cache';
import { getCombos } from '../utils/api';

const AllCombos = () => {
  const [combos, setCombos] = useState([]);
  const [filteredCombos, setFilteredCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    const cachedCombos = cache.get('combos');
    if (cachedCombos) {
      setCombos(cachedCombos);
      setFilteredCombos(cachedCombos);
      setLoading(false);
      return;
    }

    try {
      const data = await getCombos();
      if (Array.isArray(data)) {
        setCombos(data);
        setFilteredCombos(data);
        cache.set('combos', data);
      } else {
        setCombos([]);
        setFilteredCombos([]);
      }
    } catch (error) {
      console.error('Error fetching combos:', error);
      setCombos([]);
      setFilteredCombos([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    let filtered = combos.filter(combo => 
      combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (combo.description && combo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        case 'savings-high':
          return parseInt(b.savings.replace(/[^0-9]/g, '')) - parseInt(a.savings.replace(/[^0-9]/g, ''));
        case 'price-low':
          return parseInt(a.comboPrice.replace(/[^0-9]/g, '')) - parseInt(b.comboPrice.replace(/[^0-9]/g, ''));
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    setFilteredCombos(filtered);
  }, [combos, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="pt-20">
        <div className="bg-white shadow-sm border-b mb-8">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Best Combos</h1>
                <p className="text-gray-600">Save more with our curated combo deals</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 pb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search combos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="savings-high">Highest Savings</option>
                <option value="price-low">Price: Low to High</option>
                <option value="name">Name A-Z</option>
              </select>
              
              <div className="flex items-center justify-center bg-green-50 rounded-xl px-4 py-3">
                <span className="text-green-700 font-medium">
                  {filteredCombos.length} {filteredCombos.length === 1 ? 'Combo' : 'Combos'}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {[...Array(6)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredCombos.map((combo, index) => (
                <div 
                  key={combo._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ComboCard combo={combo} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredCombos.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No combos found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSortBy('popular');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCombos;