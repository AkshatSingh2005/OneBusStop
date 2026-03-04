import { Motion } from '@capacitor/motion';
import { Geolocation } from '@capacitor/geolocation';

let accel = { x: null, y: null, z: null };
let gyro = { x: null, y: null, z: null };
let location = {};

let startTime = null;
let lastTimeSec = null;
let locationWatchId = null;

let isLoggingActive = false;   // IMPORTANT FIX

let samplingIntervalMs = 0;
let lastEmitTime = 0;


function getDayString() {
  return new Date().toISOString().split("T")[0];
}

function nowNano() {
  return Date.now() * 1e6;
}

function nowSec() {
  return Date.now() / 1000;
}


export async function startSensorListeners(callback, busNumber, intervalMs = 0) {

  isLoggingActive = true;   // enable logging
  
  samplingIntervalMs = intervalMs;
  lastEmitTime = 0;

  await Geolocation.requestPermissions();

  startTime = nowSec();
  lastTimeSec = startTime;


  Motion.addListener('accel', event => {

    if (!isLoggingActive) return;

    accel = event.acceleration;

    emitRow(callback, busNumber);

  });


  Motion.addListener('orientation', event => {

    if (!isLoggingActive) return;

    gyro = {
      x: event.alpha,
      y: event.beta,
      z: event.gamma
    };

    emitRow(callback, busNumber);

  });


  locationWatchId = await Geolocation.watchPosition(
    { enableHighAccuracy: true },
    position => {

      if (!isLoggingActive) return;

      if (position) {

        location = position.coords;

        emitRow(callback, busNumber);

      }

    }
  );

}


function emitRow(callback, busNumber) {

  if (!isLoggingActive) return; 
  
  // frequency control
  const now = Date.now();
  if (samplingIntervalMs > 0) {

    if (now - lastEmitTime < samplingIntervalMs) {
      return;
    }

    lastEmitTime = now;
  }// CRITICAL FIX


  const global_time = nowNano();

  const time_sec = nowSec();

  const delta_t = lastTimeSec ? (time_sec - lastTimeSec) : 0;

  lastTimeSec = time_sec;

  const elapsed = time_sec - startTime;

  const day = getDayString();


  const row = {

    global_time,

    Accelerometer_seconds_elapsed: elapsed,
    Accelerometer_x: accel.x,
    Accelerometer_y: accel.y,
    Accelerometer_z: accel.z,

    Gyroscope_seconds_elapsed: elapsed,
    Gyroscope_x: gyro.x,
    Gyroscope_y: gyro.y,
    Gyroscope_z: gyro.z,

    Location_seconds_elapsed: elapsed,
    Location_latitude: location.latitude,
    Location_longitude: location.longitude,
    Location_speed: location.speed,
    Location_bearing: location.heading,
    Location_altitude: location.altitude,
    Location_horizontalAccuracy: location.accuracy,
    Location_verticalAccuracy: location.altitudeAccuracy,
    Location_speedAccuracy: location.speedAccuracy,
    Location_bearingAccuracy: location.headingAccuracy,

    TotalAcceleration_seconds_elapsed: elapsed,
    TotalAcceleration_x: accel.x,
    TotalAcceleration_y: accel.y,
    TotalAcceleration_z: accel.z,

    Accelerometer_Day: day,
    Gyroscope_Day: day,
    Location_Day: day,
    TotalAcceleration_Day: day,

    time_sec,
    delta_t,

    bus_number: busNumber

  };

  callback(row);

}


export async function stopSensorListeners() {

  isLoggingActive = false;   // STOP logging immediately

  Motion.removeAllListeners();

  if (locationWatchId) {

    await Geolocation.clearWatch({ id: locationWatchId });

    locationWatchId = null;

  }

}