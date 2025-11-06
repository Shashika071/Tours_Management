import React, { useCallback, useEffect, useState } from 'react';

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
  const [rejectingTour, setRejectingTour] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [expandedTour, setExpandedTour] = useState<string | null>(null);
  const [tourCounts, setTourCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    all: 0
  });

  const fetchTours = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      let endpoint = 'all';
      
      if (activeTab !== 'all') {
        endpoint = activeTab;
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
      const endpoints = ['pending', 'approved', 'rejected', 'all'];
      const counts = {
        pending: 0,
        approved: 0,
        rejected: 0,
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
          counts[endpoint as keyof typeof counts] = data.tours.length;
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

      {tours.length === 0 ? (
        <p>No tours to display.</p>
      ) : (
        <div className="grid gap-6">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white p-6 rounded-lg shadow-md border">
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
                      <h3 className="text-xl font-semibold">{tour.title}</h3>
                      <p className="text-gray-600">Guide: {tour.guide.name} ({tour.guide.email})</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(tour.createdAt).toLocaleDateString()}
                      </p>
                    </div>
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

                  {tour.images && tour.images.length > 1 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500">Images ({tour.images.length}):</span>
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
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                            +{tour.images.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expandable Details */}
                  {expandedTour === tour._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold mb-3">Tour Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Tour ID:</span>
                          <p className="text-sm font-mono break-all">{tour._id}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Guide ID:</span>
                          <p className="text-sm font-mono break-all">{tour.guide._id}</p>
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
                          <span className="text-sm font-medium text-gray-500">Max Participants:</span>
                          <p className="text-sm">{tour.maxParticipants || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Active Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tour.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tour.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Created Date:</span>
                          <p className="text-sm">{new Date(tour.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Total Images:</span>
                          <p className="text-sm">{tour.images ? tour.images.length : 0}</p>
                        </div>
                      </div>

                      {/* Additional Details Sections */}
                      {tour.itinerary && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Itinerary:</span>
                          <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{tour.itinerary}</p>
                        </div>
                      )}

                      {tour.inclusions && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Inclusions:</span>
                          <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{tour.inclusions}</p>
                        </div>
                      )}

                      {tour.exclusions && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Exclusions:</span>
                          <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{tour.exclusions}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedTour(expandedTour === tour._id ? null : tour._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                      {expandedTour === tour._id ? 'Hide Details' : 'View Details'}
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
    </div>
  );
};

export default Tours;