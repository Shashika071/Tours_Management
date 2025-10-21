import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const TourCard = ({ tour }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(tour);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="card hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col"
    >
      <div className="relative">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full font-semibold">
          ${tour.price}
        </div>
        {tour.featured && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
            Featured
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{tour.name}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="text-primary mr-2" />
          <span>{tour.location}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <FaClock className="text-primary mr-2" />
          <span>{tour.duration}</span>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={index < Math.floor(tour.rating) ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="ml-2 text-gray-600">({tour.reviews} reviews)</span>
        </div>

        <p className="text-gray-600 mb-6 flex-1">{tour.description}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="btn-primary w-full flex items-center justify-center space-x-2 mt-auto"
        >
          <FaCalendarAlt />
          <span>Book Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TourCard;
