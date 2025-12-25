import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ isHomePage = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout, openAuthModal } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    if (user) {
      // toggle profile dropdown
      setIsProfileMenuOpen((s) => !s);
    } else {
      openAuthModal();
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSectionNavigation = (sectionId) => {
    if (!isHomePage) {
      // If not on home page, navigate to home first, then scroll to section
      navigate('/');
      // Use setTimeout to wait for navigation to complete
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Different styles for home page vs other pages
  const getNavbarStyles = () => {
    if (isHomePage) {
      // Home page: transparent at top, solid when scrolled
      return scrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-2xl' 
        : 'bg-transparent';
    } else {
      // Other pages: always solid
      return 'bg-white/90 backdrop-blur-lg shadow-2xl';
    }
  };

  // Text color changes based on transparency
  const getTextColor = () => {
    if (isHomePage && !scrolled) {
      return 'text-white hover:text-gray-200';
    }
    return 'text-gray-700 hover:text-primary';
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarStyles()}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/logo.png"
                  alt="GuideBeeLK Logo"
                  className="h-12 object-contain"
                />
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={`${getTextColor()} transition-all font-medium hover:scale-110 transform`}>
                Home
              </Link>
              <button 
                onClick={() => handleSectionNavigation('tours')}
                className={`${getTextColor()} transition-all font-medium hover:scale-110 transform bg-transparent border-none cursor-pointer`}
              >
                Tours
              </button>
              <Link to="/all-tours" className={`${getTextColor()} transition-all font-medium hover:scale-110 transform`}>
                All Tours
              </Link>
              <button 
                onClick={() => handleSectionNavigation('packages')}
                className={`${getTextColor()} transition-all font-medium hover:scale-110 transform bg-transparent border-none cursor-pointer`}
              >
                Packages
              </button>
              <button 
                onClick={() => handleSectionNavigation('destinations')}
                className={`${getTextColor()} transition-all font-medium hover:scale-110 transform bg-transparent border-none cursor-pointer`}
              >
                Destinations
              </button>
              <button 
                onClick={() => handleSectionNavigation('offers')}
                className={`${getTextColor()} transition-all font-medium hover:scale-110 transform bg-transparent border-none cursor-pointer`}
              >
                Offers
              </button>
              <button 
                onClick={() => handleSectionNavigation('about')}
                className={`${getTextColor()} transition-all font-medium hover:scale-110 transform bg-transparent border-none cursor-pointer`}
              >
                About
              </button>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to="/cart" className={`relative ${getTextColor()} transition-colors`}>
                  <FaShoppingCart className="text-2xl" />
                  {getTotalItems() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                    >
                      {getTotalItems()}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {user ? (
                <div className="relative flex items-center space-x-3" ref={profileMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleAuthClick}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage.startsWith('http') ? user.profileImage : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${user.profileImage}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-primary shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-primary shadow-md bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </motion.button>

                  {/* Small dropdown menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
                      <div className="px-2 py-2">
                        <button
                          onClick={() => { setIsProfileMenuOpen(false); navigate('/cart'); }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Cart
                        </button>
                        <button
                          onClick={() => { setIsProfileMenuOpen(false); navigate('/profile'); }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => { setIsProfileMenuOpen(false); navigate('/orders'); }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Orders
                        </button>
                        <div className="border-t my-1" />
                        <button
                          onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openAuthModal} 
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
                >
                  Login / Sign Up
                </motion.button>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden ${getTextColor()} z-50`}
            >
              {isMenuOpen ? <FaTimes className="text-3xl" /> : <FaBars className="text-3xl" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-lg border-t shadow-xl"
            >
              <div className="px-6 py-6 space-y-4">
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-primary transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <button
                  onClick={() => {
                    handleSectionNavigation('tours');
                    setIsMenuOpen(false);
                  }}
                  className="block text-left text-gray-700 hover:text-primary transition-colors font-medium text-lg bg-transparent border-none cursor-pointer w-full"
                >
                  Tours
                </button>
                <Link
                  to="/all-tours"
                  className="block text-gray-700 hover:text-primary transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Tours
                </Link>
                <button
                  onClick={() => {
                    handleSectionNavigation('packages');
                    setIsMenuOpen(false);
                  }}
                  className="block text-left text-gray-700 hover:text-primary transition-colors font-medium text-lg bg-transparent border-none cursor-pointer w-full"
                >
                  Packages
                </button>
                <button
                  onClick={() => {
                    handleSectionNavigation('destinations');
                    setIsMenuOpen(false);
                  }}
                  className="block text-left text-gray-700 hover:text-primary transition-colors font-medium text-lg bg-transparent border-none cursor-pointer w-full"
                >
                  Destinations
                </button>
                <button
                  onClick={() => {
                    handleSectionNavigation('offers');
                    setIsMenuOpen(false);
                  }}
                  className="block text-left text-gray-700 hover:text-primary transition-colors font-medium text-lg bg-transparent border-none cursor-pointer w-full"
                >
                  Offers
                </button>
                <button
                  onClick={() => {
                    handleSectionNavigation('about');
                    setIsMenuOpen(false);
                  }}
                  className="block text-left text-gray-700 hover:text-primary transition-colors font-medium text-lg bg-transparent border-none cursor-pointer w-full"
                >
                  About
                </button>
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart />
                  <span>Cart ({getTotalItems()})</span>
                </Link>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        handleAuthClick();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium text-lg"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-red-500 hover:text-red-700 transition-colors font-medium text-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal();
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-primary to-secondary text-white w-full py-3 rounded-lg font-semibold text-lg"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <AuthModal />
    </>
  );
};

export default Navbar;
