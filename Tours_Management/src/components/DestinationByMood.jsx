import {
  FaHiking,
  FaMountain,
  FaPaw,
  FaPlane,
  FaShip,
  FaUmbrellaBeach
} from 'react-icons/fa';

import { motion } from 'framer-motion';
import { useState } from 'react';

const moods = [
  {
    id: 'adventure',
    name: 'Adventure',
    icon: FaMountain,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    description: 'For thrill-seekers and explorers',
    destinations: [
      {
        name: 'Sigiriya Rock Climb',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
        price: 299,
        location: 'Sigiriya, Sri Lanka',
      },
      {
        name: 'Adam\'s Peak Trek',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
        price: 199,
        location: 'Nallathanniya, Sri Lanka',
      },
      {
        name: 'Knuckles Mountain Hike',
        image: 'https://images.unsplash.com/photo-1544008230-ac1e1fb4f4f4?auto=format&fit=crop&w=400&q=80',
        price: 249,
        location: 'Knuckles Range, Sri Lanka',
      },
    ],
  },
  {
    id: 'air-rides',
    name: 'Air Rides',
    icon: FaPlane,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Scenic flights and aerial adventures',
    destinations: [
      {
        name: 'Colombo City Flight',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
        price: 149,
        location: 'Colombo, Sri Lanka',
      },
      {
        name: 'Tea Country Scenic Flight',
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=400&q=80',
        price: 199,
        location: 'Nuwara Eliya, Sri Lanka',
      },
      {
        name: 'Southern Coast Flight',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
        price: 179,
        location: 'Galle, Sri Lanka',
      },
    ],
  },
  {
    id: 'beaches',
    name: 'Beaches',
    icon: FaUmbrellaBeach,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    description: 'Relax on pristine shores',
    destinations: [
      {
        name: 'Mirissa Beach',
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=400&q=80',
        price: 349,
        location: 'Mirissa, Sri Lanka',
      },
      {
        name: 'Unawatuna Beach',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
        price: 299,
        location: 'Unawatuna, Sri Lanka',
      },
      {
        name: 'Negombo Beach',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
        price: 279,
        location: 'Negombo, Sri Lanka',
      },
    ],
  },
  {
    id: 'cruises',
    name: 'Cruises',
    icon: FaShip,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'Luxury sailing experiences',
    destinations: [
      {
        name: 'Bentota River Cruise',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
        price: 149,
        location: 'Bentota, Sri Lanka',
      },
      {
        name: 'Madu River Safari',
        image: 'https://images.unsplash.com/photo-1512499767985-c33ab34abcd7?auto=format&fit=crop&w=400&q=80',
        price: 99,
        location: 'Balapitiya, Sri Lanka',
      },
      {
        name: 'Negombo Lagoon Cruise',
        image: 'https://images.unsplash.com/photo-1563472262248-0c78e3a25e35?auto=format&fit=crop&w=400&q=80',
        price: 129,
        location: 'Negombo, Sri Lanka',
      },
    ],
  },
  {
    id: 'tracking',
    name: 'Trekking',
    icon: FaHiking,
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    description: 'Mountain trails and hiking',
    destinations: [
      {
        name: 'Horton Plains Trek',
        image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=400&q=80',
        price: 179,
        location: 'Horton Plains, Sri Lanka',
      },
      {
        name: 'Sinharaja Rainforest',
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=400&q=80',
        price: 199,
        location: 'Sinharaja, Sri Lanka',
      },
      {
        name: 'Piduruthalagala Hike',
        image: 'https://images.unsplash.com/photo-1609198092357-e0c3f8c0e925?auto=format&fit=crop&w=400&q=80',
        price: 149,
        location: 'Nuwara Eliya, Sri Lanka',
      },
    ],
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    icon: FaPaw,
    color: 'from-amber-600 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    description: 'Safari and nature encounters',
    destinations: [
      {
        name: 'Yala National Park Safari',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80',
        price: 249,
        location: 'Yala, Sri Lanka',
      },
      {
        name: 'Udawalawe Elephant Safari',
        image: 'https://images.unsplash.com/photo-1516706762359-a75a0379ce68?auto=format&fit=crop&w=400&q=80',
        price: 199,
        location: 'Udawalawe, Sri Lanka',
      },
      {
        name: 'Wilpattu Wildlife Safari',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80',
        price: 299,
        location: 'Wilpattu, Sri Lanka',
      },
    ],
  },
];

const DestinationByMood = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <section id="destinations" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Select Your Destination by Mood
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the type of experience that matches your travel style and preferences
          </p>
        </motion.div>

        {/* Mood Selector - Improved Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {moods.map((mood, index) => {
            const Icon = mood.icon;
            const isActive = selectedMood?.id === mood.id;
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(mood)}
                className={`relative group flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${mood.color} text-white shadow-2xl ring-4 ring-white`
                    : `bg-white/80 backdrop-blur-sm ${mood.textColor} hover:shadow-xl border-2 border-gray-200 hover:border-transparent`
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMood"
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`text-4xl mb-2 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="font-bold text-base text-center">{mood.name}</span>
                <span className={`text-xs mt-1 text-center ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                  {mood.description}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Destinations Grid - Show all when no mood selected, specific when mood selected */}
        <motion.div 
          key={selectedMood ? selectedMood.id : 'all-destinations'}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {selectedMood 
            ? selectedMood.destinations.map((destination, index) => (
                <motion.div
                  key={destination.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 right-4 bg-gradient-to-br ${selectedMood.color} text-white px-4 py-2 rounded-full font-bold shadow-lg`}>
                      ${destination.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{destination.location}</p>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full bg-gradient-to-r ${selectedMood.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))
            : moods.flatMap(mood => 
                mood.destinations.map((destination, index) => (
                  <motion.div
                    key={`${mood.id}-${destination.name}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute top-4 right-4 bg-gradient-to-br ${mood.color} text-white px-4 py-2 rounded-full font-bold shadow-lg`}>
                        ${destination.price}
                      </div>
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {mood.name}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                        {destination.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{destination.location}</p>

                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full bg-gradient-to-r ${mood.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )
          }
        </motion.div>
      </div>
    </section>
  );
};

export default DestinationByMood;
