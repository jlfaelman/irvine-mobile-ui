import 'dotenv/config';

export default () => ({
  expo: {
    name: 'Irvine Mobile App',
    slug: 'irvine-mobile-app',
    version: '1.0.0',
    extra: {
      API_URL: process.env.API_URL,
      SECRET_KEY: process.env.SECRET_KEY,
      eas: {
        "projectId": "f638225c-661c-4bb6-82f2-618a9ec5fb65"
      }
    },
  },
});
