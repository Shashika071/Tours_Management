import { Link } from 'react-router-dom';
import TourCard from './TourCard';

const tours = [
  {
    id: 1,
    name: 'Colombo City Explorer',
    location: 'Colombo, Sri Lanka',
    duration: '3 Days',
    price: 299,
    rating: 4.8,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    description: 'Discover Colombo\'s colonial heritage, bustling markets, and vibrant street life.',
    featured: true,
  },
  {
    id: 2,
    name: 'Tea Country Escape',
    location: 'Nuwara Eliya, Sri Lanka',
    duration: '4 Days',
    price: 449,
    rating: 4.9,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    description: 'Experience the misty hills, tea plantations, and colonial charm of Sri Lanka\'s hill country.',
    featured: true,
  },
  {
    id: 3,
    name: 'Ancient Anuradhapura',
    location: 'Anuradhapura, Sri Lanka',
    duration: '2 Days',
    price: 199,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    description: 'Explore ancient Buddhist ruins, sacred temples, and the birthplace of Sri Lankan civilization.',
    featured: false,
  },
  {
    id: 4,
    name: 'Polonnaruwa Heritage',
    location: 'Polonnaruwa, Sri Lanka',
    duration: '2 Days',
    price: 249,
    rating: 4.9,
    reviews: 421,
    image: 'https://images.unsplash.com/photo-1544008230-ac1e1fb4f4f4?auto=format&fit=crop&w=800&q=80',
    description: 'Discover medieval Sri Lankan history with magnificent statues and ancient irrigation systems.',
    featured: true,
  },
  {
    id: 5,
    name: 'Ella Scenic Journey',
    location: 'Ella, Sri Lanka',
    duration: '3 Days',
    price: 349,
    rating: 4.8,
    reviews: 298,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'Hike to Little Adam\'s Peak, visit Nine Arches Bridge, and enjoy breathtaking valley views.',
    featured: false,
  },
  {
    id: 6,
    name: 'Negombo Beach Retreat',
    location: 'Negombo, Sri Lanka',
    duration: '3 Days',
    price: 279,
    rating: 4.6,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    description: 'Relax on golden beaches, explore Dutch forts, and enjoy fresh seafood by the Indian Ocean.',
    featured: false,
  },
];

const TopTours = () => {
  return (
    <section id="tours" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sri Lanka's Top Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular destinations and experiences across the beautiful island of Sri Lanka
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
