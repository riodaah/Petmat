import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CTAButton from './CTAButton';
import heroVideo from '../assets/videos/hero.mp4';

/**
 * Componente Hero con video de fondo
 * Video specs: 1920x1080, 6-8 segundos, sin audio, formato .mp4
 * Ubicación: src/assets/videos/hero.mp4
 */
const Hero = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Video de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 drop-shadow-lg">
            Accesorios diseñados para hacer
            <br />
            <span className="text-primary">feliz a tu mascota</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
            Productos seguros, duraderos y pensados para su bienestar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTAButton to="/tienda" size="lg">
              Ver Tienda
            </CTAButton>
            <CTAButton to="/contacto" variant="secondary" size="lg">
              Contáctanos
            </CTAButton>
          </div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;


