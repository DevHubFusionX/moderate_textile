import React, { useState } from 'react';
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import Button from '../ui/Button';

const ProductForm = ({ product, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    category: product?.category || '',
    description: product?.description || '',
    fabricType: product?.fabricType || '',
    texture: product?.texture || '',
    quality: product?.quality || '',
    care: product?.care || '',
    images: []
  });
  
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || '',
        description: product.description || '',
        fabricType: product.fabricType || '',
        texture: product.texture || '',
        quality: product.quality || '',
        care: product.care || '',
        images: []
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <FaPlus className="text-white text-sm" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Price</label>
          <input
            type="text"
            placeholder="e.g., ₦15,000"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            required
          >
            <option value="">Select Category</option>
            <option value="Traditional">Traditional</option>
            <option value="Casual">Casual</option>
            <option value="Premium">Premium</option>
            <option value="Fabrics">Fabrics</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-green-50 file:text-green-700 file:text-xs"
          />
          <p className="text-xs text-gray-500">Select multiple images for this product</p>
        </div>
        
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Enter product description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fabric Type</label>
          <input
            type="text"
            placeholder="e.g., Cotton, Silk, Polyester"
            value={formData.fabricType}
            onChange={(e) => setFormData({...formData, fabricType: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Texture</label>
          <input
            type="text"
            placeholder="e.g., Smooth, Rough, Soft"
            value={formData.texture}
            onChange={(e) => setFormData({...formData, texture: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quality</label>
          <input
            type="text"
            placeholder="e.g., Premium, Standard, Luxury"
            value={formData.quality}
            onChange={(e) => setFormData({...formData, quality: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Care Instructions</label>
          <input
            type="text"
            placeholder="e.g., Hand wash, Dry clean only"
            value={formData.care}
            onChange={(e) => setFormData({...formData, care: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:col-span-2 pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className={`bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 bg-green-600 rounded-lg flex items-center justify-center animate-spin">
                  <span className="text-white font-semibold text-xs">MT</span>
                </div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Save Product</span>
              </>
            )}
          </Button>
          <Button 
            type="button" 
            disabled={loading}
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <FaTimes />
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;