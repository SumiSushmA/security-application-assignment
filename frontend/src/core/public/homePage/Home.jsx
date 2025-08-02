import { useRef, useState } from 'react';
import BottomNavBar from '../../../components/BottomNavBar';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import AboutPlaceMate from './AboutPlaceMate';
import HeroSection from './PropertyHeroSection';
import RecommendSection from './RecommendSection';
import WhyPlaceMate from './WhyPlaceMate';

const Home = () => {
  const recommendRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Recommended");

  const scrollToRecommendSection = () => {
    setActiveTab("New Listings");
    recommendRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-white text-black min-h-screen w-full">
        <Navbar />
        <HeroSection scrollToRecommendSection={scrollToRecommendSection} />

        {/* Explore by Purpose */}
        <section className="py-16 px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Explore by Purpose</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Homes for Families", desc: "Spacious and peaceful for your loved ones." },
              { title: "Homes for Bachelors", desc: "Modern and convenient lifestyle." },
              { title: "Networking", desc: "Business-ready rentals in prime locations." },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition duration-300 hover:scale-[1.03]"
              >
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-700 text-center">{item.desc}</p>
                <button className="mt-4 text-gray-900 border border-gray-800 px-4 py-2 rounded-md hover:bg-black hover:text-white transition-all duration-300">
                  Explore
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Why PlaceMate Section */}
        <WhyPlaceMate />

        {/* About PlaceMate Section */}
        <AboutPlaceMate />

        {/* Recommend Section */}
        <div ref={recommendRef}>
          <RecommendSection activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <BottomNavBar />
        <Footer />
      </div>
    </>
  );
};

export default Home;

