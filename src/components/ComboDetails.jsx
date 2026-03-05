import { useParams, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import Button from './ui/Button';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

const ComboDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = combo?.images || (combo?.image ? [combo.image] : []);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    fetchCombo();
  }, [id]);

  const fetchCombo = async () => {
    try {
      console.log('Fetching combo with ID:', id);
      const data = await apiRequest(`${API_ENDPOINTS.combos}/${id}`);
      console.log('Combo data received:', data);
      setCombo(data);
    } catch (error) {
      console.error('Error fetching combo:', error);
      // If combo not found in database, try to find it in the generated combos
      try {
        const allCombos = await apiRequest(API_ENDPOINTS.combos);
        const foundCombo = allCombos.find(c => (c._id || c.id) === id);
        if (foundCombo) {
          setCombo(foundCombo);
        }
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi, I'm interested in the ${combo.name} combo for ${combo.comboPrice}`;
    window.open(`https://wa.me/2347069257877?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Combo not found</h2>
          <Button onClick={() => navigate('/combos')}>Back to Combos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Helmet>
        <title>{combo.name} Combo - Moderate's Textile</title>
        <meta name="description" content={`Get the ${combo.name} combo at Moderate's Textile. Save ${combo.savings} on this premium collection.`} />
        <meta property="og:title" content={`${combo.name} Combo - Moderate's Textile`} />
        <meta property="og:description" content={combo.description?.substring(0, 150)} />
        <meta property="og:image" content={images[0]} />
        <link rel="canonical" href={`https://moderates-textile.vercel.app/combo/${id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": `${combo.name} Combo`,
            "image": images,
            "description": combo.description,
            "sku": combo._id || combo.id,
            "brand": {
              "@type": "Brand",
              "name": "Moderate's Textile"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://moderates-textile.vercel.app/combo/${id}`,
              "priceCurrency": "NGN",
              "price": combo.comboPrice.replace(/[^0-9]/g, ''),
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 lg:mb-8">
          <button onClick={() => navigate('/')} className="hover:text-green-600 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/combos')} className="hover:text-green-600 transition-colors">Combos</button>
          <span>/</span>
          <span className="text-gray-900">{combo.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Image Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
              <div className="relative aspect-square bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden">
                <img
                  src={images[currentImageIndex] || 'https://via.placeholder.com/600x600?text=No+Image'}
                  alt={combo.name}
                  className="w-full h-full object-cover"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                    >
                      <FaChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                    >
                      <FaChevronRight size={16} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {combo.popular && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <FaStar size={12} />
                    <span>Popular</span>
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg p-1 shadow-sm transition-all ${index === currentImageIndex ? 'ring-2 ring-green-500' : 'hover:shadow-md'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${combo.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Combo Info */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Combo Deal
                </span>
                {combo.popular && (
                  <span className="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Popular Choice
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{combo.name}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">{combo.comboPrice}</span>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">{combo.originalPrice}</span>
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Save {combo.savings}
                </span>
              </div>
            </div>

            {/* Description */}
            {combo.description && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Combo Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{combo.description}</p>
              </div>
            )}

            {/* Products in Combo */}
            {combo.products && combo.products.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">What's Included</h3>
                <div className="grid gap-3">
                  {combo.products.map((product, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image || product.images?.[0] || 'https://via.placeholder.com/100x100'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                        <p className="text-green-600 font-semibold text-sm">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border-2 border-green-100">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Ready to Order This Combo?</h3>
                <p className="text-gray-600 text-sm sm:text-base">Get all these items together and save money!</p>
              </div>
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all"
                icon={<FaWhatsapp size={20} className="sm:w-6 sm:h-6" />}
                onClick={handleWhatsAppOrder}
              >
                Order Combo via WhatsApp
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

export default ComboDetails;