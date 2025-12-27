import { FaCalendarAlt, FaPercent, FaTag } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import api from '../utils/api';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const SpecialOffers = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const response = await api.get('/tours/special-offers');
        setTours(response.data.tours);
      } catch (err) {
        console.error('Error fetching special offers:', err);
        setError('Failed to load special offers');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialOffers();
  }, []);

  const handleAddToCart = (tour) => {
    addToCart({
      ...tour,
      id: tour._id,
      price: tour.price,
    });
  };

  if (loading) {
    return (
      <section id="offers" className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full mb-4 animate-pulse"
            >
              <FaPercent className="mr-2" />
              <span className="font-bold">SPECIAL OFFERS</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Exclusive Deals & Offers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Loading special offers...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || tours.length === 0) {
    return (
      <section id="offers" className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full mb-4 animate-pulse"
            >
              <FaPercent className="mr-2" />
              <span className="font-bold">SPECIAL OFFERS</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Exclusive Deals & Offers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {error || 'No special offers available at the moment.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="offers" className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full mb-4 animate-pulse"
          >
            <FaPercent className="mr-2" />
            <span className="font-bold">SPECIAL OFFERS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Exclusive Deals & Offers
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't miss out on these incredible limited-time offers and save on your dream vacation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour, index) => (
            <motion.div
              key={tour._id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white rounded-2xl overflow-hidden text-gray-800 shadow-xl"
            >
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${tour.images?.[0]}` || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
                  -{tour.offer.discountPercentage}%
                </div>
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  Special
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                <p className="text-gray-600 font-semibold mb-2">{tour.location}</p>
                <p className="text-gray-600 text-sm mb-4">{tour.description}</p>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaCalendarAlt className="mr-2 text-primary" />
                  <span>Valid until: {new Date(tour.offer.endDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-gray-400 line-through text-sm">${tour.price}</div>
                    <div className="text-2xl font-bold text-primary">
                      ${(tour.price * (1 - tour.offer.discountPercentage / 100)).toFixed(0)}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(tour)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Grab Deal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Limited time offers - Book now before they're gone!</p>
          <div className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold">
            <FaTag className="mr-2 text-orange-500" />
            <span>More offers coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
