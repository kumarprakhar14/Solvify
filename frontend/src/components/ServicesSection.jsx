import React from 'react';
import ServiceCard from './ServiceCard';

const ServicesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <h2 className="text-4xl font-bold text-center mb-12">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <ServiceCard
          icon="🖥️"
          title="Full Stack Development"
          description="Modern web apps open using Starch MongoJs and available databases."
          linkText="Learn More"
        />
        <ServiceCard
          icon="🤖"
          title="Machine Learning & AI"
          description="Predictive models, automation, and all-powerful insights."
          linkText="Learn More"
        />
        <ServiceCard
          icon="📊"
          title="Data Analytics & Visualization"
          description="Interactive dashboards that help you make data-driven decisions."
          linkText="Learn More"
        />
        <ServiceCard
          icon="⏰"
          title="HR & Workflow Automation"
          description="Custom scheduling and HR Earth 5p simplify daily options."
          linkText="Learn More"
        />
      </div>
    </section>
  );
};

export default ServicesSection;