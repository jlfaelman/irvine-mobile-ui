// URL Configuration - centralized URLs to avoid environment variable issues
const URL_CONFIG = {
  abp: 'https://abp-api.irvineas.com/api',
  cantilan: 'https://cantilanwd-api.irvineas.com/api',
  thepalms: 'https://thepalms-api.irvineas.com/api',
  infinity: 'https://infinityx-api.irvineas.com/api',
  dev: 'http://localhost:5000/api',
};

export default () => ({
  expo: {
    name: 'IrvineMobile',
    slug: 'irvine-mobile-app',
    version: '1.0.0',
    scheme: 'irvine-mobile',
    extra: {
      // Use centralized config instead of environment variables
      API_URL: URL_CONFIG.abp,
      // Connection string mappings from config
      CONN_abp: URL_CONFIG.abp,
      CONN_cantilan: URL_CONFIG.cantilan,
      CONN_thepalms: URL_CONFIG.thepalms,
      CONN_infinity: URL_CONFIG.infinity,
      CONN_dev: URL_CONFIG.dev,
      eas: {
        "projectId": "f638225c-661c-4bb6-82f2-618a9ec5fb65"
      }
    },
  },
});
