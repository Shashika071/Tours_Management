import { FaArrowLeft, FaCalendarAlt, FaClock, FaGavel, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import api from '../utils/api';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const TourDetail = () => {
  const { tourId } = useParams();
  const { user, setIsAuthModalOpen } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);
  const [bidMessage, setBidMessage] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await api.get(`/tours/${tourId}`);
        setTour(response.data.tour);
        // Set minimum bid amount
        if (response.data.tour.tourType === 'bid') {
          setBidAmount((response.data.tour.bidDetails?.currentHighestBid || response.data.tour.bidDetails?.startingPrice || 0) + 1);
        }
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  const handlePlaceBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= (tour.bidDetails?.currentHighestBid || tour.bidDetails?.startingPrice || 0)) {
      setBidMessage('Bid amount must be higher than the current highest bid');
      return;
    }

    setBidding(true);
    try {
      const response = await api.post(`/tours/${tourId}/bid`, {
        bidAmount: parseFloat(bidAmount)
      });

      setBidMessage('Bid placed successfully!');
      // Update the tour with new highest bid
      setTour(prev => ({
        ...prev,
        bidDetails: {
          ...prev.bidDetails,
          currentHighestBid: parseFloat(bidAmount)
        }
      }));
      // Update minimum bid amount
      setBidAmount(parseFloat(bidAmount) + 1);
    } catch (err) {
      console.error('Error placing bid:', err);
      setBidMessage(err.response?.data?.message || 'Failed to place bid');
    } finally {
      setBidding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Tour not found'}</p>
          <Link to="/all-tours" className="btn-outline">Back to Tours</Link>
        </div>
      </div>
    );
  }

  const isBiddingOpen = tour.tourType === 'bid' && new Date() <= new Date(tour.bidDetails?.bidEndDate);
  const currentHighestBid = tour.bidDetails?.currentHighestBid || tour.bidDetails?.startingPrice || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/all-tours"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <FaArrowLeft />
            <span>Back to All Tours</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${tour.images?.[0]}`}
                  alt={tour.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                {tour.tourType === 'bid' && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
                    <FaGavel />
                    BID TOUR
                  </div>
                )}
              </div>
              {tour.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {tour.images.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${image}`}
                      alt={`${tour.title} ${index + 2}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Tour Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{tour.title}</h1>

              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-primary" />
                  <span>{tour.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-primary" />
                <span className="text-gray-600">Guide: <span className="font-semibold">{tour.guide?.name}</span></span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              {tour.tourType === 'bid' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Starting Price:</span>
                    <span className="text-2xl font-bold text-amber-600">${tour.bidDetails?.startingPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Current Highest Bid:</span>
                    <span className="text-2xl font-bold text-green-600">${currentHighestBid}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Bidding Ends:</span>
                    <span className="text-lg font-semibold text-gray-800">
                      {new Date(tour.bidDetails?.bidEndDate).toLocaleDateString()} at{' '}
                      {new Date(tour.bidDetails?.bidEndDate).toLocaleTimeString()}
                    </span>
                  </div>

                  {isBiddingOpen ? (
                    <div className="border-t pt-4 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Place Your Bid</h3>
                      {user ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="Enter bid amount"
                            min={currentHighestBid + 1}
                            step="0.01"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                          <button
                            onClick={handlePlaceBid}
                            disabled={bidding}
                            className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                          >
                            {bidding ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Placing...
                              </>
                            ) : (
                              <>
                                <FaGavel />
                                Place Bid
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-600 mb-4">You need to be logged in to place a bid</p>
                          <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Login to Bid
                          </button>
                        </div>
                      )}
                      {bidMessage && (
                        <p className={`text-sm ${bidMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                          {bidMessage}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-red-600 font-semibold">Bidding has ended for this tour</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary">${tour.price}</span>
                  <p className="text-gray-600 mt-2">per person</p>
                </div>
              )}
            </div>

            {/* Tour Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tour Information</h3>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{tour.description}</p>
              </div>

              {tour.itinerary && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Itinerary</h4>
                  <p className="text-gray-600">{tour.itinerary}</p>
                </div>
              )}

              {tour.inclusions && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Inclusions</h4>
                  <p className="text-gray-600">{tour.inclusions}</p>
                </div>
              )}

              {tour.exclusions && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Exclusions</h4>
                  <p className="text-gray-600">{tour.exclusions}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-semibold text-gray-700">Difficulty</h4>
                  <p className="text-gray-600">{tour.difficulty}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Category</h4>
                  <p className="text-gray-600">{tour.category}</p>
                </div>
                {tour.maxParticipants && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Max Participants</h4>
                    <p className="text-gray-600">{tour.maxParticipants}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;