import { FaGoogle } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.message);
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      const result = await signup(formData.name, formData.email, formData.password);
      if (!result.success) {
        setError(result.message);
      }
    }

    if (!error) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('Password reset email sent! Check your inbox.');
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordEmail('');
        }, 3000);
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  if (!isAuthModalOpen) return null;

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl max-w-md w-full p-8 relative'>
          <button
            onClick={() => {
              setShowForgotPassword(false);
              setForgotPasswordEmail('');
              setError('');
            }}
            className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
          >
            <FaTimes className='text-2xl' />
          </button>

          <h2 className='text-3xl font-bold text-gray-800 mb-6'>Reset Password</h2>

          <p className='text-gray-600 mb-6'>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className='space-y-4'>
            <div>
              <label htmlFor='resetEmail' className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <input
                type='email'
                id='resetEmail'
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className='input-field'
                placeholder='Enter your email'
                required
              />
            </div>

            <button type='submit' className='btn-primary w-full'>
              Send Reset Link
            </button>
          </form>

          <div className='mt-6 text-center'>
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordEmail('');
                setError('');
              }}
              className='text-primary font-semibold hover:underline'
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl max-w-md w-full p-8 relative'>
        <button
          onClick={closeAuthModal}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
        >
          <FaTimes className='text-2xl' />
        </button>

        <h2 className='text-3xl font-bold text-gray-800 mb-6'>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {!isLogin && (
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                Full Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='input-field'
                placeholder='Enter your full name'
              />
            </div>
          )}

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='input-field'
              placeholder='Enter your email'
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='input-field'
              placeholder='Enter your password'
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='input-field'
                placeholder='Confirm your password'
              />
            </div>
          )}

          <button type='submit' className='btn-primary w-full mt-6'>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {isLogin && (
          <div className='mt-4 text-center'>
            <button
              onClick={() => setShowForgotPassword(true)}
              className='text-primary text-sm hover:underline'
            >
              Forgot Password?
            </button>
          </div>
        )}

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className='mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <FaGoogle className='text-red-500' />
            <span className='text-gray-700 font-medium'>Continue with Google</span>
          </button>
        </div>

        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            {isLogin ? 'Don\'t have an account? ' : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className='text-primary font-semibold hover:underline'
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
