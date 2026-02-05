import { useEffect, useState } from "react";
import Section from "../Section/Section.jsx";

import { fetchTemperature } from "../../utils/api.js";
import { BiHomeAlt2 } from "react-icons/bi";

const Temperature = () => {
  const [temp, setTemp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTemp = async () => {
      const data = await fetchTemperature();
      if (data.temperature === null) {
        setTemp(null);
        if (data.status === "no-data") {
          setError("No data yet in Supabase");
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Sensor not found or ESP32 is offline");
        }
      } else {
        setTemp(data.temperature);
        setError(null);
      }
    };
    loadTemp();
    const interval = setInterval(loadTemp, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section>
      <div className="relative overflow-hidden  flex flex-col items-center justify-center h-155 w-162 rounded-lg bg-card p-8 shadow-lg border border-white/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="398"
          height="222"
          viewBox="0 0 204 123"
          fill="none"
          className="absolute -top-14 -left-8"
        >
          <path
            d="M5 123C114.905 123 204 73.3036 204 12C204 -49.3036 114.905 -99 5 -99C-104.905 -99 -194 -49.3036 -194 12C-194 73.3036 -104.905 123 5 123Z"
            fill="rgba(34, 32, 66, 0.4)"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="398"
          height="222"
          viewBox="0 0 169 193"
          fill="none"
          className="absolute top-0 -left-4 overflow-hidden  z-0"
        >
          <path
            d="M-30 193C79.9047 193 169 143.304 169 82C169 20.6964 79.9047 -29 -30 -29C-139.905 -29 -229 20.6964 -229 82C-229 143.304 -139.905 193 -30 193Z"
            fill="rgba(34, 32, 66, 0.6)"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="398"
          height="222"
          viewBox="0 0 136 222"
          fill="none"
          className="absolute -left-12 top-12"
        >
          <path
            d="M-63 222C46.9047 222 136 172.304 136 111C136 49.6964 46.9047 0 -63 0C-172.905 0 -262 49.6964 -262 111C-262 172.304 -172.905 222 -63 222Z"
            fill="rgba(34, 32, 66, 0.4)"
          />
        </svg>
        <div className="absolute top-20 left-4 z-10 items-self-center mb-6">
          <h1 className="mx-auto max-w-45 text-center text-2xl font-normal leading-tight text-primary tracking-wide">
            Thermometer <span className="font-extralight">ESP32</span>
          </h1>
        </div>
        <div className="flex items-end space-x-4">
          <BiHomeAlt2 size={48} className="text-yellow-400" />
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <p className="font-light text-4xl text-primary">
              {temp !== null ? temp.toFixed(1) : "__"} °C
            </p>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Temperature;
