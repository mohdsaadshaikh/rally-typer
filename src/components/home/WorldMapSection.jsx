import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Cache to avoid repeated API calls
const ipCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const WorldMapSection = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithDelay = async (promises, delay = 150) => {
    const results = [];
    for (const promise of promises) {
      results.push(await promise);
      await new Promise((r) => setTimeout(r, delay)); // 150ms delay = ~6 req/sec
    }
    return results;
  };

  useEffect(() => {
    const fetchActivePlayers = async () => {
      try {
        const playersRef = collection(db, "players");
        const snapshot = await getDocs(playersRef);

        const ipList = snapshot.docs
          .map((doc) => doc.data().ip)
          .filter((ip) => ip && ip !== "unknown" && ip !== null);

        const uniqueIps = [...new Set(ipList)].slice(0, 25); // Max 25 to avoid ban

        const now = Date.now();

        const coordsPromises = uniqueIps.map((ip) => async () => {
          // Check cache
          const cached = ipCache.get(ip);
          if (cached && now - cached.timestamp < CACHE_DURATION) {
            return cached.data;
          }

          try {
            const res = await fetch(
              `https://ip-api.com/json/${ip}?fields=status,country,city,lat,lon`
            );
            if (!res.ok) return null;
            const data = await res.json();
            if (data.status === "success") {
              const result = {
                name: data.city || data.country,
                coordinates: [data.lon, data.lat],
              };
              ipCache.set(ip, { data: result, timestamp: now });
              return result;
            }
          } catch (e) {
            console.warn("IP lookup failed:", ip, e);
          }
          return null;
        });

        const coords = await fetchWithDelay(
          coordsPromises.map((p) => p()),
          180 // 180ms = 5.5 req/sec < 45/min
        );

        const validCoords = coords.filter(Boolean);
        setMarkers(validCoords);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchActivePlayers();
    const interval = setInterval(fetchActivePlayers, 60000); // 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-8 bg-black">
      <div className="container mx-auto max-w-full rounded-4xl bg-brand-dark-1 p-20">
        <div className="text-center mb-20">
          <h2 className="text-brand text-3xl md:text-4xl font-bold mb-4">
            {loading
              ? "Loading Live Players..."
              : markers.length > 0
              ? `Live in ${markers.length} Locations`
              : "No Active Players"}
          </h2>
          <p className="text-gray-100 text-sm">
            Real-time typing races happening globallyy
          </p>
        </div>

        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
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

            {markers.map((marker, index) => (
              <Marker key={index} coordinates={marker.coordinates}>
                <g>
                  <circle
                    r={14}
                    fill="#F25A06"
                    fillOpacity={0.3}
                    className="animate-ping"
                    style={{ animationDelay: `${index * 0.1}s` }}
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white">Fetching live players...</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorldMapSection;
