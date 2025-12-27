import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TourCard = ({ tour }) => {
  const isBiddingOpen = tour.tourType === 'bid' && new Date() <= new Date(tour.bidDetails?.bidEndDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${tour.images?.[0]}`}
          alt={tour.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          ${tour.tourType === 'bid' ? (tour.bidDetails?.currentHighestBid || tour.bidDetails?.startingPrice) : tour.price}
        </div>
        {tour.tourType === 'bid' && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            BID TOUR
          </div>
        )}
        {tour.offer?.isActive && tour.tourType !== 'bid' && (
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
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Link to={`/tour/${tour._id}`} className="block w-full h-full flex items-center justify-center">
            View Details
          </Link>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TourCard;
