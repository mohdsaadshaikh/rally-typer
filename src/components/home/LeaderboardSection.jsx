import React, { useState, useEffect } from "react";
import DifficultyCard from "./DifficultyCard";
import { Trophy, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { shortName, TOP_3_AVATARS } from "@/lib/utils";
import { MiniLoader } from "../common/Loader";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const FALLBACK_AVATAR = "/images/avatar.svg";

const LeaderboardSection = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("NORMAL");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  const difficulties = ["NOOB", "EASY", "NORMAL", "HARD", "ADVANCE"];
  const difficultyMap = {
    NOOB: "noob",
    EASY: "easy",
    NORMAL: "normal",
    HARD: "hard",
    ADVANCE: "advanced",
  };

  useEffect(() => {
    fetch("/assets/countries.json")
      .then((res) => res.json())
      .then(setCountries)
      .catch((err) => console.error("Countries load error:", err));
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const diff = difficultyMap[selectedDifficulty];
      const colRef = collection(db, "leaderboard", diff, "players");
      const q = query(colRef, orderBy("score", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc, i) => {
        const p = doc.data();
        const isTop3 = i < 3;

        return {
          id: doc.id,
          username: p.username || "Anonymous",
          score: p.score,
          accuracy: p.accuracy,
          country: p.country || "XX",
          avatar: isTop3 ? TOP_3_AVATARS[i] : FALLBACK_AVATAR,
          date: p.date || null,
        };
      });

      setLeaderboardData(data);
    } catch (err) {
      setError("Failed to load leaderboard. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedDifficulty]);

  const topThree = leaderboardData.slice(0, 3).map((p, i) => ({
    name: p.username,
    score: p.score,
    avatar: p.avatar,
    position: i + 1,
    trophyColor: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32",
    // trophySize: i === 0 ? 48 : 32,
    trophySize:
      i === 0
        ? "[@media(min-width:680px)]:w-12 [@media(min-width:680px)]:h-12 w-8 h-8"
        : "[@media(min-width:680px)]:w-8 [@media(min-width:680px)]:h-8 w-6 h-6",

    size:
      i === 0
        ? "w-40 h-40 max-[520px]:w-28 max-[520px]:h-28"
        : "w-28 h-28 max-[520px]:w-20 max-[520px]:h-20",
    textSize: i === 0 ? "text-2xl" : "text-xl",
    placement:
      i === 0
        ? "left-1/2 transform -translate-x-1/2"
        : i === 1
        ? "left-[11%]"
        : "right-[11%]",
    topOffset: i === 0 ? "-top-2" : "top-4",
    borderColor: i === 0 ? "border-brand-gold" : "border-white",
    nameColor: i === 0 ? "text-brand-gold" : "text-white",
  }));

  const getFlagUrl = (code) => {
    if (!code || code === "XX") return "/images/earth.png";
    const upperCode = code.toUpperCase();
    const country = countries.find((c) => c.code === upperCode);
    if (country?.flag) return country.flag;
    return `https://flagcdn.com/${code.toLowerCase()}.svg`;
  };

  console.log("Leaderboard Data:", leaderboardData);

  return (
    <section className="py-20 md:px-8 bg-black" id="leaderboard-section">
      <div className="md:mx-auto max-w-6xl">
        <div className="bg-linear-to-r from-brand to-[#d94d05] h-[465px] max-[520px]:h-96 py-8 text-center shadow-xl relative overflow-visible">
          <h2
            className="text-white uppercase mb-16 font-black text-5xl max-[450px]:text-3xl"
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 900,
              textShadow:
                "0px 3.85px 0px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            Leaderboard
          </h2>

          {loading && <MiniLoader />}
          {error && <div className="text-red-400 text-xl">{error}</div>}

          {!loading && !error && topThree.length > 0 && (
            <div className="relative w-full h-64 flex items-center justify-center select-none ">
              <img
                src="/images/top-players.svg"
                alt="top players background"
                className="absolute max-[680px]:hidden inset-0 sm:w-full w-3/4 mx-auto h-full object-contain"
              />
              <div className="relative flex -top-38 justify-center items-center gap-4 w-full max-w-2xl z-10">
                {topThree.map((player) => (
                  <div
                    key={player.position}
                    className={`flex flex-col items-center absolute ${player.placement} ${player.topOffset}`}
                  >
                    <span
                      className={`text-white ${player.textSize} font-bold mb-8`}
                    >
                      #{player.position}
                    </span>
                    <div className="relative">
                      <div
                        className={`${player.size} rounded-full overflow-hidden border-4 ${player.borderColor} shadow-2xl flex items-center justify-center`}
                      >
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.src = FALLBACK_AVATAR)}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <Trophy
                        className={player.trophySize}
                        fill={player.trophyColor}
                        color={player.trophyColor}
                      />
                    </div>
                    <div
                      className={`${player.nameColor} font-bold text-sm md:text-base mt-4`}
                    >
                      {shortName(player.name)}
                    </div>
                    <div className="text-white text-xs md:text-sm">
                      {Math.round(player.score)} WPM
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-brand-dark-3 lg:p-10 p-3">
          <div className="grid grid-cols-5 max-w-5xl mx-auto my-10 md:gap-6 gap-3 relative z-10">
            {difficulties.map((difficulty) => (
              <DifficultyCard
                key={difficulty}
                difficulty={difficulty}
                isSelected={selectedDifficulty === difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
              />
            ))}
            <div className="col-span-5 flex justify-end">
              <button
                onClick={fetchLeaderboard}
                className="flex items-center justify-center gap-2 text-white hover:text-brand transition mr-2 cursor-pointer"
              >
                <RefreshCw
                  size={20}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
          <ScrollArea className="w-full rounded-md whitespace-nowrap">
            <div className="space-y-4 min-w-2xl">
              <div className="grid grid-cols-6 gap-8 md:p-6 p-4 bg-brand-dark-2 rounded-lg">
                <div className="text-white text-[10px] [@media(min-width:520px)]:text-sm lg:text-lg font-medium uppercase">
                  Position
                </div>
                <div className="text-white text-[10px] [@media(min-width:520px)]:text-sm lg:text-lg font-medium uppercase">
                  Username
                </div>
                <div className="text-center text-white text-[10px] [@media(min-width:520px)]:text-sm lg:text-lg font-medium uppercase">
                  Country
                </div>
                <div className="text-center text-white text-[10px] [@media(min-width:520px)]:text-sm lg:text-lg font-medium uppercase">
                  Accuracy
                </div>
                <div className="text-center text-white text-[10px] [@media(min-width:520px)]:text-sm lg:text-lg font-medium uppercase">
                  WPM
                </div>
                <div className="text-center text-white text-[10px] [@media(min-width:520px)]:text-sm md:text-lg font-medium uppercase">
                  Date
                </div>
              </div>

              {!loading && !error && leaderboardData.length === 0 && (
                <div className="text-center text-white py-10">
                  No scores yet. Be the first!
                </div>
              )}

              {leaderboardData.slice(0, 20).map((player, index) => (
                <div className="grid grid-cols-6 items-center lg:px-8 md:py-5 px-3 py-2 bg-brand-dark-4 rounded-lg hover:bg-brand-dark-2 transition-colors duration-200">
                  <div className="text-white font-bold sm:text-lg text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Username + Avatar */}
                  <div className="flex items-center gap-4 flex-nowrap">
                    <div className="lg:w-14 lg:h-14 w-10 h-10 rounded-full overflow-hidden flex items-center shrink-0 justify-center bg-transparent">
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = FALLBACK_AVATAR)}
                      />
                    </div>
                    <span className="text-white font-medium lg:text-lg text-sm">
                      {shortName(player.username, 12)}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <img
                      src={getFlagUrl(player.country)}
                      alt={player.country}
                      className="md:w-12 md:h-8 w-8 h-5 object-cover shadow-sm rounded"
                      onError={(e) => (e.target.src = "/images/earth.png")}
                    />
                  </div>

                  <div className="text-center text-white font-medium lg:text-lg text-sm">
                    {player.accuracy ? `${Math.round(player.accuracy)}%` : "-"}
                  </div>

                  <div className="text-center text-white font-medium lg:text-lg text-sm">
                    {Math.round(player.score)} WPM
                  </div>

                  <div className="text-center text-white font-medium lg:text-lg text-sm">
                    {player.date}
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="" />
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
