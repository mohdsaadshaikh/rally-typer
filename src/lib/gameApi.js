// // API service for game-related endpoints

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// /**
//  * Submit game results to the backend leaderboard
//  * @param {Object} gameResults - The game results object from the game
//  * @returns {Promise} API response
//  */
// export const submitGameResults = async (gameResults) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/leaderboard`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // Add auth token if needed
//         // "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(gameResults),
//     });
//     console.log(response);

//     if (!response.ok) {
//       throw new Error(`Failed to submit results: ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log("✅ Results submitted successfully:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Error submitting game results:", error);
//     throw error;
//   }
// };

// /**
//  * Get leaderboard data
//  * @param {string} difficulty - The difficulty level (noob, easy, normal, hard, advanced)
//  * @param {number} limit - Number of top players to fetch
//  * @returns {Promise} Leaderboard data
//  */
// export const getLeaderboard = async (difficulty = "all", limit = 10) => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/leaderboard?difficulty=${difficulty}&limit=${limit}`
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("❌ Error fetching leaderboard:", error);
//     throw error;
//   }
// };

// /**
//  * Get player stats
//  * @param {string} playerId - The player ID
//  * @returns {Promise} Player stats
//  */
// export const getPlayerStats = async (playerId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/player/${playerId}/stats`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch player stats: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("❌ Error fetching player stats:", error);
//     throw error;
//   }
// };
// lib/gameApi.js
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "./firebase";

// const difficultyNames = ["noob", "easy", "normal", "hard", "advanced"];

// async function getPlayerId() {
//   let playerId = localStorage.getItem("playerId");
//   if (!playerId) {
//     let isUnique = false;
//     let attempt = 0;
//     while (!isUnique) {
//       const len = 9 + attempt;
//       playerId =
//         "player_" +
//         Math.random()
//           .toString(36)
//           .slice(2, 2 + len);
//       const ref = doc(db, "players", playerId);
//       const snap = await getDoc(ref);
//       if (!snap.exists()) {
//         isUnique = true;
//         await setDoc(ref, { createdAt: Date.now() });
//         localStorage.setItem("playerId", playerId);
//       }
//       attempt++;
//     }
//   }
//   return playerId;
// }

// export const submitGameResults = async (results) => {
//   try {
//     const {
//       gwam,
//       accuracy,
//       time,
//       characters,
//       mistakes,
//       difficulty: diffIndex,
//     } = results;

//     // User data from sessionStorage (React se aaya)
//     const userDataStr = sessionStorage.getItem("gameUserData");
//     const userData = userDataStr ? JSON.parse(userDataStr) : {};
//     const {
//       username = "Player",
//       country = "United States",
//       countryCode = "US",
//       playerId: storedPlayerId,
//     } = userData;

//     // Validate difficulty
//     const difficultyIndex = Number(diffIndex);
//     if (isNaN(difficultyIndex) || difficultyIndex < 0 || difficultyIndex > 4) {
//       throw new Error("Invalid difficulty level");
//     }
//     const difficulty = difficultyNames[difficultyIndex];

//     const playerId = storedPlayerId || (await getPlayerId());

//     const now = new Date();
//     const formattedDate = `${
//       now.getMonth() + 1
//     }/${now.getDate()}/${now.getFullYear()}`;

//     // Final data to save
//     const leaderboardData = {
//       username,
//       score: gwam, // WPM
//       accuracy, // Accuracy in %
//       time: Math.round(time * 100) / 100,
//       characters,
//       mistakes,
//       date: formattedDate,
//       difficulty,
//       country: countryCode,
//       playerId,
//       submittedAt: Date.now(),
//     };

//     const docRef = doc(db, "leaderboard", difficulty, "players", playerId);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists() && docSnap.data().score >= gwam) {
//       return { success: false, message: "Pehle wala score zyada hai!" };
//     }

//     await setDoc(docRef, leaderboardData);
//     localStorage.setItem("username", username);
//     localStorage.setItem("country", country);
//     localStorage.setItem("countryCode", countryCode);

//     console.log("Score + Accuracy saved!", leaderboardData);
//     return { success: true, data: leaderboardData };
//   } catch (error) {
//     console.error("Submit failed:", error);
//     throw error;
//   }
// };
// /**
//  * Get player's best scores
//  */
// export async function getPlayerBestScores(playerId) {
//   try {
//     const difficulties = ["noob", "easy", "normal", "hard", "advanced"];
//     const scores = {};

//     for (const difficulty of difficulties) {
//       const docRef = doc(db, "leaderboard", difficulty, "players", playerId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         scores[difficulty] = docSnap.data();
//       }
//     }

//     return scores;
//   } catch (error) {
//     console.error("Error fetching scores:", error);
//     return {};
//   }
// }

// /**
//  * Get leaderboard data for specific difficulty
//  */
// export async function getLeaderboard(difficulty, limit = 10) {
//   try {
//     const difficultyNames = ["noob", "easy", "normal", "hard", "advanced"];
//     const difficultyName = difficultyNames[difficulty] || "normal";

//     // Note: Firestore mein orderBy aur limit ke liye query use karni hogi
//     // Yeh basic example hai - proper implementation ke liye Firestore queries use karein

//     return {
//       success: true,
//       difficulty: difficultyName,
//       message:
//         "Leaderboard data fetch karne ke liye proper query implement karein",
//     };
//   } catch (error) {
//     console.error("Leaderboard fetch error:", error);
//     throw error;
//   }
// }
