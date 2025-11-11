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
const IPINFO_TOKEN = "ca2e0ce571e7c3";

const WorldMapSection = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch players + convert IP to coordinates
  useEffect(() => {
    const fetchActivePlayers = async () => {
      try {
        const playersRef = collection(db, "players");
        const snapshot = await getDocs(playersRef);

        const ipList = snapshot.docs
          .map((doc) => doc.data().ip)
          .filter((ip) => ip && ip !== "unknown");

        // Remove duplicates
        const uniqueIps = [...new Set(ipList)];

        // Fetch coordinates for each IP
        const coordsPromises = uniqueIps.map(async (ip) => {
          try {
            // const res = await fetch(`http://ip-api.com/json/${ip}`);
            const res = await fetch(
              `https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`
            );
            if (!res.ok) return null;
            const data = await res.json();
            if (data.status === "success") {
              return {
                name: data.city || data.country,
                coordinates: [data.lon, data.lat],
              };
            }
          } catch (e) {
            console.warn("IP lookup failed:", ip, e);
          }
          return null;
        });

        const coords = (await Promise.all(coordsPromises)).filter(Boolean);

        // Limit to 30 markers for performance
        setMarkers(coords.slice(0, 30));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching players:", error);
        setLoading(false);
      }
    };

    fetchActivePlayers();

    // Refresh every 30 seconds
    const interval = setInterval(fetchActivePlayers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-8 bg-black">
      <div className="container mx-auto max-w-full bg-brand-dark-1 rounded-3xl">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-brand text-3xl md:text-4xl font-bold mb-4">
            {loading
              ? "Loading Live Players..."
              : `Live Players: ${markers.length}`}
          </h2>
          <p className="text-gray-100 text-sm">
            Real-time typing races happening globally. Join the rally!
          </p>
        </div>

        {/* World Map */}
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
