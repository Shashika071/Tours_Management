import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import TourCard from './TourCard';
import api from '../utils/api';

const BidTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBidTours = async () => {
      try {
        const response = await api.get('/tours/bid-tours');
        setTours(response.data.tours);
      } catch (err) {
        console.error('Error fetching bid tours:', err);
        setError('Failed to load bid tours');
      } finally {
        setLoading(false);
      }
    };

    fetchBidTours();
  }, []);

  if (loading) {
    return (
      <section id="bid-tours" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Bid Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading bid tours...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || tours.length === 0) {
    return (
      <section id="bid-tours" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Bid Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {error || 'No bid tours available at the moment.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="bid-tours" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Bid Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Place your bid on exclusive tour packages and get amazing deals on unique experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/all-tours" className="btn-primary inline-block">
            View All Tours
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BidTours;