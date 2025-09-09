import 'dotenv/config';

export default () => ({
  expo: {
    name: 'Irvine Mobile App',
    slug: 'irvine-mobile-app',
    version: '1.0.0',
    extra: {
      API_URL: process.env.EXPO_PUBLIC_API_URL,
      // Connection string mappings
      CONN_abp: process.env.EXPO_PUBLIC_CONN_abp,
      CONN_cantilan: process.env.EXPO_PUBLIC_CONN_cantilan,
      CONN_thepalms: process.env.EXPO_PUBLIC_CONN_thepalms,
      CONN_dev: process.env.EXPO_PUBLIC_CONN_dev,
      eas: {
        "projectId": "f638225c-661c-4bb6-82f2-618a9ec5fb65"
      }
    },
  },
});
