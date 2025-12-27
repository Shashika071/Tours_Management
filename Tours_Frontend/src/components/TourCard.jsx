import { FaCalendarAlt, FaClock, FaGavel, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const TourCard = ({ tour }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (tour.tourType === 'bid') {
      // For bid tours, redirect to tour detail page
      return;
    }
    addToCart(tour);
  };

  const isBiddingOpen = tour.tourType === 'bid' && new Date() <= new Date(tour.bidDetails?.bidEndDate);

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
          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${tour.images?.[0]}`}
          alt={tour.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full font-semibold">
          {tour.tourType === 'bid' ? (
            <>${tour.bidDetails?.currentHighestBid || tour.bidDetails?.startingPrice}</>
          ) : (
            <>${tour.price}</>
          )}
        </div>
        {tour.tourType === 'bid' && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1">
            <FaGavel className="text-xs" />
            BID TOUR
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{tour.title}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="text-primary mr-2" />
          <span>{tour.location}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <FaClock className="text-primary mr-2" />
          <span>{tour.duration}</span>
        </div>

        {tour.tourType === 'bid' && tour.bidDetails && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-700 font-medium">Starting Price:</span>
              <span className="text-amber-800 font-bold">${tour.bidDetails.startingPrice}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-amber-700 font-medium">Current Bid:</span>
              <span className="text-amber-800 font-bold">${tour.bidDetails.currentHighestBid || tour.bidDetails.startingPrice}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-amber-700 font-medium">Ends:</span>
              <span className="text-amber-800 font-bold">
                {new Date(tour.bidDetails.bidEndDate).toLocaleDateString()}
              </span>
            </div>
            {!isBiddingOpen && (
              <div className="text-red-600 text-xs font-bold mt-2 text-center">
                Bidding Closed
              </div>
            )}
          </div>
        )}

        <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{tour.description}</p>

        <div className="mt-auto">
          {tour.tourType === 'bid' ? (
            <Link
              to={`/tour/${tour._id}`}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                isBiddingOpen
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <FaGavel />
              <span>{isBiddingOpen ? 'Place Bid' : 'Bidding Closed'}</span>
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <FaCalendarAlt />
              <span>Book Now</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
