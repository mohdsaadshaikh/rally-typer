import React from "react";
import { Marquee, MarqueeContent, MarqueeItem } from "@/components/ui/marquee";

const CountriesSection = () => {
  const countries = [
    { name: "USA", code: "us" },
    { name: "Brazil", code: "br" },
    { name: "China", code: "cn" },
    { name: "India", code: "in" },
    { name: "Pakistan", code: "pk" },
    { name: "United Kingdom", code: "gb" },
    { name: "Germany", code: "de" },
    { name: "France", code: "fr" },
    { name: "Spain", code: "es" },
    { name: "Italy", code: "it" },
    { name: "Canada", code: "ca" },
    { name: "Mexico", code: "mx" },
    { name: "Argentina", code: "ar" },
    { name: "Colombia", code: "co" },
    { name: "Peru", code: "pe" },
    { name: "Japan", code: "jp" },
    { name: "South Korea", code: "kr" },
    { name: "Australia", code: "au" },
    { name: "New Zealand", code: "nz" },
    { name: "Russia", code: "ru" },
    { name: "Turkey", code: "tr" },
    { name: "Saudi Arabia", code: "sa" },
    { name: "UAE", code: "ae" },
    { name: "Egypt", code: "eg" },
    { name: "Nigeria", code: "ng" },
    { name: "South Africa", code: "za" },
    { name: "Kenya", code: "ke" },
    { name: "Indonesia", code: "id" },
    { name: "Thailand", code: "th" },
    { name: "Vietnam", code: "vn" },
    { name: "Philippines", code: "ph" },
    { name: "Singapore", code: "sg" },
    { name: "Malaysia", code: "my" },
    { name: "Bangladesh", code: "bd" },
    { name: "Iran", code: "ir" },
    { name: "Iraq", code: "iq" },
    { name: "Poland", code: "pl" },
    { name: "Netherlands", code: "nl" },
    { name: "Belgium", code: "be" },
    { name: "Sweden", code: "se" },
    { name: "Norway", code: "no" },
    { name: "Denmark", code: "dk" },
    { name: "Finland", code: "fi" },
    { name: "Ireland", code: "ie" },
    { name: "Portugal", code: "pt" },
    { name: "Greece", code: "gr" },
    { name: "Switzerland", code: "ch" },
    { name: "Austria", code: "at" },
    { name: "Czech Republic", code: "cz" },
    { name: "Honduras", code: "hn" },
  ];

  return (
    <section className="py-20 px-6 bg-brand-dark-1">
      <div className="container mx-auto max-w-full space-y-20">
        <h2
          className="text-white text-center text-4xl md:text-6xl font-medium"
          style={{ fontFamily: "Anton, sans-serif" }}
        >
          Check Out All The Countries Representing <br /> Rally Typer!
        </h2>

        {/* First Marquee - Left to Right */}
        <Marquee className="mb-6">
          <MarqueeContent speed={50} pauseOnHover={true}>
            {countries.slice(0, 25).map((country, index) => (
              <MarqueeItem key={index}>
                <div className="aspect-video w-56 flex items-center justify-center overflow-hidden shadow-md">
                  <img
                    src={`https://flagcdn.com/${country.code}.svg`}
                    alt={`${country.name} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>
    </section>
  );
};

export default CountriesSection;
