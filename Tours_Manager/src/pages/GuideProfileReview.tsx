import React, { useEffect, useState } from 'react';

interface Guide {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  nationalId?: string;
  idFrontImage?: string;
  idBackImage?: string;
  registrationNumber?: string;
  certificateImage?: string;
  yearsOfExperience?: number;
  languagesSpoken?: string;
  areasOfOperation?: string;
  specialization?: string;
  shortBio?: string;
  preferredPaymentMethod?: string;
  bankAccountNumber?: string;
  taxId?: string;
  profileCompleted: boolean;
  profileApproved: boolean;
}

const GuideProfileReview: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    fetchGuidesForReview();
  }, []);

  const fetchGuidesForReview = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guides/profile-review`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch guides for review');
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guides/${guideId}/approve-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve guide profile');
      }

      // Remove from list
      setGuides(guides.filter(g => g._id !== guideId));
      setSelectedGuide(null);
      alert('Guide profile approved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Guide Profile Review</h1>

      {selectedGuide ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedGuide.name}'s Profile</h2>
            <button
              onClick={() => setSelectedGuide(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Personal Information</h3>
              <p><strong>Email:</strong> {selectedGuide.email}</p>
              <p><strong>Phone:</strong> {selectedGuide.phone || 'Not provided'}</p>
              <p><strong>Address:</strong> {selectedGuide.address || 'Not provided'}</p>
              <p><strong>Date of Birth:</strong> {selectedGuide.dateOfBirth ? new Date(selectedGuide.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              <p><strong>Country:</strong> {selectedGuide.country || 'Not provided'}</p>
              <p><strong>City:</strong> {selectedGuide.city || 'Not provided'}</p>
              <p><strong>National ID:</strong> {selectedGuide.nationalId || 'Not provided'}</p>
              <p><strong>Registration Number:</strong> {selectedGuide.registrationNumber || 'Not provided'}</p>
              <p><strong>Years of Experience:</strong> {selectedGuide.yearsOfExperience || 'Not provided'}</p>
              <p><strong>Languages Spoken:</strong> {selectedGuide.languagesSpoken || 'Not provided'}</p>
              <p><strong>Areas of Operation:</strong> {selectedGuide.areasOfOperation || 'Not provided'}</p>
              <p><strong>Specialization:</strong> {selectedGuide.specialization || 'Not provided'}</p>
              <p><strong>Short Bio:</strong> {selectedGuide.shortBio || 'Not provided'}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Payment Information</h3>
              <p><strong>Preferred Payment Method:</strong> {selectedGuide.preferredPaymentMethod || 'Not provided'}</p>
              <p><strong>Bank Account Number:</strong> {selectedGuide.bankAccountNumber || 'Not provided'}</p>
              <p><strong>Tax ID:</strong> {selectedGuide.taxId || 'Not provided'}</p>

              <h3 className="text-lg font-medium mb-3 mt-6">Documents</h3>
              {selectedGuide.idFrontImage && (
                <p><strong>ID Front:</strong> <a href={`${import.meta.env.VITE_API_URL}${selectedGuide.idFrontImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a></p>
              )}
              {selectedGuide.idBackImage && (
                <p><strong>ID Back:</strong> <a href={`${import.meta.env.VITE_API_URL}${selectedGuide.idBackImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a></p>
              )}
              {selectedGuide.certificateImage && (
                <p><strong>Certificate:</strong> <a href={`${import.meta.env.VITE_API_URL}${selectedGuide.certificateImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a></p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => handleApprove(selectedGuide._id)}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve Profile
            </button>
            <button
              onClick={() => setSelectedGuide(null)}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Guides Awaiting Profile Review</h2>
            {guides.length === 0 ? (
              <p className="text-gray-600">No guides awaiting profile review.</p>
            ) : (
              <div className="space-y-4">
                {guides.map((guide) => (
                  <div key={guide._id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{guide.name}</h3>
                      <p className="text-gray-600">{guide.email}</p>
                      <p className="text-sm text-gray-500">{guide.phone || 'No phone'}</p>
                    </div>
                    <button
                      onClick={() => setSelectedGuide(guide)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Review Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideProfileReview;