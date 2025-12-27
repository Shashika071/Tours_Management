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
  offer?: {
    discountPercentage: number;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
  };
  tourType?: 'standard' | 'bid';
  bidDetails?: {
    startingPrice: number;
    bidEndDate: string;
    currentHighestBid: number;
  };
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
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'pending_deletion' | 'all'>('all');
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
  const [offerFilter, setOfferFilter] = useState<string>('all');
  const [tourTypeFilter, setTourTypeFilter] = useState<string>('all');

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

    if (offerFilter !== 'all') {
      const hasOffer = offerFilter === 'has_offer';
      filtered = filtered.filter(tour => {
        const activeOffer = tour.offer && tour.offer.isActive && tour.offer.discountPercentage > 0;
        return hasOffer ? activeOffer : !activeOffer;
      });
    }

    if (tourTypeFilter !== 'all') {
      filtered = filtered.filter(tour => (tour.tourType || 'standard') === tourTypeFilter);
    }

    setFilteredTours(filtered);
  }, [tours, difficultyFilter, categoryFilter, guideFilter, activeFilter, offerFilter, tourTypeFilter]);

  const resetFilters = () => {
    setDifficultyFilter('all');
    setCategoryFilter('all');
    setGuideFilter('all');
    setActiveFilter('all');
    setOfferFilter('all');
    setTourTypeFilter('all');
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
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'pending'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Pending Tours ({tourCounts.pending})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'approved'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Approved Tours ({tourCounts.approved})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'rejected'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Rejected Tours ({tourCounts.rejected})
        </button>
        <button
          onClick={() => setActiveTab('pending_deletion')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'pending_deletion'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Pending Deletion ({tourCounts.pending_deletion})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'all'
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
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          {/* Offer Status Filter */}
          <div>
            <label htmlFor="offer-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Offer Status
            </label>
            <select
              id="offer-filter"
              value={offerFilter}
              onChange={(e) => setOfferFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All (Offers & Regular)</option>
              <option value="has_offer">With Active Offers</option>
              <option value="no_offer">No Active Offers</option>
            </select>
          </div>

          {/* Tour Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Tour Type
            </label>
            <select
              id="type-filter"
              value={tourTypeFilter}
              onChange={(e) => setTourTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard Tours</option>
              <option value="bid">Bid Tours</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredTours.length} of {tours.length} tours
            {(difficultyFilter !== 'all' || categoryFilter !== 'all' || guideFilter !== 'all' || activeFilter !== 'all' || offerFilter !== 'all' || tourTypeFilter !== 'all') && (
              <span className="ml-2 text-blue-600">
                (filtered)
              </span>
            )}
          </p>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-7xl mb-6">🗺️</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No tours found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            No tours match your current filters and selected tab.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTours.map((tour) => (
            <div key={tour._id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 overflow-hidden">
              <div className="p-5 md:p-6">
                {/* Top Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {tour.title}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(tour.status)}`}>
                        {tour.status.replace('_', ' ')}
                      </span>
                      {tour.tourType === 'bid' && (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                          BID TOUR
                        </span>
                      )}
                      {!tour.isActive && (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <span>Guide: <strong className="text-gray-700 dark:text-gray-200">{tour.guide?.name}</strong></span>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <span>Added on {new Date(tour.createdAt).toLocaleDateString()}</span>
                    </div>
                    {tour.offer && tour.offer.isActive && tour.offer.discountPercentage > 0 && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {tour.offer.discountPercentage}% OFF OFFER
                      </div>
                    )}
                    {tour.tourType === 'bid' && tour.bidDetails && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-amber-200">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Bidding Ends: {new Date(tour.bidDetails.bidEndDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                        {tour.tourType === 'bid' ? 'Starting Price' : 'Price / Person'}
                      </p>
                      {tour.tourType === 'bid' ? (
                        <p className="text-2xl font-black text-amber-600 tracking-tighter">${tour.bidDetails?.startingPrice}</p>
                      ) : (
                        tour.offer && tour.offer.isActive && tour.offer.discountPercentage > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 line-through font-bold leading-none">${tour.price}</span>
                            <p className="text-2xl font-black text-brand-500 tracking-tighter leading-tight">
                              ${(tour.price * (1 - tour.offer.discountPercentage / 100)).toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-2xl font-black text-brand-500 tracking-tighter">${tour.price}</p>
                        )
                      )}
                    </div>
                    <div className="h-10 w-px bg-gray-100 dark:bg-gray-700 hidden lg:block"></div>
                    <div className="flex gap-2">
                      {tour.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(tour._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(tour._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {tour.status === 'pending_deletion' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveDeletion(tour._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
                          >
                            Approve Delete
                          </button>
                          <button
                            onClick={() => openRejectDeletionModal(tour._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
                          >
                            Deny Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 py-4 border-y border-gray-50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{tour.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Duration</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{tour.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-lg">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Category</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{tour.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Level</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{tour.difficulty}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 flex-1">
                    {tour.description}
                  </p>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleViewDetails(tour)}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {tour.rejectionReason && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Rejection Feedback</p>
                    <p className="text-sm text-red-700 dark:text-red-400 italic">{tour.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )
      }

      {/* Rejection Modal */}
      {
        rejectingTour && (
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
        )
      }

      {/* Deletion Rejection Modal */}
      {
        rejectingDeletionTour && (
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
        )
      }

      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {selectedTourForDetails && (
          <div className="p-0">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-6 z-10 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                    {selectedTourForDetails.title}
                  </h2>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedTourForDetails.status)}`}>
                    {selectedTourForDetails.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium font-mono">ID: {selectedTourForDetails._id}</p>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-8 py-8 space-y-10">
              {/* Image Gallery */}
              {selectedTourForDetails.images && selectedTourForDetails.images.length > 0 && (
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Media Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedTourForDetails.images.map((image, index) => (
                      <div key={index} className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${image}`}
                          alt={`Tour gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Core Specs Grid */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-gray-50 dark:border-gray-700/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Location</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {selectedTourForDetails.location}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Duration</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selectedTourForDetails.duration}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Difficulty</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {selectedTourForDetails.difficulty}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                    {selectedTourForDetails.tourType === 'bid' ? 'Starting Price' : 'Price / Person'}
                  </p>
                  <p className="text-2xl font-black text-brand-600 tracking-tighter">
                    ${selectedTourForDetails.tourType === 'bid' ? selectedTourForDetails.bidDetails?.startingPrice : selectedTourForDetails.price}
                  </p>
                </div>
              </section>

              {/* Guide Information Card */}
              <section className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 font-black text-xl">
                    {selectedTourForDetails.guide?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Created By Guide</p>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{selectedTourForDetails.guide?.name}</h4>
                    <p className="text-sm text-gray-500">{selectedTourForDetails.guide?.email}</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Participants</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedTourForDetails.maxParticipants} Max</p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Created Date</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(selectedTourForDetails.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </section>

              {/* Bid Information Section */}
              {selectedTourForDetails.tourType === 'bid' && selectedTourForDetails.bidDetails && (
                <section className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Bid Information</p>
                        <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100">Active Bidding Tour</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          Bids started at ${selectedTourForDetails.bidDetails.startingPrice}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Highest Bid</p>
                        <p className="text-xl font-black text-amber-900 dark:text-amber-100">${selectedTourForDetails.bidDetails.currentHighestBid || selectedTourForDetails.bidDetails.startingPrice}</p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Bidding Ends</p>
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-100">{new Date(selectedTourForDetails.bidDetails.bidEndDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Offer Information Section */}
              {selectedTourForDetails.offer && selectedTourForDetails.offer.isActive && selectedTourForDetails.offer.discountPercentage > 0 && (
                <section className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Active Percentage Offer</p>
                        <h4 className="text-lg font-bold text-red-700 dark:text-red-400">{selectedTourForDetails.offer.discountPercentage}% Instant Discount</h4>
                        <p className="text-sm text-red-600/70">Applied by Guide</p>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Offer Period</p>
                        <p className="text-sm font-bold text-red-700 dark:text-red-300">
                          {new Date(selectedTourForDetails.offer.startDate!).toLocaleDateString()} - {new Date(selectedTourForDetails.offer.endDate!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Discounted Price</p>
                        <p className="text-xl font-black text-red-700 dark:text-red-300 tracking-tighter">
                          ${(selectedTourForDetails.price * (1 - selectedTourForDetails.offer.discountPercentage / 100)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Rich Content Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Overview</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line text-sm">
                      {selectedTourForDetails.description}
                    </p>
                  </section>

                  {selectedTourForDetails.itinerary && (
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Detailed Itinerary</h3>
                      <div className="p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm leading-relaxed text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {selectedTourForDetails.itinerary}
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-8">
                  {selectedTourForDetails.inclusions && (
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">What's Included</h3>
                      <div className="p-5 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100/50 dark:border-green-900/30 text-sm text-gray-700 dark:text-gray-400 whitespace-pre-line">
                        {selectedTourForDetails.inclusions}
                      </div>
                    </section>
                  )}

                  {selectedTourForDetails.exclusions && (
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">What's Excluded</h3>
                      <div className="p-5 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-900/30 text-sm text-gray-700 dark:text-gray-400 whitespace-pre-line">
                        {selectedTourForDetails.exclusions}
                      </div>
                    </section>
                  )}

                  {selectedTourForDetails.rejectionReason && (
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-3">Manager Note / Rejection Reason</h3>
                      <div className="p-5 bg-red-500/5 rounded-xl border border-red-500/20 text-sm text-red-700 dark:text-red-400 italic">
                        {selectedTourForDetails.rejectionReason}
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* Static Action Bar */}
              {(selectedTourForDetails.status === 'pending' || selectedTourForDetails.status === 'pending_deletion') && (
                <div className="pt-10 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                  {selectedTourForDetails.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleApprove(selectedTourForDetails._id);
                          setDetailsModalOpen(false);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-100 transition-all"
                      >
                        Approve Tour
                      </button>
                      <button
                        onClick={() => {
                          openRejectModal(selectedTourForDetails._id);
                          setDetailsModalOpen(false);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-100 transition-all"
                      >
                        Reject Tour
                      </button>
                    </>
                  )}
                  {selectedTourForDetails.status === 'pending_deletion' && (
                    <>
                      <button
                        onClick={() => {
                          handleApproveDeletion(selectedTourForDetails._id);
                          setDetailsModalOpen(false);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-100 transition-all"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => {
                          openRejectDeletionModal(selectedTourForDetails._id);
                          setDetailsModalOpen(false);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-100 transition-all"
                      >
                        Reject Deletion
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div >
  );
};

export default Tours;