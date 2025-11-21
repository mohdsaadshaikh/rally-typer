import React from "react";
import HeroSection from "@/components/home/HeroSection";
import LeaderboardSection from "@/components/home/LeaderboardSection";
import WorldMapSection from "@/components/home/WorldMapSection";
import KeyboardSection from "@/components/home/KeyboardSection";
import GlobalLeaderboardSection from "@/components/home/GlobalLeaderboardSection";
import LevelUpSection from "@/components/home/LevelUpSection";
import CountriesSection from "@/components/home/CountriesSection";
import BlogSection from "@/components/home/BlogSection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <iframe
        allow="fullscreen"
        className="w-full h-[800px] border-0 bg-black"
        // src="https://rallytyper.com/Newgame"
        src="/Newgame/index.html"
        title="New Game "
        id="game"
        // className="iframe"
      />
      <LeaderboardSection />
      <WorldMapSection />
      <KeyboardSection />
      <GlobalLeaderboardSection />
      <LevelUpSection />
      <CountriesSection />
      <BlogSection />
    </div>
  );
};

export default HomePage;
