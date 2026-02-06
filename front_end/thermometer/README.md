## Thermometer Frontend (Vite + React)

Frontend UI that displays the latest temperature from the ESP32 or Supabase.

### Requirements

- Node.js (LTS recommended)
- npm

### Install

```sh
npm install
```

### Configure Environment

Create a `.env` file in this folder and add one of these options:

Option A (read directly from ESP32):

```sh
VITE_ESP32_URL=http://192.168.0.50
# or
VITE_ESP32_IP=192.168.0.50
```

Option B (read from Supabase, preferred if available):

```sh
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

If Supabase variables are set, the app reads the latest entry from
`temperature_log`. Otherwise, it falls back to the ESP32 endpoint.

### Run Dev Server

```sh
npm run dev
```

### Build

```sh
npm run build
```
