import About from '../components/About';
import BidTours from '../components/BidTours';
import DestinationByMood from '../components/DestinationByMood';
import FeaturedPackages from '../components/FeaturedPackages';
import Hero from '../components/Hero';
import SpecialOffers from '../components/SpecialOffers';
import Testimonials from '../components/Testimonials';
import TopTours from '../components/TopTours';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedPackages />
      <TopTours />
      <BidTours />
      <DestinationByMood />
      <SpecialOffers />
      <WhyChooseUs />
      <About />
      <Testimonials />
    </div>
  );
};

export default Home;
