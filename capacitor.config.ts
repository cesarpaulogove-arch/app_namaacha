
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mz.namaacha.app',
  appName: 'app_namaacha',
  webDir: 'www',

  server: {
    url: 'https://app-namaacha.vercel.app',
    cleartext: false
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      showSpinner: false
    }
  }
};

export default config;
