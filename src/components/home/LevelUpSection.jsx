import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <img src={icon} alt={title} className="w-20 h-20" />
      </div>
      <h3 className="text-white text-xl font-bold">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const LevelUpSection = () => {
  const features = [
    {
      icon: "/images/classroomsafe.svg",
      title: "100% Classroom Safe",
      description:
        "Start your best-case data private secure learning journey with RallyTyper",
    },
    {
      icon: "/images/skill-learning.svg",
      title: "Skill-Based Learning",
      description:
        "Get challenged by real-world tests and improve your learning with real feedback",
    },
    {
      icon: "/images/ps4.svg",
      title: "Zero Personal Data",
      description:
        "We believe in your privacy first play risk-free on your personal testing devices",
    },
    {
      icon: "/images/vr-face.svg",
      title: "Boost Test Readiness",
      description:
        "Complete a typing test series with expert tips and tricks from pro typists",
    },
  ];

  return (
    <section
      className="pb-28 px-6 bg-black relative"
      style={{
        backgroundImage: "url('/images/levelbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/75"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <h2
          className="text-white text-4xl md:text-6xl font-medium text-center mb-20 pt-20"
          style={{ fontFamily: "Anton, sans-serif" }}
        >
          Level Up Typing Skills with RallyTyper
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LevelUpSection;
