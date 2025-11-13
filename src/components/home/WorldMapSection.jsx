import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "@vnedyalk0v/react19-simple-maps";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MiniLoader } from "../common/Loader";

const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";
const IPINFO_TOKEN = "ca2e0ce571e7c3";

const WorldMapSection = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePlayers = async () => {
      try {
        const playersRef = collection(db, "players");
        const snapshot = await getDocs(playersRef);

        const ipList = snapshot.docs
          .map((doc) => doc.data().ip)
          .filter((ip) => ip && ip !== "unknown" && ip !== null);

        const uniqueIps = [...new Set(ipList)].slice(0, 20); // Max 20 for free tier

        const coordsPromises = uniqueIps.map(async (ip) => {
          try {
            // Main endpoint: https://ipinfo.io/{ip}/json?token=TOKEN
            const res = await fetch(
              `https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`
            );
            if (!res.ok) return null;

            const data = await res.json();
            if (data.loc) {
              const [lat, lon] = data.loc.split(",").map(parseFloat);
              return {
                name: data.city || data.country || "Unknown",
                coordinates: [lon, lat], // [lon, lat] format for Marker
              };
            }
          } catch (e) {
            console.warn("IP lookup failed for", ip, ":", e);
          }
          return null;
        });

        // Sequential calls for rate limit (1 req/sec)
        const coords = [];
        for (const promise of coordsPromises) {
          const result = await promise;
          if (result) coords.push(result);
          await new Promise((r) => setTimeout(r, 1000)); // 1 sec delay
        }

        setMarkers(coords.slice(0, 30));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching players:", error);
        setLoading(false);
      }
    };

    fetchActivePlayers();

    // Refresh every 2 minutes (120 sec)
    const interval = setInterval(fetchActivePlayers, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="md:py-20 py-8 sm:px-8 px-2 bg-black" id="maps">
      <div className="container mx-auto max-w-full rounded-4xl bg-brand-dark-1 ">
        <div className="text-center md:mb-20 mb-8">
          <h2 className="text-brand text-xl sm:text-4xl font-bold mb-1 sm:mb-4 md:pt-20 pt-8 px-2 sm:px-5">
            Typing Races Happening All Around the World
          </h2>
          <p className="text-gray-100 text-sm max-sm:px-2">
            Real-time typing races happening globally. Join the rally!
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 150, center: [0, 25] }}
            height={500}
            style={{ width: "100%" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#8D8A85"
                    stroke="#1F2937"
                    strokeWidth={1}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#7C8A96" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Dynamic Markers */}
            {markers.map((marker, index) => (
              <Marker key={index} coordinates={marker.coordinates}>
                <g>
                  <circle
                    r={14}
                    fill="#F25A06"
                    fillOpacity={0.3}
                    className="animate-ping"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                  <image
                    href="/images/marker.svg"
                    x={-12.5}
                    y={-12.5}
                    width={25}
                    height={25}
                    style={{
                      filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))",
                    }}
                  />
                </g>
              </Marker>
            ))}
          </ComposableMap>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl">
              <p className="text-orange-400 text-lg font-semibold">
                Loading...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorldMapSection;
