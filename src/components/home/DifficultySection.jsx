import { useState, useEffect, useRef } from "react";
import DifficultyCard from "./DifficultyCard";
import { submitGameResults } from "@/lib/gameApi";

const DifficultySection = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("NORMAL");
  const [showGame, setShowGame] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  const iframeRef = useRef(null);

  const difficulties = ["NOOB", "EASY", "NORMAL", "HARD", "ADVANCE"];

  const handleStartGame = () => {
    const difficultyIndex = difficulties.indexOf(selectedDifficulty);

    const userData = {
      username: localStorage.getItem("username") || "Player",
      country: localStorage.getItem("country") || "United States",
      countryCode: localStorage.getItem("countryCode") || "US",
      playerId: localStorage.getItem("playerId") || "",
    };

    // Yeh zaroori hai!
    sessionStorage.setItem("gameUserData", JSON.stringify(userData));
    sessionStorage.setItem("gameDifficulty", difficultyIndex.toString()); // <-- String

    setIsLoading(true);
    setShowGame(true);
    setGameResults(null);

    setTimeout(() => {
      const gameContainer = document.getElementById("game-container");
      if (gameContainer && document.fullscreenEnabled) {
        gameContainer.requestFullscreen().catch(() => {});
      }
    }, 100);
  };

  const handleCloseGame = () => {
    setShowGame(false);
    setIsLoading(false);
    setGameResults(null);
    sessionStorage.removeItem("gameUserData");
    sessionStorage.removeItem("gameDifficulty");

    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "GAME_RESULTS") {
        console.log("🎮 Game Results Received:", event.data.payload);
        setGameResults(event.data.payload);

        // Auto-submit to Firebase
        submitGameResults(event.data.payload)
          .then((response) => {
            console.log("✅ Results saved:", response);
            // Optional: Show success message
          })
          .catch((error) => {
            console.error("❌ Submit failed:", error);
            // Optional: Show error toast
          });
      }
    };

    const handleFullscreenChange = () => {
      // If user exits fullscreen, close the game
      if (!document.fullscreenElement && showGame) {
        handleCloseGame();
      }
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [showGame]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <section id="difficulty" className="py-20 px-6 bg-brand-dark-1">
        <div className="container mx-auto space-y-14 max-w-4xl">
          {/* Title */}
          <div className="relative">
            <div
              className="bg-contain bg-center bg-no-repeat py-8 px-8 text-center min-h-[120px] flex items-start justify-center pt-5"
              style={{
                backgroundImage: "url('/images/choose-difficulty.svg')",
              }}
            >
              <h2
                className="text-white text-4xl font-black uppercase tracking-normal leading-relaxed"
                style={{
                  fontFamily: "Nunito, sans-serif",
                  textShadow: "0px 3.85px 0px rgba(0, 0, 0, 0.15)",
                }}
              >
                CHOOSE DIFFICULTY
              </h2>
            </div>
          </div>

          {/* Difficulty Cards */}
          <div className="grid grid-cols-5 w-full gap-6">
            {difficulties.map((difficulty) => (
              <DifficultyCard
                key={difficulty}
                difficulty={difficulty}
                isSelected={selectedDifficulty === difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
              />
            ))}
          </div>

          {/* Let's Ride Button */}
          <div className="text-center mt-20">
            <div
              className="inline-block bg-contain bg-center bg-no-repeat px-10 py-8 cursor-pointer hover:scale-105 transition-transform duration-300"
              style={{
                backgroundImage: "url('/images/lets-ride.svg')",
                minWidth: "200px",
                minHeight: "100px",
              }}
              onClick={handleStartGame}
            >
              <div className="flex items-center justify-center gap-3">
                <img src="/images/play.svg" alt="Play" className="w-10 h-10" />
                <span
                  className="text-white text-4xl font-black uppercase tracking-normal leading-relaxed"
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    textShadow: "0px 3.85px 0px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  LETS RIDE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Iframe Overlay */}
      {showGame && (
        <div id="game-container" className="fixed inset-0 z-50 bg-gray-900">
          {/* Close Button */}
          <button
            onClick={handleCloseGame}
            className="absolute top-4 right-4 z-50 bg-brand hover:bg-brand/90 cursor-pointer text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-colors"
          >
            ✕ Exit Game
          </button>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-40">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white text-xl font-semibold">
                  Loading Game...
                </p>
              </div>
            </div>
          )}

          {/* Game Results Overlay */}
          {gameResults && (
            <div className="absolute top-4 left-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
              <p className="font-semibold">✅ Results Saved!</p>
              <p className="text-sm">GWAM: {gameResults.gwam}</p>
            </div>
          )}

          {/* Game Iframe */}
          <iframe
            ref={iframeRef}
            src={`/game/index.html?difficulty=${difficulties.indexOf(
              selectedDifficulty
            )}`}
            title="Rally Typer Game"
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
          />
          {/* <iframe
            allow="fullscreen"
            className="w-full h-full border-0"
            src="https://rallytyper.com/Newgame"
            title="New Game "
            // className="iframe"
          /> */}
        </div>
      )}
    </>
  );
};

