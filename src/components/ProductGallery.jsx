import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Galería de imágenes de producto con thumbnails
 */
const ProductGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <motion.div
        className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={images[selectedImage]}
            alt={`${productName} - imagen ${selectedImage + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x800/6CC5E9/FFFFFF?text=PetMAT';
            }}
          />
        </AnimatePresence>

        {/* Indicador de zoom */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2">
          <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </motion.div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === index
                  ? 'border-primary shadow-md'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x200/6CC5E9/FFFFFF?text=PetMAT';
                }}
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Modal de zoom */}
      <AnimatePresence>
        {isZoomed && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 cursor-zoom-out"
              onClick={() => setIsZoomed(false)}
            />

            {/* Imagen zoomed */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
              onClick={() => setIsZoomed(false)}
            >
              <img
                src={images[selectedImage]}
                alt={`${productName} - zoom`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Botón cerrar */}
              <button
                className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                onClick={() => setIsZoomed(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;


