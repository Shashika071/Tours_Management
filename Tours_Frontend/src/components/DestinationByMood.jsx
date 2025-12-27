import {
  FaCity,
  FaHiking,
  FaLandmark,
  FaMountain,
  FaPaw,
  FaPlane,
  FaQuestion,
  FaShip,
  FaUmbrellaBeach,
  FaUtensils
} from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';

import api from '../utils/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'Adventure',
    name: 'Adventure',
    icon: FaMountain,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    description: 'Thrilling adventures and outdoor activities',
  },
  {
    id: 'Cultural',
    name: 'Cultural',
    icon: FaLandmark,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'Explore heritage and traditions',
  },
  {
    id: 'Nature',
    name: 'Nature',
    icon: FaPaw,
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    description: 'Natural wonders and wildlife experiences',
  },
  {
    id: 'City',
    name: 'City',
    icon: FaCity,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Urban exploration and city life',
  },
  {
    id: 'Beach',
    name: 'Beach',
    icon: FaUmbrellaBeach,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    description: 'Relax on pristine shores',
  },
  {
    id: 'Mountain',
    name: 'Mountain',
    icon: FaHiking,
    color: 'from-amber-600 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    description: 'Mountain trails and hiking adventures',
  },
  {
    id: 'Historical',
    name: 'Historical',
    icon: FaLandmark,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    description: 'Ancient sites and historical landmarks',
  },
  {
    id: 'Food',
    name: 'Food',
    icon: FaUtensils,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    description: 'Culinary journeys and food experiences',
  },
  {
    id: 'Other',
    name: 'Other',
    icon: FaQuestion,
    color: 'from-gray-500 to-slate-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    description: 'Unique and special experiences',
  },
];

const DestinationByMood = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null); // No default category selected
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get('/tours/approved');
        setTours(response.data.tours);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Keyboard event handler to clear category selection
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only clear if backspace is pressed, a category is selected, and we're not in an input field
      if (event.key === 'Backspace' && selectedCategory && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault(); // Prevent browser back navigation
        setSelectedCategory(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategory]);

  // Filter tours based on selected category
  const filteredTours = useMemo(() => {
    if (!tours.length) return [];
    if (!selectedCategory) return tours; // Show all tours when no category selected
    return tours.filter(tour => tour.category === selectedCategory.id);
  }, [tours, selectedCategory]);

  return (
    <section id="destinations" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        onClick={(e) => {
          // Clear selection when clicking on blank space in the main container
          if (selectedCategory && (e.target === e.currentTarget || e.target.classList.contains('bg-gradient-to-br'))) {
            setSelectedCategory(null);
          }
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Select Your Destination by Mood
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the type of experience that matches your travel style and preferences
          </p>
        </motion.div>

        {/* Mood Selector - Single Row Layout */}
        <div
          className="flex gap-4 mb-16 overflow-x-auto pb-4 px-2 flex-nowrap min-w-0"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f9fafb',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = selectedCategory?.id === category.id;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`relative group flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 flex-shrink-0 w-24 sm:w-28 ${
                  isActive
                    ? `bg-gradient-to-br ${category.color} text-white shadow-2xl ring-4 ring-white`
                    : `bg-white/80 backdrop-blur-sm ${category.textColor} hover:shadow-xl border-2 border-gray-200 hover:border-transparent`
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`text-3xl mb-1 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="font-bold text-sm text-center leading-tight">{category.name}</span>
                <span className={`text-xs mt-1 text-center leading-tight ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                  {category.description}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Tour Display Section */}
        <motion.div
          key={selectedCategory?.id || 'no-selection'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {selectedCategory ? `${selectedCategory.name} Tours` : 'Explore All Tours'}
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                  title="Clear selection (Backspace)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {selectedCategory
                ? selectedCategory.description
                : 'Select a category above to filter tours, or browse all available tours'
              }
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No tours available for this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={tour._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${tour.images?.[0]}`}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/placeholder-tour.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">
                        {tour.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 font-semibold">
                          ${tour.price}
                        </span>
                        <span className="text-white/90 text-sm">
                          {tour.duration} days
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {tour.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">(4.8)</span>
                      </div>
                      <button
                        onClick={() => navigate(`/tour/${tour._id}`)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default DestinationByMood;