export default DifficultySection;
// import { useState, useEffect, useRef } from "react";
// import DifficultyCard from "./DifficultyCard";
// import { submitGameResults, getPlayerId } from "@/lib/gameApi";

// const DifficultySection = () => {
//   const [selectedDifficulty, setSelectedDifficulty] = useState("NORMAL");
//   const [showGame, setShowGame] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [gameResults, setGameResults] = useState(null);
//   const [resultMessage, setResultMessage] = useState("");
//   const [showUserForm, setShowUserForm] = useState(false);
//   const iframeRef = useRef(null);

//   const difficulties = ["NOOB", "EASY", "NORMAL", "HARD", "ADVANCED"];

//   const handleStartGame = async () => {
//     const difficultyIndex = difficulties.indexOf(selectedDifficulty);

//     // Player ID generate karein
//     const playerId = await getPlayerId();

//     // User data prepare karein
//     const userData = {
//       username: localStorage.getItem("username") || "",
//       country: localStorage.getItem("country") || "",
//       countryCode: localStorage.getItem("countryCode") || "",
//       playerId: playerId,
//     };

//     // Session storage mein store karein
//     sessionStorage.setItem("gameUserData", JSON.stringify(userData));
//     sessionStorage.setItem("gameDifficulty", difficultyIndex.toString());

//     setIsLoading(true);
//     setShowGame(true);
//     setGameResults(null);
//     setResultMessage("");

//     // Fullscreen request
//     setTimeout(() => {
//       const gameContainer = document.getElementById("game-container");
//       if (gameContainer && document.fullscreenEnabled) {
//         gameContainer.requestFullscreen().catch((err) => {
//           console.log("Fullscreen request failed:", err);
//         });
//       }
//     }, 100);
//   };

//   const handleCloseGame = () => {
//     setShowGame(false);
//     setIsLoading(false);
//     setGameResults(null);
//     setResultMessage("");
//     setShowUserForm(false);

//     // Exit fullscreen
//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//     }
//   };

//   const handleSubmitToLeaderboard = async (formData) => {
//     try {
//       const { username, country, countryCode } = formData;

//       // Game results ke saath user data merge karein
//       const completeResults = {
//         ...gameResults,
//         username,
//         country,
//         countryCode,
//       };

//       const response = await submitGameResults(completeResults);

//       if (response.success) {
//         setResultMessage("✅ " + response.message);
//         setShowUserForm(false);
//       } else {
//         setResultMessage("⚠️ " + response.message);
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//       setResultMessage("❌ Submission failed: " + error.message);
//     }
//   };

//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== window.location.origin) return;

//       if (event.data?.type === "GAME_RESULTS") {
//         console.log("🎮 Game Results Received:", event.data.payload);
//         const results = event.data.payload;
//         setGameResults(results);

