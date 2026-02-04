const ESP32_BASE =
  import.meta.env.VITE_ESP32_URL || import.meta.env.VITE_ESP32_IP;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function normalizeEsp32Base(base) {
  if (!base) return null;
  if (base.startsWith("http://") || base.startsWith("https://")) return base;
  return `http://${base}`;
}

async function fetchFromEsp32() {
  const base = normalizeEsp32Base(ESP32_BASE);
  if (!base) throw new Error("ESP32 base URL is not set");
  const res = await fetch(`${base}/temperature`);
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  return res.json();
}

async function fetchFromSupabase() {
  const url = `${SUPABASE_URL}/rest/v1/temperature_log?select=temp,unit,created_at&order=created_at.desc&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase HTTP error ${res.status}`);
  }
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return { temperature: null, unit: "C", status: "no-data" };
  }
  return {
    temperature: rows[0].temp ?? null,
    unit: rows[0].unit ?? "C",
  };
}

export async function fetchTemperature() {
  try {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      return await fetchFromSupabase();
    }
    return await fetchFromEsp32();
  } catch (err) {
    console.log("Error fetching temperature:", err);
    return {
      temperature: null,
      unit: "C",
      error: err?.message ?? "Fetch failed",
    };
  }
}
