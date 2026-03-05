import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import Button from './ui/Button';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.products}/${id}`);
      setProduct(data);
      if (data.colors?.length > 0) {
        setSelectedColor(data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    const images = selectedColor?.images || product?.images || [product?.image];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = selectedColor?.images || product?.images || [product?.image];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
  };

  const handleWhatsAppOrder = () => {
    const colorText = selectedColor ? ` in ${selectedColor.name}` : '';
    const message = `Hi, I'm interested in ${product.name}${colorText} for ${product.price}`;
    window.open(`https://wa.me/2347069257877?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const currentImages = selectedColor?.images ||
    (product.images && product.images.length > 0 ? product.images :
      (product.image ? [product.image] : ['https://via.placeholder.com/400x400?text=No+Image']));

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Helmet>
        <title>{product.name} - Moderate's Textile</title>
        <meta name="description" content={`Buy ${product.name} at Moderate's Textile. ${product.description?.substring(0, 150) || 'Premium quality fabrics at best prices.'}`} />
        <meta property="og:title" content={`${product.name} - Moderate's Textile`} />
        <meta property="og:description" content={product.description?.substring(0, 150)} />
        <meta property="og:image" content={currentImages[0]} />
        <link rel="canonical" href={`https://moderatestextile.com/product/${id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": currentImages,
            "description": product.description,
            "sku": product._id,
            "brand": {
              "@type": "Brand",
              "name": "Moderate's Textile"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://moderatestextile.com/product/${id}`,
              "priceCurrency": "NGN",
              "price": product.price.replace(/[^0-9]/g, ''),
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 lg:mb-8">
          <button onClick={() => navigate('/')} className="hover:text-green-600 transition-colors truncate">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-green-600 transition-colors truncate">Products</button>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
              <div className="relative aspect-square bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden">
                <img
                  src={imageError ? 'https://via.placeholder.com/600x600?text=No+Image' : currentImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />

                {currentImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <FaChevronLeft size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <FaChevronRight size={14} className="sm:w-4 sm:h-4" />
                    </button>

                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {currentImageIndex + 1} / {currentImages.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Grid */}
            {currentImages.length > 1 && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2">
                  {currentImages.slice(0, 12).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${index === currentImageIndex ? 'border-green-500 ring-1 sm:ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {currentImages.length > 12 && (
                    <div className="aspect-square bg-gray-100 rounded-md sm:rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                      +{currentImages.length - 12}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {product.category}
                </span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-xs sm:text-sm text-gray-500">In Stock</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">{product.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">{product.price}</p>
                <span className="text-sm sm:text-base lg:text-lg text-gray-500">per piece</span>
              </div>
            </div>

            {/* Color Variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Available Colors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-center ${selectedColor?.name === color.name
                        ? 'border-green-500 bg-green-50 text-green-800 ring-1 sm:ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className="font-medium text-sm sm:text-base">{color.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description}</p>
              </div>
            )}

            {/* Fabric Details */}
            {(product.fabricType || product.texture || product.quality || product.care) && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Product Details</h3>
                <div className="space-y-3 sm:space-y-4">
                  {product.fabricType && (
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-2">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Fabric Type</span>
                      <span className="text-gray-900 text-sm sm:text-base">{product.fabricType}</span>
                    </div>
                  )}
                  {product.texture && (
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-2">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Texture</span>
                      <span className="text-gray-900 text-sm sm:text-base">{product.texture}</span>
                    </div>
                  )}
                  {product.quality && (
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-2">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Quality</span>
                      <span className="text-gray-900 text-sm sm:text-base">{product.quality}</span>
                    </div>
                  )}
                  {product.care && (
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-2">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Care Instructions</span>
                      <span className="text-gray-900 text-sm sm:text-base">{product.care}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border-2 border-green-100">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Ready to Order?</h3>
                <p className="text-gray-600 text-sm sm:text-base">Contact us directly via WhatsApp for instant service</p>
              </div>
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all"
                icon={<FaWhatsapp size={20} className="sm:w-6 sm:h-6" />}
                onClick={handleWhatsAppOrder}
              >
                Order via WhatsApp
              </Button>
              <div className="mt-3 sm:mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-500">Fast response • Secure payment • Nationwide delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;