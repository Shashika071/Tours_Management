import { FaAward, FaGlobe, FaHeart, FaUsers } from 'react-icons/fa';

import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { icon: FaGlobe, value: '150+', label: 'Destinations' },
    { icon: FaUsers, value: '50K+', label: 'Happy Travelers' },
    { icon: FaAward, value: '15+', label: 'Years Experience' },
    { icon: FaHeart, value: '98%', label: 'Satisfaction Rate' },
  ];

  const features = [
    '✓ Expert Local Guides',
    '✓ 24/7 Customer Support',
    '✓ Best Price Guarantee',
    '✓ Flexible Booking',
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              About GuideBeeLK
            </motion.h2>
            <motion.p 
              className="text-lg text-white/90 mb-6 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We are passionate about creating unforgettable travel experiences. With over 15 years
              of expertise in the tourism industry, we've helped thousands of travelers explore the
              world's most beautiful destinations.
            </motion.p>
            <motion.p 
              className="text-lg text-white/90 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Our team of experienced travel experts carefully curates each tour to ensure you get
              the best combination of adventure, culture, and relaxation. We believe that travel is
              not just about visiting places—it's about creating memories that last a lifetime.
            </motion.p>
            <div className="flex flex-wrap gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-xl"
                >
                  <p className="font-semibold">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/30 shadow-2xl hover:shadow-3xl transition-all"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileInView={{ rotate: 360 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Icon className="text-5xl mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-lg text-white/90">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
