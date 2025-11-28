import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Botón CTA reutilizable con animaciones
 */
const CTAButton = ({ 
  children, 
  to, 
  href, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-block text-center';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-[#5AB5D9] shadow-md hover:shadow-lg',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white',
    outline: 'bg-transparent text-text border-2 border-text hover:bg-text hover:text-white',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const MotionComponent = motion.div;
  
  // Si es un link interno
  if (to) {
    return (
      <MotionComponent
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link to={to} className={buttonClasses} {...props}>
          {children}
        </Link>
      </MotionComponent>
    );
  }
  
  // Si es un link externo
  if (href) {
    return (
      <MotionComponent
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <a href={href} className={buttonClasses} {...props}>
          {children}
        </a>
      </MotionComponent>
    );
  }
  
  // Si es un botón normal
  return (
    <MotionComponent
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button onClick={onClick} className={buttonClasses} {...props}>
        {children}
      </button>
    </MotionComponent>
  );
};

export default CTAButton;







