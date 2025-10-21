import { Link } from 'react-router-dom';
import TourCard from './TourCard';

const tours = [
  {
    id: 1,
    name: 'Paris City Tour',
    location: 'Paris, France',
    duration: '5 Days',
    price: 1299,
    rating: 4.8,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'Experience the magic of Paris with visits to the Eiffel Tower, Louvre Museum, and more.',
    featured: true,
  },
  {
    id: 2,
    name: 'Bali Paradise',
    location: 'Bali, Indonesia',
    duration: '7 Days',
    price: 1599,
    rating: 4.9,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Discover tropical paradise with pristine beaches, temples, and vibrant culture.',
    featured: true,
  },
  {
    id: 3,
    name: 'Swiss Alps Adventure',
    location: 'Switzerland',
    duration: '6 Days',
    price: 1899,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
    description: 'Breathtaking mountain views, skiing, and charming alpine villages await you.',
    featured: false,
  },
  {
    id: 4,
    name: 'Tokyo Explorer',
    location: 'Tokyo, Japan',
    duration: '8 Days',
    price: 2199,
    rating: 4.9,
    reviews: 421,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    description: 'Immerse yourself in Japanese culture, technology, and culinary delights.',
    featured: true,
  },
  {
    id: 5,
    name: 'Greek Islands Cruise',
    location: 'Greece',
    duration: '10 Days',
    price: 2499,
    rating: 4.8,
    reviews: 298,
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80',
    description: 'Sail through the stunning Greek islands and explore ancient history.',
    featured: false,
  },
  {
    id: 6,
    name: 'Dubai Luxury',
    location: 'Dubai, UAE',
    duration: '5 Days',
    price: 1799,
    rating: 4.6,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    description: 'Experience luxury and modern architecture in the heart of the desert.',
    featured: false,
  },
];

const TopTours = () => {
  return (
    <section id="tours" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Top Tours & Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of the world's most amazing destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/all-tours" className="btn-primary inline-block">
            See More Tours
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopTours;
export { tours };
