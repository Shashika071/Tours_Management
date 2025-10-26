import { FaCamera, FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSave, FaTimes, FaUser } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, updateProfile, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // Update profileData when user data loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const bookings = [
    {
      id: 1,
      tourName: 'Paris City Tour',
      location: 'Paris, France',
      date: '2025-11-15',
      status: 'Confirmed',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      tourName: 'Bali Paradise',
      location: 'Bali, Indonesia',
      date: '2025-12-01',
      status: 'Pending',
      price: 1599,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80',
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-xl text-gray-600 mb-8">
            You need to be logged in to view your profile
          </p>
          <button onClick={openAuthModal} className="btn-primary">
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateProfile(profileData, selectedImage);
    setLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setSelectedImage(null);
    } else {
      setError(result.message);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
    });
    setIsEditing(false);
    setSelectedImage(null);
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const getProfileImageUrl = () => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }
    if (user.profileImage) {
      if (user.profileImage.startsWith('http')) {
        return user.profileImage;
      }
      return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${user.profileImage}`;
    }
    return `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=3B82F6&color=fff&size=128`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={getProfileImageUrl()}
                    alt={user.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                    onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=3B82F6&color=fff&size=128`}
                  />
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                    >
                      <FaCamera className="text-sm" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-outline w-full flex items-center justify-center space-x-2"
                >
                  <FaEdit />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <FaSave />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <FaUser className="text-primary text-xl mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaEnvelope className="text-primary text-xl mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled={user?.authProvider === 'google'}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaPhone className="text-primary text-xl mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="text-primary text-xl mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* My Bookings */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={booking.image}
                        alt={booking.tourName}
                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {booking.tourName}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{booking.location}</p>
                        <p className="text-gray-600 mb-2">
                          Travel Date: {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p className="text-2xl font-bold text-primary">${booking.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {bookings.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <p>No bookings yet. Start exploring our tours!</p>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-primary mt-4"
                  >
                    Browse Tours
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
