import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { getFlagUrl, shortName, TOP_3_AVATARS } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { MiniLoader } from "../common/Loader";

const HeroSection = () => {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [_countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("/assets/countries.json")
      .then((res) => res.json())
      .then(setCountries)
      .catch((err) => console.error("Countries load error:", err));
  }, []);

  const fetchTopPlayers = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "leaderboard", "advanced", "players");
      const q = query(colRef, orderBy("score", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.slice(0, 10).map((doc, i) => {
        const p = doc.data();
        const isTop3 = i < 3;

        return {
          rank: i + 1,
          username: p.username || "Anonymous",
          wpm: `${Math.round(p.score)} WPM`,
          accuracy: p.accuracy ? `${Math.round(p.accuracy)}%` : "-",
          flagCode: p.country || "XX",
          avatar: isTop3 ? TOP_3_AVATARS[i] : null,
        };
      });

      setTopPlayers(data);
    } catch (err) {
      console.error("Failed to load top players:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopPlayers();
  }, []);

  const podiumOrder =
    topPlayers.length >= 3
      ? [topPlayers[1], topPlayers[0], topPlayers[2]]
      : topPlayers;

  return (
    <section className="relative min-h-screen py-10 overflow-hidden">
      <div className="mx-auto px- sm:px-6 lg:px-18 relative z-10">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          {/* Left Content */}
          <div className="text-white space-y-10 mt-20">
            <h1
              className="text-5xl sm:text-7xl space-y-2.5 font-medium leading-[1.1]"
              style={{ fontFamily: "Anton, sans-serif" }}
            >
              <span className="text-brand block max-lg:text-center">
                Master Your Typing <br />
                Skills with RallyTyper
                <img
                  src="/images/tyre.svg"
                  alt="Tyre"
                  className="inline-block w-14 h-14 sm:w-22 sm:h-22 ml-3 mb-1"
                />
              </span>
              {/* <span className="text-brand flex items-center gap-2">
              </span> */}
              <span className="text-white block mt-3 max-lg:text-center">
                The Ultimate Typing Game!
              </span>
            </h1>
            <p
              className="text-lg lg:text-2xl text-white/90 lg:max-w-2xl w-full leading-11 max-lg:text-center max-lg:px-3"
              style={{ fontFamily: "ADLaM Display, sans-serif" }}
            >
              Get ready for a high-speed challenge where your typing skills
              determine your success! All while having fun. Best of all. it's a
              free typing game online that helps you improve with every race!
            </p>
          </div>

          {/* Right Content - Leaderboard */}
          <div className="bg-linear-to-b from-[#CF4B03] to-brand rounded-2xl px-2 sm:px-6 py-4 shadow-2xl">
            <div className="text-center mb-2">
              <h2
                className="text-white text-2xl lg:text-4xl text-shadow-lg font-bold mb-16"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                OUR TOP PLAYERS
              </h2>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <MiniLoader />
                </div>
              ) : (
                <div className="flex justify-center items-end gap-6 mb-6">
                  {podiumOrder.map((player) => {
                    if (!player) return null;
                    const isFirst = player.rank === 1;
                    const isSecond = player.rank === 2;
                    const isThird = player.rank === 3;

                    return (
                      <div
                        key={player.rank}
                        className={`flex flex-col items-center ${
                          isFirst ? "z-20" : "z-10"
                        } ${
                          isSecond
                            ? "relative left-9 bottom-4"
                            : isThird
                            ? "relative right-9 bottom-4"
                            : ""
                        }`}
                        style={{ fontFamily: "'NATS Regular', sans-serif" }}
                      >
                        <div
                          className={`relative ${
                            isFirst ? "w-32 h-32" : "w-21 h-21"
                          }`}
                        >
                          {isFirst && (
                            <img
                              src="/images/crown.png"
                              alt="Crown"
                              className="absolute -top-14 left-1/2 -translate-x-1/2 w-23 h-20 z-20"
                            />
                          )}
                          <div
                            className={`w-full h-full rounded-full border-4 ${
                              isFirst
                                ? "border-yellow-400 bg-yellow-400"
                                : isSecond
                                ? "border-white bg-white"
                                : "border-[#FF8228] bg-[#FF8228]"
                            } flex items-center justify-center overflow-hidden`}
                          >
                            <img
                              src={player.avatar || "/images/avatar.svg"}
                              alt={player.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div
                            className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm border-3 border-brand-blue ${
                              isFirst
                                ? "bg-yellow-400"
                                : isSecond
                                ? "bg-white"
                                : "bg-[#FF8228]"
                            } text-black`}
                          >
                            {player.rank}
                          </div>
                        </div>
                        <p className="text-white text-lg mt-3">
                          {shortName(player.username)}
                        </p>
                        <p className="text-white/80 -mt-2">{player.wpm}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div
                className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 bg-brand-dark-4 px-3 sm:px-8 py-3 mb-3 rounded-xl text-white font-bold text-sm uppercase"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                <div>USERNAME</div>
                <div className="text-center">ACCURACY</div>
                <div className="text-center">WPM</div>
              </div>

              {topPlayers.map((player, index) => {
                const bgColor =
                  player.rank === 1
                    ? "bg-[#FFCA28]"
                    : player.rank === 2
                    ? "bg-[#1A1B3D]"
                    : player.rank === 3
                    ? "bg-[#4B1507]"
                    : "bg-brand-dark-4";

                return (
                  <div
                    key={index}
                    className={`grid grid-cols-[1.5fr_1fr_1fr] gap-2 px-3 sm:px-6 py-2 rounded-xl hover:brightness-110 transition-all ${bgColor}`}
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    <div className="flex items-center gap-2 flex-nowrap">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-dark-4 flex items-center justify-center flex-shrink-0">
                        <img
                          src={player.avatar || "/images/avatar.svg"}
                          alt={player.username}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Username + Flag */}
                      <div className="flex items-center gap-1 flex-nowrap min-w-0">
                        <span className="text-white font-bold text-base truncate">
                          {shortName(player.username)}
                        </span>
                        <img
                          src={getFlagUrl(player.flagCode)}
                          alt={player.flagCode}
                          className="w-6 h-4 object-cover rounded flex-shrink-0"
                          onError={(e) => (e.target.src = "/images/earth.png")}
                        />
                      </div>
                    </div>

                    {/* Accuracy */}
                    <div className="text-center text-white font-bold text-sm sm:text-base">
                      {player.accuracy}
                    </div>

                    {/* WPM */}
                    <div className="text-center my-auto text-white font-bold text-sm sm:text-base">
                      {player.wpm}
                    </div>
                  </div>
                );
              })}

              <div className="text-center mt-3">
                <Button
                  variant="brandDark"
                  size="xl"
                  onClick={() => {
                    const el = document.getElementById("leaderboard-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
