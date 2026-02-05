import { useEffect, useState } from "react";
import Section from "../Section/Section.jsx";

import { fetchTemperature } from "../../utils/api.js";

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
      <div className="grid h-full w-full place-items-center text-center">
        <h1>ESP32 Thermometer</h1>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p className="font-semibold text-2xl text bg-red-400">
            {temp !== null ? temp.toFixed(1) : "__"} °C
          </p>
        )}
      </div>
    </Section>
  );
};

export default Temperature;
