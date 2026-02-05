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
      <div className="flex flex-col items-center justify-center h-155 w-162 rounded-lg bg-card p-8 shadow-lg border border-white/10">
        <div className="items-self-center mb-6">
          <h1 className="mx-auto max-w-xs text-center text-4xl font-light leading-tight text-primary">
            ESP32 Thermometer
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <BiHomeAlt2 size={48} className="text-yellow-400" />
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <p className="font-normal text-4xl text-primary">
              {temp !== null ? temp.toFixed(1) : "__"} °C
            </p>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Temperature;
