import { FaClock, FaFire, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const featuredPackages = [
  {
    id: 101,
    name: 'Sigiriya Rock Fortress Adventure',
    location: 'Sigiriya, Sri Lanka',
    duration: '2 Days / 1 Night',
    price: 299,
    originalPrice: 399,
    discount: '25%',
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    description: 'Climb the ancient rock fortress, explore frescoes, and enjoy panoramic views of Sri Lanka.',
    badge: 'UNESCO Site',
    includes: ['Hotel', 'Guide', 'Entrance Fees', 'Meals'],
  },
  {
    id: 102,
    name: 'Kandy Cultural Experience',
    location: 'Kandy, Sri Lanka',
    duration: '3 Days / 2 Nights',
    price: 449,
    originalPrice: 549,
    discount: '18%',
    rating: 5.0,
    reviews: 678,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'Visit the Temple of the Tooth, enjoy cultural shows, and explore the hill country.',
    badge: 'Best Seller',
    includes: ['Hotel', 'Cultural Show', 'Temple Visit', 'All Meals'],
  },
  {
    id: 103,
    name: 'Yala Safari & Beach Paradise',
    location: 'Yala, Sri Lanka',
    duration: '4 Days / 3 Nights',
    price: 699,
    originalPrice: 899,
    discount: '22%',
    rating: 4.8,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1544008230-ac1e1fb4f4f4?auto=format&fit=crop&w=800&q=80',
    description: 'Safari adventures in Yala National Park and relaxation on pristine beaches.',
    badge: 'Wildlife',
    includes: ['Safari Jeep', 'Beach Resort', 'Guide', 'Meals'],
  },
  {
    id: 104,
    name: 'Galle Fort & Southern Coast',
    location: 'Galle, Sri Lanka',
    duration: '3 Days / 2 Nights',
    price: 399,
    originalPrice: 499,
    discount: '20%',
    rating: 4.9,
    reviews: 523,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    description: 'Explore the historic Galle Fort, Dutch architecture, and beautiful coastal scenery.',
    badge: 'Heritage',
    includes: ['Heritage Hotel', 'Fort Tour', 'Boat Ride', 'Meals'],
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
            Featured Sri Lankan Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked exclusive deals with amazing discounts for your Sri Lankan adventure
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
              className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col"
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

              <div className="p-6 flex-1 flex flex-col">
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

                <p className="text-gray-600 mb-4 flex-1">{pkg.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {pkg.includes.map((item, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ {item}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t mb-4">
                  <div>
                    <span className="text-gray-400 line-through text-lg">${pkg.originalPrice}</span>
                    <span className="text-3xl font-bold text-primary ml-2">${pkg.price}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(pkg)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Book Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    View Details
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
