import React, { useEffect, useState } from 'react';

interface Guide {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  phone?: string;
  address?: string;
  profileImage?: string;
  createdAt: string;
}

const Guides: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [rejectingGuide, setRejectingGuide] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guides/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch guides');
      }

      const data = await response.json();
      setGuides(data.guides);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (guideId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guides/${guideId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve guide');
      }

      // Update local state
      setGuides(guides.filter(guide => guide._id !== guideId));
      alert('Guide approved successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const openRejectModal = (guideId: string) => {
    setRejectingGuide(guideId);
    setRejectionReason('');
  };

  const closeRejectModal = () => {
    setRejectingGuide(null);
    setRejectionReason('');
  };

  const handleReject = async (guideId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guides/${guideId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject guide');
      }

      // Update local state
      setGuides(guides.filter(guide => guide._id !== guideId));
      setRejectingGuide(null);
      setRejectionReason('');
      alert('Guide rejected successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
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
      <h1 className="text-2xl font-bold mb-6">Guide Management</h1>

      {guides.length === 0 ? (
        <p>No pending guides to review.</p>
      ) : (
        <div className="grid gap-4">
          {guides.map((guide) => (
            <div key={guide._id} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {guide.profileImage && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${guide.profileImage}`}
                      alt={guide.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{guide.name}</h3>
                    <p className="text-gray-600">{guide.email}</p>
                    {guide.phone && <p className="text-sm text-gray-500">{guide.phone}</p>}
                    {guide.address && <p className="text-sm text-gray-500">{guide.address}</p>}
                    <p className="text-sm text-gray-400">
                      Registered: {new Date(guide.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(guide._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(guide._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Reject Guide Application</h2>
            <p className="mb-4 text-gray-600">
              Please provide a reason for rejecting this guide's application. This will be emailed to the guide.
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
                onClick={() => handleReject(rejectingGuide)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                disabled={!rejectionReason.trim()}
              >
                Reject Guide
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

export default Guides;