import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import TourCard from '../components/TourCard';
import api from '../utils/api';
import { motion } from 'framer-motion';

const AllTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get('/tours/approved');
        let tours = response.data.tours;

        // Fetch top 20 promoted tours
        try {
          const top20Response = await api.get('/tours/top-20');
          const top20Tours = top20Response.data.tours;

          // Create a set of top 20 tour IDs for quick lookup
          const top20Ids = new Set(top20Tours.map(tour => tour._id));

          // Sort tours: top 20 promoted tours first, then others
          tours = tours.sort((a, b) => {
            const aIsTop20 = top20Ids.has(a._id);
            const bIsTop20 = top20Ids.has(b._id);

            if (aIsTop20 && !bIsTop20) return -1;
            if (!aIsTop20 && bIsTop20) return 1;
            return 0; // Maintain original order for non-promoted tours
          });
        } catch (top20Error) {
          console.error('Error fetching top 20 tours:', top20Error);
          // Continue with regular tours if top 20 fetch fails
        }

        setTours(tours);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/" className="btn-outline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tours Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {tours.map((tour, index) => (
            <motion.div
              key={tour._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <TourCard tour={tour} />
            </motion.div>
          ))}
        </motion.div>

        {tours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tours available at the moment.</p>
          </div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Tour Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{tours.length}</div>
                <div className="text-gray-600">Available Tours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">
                  {tours.filter(tour => tour.tourType === 'bid').length}
                </div>
                <div className="text-gray-600">Bid Tours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">
                  {tours.filter(tour => tour.tourType === 'standard').length}
                </div>
                <div className="text-gray-600">Standard Tours</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AllTours;