//         // Check karein ke user data already hai ya nahi
//         const hasUserData =
//           localStorage.getItem("username") && localStorage.getItem("country");

//         if (hasUserData) {
//           // Agar data hai to seedha submit karein
//           const userData = {
//             username: localStorage.getItem("username"),
//             country: localStorage.getItem("country"),
//             countryCode: localStorage.getItem("countryCode"),
//           };

//           submitGameResults({ ...results, ...userData })
//             .then((response) => {
//               console.log("✅ Results saved:", response);
//               setResultMessage(
//                 response.success
//                   ? "✅ " + response.message
//                   : "⚠️ " + response.message
//               );
//             })
//             .catch((error) => {
//               console.error("❌ Save failed:", error);
//               setResultMessage("❌ Save failed");
//             });
//         } else {
//           // Nahi to form dikhayein
//           setShowUserForm(true);
//         }
//       }
//     };

//     const handleFullscreenChange = () => {
//       if (!document.fullscreenElement && showGame) {
//         handleCloseGame();
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     document.addEventListener("fullscreenchange", handleFullscreenChange);

//     return () => {
//       window.removeEventListener("message", handleMessage);
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//     };
//   }, [showGame]);

//   const handleIframeLoad = () => {
//     setIsLoading(false);
//   };

//   return (
//     <>
//       <section id="difficulty" className="py-20 px-6 bg-brand-dark-1">
//         <div className="container mx-auto space-y-14 max-w-4xl">
//           {/* Title */}
//           <div className="relative">
//             <div
//               className="bg-contain bg-center bg-no-repeat py-8 px-8 text-center min-h-[120px] flex items-start justify-center pt-5"
//               style={{
//                 backgroundImage: "url('/images/choose-difficulty.svg')",
//               }}
//             >
//               <h2
//                 className="text-white text-4xl font-black uppercase tracking-normal leading-relaxed"
//                 style={{
//                   fontFamily: "Nunito, sans-serif",
//                   textShadow: "0px 3.85px 0px rgba(0, 0, 0, 0.15)",
//                 }}
//               >
//                 CHOOSE DIFFICULTY
//               </h2>
//             </div>
//           </div>

//           {/* Difficulty Cards */}
//           <div className="grid grid-cols-5 w-full gap-6">
//             {difficulties.map((difficulty) => (
//               <DifficultyCard
//                 key={difficulty}
//                 difficulty={difficulty}
//                 isSelected={selectedDifficulty === difficulty}
//                 onClick={() => setSelectedDifficulty(difficulty)}
//               />
//             ))}
//           </div>

//           {/* Let's Ride Button */}
//           <div className="text-center mt-20">
//             <div
//               className="inline-block bg-contain bg-center bg-no-repeat px-10 py-8 cursor-pointer hover:scale-105 transition-transform duration-300"
//               style={{
//                 backgroundImage: "url('/images/lets-ride.svg')",
//                 minWidth: "200px",
//                 minHeight: "100px",
//               }}
//               onClick={handleStartGame}
//             >
//               <div className="flex items-center justify-center gap-3">
//                 <img src="/images/play.svg" alt="Play" className="w-10 h-10" />
//                 <span
//                   className="text-white text-4xl font-black uppercase tracking-normal leading-relaxed"
//                   style={{
//                     fontFamily: "Nunito, sans-serif",
//                     textShadow: "0px 3.85px 0px rgba(0, 0, 0, 0.15)",
//                   }}
//                 >
//                   LETS RIDE
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Game Iframe Overlay */}
//       {showGame && (
//         <div id="game-container" className="fixed inset-0 z-50 bg-gray-900">
//           {/* Close Button */}
//           <button
//             onClick={handleCloseGame}
//             className="absolute top-4 right-4 z-50 bg-brand hover:bg-brand/90 cursor-pointer text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-colors"
//           >
//             ✕ Exit Game
//           </button>

