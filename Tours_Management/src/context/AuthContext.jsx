import { createContext, useContext, useState } from 'react';

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

  const login = (email, password) => {
    // Simulated login - replace with actual API call
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: email,
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff',
    };
    setUser(mockUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = (name, email, password) => {
    // Simulated signup - replace with actual API call
    const mockUser = {
      id: 1,
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=3B82F6&color=fff`,
    };
    setUser(mockUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
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
        login,
        signup,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
