import React from 'react';
import { Code, Cpu, BarChart } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Our Services
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
          We build digital products, intelligent systems, and automation tools for startups & SMEs.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300">
            <Code size={20} /> Get a Quote
          </button>
          <button className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300">
            <BarChart size={20} /> View Our Work
          </button>
        </div>

        {/* Service Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
            <Cpu size={32} className="text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 text-center">AI & ML Solutions</h3>
            <p className="text-gray-600 text-center">
              Build intelligent systems that automate processes and provide insights.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
            <Code size={32} className="text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 text-center">Fullstack Development</h3>
            <p className="text-gray-600 text-center">
              Create modern web & mobile applications with scalable architecture.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
            <BarChart size={32} className="text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 text-center">Data Analysis</h3>
            <p className="text-gray-600 text-center">
              Extract actionable insights from your data using advanced analytics.
            </p>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="mt-12 flex justify-center">
          <img
            src="https://via.placeholder.com/700x350.png?text=Team+Illustration"
            alt="Team working on analytics"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
