import React, { useEffect, useState } from 'react';

import { Modal } from "../../components/ui/modal";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import { useTour } from "../../context/TourContext";

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
  isActive: boolean;
  createdAt: string;
  rejectionReason?: string;
}

const AllTours: React.FC = () => {
  const navigate = useNavigate();
  const { tours, loading, refetchTours } = useTour();
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [expandedTour] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTourForDetails, setSelectedTourForDetails] = useState<Tour | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');

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

  const handleEdit = (tourId: string) => {
    const tour = tours.find(t => t._id === tourId);
    if (tour?.status === 'approved') {
      // For approved tours, allow editing but notify manager
      const confirmEdit = window.confirm(
        'This tour is approved. Editing it will notify the manager for review. Continue?'
      );
      if (!confirmEdit) return;
    }
    navigate(`/tours/edit/${tourId}`);
  };

  const handleViewDetails = (tour: Tour) => {
    setSelectedTourForDetails(tour);
    setDetailsModalOpen(true);
  };

  const handleDelete = async (tourId: string) => {
    const tour = tours.find(t => t._id === tourId);
    let confirmMessage = 'Are you sure you want to delete this tour?';

    if (tour?.status === 'approved') {
      confirmMessage = 'This tour is approved. Deleting it will require manager approval. Are you sure you want to continue?';
    }

    if (window.confirm(confirmMessage)) {
      try {
        const token = localStorage.getItem('guideToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/${tourId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          await refetchTours();
          if (data.status === 'pending_deletion') {
            alert('Deletion request submitted. Waiting for manager approval.');
          } else {
            alert('Tour deleted successfully');
          }
        } else {
          alert(data.message || 'Failed to delete tour');
        }
      } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Error deleting tour');
      }
    }
  };

  const handleResubmit = async (tourId: string) => {
    try {
      const token = localStorage.getItem('guideToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/${tourId}/resubmit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await refetchTours();
        alert('Tour resubmitted successfully');
      } else {
        alert('Failed to resubmit tour');
      }
    } catch (error) {
      console.error('Error resubmitting tour:', error);
      alert('Error resubmitting tour');
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


  return (
    <>
      <PageMeta
        title="All Tours | GuideBeeLK Guide"
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
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tour.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created: {new Date(tour.createdAt).toLocaleDateString()}
                      </p>
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

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(tour)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium underline"
                      >
                        View Details
                      </button>

                      {/* Edit Button - available for all statuses, but may require permission for approved */}
                      <button
                        onClick={() => handleEdit(tour._id)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium underline"
                      >
                        Edit
                      </button>

                      {/* Delete Button - available for all statuses except pending_deletion */}
                      {tour.status !== 'pending_deletion' && (
                        <button
                          onClick={() => handleDelete(tour._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium underline"
                        >
                          Delete
                        </button>
                      )}

                      {/* Pending Deletion Status Indicator */}
                      {tour.status === 'pending_deletion' && (
                        <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                          Pending Manager Approval
                        </span>
                      )}

                      {/* Resubmit Button - only for rejected tours */}
                      {tour.status === 'rejected' && (
                        <button
                          onClick={() => handleResubmit(tour._id)}
                          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium underline"
                        >
                          Resubmit
                        </button>
                      )}

                      {/* Promote Button - only for approved tours */}
                      {tour.status === 'approved' && (
                        <button
                          onClick={() => navigate(`/tours/promote/new?tourId=${tour._id}`)}
                          className="text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium underline"
                        >
                          Promote
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedTourForDetails.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                      selectedTourForDetails.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                        'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                      }`}>
                      {selectedTourForDetails.status.charAt(0).toUpperCase() + selectedTourForDetails.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedTourForDetails.isActive ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
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
          </div>
        )}
      </Modal>
    </>
  );
};

export default AllTours;