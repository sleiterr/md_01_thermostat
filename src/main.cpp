#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <math.h>

#include "secrets.h"

// DS18B20 data pin
constexpr int PIN_ONEWIRE = 4;

// Onboard blue LED
#ifndef LED_BUILTIN
constexpr int LED_BUILTIN = 2;
#endif

OneWire oneWire(PIN_ONEWIRE);
DallasTemperature sensors(&oneWire);
WebServer server(80);

constexpr unsigned long READ_INTERVAL_MS = 5000;
constexpr float CHANGE_THRESHOLD_C = 0.1f;

unsigned long lastReadMs = 0;
unsigned long ledBlinkUntilMs = 0;
float lastTempC = NAN;
bool lastSensorOk = true;

void postToSupabase(float tempC) {
  if (WiFi.status() != WL_CONNECTED) return;

HTTPClient http;
http.begin(SUPABASE_URL);
http.addHeader("Content-Type", "application/json");
http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY); // обов'язково
http.addHeader("apikey", SUPABASE_KEY);                             // обов'язково


  StaticJsonDocument<128> doc;
  doc["temp"] = tempC;
  doc["unit"] = "C";

  String body;
  serializeJson(doc, body);
  Serial.println("POST body:");
  Serial.println(body);

  int code = http.POST(body);
  Serial.print("Supabase POST response: ");
  Serial.println(code);
  if (code != 201) {
    Serial.println("Response body:");
    Serial.println(http.getString());
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(2000);
  Serial.println("Booting...");
  pinMode(LED_BUILTIN, OUTPUT);
  sensors.begin();
  Serial.print("Sensors found: ");
  Serial.println(sensors.getDeviceCount());

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  server.on("/temperature", HTTP_GET, []() {
    sensors.requestTemperatures();
    float tempC = sensors.getTempCByIndex(0);

    StaticJsonDocument<128> doc;
    if (tempC == DEVICE_DISCONNECTED_C) {
      doc["temperature"] = nullptr;
    } else {
      doc["temperature"] = tempC;
    }
    doc["unit"] = "C";

    String body;
    serializeJson(doc, body);
    server.send(200, "application/json", body);
  });

  server.begin();
}

void loop() {
  server.handleClient();
  unsigned long now = millis();

  if (ledBlinkUntilMs != 0 && now >= ledBlinkUntilMs) {
    ledBlinkUntilMs = 0;
    if (lastSensorOk) digitalWrite(LED_BUILTIN, LOW);
  }

  if (now - lastReadMs < READ_INTERVAL_MS) return;
  lastReadMs = now;

  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  bool sensorOk = (tempC != DEVICE_DISCONNECTED_C);

  if (!sensorOk) {
    if (lastSensorOk) Serial.println("Temp: Sensor not found");
    lastSensorOk = false;
    digitalWrite(LED_BUILTIN, HIGH);
    return;
  }

  lastSensorOk = true;

  bool changed = isnan(lastTempC) || fabsf(tempC - lastTempC) >= CHANGE_THRESHOLD_C;
  if (changed) {
    lastTempC = tempC;
    Serial.print("Temp: ");
    if (tempC >= 0) Serial.print("+");
    Serial.print(tempC, 1);
    Serial.println(" C");

    postToSupabase(tempC);

    // LED blink
    digitalWrite(LED_BUILTIN, HIGH);
    ledBlinkUntilMs = now + 200;
  }
}