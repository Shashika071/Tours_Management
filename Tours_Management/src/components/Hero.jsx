import { FaCalendarAlt, FaMapMarkerAlt, FaPlay, FaSearch, FaStar, FaUsers } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

const Hero = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
    travelers: '1',
  });

  const backgrounds = [
 
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80', // Adam's Peak
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80', // Galle Fort
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=2000&q=80', // Tea plantations
 
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchData);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Background Images with Transition */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all ease-in-out ${
            index === currentBg ? 'opacity-100 scale-105 duration-[3000ms]' : 'opacity-0 scale-100 duration-[2500ms]'
          }`}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        </div>
      ))}

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto w-full">
        {/* Main Heading */}
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-5 leading-tight">
            <span className="block mb-2">Discover Sri Lanka's</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
              Hidden Treasures
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-3xl mx-auto font-light">
            Explore the Pearl of the Indian Ocean with our curated Sri Lankan tours and authentic cultural experiences
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/all-tours"
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-base shadow-xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <FaMapMarkerAlt className="text-sm" />
                Explore Tours
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <button className="group px-8 py-3 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full font-bold text-base hover:bg-white/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              <FaPlay className="text-sm" />
              Watch Video
            </button>
          </div>

          {/* Enhanced Search Bar */}
          <div className={`relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2.5 max-w-5xl mx-auto mb-2 transition-all duration-300 ${
            isSearchFocused ? 'ring-2 ring-blue-400/50' : ''
          }`}>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative group">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-hover:text-blue-400 transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-transparent focus:border-blue-400 focus:bg-white focus:outline-none text-gray-800 font-medium placeholder-gray-500 transition-all"
                />
              </div>

              <div className="relative group">
                <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-hover:text-blue-400 transition-colors z-10" />
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-transparent focus:border-blue-400 focus:bg-white focus:outline-none text-gray-800 font-medium transition-all"
                />
              </div>

              <div className="relative group">
                <FaUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-hover:text-blue-400 transition-colors z-10" />
                <select
                  value={searchData.travelers}
                  onChange={(e) => setSearchData({ ...searchData, travelers: e.target.value })}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-transparent focus:border-blue-400 focus:bg-white focus:outline-none text-gray-800 font-medium appearance-none cursor-pointer transition-all"
                >
                  <option>1 Traveler</option>
                  <option>2 Travelers</option>
                  <option>3 Travelers</option>
                  <option>4+ Travelers</option>
                </select>
              </div>

              <button
                type="submit"
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Search Tours</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll"></div>
          </div>
          <span className="text-white/70 text-xs font-medium">Scroll Down</span>
        </div>
      </div>

      {/* Background Indicator Dots */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {backgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBg(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentBg ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
