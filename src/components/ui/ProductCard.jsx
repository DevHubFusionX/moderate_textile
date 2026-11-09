import React, { useState } from 'react';
import { FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const ProductCard = React.memo(({ product, showActions = false, onEdit, onDelete, isDeleting = false }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : ['https://via.placeholder.com/400x400?text=No+Image'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCardClick = () => {
    if (!showActions) {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <div 
      className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 h-[450px] sm:h-[420px] md:h-[450px] flex flex-col ${
        !showActions ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden h-48 sm:h-52 flex-shrink-0">
        <img 
          src={imageError ? 'https://via.placeholder.com/400x400?text=No+Image' : images[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronLeft size={10} className="sm:w-3 sm:h-3" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronRight size={10} className="sm:w-3 sm:h-3" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 max-w-[80%]">
              {images.length <= 8 ? (
                <div className="flex space-x-1 justify-center">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs text-center">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {product.category}
        </div>
        {images.length > 1 && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
            +{images.length - 1}
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 leading-tight">{product.name}</h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        {(product.fabricType || product.quality) && (
          <div className="mb-3 space-y-1">
            {product.fabricType && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                <span>{product.fabricType}</span>
              </div>
            )}
            {product.quality && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                <span>{product.quality} Quality</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-lg sm:text-xl font-bold text-green-600">{product.price}</span>
          </div>
        
          {showActions ? (
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" onClick={() => onEdit(product)} disabled={isDeleting}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(product._id)} disabled={isDeleting}>
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="whatsapp"
              className="w-full"
              size="sm"
              icon={<FaWhatsapp size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/2347069257877?text=Hi, I'm interested in ${product.name} for ${product.price}`, '_blank');
              }}
            >
              Order Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;