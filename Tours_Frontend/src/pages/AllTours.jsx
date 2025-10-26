import { Link } from 'react-router-dom';
import TourCard from '../components/TourCard';
import { motion } from 'framer-motion';
import { tours } from '../components/TopTours';

const AllTours = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Sri Lanka Tours & Destinations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover our complete collection of amazing Sri Lankan tours and destinations from Colombo to the ancient cities
          </p>
          <Link to="/" className="btn-outline inline-block">
            ← Back to Home
          </Link>
        </motion.div>

        {/* Tours Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <TourCard tour={tour} />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Sri Lanka?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{tours.length}</div>
                <div className="text-gray-600">Sri Lankan Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">
                  {tours.reduce((sum, tour) => sum + tour.reviews, 0)}
                </div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">
                  {(tours.reduce((sum, tour) => sum + tour.rating, 0) / tours.length).toFixed(1)}
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AllTours;