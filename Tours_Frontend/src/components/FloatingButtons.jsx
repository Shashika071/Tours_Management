import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowUp, FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChatClick = () => {
    setShowChatModal(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatMessages([...chatMessages, { sender: 'user', text: message }]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          sender: 'bot', 
          text: 'Thanks for your message! Our team will get back to you shortly.' 
        }]);
      }, 1000);
    }
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all backdrop-blur-sm bg-opacity-90"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleChatClick}
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all backdrop-blur-sm bg-opacity-90"
        aria-label="Chat with us"
      >
        <FaComments className="text-xl" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
          1
        </span>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChatModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChatModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FaComments className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold">GuideBeeLK Support</h3>
                    <p className="text-xs text-white/80">Online • Reply in minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : 'bg-white text-gray-800 shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full hover:shadow-lg transition-all"
                  >
                    <FaPaperPlane />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingButtons;
