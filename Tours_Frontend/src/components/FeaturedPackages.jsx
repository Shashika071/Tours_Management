import { useEffect, useState } from 'react';

import { FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';

const FeaturedPackages = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const response = await api.get('/tours/featured');
        setTours(response.data.tours);
      } catch (err) {
        console.error('Error fetching featured tours:', err);
        setError('Failed to load featured tours');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  if (loading) {
    return (
      <section id="packages" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4"
            >
              <FaFire className="mr-2" />
              <span className="font-semibold">Limited Time Offers</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Featured Sri Lankan Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading featured tours...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || tours.length === 0) {
    return (
      <section id="packages" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4"
            >
              <FaFire className="mr-2" />
              <span className="font-semibold">Limited Time Offers</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Featured Sri Lankan Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {error || 'No featured tours available at the moment.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4"
          >
            <FaFire className="mr-2" />
            <span className="font-semibold">Limited Time Offers</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured Sri Lankan Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked exclusive deals with amazing discounts for your Sri Lankan adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <motion.div
              key={tour._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${tour.images?.[0]}` || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'}
                  alt={tour.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-br from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  ${tour.price}
                </div>
                {tour.offer?.isActive && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {tour.offer.discountPercentage}% OFF
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                  {tour.title}
                </h3>
                <p className="text-gray-600 mb-4">{tour.location}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Link to={`/tour/${tour._id}`} className="block w-full h-full flex items-center justify-center">
                    View Details
                  </Link>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
