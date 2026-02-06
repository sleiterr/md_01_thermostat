import { useEffect, useState } from "react";
import Section from "../Section/Section.jsx";
import CardBackground from "./CardBackground.jsx";

import { fetchTemperature } from "../../utils/api.js";
import { BiHomeAlt2 } from "react-icons/bi";

const termText = [
  {
    id: 1,
    title: "Thermometer",
    text: "ESP32",
    titleClass:
      "mx-auto max-w-45 text-center text-2xl font-normal leading-tight text-primary tracking-wide",
    textClass: "font-extralight text-center text-xl text-primary",
  },
];

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
      <div className="relative overflow-hidden  flex flex-col items-center justify-center h-190 w-140 bg-card p-8 shadow-lg border rounded-xl border-white/10">
        <CardBackground />
        <Term />
        {/* <div className="absolute top-20 left-4 z-10 items-self-center mb-6">
          <h1 className="mx-auto max-w-45 text-center text-2xl font-normal leading-tight text-primary tracking-wide">
            Thermometer <span className="font-extralight">ESP32</span>
          </h1>
        </div> */}
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

const Term = () => {
  return (
    <>
      {termText.map((item) => (
        <div
          key={item.id}
          className="absolute top-34 left-6 z-10 items-self-center mb-6"
        >
          <h1 className={item.titleClass}>{item.title}</h1>
          <p className={item.textClass}>{item.text}</p>
        </div>
      ))}
    </>
  );
};

export default Temperature;
