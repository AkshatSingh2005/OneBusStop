import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.akshat.sensorapp',
  appName: 'sensor-app',
  webDir: 'build',
  server: {
    cleartext: true
  }
};

export default config;