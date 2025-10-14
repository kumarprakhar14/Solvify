import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import PortfolioSection from './components/PortfolioSection';
import AboutUsSection from './components/AboutUsSection';

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      <Header />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <AboutUsSection />
    </div>
  );
};

export default App;