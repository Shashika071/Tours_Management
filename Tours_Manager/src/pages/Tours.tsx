import React, { useCallback, useEffect, useState } from 'react';

import { Modal } from '../components/ui/modal';

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
  status: 'pending' | 'approved' | 'rejected' | 'pending_deletion';
  guide: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  rejectionReason?: string;
}

const Tours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [rejectingTour, setRejectingTour] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingDeletionTour, setRejectingDeletionTour] = useState<string | null>(null);
  const [deletionRejectionReason, setDeletionRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'pending_deletion' | 'all'>('pending');
  const [expandedTour, setExpandedTour] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTourForDetails, setSelectedTourForDetails] = useState<Tour | null>(null);
  const [tourCounts, setTourCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    pending_deletion: 0,
    all: 0
  });

  // Filter states
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [guideFilter, setGuideFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const fetchTours = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      let endpoint = 'all';
      
      if (activeTab !== 'all') {
        // Map frontend tab names to API endpoint names
        const endpointMap: { [key: string]: string } = {
          'pending': 'pending',
          'approved': 'approved',
          'rejected': 'rejected',
          'pending_deletion': 'pending-deletion'
        };
        endpoint = endpointMap[activeTab] || activeTab;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tours/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }

      const data = await response.json();
      setTours(data.tours);

      // Fetch counts for all tabs
      await fetchTourCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchTourCounts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoints = ['pending', 'approved', 'rejected', 'pending-deletion', 'all'];
      const counts = {
        pending: 0,
        approved: 0,
        rejected: 0,
        pending_deletion: 0,
        all: 0
      };

      for (const endpoint of endpoints) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tours/${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Map API endpoint names back to frontend state names
          const stateKeyMap: { [key: string]: string } = {
            'pending': 'pending',
            'approved': 'approved',
            'rejected': 'rejected',
            'pending-deletion': 'pending_deletion'
          };
          const stateKey = stateKeyMap[endpoint] || endpoint;
          counts[stateKey as keyof typeof counts] = data.tours.length;
        }
      }

      setTourCounts(counts);
    } catch (err) {
      console.error('Failed to fetch tour counts:', err);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Apply filters whenever tours or filter states change
  useEffect(() => {
    let filtered = [...tours];

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(tour => tour.difficulty === difficultyFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tour => tour.category === categoryFilter);
    }

    if (guideFilter !== 'all') {
      filtered = filtered.filter(tour => tour.guide._id === guideFilter);
    }

    if (activeFilter !== 'all') {
      const isActive = activeFilter === 'active';
      filtered = filtered.filter(tour => tour.isActive === isActive);
    }

    setFilteredTours(filtered);
  }, [tours, difficultyFilter, categoryFilter, guideFilter, activeFilter]);

  const resetFilters = () => {
    setDifficultyFilter('all');
    setCategoryFilter('all');
    setGuideFilter('all');
    setActiveFilter('all');
  };

  useEffect(() => {
    fetchTourCounts();
  }, []);

  const handleApprove = async (tourId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tours/${tourId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve tour');
      }

      // Update local state and refresh counts
      setTours(tours.filter(tour => tour._id !== tourId));
      await fetchTourCounts();
      alert('Tour approved successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleViewDetails = (tour: Tour) => {
    setSelectedTourForDetails(tour);
    setDetailsModalOpen(true);
  };

  const openRejectModal = (tourId: string) => {
    setRejectingTour(tourId);
    setRejectionReason('');
  };

  const closeRejectModal = () => {
    setRejectingTour(null);
    setRejectionReason('');
  };

  const handleReject = async (tourId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tours/${tourId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject tour');
      }

      // Update local state and refresh counts
      setTours(tours.filter(tour => tour._id !== tourId));
      setRejectingTour(null);
      setRejectionReason('');
      await fetchTourCounts();
      alert('Tour rejected successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const openRejectDeletionModal = (tourId: string) => {
    setRejectingDeletionTour(tourId);
    setDeletionRejectionReason('');
  };

  const closeRejectDeletionModal = () => {
    setRejectingDeletionTour(null);
    setDeletionRejectionReason('');
  };

  const handleApproveDeletion = async (tourId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this tour? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tours/${tourId}/approve-deletion`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve deletion');
      }

      // Update local state and refresh counts
      setTours(tours.filter(tour => tour._id !== tourId));
      await fetchTourCounts();
      alert('Tour deletion approved and completed');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRejectDeletion = async (tourId: string) => {
    if (!deletionRejectionReason.trim()) {
      alert('Please provide a reason for rejecting the deletion');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tours/${tourId}/reject-deletion`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason: deletionRejectionReason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject deletion');
      }

      // Update local state and refresh counts
      setTours(tours.map(tour => 
        tour._id === tourId ? { ...tour, status: 'approved' as const } : tour
      ));
      setRejectingDeletionTour(null);
      setDeletionRejectionReason('');
      await fetchTourCounts();
      alert('Deletion request rejected successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending_deletion':
        return 'bg-orange-100 text-orange-800';
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
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tour Management</h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'pending'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending Tours ({tourCounts.pending})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'approved'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Approved Tours ({tourCounts.approved})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'rejected'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Rejected Tours ({tourCounts.rejected})
        </button>
        <button
          onClick={() => setActiveTab('pending_deletion')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'pending_deletion'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending Deletion ({tourCounts.pending_deletion})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Tours ({tourCounts.all})
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Additional Filters</h3>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Reset All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Difficulty Filter */}
          <div>
            <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              id="difficulty-filter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Guide Filter */}
          <div>
            <label htmlFor="guide-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Guide
            </label>
            <select
              id="guide-filter"
              value={guideFilter}
              onChange={(e) => setGuideFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Guides</option>
              {Array.from(new Set(tours.map(tour => tour.guide._id)))
                .map(guideId => {
                  const guide = tours.find(tour => tour.guide._id === guideId)?.guide;
                  return guide ? (
                    <option key={guideId} value={guideId}>
                      {guide.name} ({guide.email})
                    </option>
                  ) : null;
                })}
            </select>
          </div>

          {/* Active Status Filter */}
          <div>
            <label htmlFor="active-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Active Status
            </label>
            <select
              id="active-filter"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Tours</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredTours.length} of {tours.length} tours
            {(difficultyFilter !== 'all' || categoryFilter !== 'all' || guideFilter !== 'all' || activeFilter !== 'all') && (
              <span className="ml-2 text-blue-600">
                (filtered)
              </span>
            )}
          </p>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <p>No tours to display.</p>
      ) : (
        <div className="grid gap-6">
          {filteredTours.map((tour) => (
            <div key={tour._id} className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{tour.title}</h3>
                    <p className="text-gray-600">Guide: {tour.guide.name} ({tour.guide.email})</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(tour.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Price:</span>
                      <p className="text-lg font-semibold">${tour.price}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duration:</span>
                      <p>{tour.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <p>{tour.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
                        {tour.difficulty}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Category:</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tour.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                        {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <p className={`text-gray-700 mt-1 ${expandedTour === tour._id ? '' : 'line-clamp-3'}`}>
                      {tour.description}
                    </p>
                  </div>

                  {tour.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <span className="text-sm font-medium text-red-700">Rejection Reason:</span>
                      <p className="text-red-700 mt-1">{tour.rejectionReason}</p>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => handleViewDetails(tour)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {tour.status === 'pending' && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleApprove(tour._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(tour._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {tour.status === 'pending_deletion' && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleApproveDeletion(tour._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => openRejectDeletionModal(tour._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Reject Deletion
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Reject Tour</h2>
            <p className="mb-4 text-gray-600">
              Please provide a reason for rejecting this tour. This will be emailed to the guide.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
              rows={4}
              required
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleReject(rejectingTour)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                disabled={!rejectionReason.trim()}
              >
                Reject Tour
              </button>
              <button
                onClick={closeRejectModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Rejection Modal */}
      {rejectingDeletionTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Reject Deletion Request</h2>
            <p className="mb-4 text-gray-600">
              Please provide a reason for rejecting this deletion request. This will be emailed to the guide.
            </p>
            <textarea
              value={deletionRejectionReason}
              onChange={(e) => setDeletionRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
              rows={4}
              required
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleRejectDeletion(rejectingDeletionTour)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
                disabled={!deletionRejectionReason.trim()}
              >
                Reject Deletion
              </button>
              <button
                onClick={closeRejectDeletionModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {selectedTourForDetails && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {selectedTourForDetails.title}
            </h2>

            {/* Tour Images */}
            {selectedTourForDetails.images && selectedTourForDetails.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedTourForDetails.images.slice(0, 6).map((image, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_API_URL}${image}`}
                      alt={`Tour image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                  {selectedTourForDetails.images.length > 6 && (
                    <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      +{selectedTourForDetails.images.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tour ID:</span>
                    <p className="text-sm font-mono break-all text-gray-900 dark:text-white">{selectedTourForDetails._id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Guide:</span>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTourForDetails.guide.name} ({selectedTourForDetails.guide.email})</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location:</span>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTourForDetails.location}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Price:</span>
                    <p className="text-sm text-gray-900 dark:text-white">${selectedTourForDetails.price}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration:</span>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTourForDetails.duration}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty:</span>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTourForDetails.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category:</span>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTourForDetails.category}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Status & Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTourForDetails.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                      selectedTourForDetails.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                      selectedTourForDetails.status === 'pending_deletion' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400' :
                      'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                    }`}>
                      {selectedTourForDetails.status.charAt(0).toUpperCase() + selectedTourForDetails.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTourForDetails.isActive ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                    }`}>
                      {selectedTourForDetails.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Participants:</span>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTourForDetails.maxParticipants || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Images:</span>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTourForDetails.images ? selectedTourForDetails.images.length : 0}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created:</span>
                    <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedTourForDetails.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Description</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedTourForDetails.description}</p>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedTourForDetails.itinerary && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Itinerary</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedTourForDetails.itinerary}</p>
                </div>
              )}

              {selectedTourForDetails.inclusions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Inclusions</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedTourForDetails.inclusions}</p>
                </div>
              )}

              {selectedTourForDetails.exclusions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Exclusions</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedTourForDetails.exclusions}</p>
                </div>
              )}

              {selectedTourForDetails.rejectionReason && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">Rejection Reason</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-800 dark:text-red-300">{selectedTourForDetails.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons for Pending Tours */}
            {selectedTourForDetails.status === 'pending' && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    handleApprove(selectedTourForDetails._id);
                    setDetailsModalOpen(false);
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Approve Tour
                </button>
                <button
                  onClick={() => {
                    openRejectModal(selectedTourForDetails._id);
                    setDetailsModalOpen(false);
                  }}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  Reject Tour
                </button>
              </div>
            )}

            {/* Action Buttons for Pending Deletion Tours */}
            {selectedTourForDetails.status === 'pending_deletion' && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    handleApproveDeletion(selectedTourForDetails._id);
                    setDetailsModalOpen(false);
                  }}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => {
                    openRejectDeletionModal(selectedTourForDetails._id);
                    setDetailsModalOpen(false);
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Reject Deletion
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tours;