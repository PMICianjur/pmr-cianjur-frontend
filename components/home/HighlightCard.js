// components/home/HighlightCard.js
import { motion } from 'framer-motion';

const HighlightCard = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center cursor-pointer"
    >
      <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center bg-red-100 rounded-full text-red-600">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

export default HighlightCard;