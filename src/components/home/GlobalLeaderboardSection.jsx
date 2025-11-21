import React from "react";
import { Button } from "@/components/ui/button";

const GlobalLeaderboardSection = () => {
  return (
    <section className="px-6 md:px-16 py-20 bg-black">
      <div className="mx-auto max-w-7xl container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-6">
            <h2
              className="text-white text-4xl md:text-5xl font-medium"
              style={{ fontFamily: "Anton, sans-serif" }}
            >
              Compete Globally, Climb the Leaderboard, and Represent Your
              Country with Pride
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Compete on the Global Leaderboard & Represent Your Country! Think
              you're fast enough to make the leaderboard? RallyTyper is the only
              game that features a Top 20 Leaderboard, recognizing the best
              typists from around the world! Enter your country, test your
              skills with our typing test, and see if you have what it takes to
              race to the top. With fun & free games to boost typing speed,
              RallyTyper is the ultimate way to challenge yourself while
              representing your country with pride!
            </p>
            <Button
              onClick={() => {
                const el = document.getElementById("game");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded"
            >
              Play Now
            </Button>
          </div>

          {/* Right - Image */}
          <div className="flex justify-center">
            <img
              src="/images/earthglobe.png"
              alt="Global Earth"
              className="w-full lg:pl-10 max-w-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalLeaderboardSection;
