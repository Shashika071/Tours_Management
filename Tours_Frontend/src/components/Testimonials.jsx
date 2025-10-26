import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3B82F6&color=fff&size=200',
    text: 'The Sigiriya tour was absolutely incredible! Every detail was perfectly planned, and our guide was knowledgeable and friendly. Highly recommend!',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Singapore',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=8B5CF6&color=fff&size=200',
    text: 'Best vacation ever! The Kandy Cultural package exceeded all expectations. The accommodations were luxurious and the itinerary was perfect.',
  },
  {
    id: 3,
    name: 'Emma Williams',
    location: 'London, UK',
    rating: 4,
    image: 'https://ui-avatars.com/api/?name=Emma+Williams&background=F59E0B&color=fff&size=200',
    text: 'Amazing experience in Colombo! The tour was well-organized, and we got to see both traditional and modern aspects of the city. Would definitely book again.',
  },
  {
    id: 4,
    name: 'David Rodriguez',
    location: 'Madrid, Spain',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=David+Rodriguez&background=10B981&color=fff&size=200',
    text: 'The Southern Coast tour was a dream come true! Beautiful scenery, delicious food, and wonderful company. TourHub made everything seamless.',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Read real stories from our satisfied customers around the world
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="card p-6"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>

              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
