import React, { useCallback, useEffect, useState } from 'react';

import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";

interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  itinerary?: string;
  inclusions?: string;
  exclusions?: string;
  maxParticipants?: number;
  difficulty: string;
  category: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
  rejectionReason?: string;
}

const AllTours: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTour, setExpandedTour] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const fetchTours = useCallback(async () => {
    try {
      const token = localStorage.getItem('guideToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/my-tours`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }

      const data = await response.json();
      setTours(data.tours);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Apply filters whenever tours or filter states change
  useEffect(() => {
    let filtered = [...tours];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tour => tour.status === statusFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(tour => tour.difficulty === difficultyFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tour => tour.category === categoryFilter);
    }

    if (activeFilter !== 'all') {
      const isActive = activeFilter === 'active';
      filtered = filtered.filter(tour => tour.isActive === isActive);
    }

    setFilteredTours(filtered);
  }, [tours, statusFilter, difficultyFilter, categoryFilter, activeFilter]);

  const resetFilters = () => {
    setStatusFilter('all');
    setDifficultyFilter('all');
    setCategoryFilter('all');
    setActiveFilter('all');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Challenging':
        return 'bg-orange-100 text-orange-800';
      case 'Expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading tours</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="All Tours | TourHub Guide"
        description="View and manage all your tour listings"
      />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Tours
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all your tour listings and their current status.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty-filter"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Nature">Nature</option>
                <option value="City">City</option>
                <option value="Beach">Beach</option>
                <option value="Mountain">Mountain</option>
                <option value="Historical">Historical</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Active Status Filter */}
            <div>
              <label htmlFor="active-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Active Status
              </label>
              <select
                id="active-filter"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Tours</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredTours.length} of {tours.length} tours
              {(statusFilter !== 'all' || difficultyFilter !== 'all' || categoryFilter !== 'all' || activeFilter !== 'all') && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  (filtered)
                </span>
              )}
            </p>
          </div>
        </div>

        {filteredTours.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tours yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't created any tours yet. Start by creating your first tour!
            </p>
            <button
              onClick={() => navigate('/tours/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create Your First Tour
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTours.map((tour) => (
              <div key={tour._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      {tour.images && tour.images.length > 0 && (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${tour.images[0]}`}
                          alt={tour.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tour.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created: {new Date(tour.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Price:</span>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">${tour.price}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration:</span>
                        <p className="text-gray-900 dark:text-white">{tour.duration}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location:</span>
                        <p className="text-gray-900 dark:text-white">{tour.location}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
                          {tour.difficulty}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category:</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                          {tour.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                          {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Description:</span>
                      <p className={`text-gray-700 dark:text-gray-300 mt-1 ${expandedTour === tour._id ? '' : 'line-clamp-3'}`}>
                        {tour.description}
                      </p>
                    </div>

                    {tour.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Rejection Reason:</span>
                        <p className="text-red-700 dark:text-red-400 mt-1">{tour.rejectionReason}</p>
                      </div>
                    )}

                    {tour.images && tour.images.length > 1 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Images ({tour.images.length}):</span>
                        <div className="flex space-x-2 mt-2">
                          {tour.images.slice(1, 4).map((image, index) => (
                            <img
                              key={`${tour._id}-${image}`}
                              src={`${import.meta.env.VITE_API_URL}${image}`}
                              alt={`${tour.title} ${index + 2}`}
                              className="w-16 h-16 rounded object-cover"
                            />
                          ))}
                          {tour.images.length > 4 && (
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                              +{tour.images.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expandable Details */}
                    {expandedTour === tour._id && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Tour Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tour ID:</span>
                            <p className="text-sm font-mono break-all text-gray-900 dark:text-white">{tour._id}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Participants:</span>
                            <p className="text-sm text-gray-900 dark:text-white">{tour.maxParticipants || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tour.isActive ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                            }`}>
                              {tour.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Images:</span>
                            <p className="text-sm text-gray-900 dark:text-white">{tour.images ? tour.images.length : 0}</p>
                          </div>
                        </div>

                        {/* Additional Details Sections */}
                        {tour.itinerary && (
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Itinerary:</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">{tour.itinerary}</p>
                          </div>
                        )}

                        {tour.inclusions && (
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Inclusions:</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">{tour.inclusions}</p>
                          </div>
                        )}

                        {tour.exclusions && (
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Exclusions:</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">{tour.exclusions}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => setExpandedTour(expandedTour === tour._id ? null : tour._id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium underline"
                      >
                        {expandedTour === tour._id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllTours;