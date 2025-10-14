import React from 'react';
import PortfolioCard from './PortfolioCard';
import { ShoppingCart, BarChart, Clipboard } from 'lucide-react';

const PortfolioSection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-extrabold mb-12 text-gray-900">
          Portfolio
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <PortfolioCard
            Icon={ShoppingCart}
            title="E-commerce Website"
            description="Improved sales by 30% for a retail startup."
            linkText="View Case Study"
            link="#"
          />
          <PortfolioCard
            Icon={BarChart}
            title="Sales Forecasting Model"
            description="Enhanced prediction accuracy by 30%."
            linkText="View Case Study"
            link="#"
          />
          <PortfolioCard
            Icon={Clipboard}
            title="HR Dashboard"
            description="Automates employee evidence and scheduling."
            linkText="View Case Study"
            link="#"
          />
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
