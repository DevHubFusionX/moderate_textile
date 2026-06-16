import React, { useState, useEffect } from 'react';
import ComboCard from './ui/ComboCard';
import ProductSkeleton from './ProductSkeleton';
import { cache } from '../utils/cache';
import { getCombos, getProducts } from '../utils/api';

const Combos = () => {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // Check cache first
    const cachedCombos = cache.get('combos');
    if (cachedCombos) {
      setCombos(cachedCombos);
      setLoading(false);
      return;
    }

    try {
      const data = await getCombos();
      setCombos(data);
      cache.set('combos', data);
    } catch (error) {
      console.error('Error fetching combos:', error);
      // Fallback to auto-generated combos
      const productsData = await getProducts();
      setProducts(productsData);
      generateCombos(productsData);
    } finally {
      setLoading(false);
    }
  };

  const generateCombos = (productList) => {
    if (productList.length >= 3) {
      const generatedCombos = [
        {
          id: 1,
          name: "Complete Traditional Package",
          items: `${productList[0]?.name} + ${productList[2]?.name}`,
          originalPrice: calculateOriginalPrice([productList[0], productList[2]]),
          comboPrice: calculateComboPrice([productList[0], productList[2]]),
          savings: calculateSavings([productList[0], productList[2]]),
          image: productList[0]?.image,
          popular: true
        },
        {
          id: 2,
          name: "Premium Combo",
          items: `${productList[1]?.name} + ${productList[3]?.name}`,
          originalPrice: calculateOriginalPrice([productList[1], productList[3]]),
          comboPrice: calculateComboPrice([productList[1], productList[3]]),
          savings: calculateSavings([productList[1], productList[3]]),
          image: productList[1]?.image
        },
        {
          id: 3,
          name: "Casual Special",
          items: `${productList[4]?.name} + ${productList[2]?.name}`,
          originalPrice: calculateOriginalPrice([productList[4], productList[2]]),
          comboPrice: calculateComboPrice([productList[4], productList[2]]),
          savings: calculateSavings([productList[4], productList[2]]),
          image: productList[4]?.image
        }
      ].filter(combo => combo.image); // Only show combos with valid products
      setCombos(generatedCombos);
    }
  };

  const calculateOriginalPrice = (items) => {
    const total = items.reduce((sum, item) => {
      if (item?.price) {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return sum + price;
      }
      return sum;
    }, 0);
    return `₦${total.toLocaleString()}`;
  };

  const calculateComboPrice = (items) => {
    const total = items.reduce((sum, item) => {
      if (item?.price) {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return sum + price;
      }
      return sum;
    }, 0);
    const discounted = Math.floor(total * 0.85); // 15% discount
    return `₦${discounted.toLocaleString()}`;
  };

  const calculateSavings = (items) => {
    const original = items.reduce((sum, item) => {
      if (item?.price) {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return sum + price;
      }
      return sum;
    }, 0);
    const savings = Math.floor(original * 0.15); // 15% savings
    return `₦${savings.toLocaleString()}`;
  };

  return (
    <section id="combos" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            💰 Save Up to 25%
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Value Combo Packages</h2>
          <div className="w-16 h-1 bg-green-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Smart bundles designed to give you more value for your money. 
            Perfect for bulk purchases and complete wardrobe solutions.
          </p>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[...Array(4)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {combos.slice(0, 4).map((combo, index) => (
                <div 
                  key={combo._id || combo.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <ComboCard combo={combo} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">More Savings Await</h3>
                <p className="text-gray-600 mb-6">Discover all our combo deals and save more on bulk purchases</p>
                <a href="/combos" className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                  <span>View All Combos</span>
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Combos;