import { createContext, useContext, useEffect, useState } from 'react';

import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const updateProfile = async (profileData, imageFile = null) => {
    try {
      let response;
      if (imageFile) {
        const formData = new FormData();
        if (profileData.name) formData.append('name', profileData.name);
        if (profileData.email) formData.append('email', profileData.email);
        if (profileData.phone) formData.append('phone', profileData.phone);
        if (profileData.address) formData.append('address', profileData.address);
        formData.append('profileImage', imageFile);

        response = await api.put('/auth/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.put('/auth/profile', profileData);
      }

      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, message: error.response?.data?.message || 'Profile update failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const loginWithToken = async (token) => {
    try {
      localStorage.setItem('token', token);
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      console.error('Token login failed:', error);
      localStorage.removeItem('token');
      return { success: false, message: 'Authentication failed' };
    }
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        loading,
        login,
        signup,
        updateProfile,
        logout,
        loginWithToken,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
