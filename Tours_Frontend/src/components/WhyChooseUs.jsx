import { FaAward, FaCheckCircle, FaDollarSign, FaGlobeAmericas, FaHeadset, FaShieldAlt } from 'react-icons/fa';

import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const features = [
    {
      icon: FaCheckCircle,
      title: 'Best Price Guarantee',
      description: 'We ensure you get the best value for your money with our price match guarantee.',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: FaHeadset,
      title: '24/7 Customer Support',
      description: 'Our dedicated team is available round the clock to assist you with any queries.',
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Booking',
      description: 'Your personal information and payments are protected with advanced security.',
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      icon: FaDollarSign,
      title: 'Local Expertise',
      description: 'Our experienced local guides provide authentic insights and cultural understanding.',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
    },
    {
      icon: FaAward,
      title: 'Personalized Tours',
      description: 'Custom-tailored itineraries designed to match your interests and preferences.',
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      icon: FaGlobeAmericas,
      title: 'Sri Lanka Expertise',
      description: 'Deep knowledge of Sri Lanka with expert local guides and authentic experiences.',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide exceptional service and unforgettable experiences that make your journey truly special
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group hover:shadow-2xl transition-all duration-300 p-8 rounded-2xl bg-white border border-gray-100 hover:border-transparent"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className={`${feature.bg} w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`text-3xl ${feature.color}`} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