//           {/* Loading Overlay */}
//           {isLoading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-40">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
//                 <p className="text-white text-xl font-semibold">
//                   Loading Game...
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Result Message */}
//           {resultMessage && (
//             <div
//               className={`absolute top-4 left-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white ${
//                 resultMessage.includes("✅")
//                   ? "bg-green-600"
//                   : resultMessage.includes("⚠️")
//                   ? "bg-yellow-600"
//                   : "bg-red-600"
//               }`}
//             >
//               <p className="font-semibold">{resultMessage}</p>
//             </div>
//           )}

//           {/* User Form Overlay */}
//           {showUserForm && gameResults && (
//             <UserDataForm
//               onSubmit={handleSubmitToLeaderboard}
//               onCancel={() => setShowUserForm(false)}
//               gameResults={gameResults}
//             />
//           )}

//           {/* Game Iframe */}
//           <iframe
//             ref={iframeRef}
//             src={`/game/index.html?difficulty=${difficulties.indexOf(
//               selectedDifficulty
//             )}`}
//             title="Rally Typer Game"
//             className="w-full h-full border-0"
//             onLoad={handleIframeLoad}
//             allow="fullscreen"
//           />
//         </div>
//       )}
//     </>
//   );
// };

// // User Data Form Component
// const UserDataForm = ({ onSubmit, onCancel, gameResults }) => {
//   const [formData, setFormData] = useState({
//     username: localStorage.getItem("username") || "",
//     country: "",
//     countryCode: "",
//   });
//   const [countries, setCountries] = useState([]);
//   const [filteredCountries, setFilteredCountries] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   useEffect(() => {
//     // Countries data load karein
//     fetch("/assets/countries.json")
//       .then((res) => res.json())
//       .then((data) => setCountries(data))
//       .catch((err) => console.error("Countries load error:", err));
//   }, []);

//   const handleCountryInput = (value) => {
//     setFormData({ ...formData, country: value });

//     if (value.trim()) {
//       const matches = countries.filter((c) =>
//         c.name.toLowerCase().startsWith(value.toLowerCase())
//       );
//       setFilteredCountries(matches);
//       setShowDropdown(matches.length > 0);
//     } else {
//       setShowDropdown(false);
//     }
//   };

//   const handleCountrySelect = (country) => {
//     setFormData({
//       ...formData,
//       country: country.name,
//       countryCode: country.code,
//     });
//     setShowDropdown(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.username || !formData.countryCode) {
//       alert("Please fill all fields!");
//       return;
//     }
//     onSubmit(formData);
//   };

//   return (
//     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full">
//         <h3 className="text-white text-2xl font-bold mb-4">
//           Submit to Leaderboard
//         </h3>

//         <div className="mb-4 text-white">
//           <p>
//             GWAM: <span className="font-bold">{gameResults.gwam}</span>
//           </p>
//           <p>
//             Accuracy: <span className="font-bold">{gameResults.accuracy}%</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-white block mb-2">Username</label>
//             <input
//               type="text"
//               value={formData.username}
//               onChange={(e) =>
//                 setFormData({ ...formData, username: e.target.value })
//               }
//               className="w-full px-4 py-2 rounded bg-gray-700 text-white"
//               placeholder="Enter username"
//               required
//             />
//           </div>

//           <div className="relative">
//             <label className="text-white block mb-2">Country</label>
//             <input
//               type="text"
//               value={formData.country}
//               onChange={(e) => handleCountryInput(e.target.value)}
//               className="w-full px-4 py-2 rounded bg-gray-700 text-white"
//               placeholder="Select country"
//               required
//             />

//             {showDropdown && (
//               <ul className="absolute z-10 w-full bg-gray-700 mt-1 rounded max-h-48 overflow-y-auto">
//                 {filteredCountries.map((country) => (
//                   <li
//                     key={country.code}
//                     onClick={() => handleCountrySelect(country)}
//                     className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white flex items-center gap-2"
//                   >
//                     <img src={country.flag} alt="" className="w-6 h-4" />
//                     {country.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className="flex gap-4">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DifficultySection;
