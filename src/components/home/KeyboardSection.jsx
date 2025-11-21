import React from "react";

const KeyboardSection = () => {
  return (
    <section className="pt-10 px-6 md:px-16 bg-black">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="flex justify-center">
            <img
              src="/images/keyboard.svg"
              alt="Gaming Keyboard"
              className="w-full max-w-xl"
            />
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <h2
              className="text-white text-4xl md:text-5xl font-medium"
              style={{ fontFamily: "Anton, sans-serif" }}
            >
              Boost Your Typing Speed with RallyTyper's Fast-Paced, Game-Style
              Learning
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Looking for an exciting way to boost your typing speed? RallyTyper
              makes learning fun by turning typing practice into an
              adrenaline-pumping race. Whether you're preparing for a typing
              test or just looking to sharpen your skills, our game keeps you
              engaged and improving every time you play. Perfect for Classrooms
              & Learning Why should you play typing games? Because they enhance
              focus, improve hand-eye coordination, and help you boost your
              typing speed while keeping learning exciting. While there are many
              games for improving your typing speed, none match the thrill of
              RallyTyper's fast-paced, race-based format!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyboardSection;
