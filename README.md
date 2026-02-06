## Thermostat Firmware (ESP32)

Firmware for an ESP32 that reads a DS18B20 sensor, exposes `/temperature` over HTTP,
and posts temperature changes to Supabase.

### Features

- Reads DS18B20 via OneWire
- HTTP endpoint: `GET /temperature`
- Posts temperature updates to Supabase when the value changes

### Requirements

- ESP32 dev board
- DS18B20 temperature sensor
- PlatformIO

### Setup

1. Open [include/secrets.h](include/secrets.h) and set your WiFi and Supabase values.
2. Connect the DS18B20 data pin to GPIO 4 (see `PIN_ONEWIRE` in `src/main.cpp`).

### Build and Upload

```sh
pio run -t upload
```

### Monitor Serial

```sh
pio device monitor -b 115200
```

### API

`GET /temperature` returns:

```json
{
	"temperature": 23.4,
	"unit": "C"
}
```
