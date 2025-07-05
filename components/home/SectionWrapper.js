// components/home/SectionWrapper.js
import { motion } from 'framer-motion';

const SectionWrapper = ({ children, className = '' }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;