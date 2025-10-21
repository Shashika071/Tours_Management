import { FaCalendarAlt, FaPercent, FaTag } from 'react-icons/fa';

import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const specialOffers = [
  {
    id: 201,
    name: 'Early Bird Special',
    destination: 'Sigiriya Cultural Tour',
    discount: '30%',
    validUntil: 'Dec 31, 2025',
    price: 299,
    originalPrice: 428,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    description: 'Book 3 months in advance and save big on this Sri Lankan cultural paradise.',
    tag: 'Early Bird',
    duration: '6 Days',
  },
  {
    id: 202,
    name: 'Last Minute Deal',
    destination: 'Colombo City Break',
    discount: '40%',
    validUntil: 'Limited Stock',
    price: 179,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    description: 'Grab this incredible last-minute offer for luxury Colombo experience.',
    tag: 'Last Minute',
    duration: '5 Days',
  },
  {
    id: 203,
    name: 'Group Discount',
    destination: 'Kandy Heritage Tour',
    discount: '25%',
    validUntil: 'Jan 15, 2026',
    price: 249,
    originalPrice: 333,
    image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=800&q=80',
    description: 'Book for 4+ people and enjoy exclusive group rates on this cultural adventure.',
    tag: 'Group Deal',
    duration: '7 Days',
  },
  {
    id: 204,
    name: 'Weekend Escape',
    destination: 'Galle Fort Getaway',
    discount: '35%',
    validUntil: 'Dec 20, 2025',
    price: 149,
    originalPrice: 230,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    description: 'Perfect weekend getaway with amazing savings on Sri Lankan coastal paradise.',
    tag: 'Weekend',
    duration: '3 Days',
  },
];

const SpecialOffers = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (offer) => {
    addToCart({
      ...offer,
      location: offer.destination,
    });
  };

  return (
    <section id="offers" className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full mb-4 animate-pulse"
          >
            <FaPercent className="mr-2" />
            <span className="font-bold">SPECIAL OFFERS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Exclusive Deals & Offers
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't miss out on these incredible limited-time offers and save on your dream vacation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white rounded-2xl overflow-hidden text-gray-800 shadow-xl"
            >
              <div className="relative">
                <img
                  src={offer.image}
                  alt={offer.destination}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
                  -{offer.discount}
                </div>
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  {offer.tag}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{offer.name}</h3>
                <p className="text-gray-600 font-semibold mb-2">{offer.destination}</p>
                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaCalendarAlt className="mr-2 text-primary" />
                  <span>Valid until: {offer.validUntil}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-gray-400 line-through text-sm">${offer.originalPrice}</div>
                    <div className="text-2xl font-bold text-primary">${offer.price}</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(offer)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Grab Deal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Limited time offers - Book now before they're gone!</p>
          <div className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold">
            <FaTag className="mr-2 text-orange-500" />
            <span>More offers coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
