import React from 'react';

// Team member card
const TeamMember = ({ name, role, image }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transform transition-transform duration-300">
    <img
      src={image}
      alt={name}
      className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-500"
    />
    <p className="text-xl font-semibold">{name}</p>
    <p className="text-gray-600 mt-1">{role}</p>
  </div>
);

// About Us Section
const AboutUsSection = () => {
  const teamMembers = [
    {
      name: "Purnakam Shrivastava",
      role: "Data and Database Specialist",
    //   image: "https://via.placeholder.com/150x150.png?text=Purnakam",
    },
    {
      name: "Kumar Prakhar",
      role: "AI/ML Specialist / Full Stack Developer",
    //   image: "https://via.placeholder.com/150x150.png?text=Kumar",
    },
    {
      name: "Abhishek Singh Dikhit",
      role: "LLM Developer",
    //   image: "https://via.placeholder.com/150x150.png?text=Abhishek",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-5xl font-extrabold mb-8 text-gray-900">About Us</h2>
        <p className="text-lg md:text-xl text-gray-700 mb-12">
          We are a team of passionate technologists dedicated to delivering innovative solutions that drive business success.
        </p>

        {/* Client testimonial */}
        <blockquote className="text-gray-600 italic border-l-4 border-blue-500 pl-4 mb-12 max-w-3xl mx-auto">
          “They built our dashboard in record time and helped us automate HR tasks!”
          <p className="text-right mt-2 font-semibold">- Sarah Johnson, CEO</p>
        </blockquote>

        {/* Team members grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <TeamMember
              key={idx}
              name={member.name}
              role={member.role}
            //   image={member.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
