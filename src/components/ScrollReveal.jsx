import { motion } from 'framer-motion';

/**
 * Wrapper component para animaciones de scroll reveal con Framer Motion
 */
const ScrollReveal = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  y = 30,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;





