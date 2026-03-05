import React from 'react';
import { FaWhatsapp, FaPhone, FaCheckCircle, FaShippingFast } from 'react-icons/fa';
import heroImage from '../assets/moderate_textile.jpg';

const Hero = () => {
  return (
    <section id="home" className="pt-28 pb-16 bg-white border-b">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Banner */}


          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Moderate's Textile
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Premium-quality traditional and urban wear at unbeatable prices.
                Order easily via WhatsApp for instant service.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/2347069257877" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2">
                  <FaWhatsapp size={20} />
                  <span>Order via WhatsApp</span>
                </a>
                <a href="/products" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold transition-all text-center">
                  Browse Products
                </a>
              </div>
            </div>

            <div className="relative">
              {/* Decorative Background Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-green-200 rounded-full opacity-30"></div>

              {/* Main Image Container */}
              <div className="relative overflow-hidden">
                {/* Geometric Frame */}
                <div className="relative bg-gradient-to-br from-green-50 to-white p-6 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white p-4 rounded-2xl shadow-inner">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={heroImage}
                        alt="Moderate's Textile - Premium quality traditional and urban wear collection"
                        className="w-full h-[350px] object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                      {/* Floating Badge */}
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Premium Quality
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats - Repositioned */}
                <div className="absolute -bottom-4 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-green-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="group">
                      <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform">5K+</div>
                      <div className="text-xs text-gray-600">Happy Customers</div>
                    </div>
                    <div className="group border-x border-gray-200">
                      <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform">36</div>
                      <div className="text-xs text-gray-600">States Covered</div>
                    </div>
                    <div className="group">
                      <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform">100+</div>
                      <div className="text-xs text-gray-600">Products</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;