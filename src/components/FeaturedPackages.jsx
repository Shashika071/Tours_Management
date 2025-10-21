import { FaClock, FaFire, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const featuredPackages = [
  {
    id: 101,
    name: 'Romantic Paris Getaway',
    location: 'Paris, France',
    duration: '5 Days / 4 Nights',
    price: 1199,
    originalPrice: 1499,
    discount: '20%',
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    description: 'Experience the city of love with exclusive access to top attractions and romantic dining.',
    badge: 'Hot Deal',
    includes: ['Hotel', 'Flights', 'Tours', 'Meals'],
  },
  {
    id: 102,
    name: 'Tropical Maldives Escape',
    location: 'Maldives',
    duration: '7 Days / 6 Nights',
    price: 2299,
    originalPrice: 2899,
    discount: '21%',
    rating: 5.0,
    reviews: 678,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury overwater villa with pristine beaches and world-class diving experiences.',
    badge: 'Best Seller',
    includes: ['Villa', 'Flights', 'Spa', 'All Meals'],
  },
  {
    id: 103,
    name: 'Adventure New Zealand',
    location: 'New Zealand',
    duration: '10 Days / 9 Nights',
    price: 2799,
    originalPrice: 3499,
    discount: '20%',
    rating: 4.8,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',
    description: 'Explore stunning landscapes, adventure sports, and unique wildlife experiences.',
    badge: 'Adventure',
    includes: ['Hotel', 'Transport', 'Activities', 'Guide'],
  },
  {
    id: 104,
    name: 'Cultural Japan Tour',
    location: 'Tokyo & Kyoto, Japan',
    duration: '8 Days / 7 Nights',
    price: 2499,
    originalPrice: 3099,
    discount: '19%',
    rating: 4.9,
    reviews: 523,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'Immerse in Japanese culture, visit temples, and enjoy authentic cuisine.',
    badge: 'Cultural',
    includes: ['Hotel', 'Rail Pass', 'Tours', 'Guide'],
  },
];

const FeaturedPackages = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (pkg) => {
    addToCart({
      ...pkg,
      id: pkg.id,
      price: pkg.price,
    });
  };

  return (
    <section id="packages" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4"
          >
            <FaFire className="mr-2" />
            <span className="font-semibold">Limited Time Offers</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked exclusive deals with amazing discounts for your next adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {featuredPackages.map((pkg, index) => (
            <motion.div 
              key={pkg.id} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {pkg.discount} OFF
                </div>
                <div className="absolute top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-full font-semibold shadow-lg">
                  {pkg.badge}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                  {pkg.name}
                </h3>

                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="text-primary mr-2" />
                  <span>{pkg.location}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <FaClock className="text-primary mr-2" />
                  <span>{pkg.duration}</span>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={index < Math.floor(pkg.rating) ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({pkg.reviews} reviews)</span>
                </div>

                <p className="text-gray-600 mb-4">{pkg.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {pkg.includes.map((item, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ {item}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-gray-400 line-through text-lg">${pkg.originalPrice}</span>
                    <span className="text-3xl font-bold text-primary ml-2">${pkg.price}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(pkg)}
                    className="btn-primary"
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
