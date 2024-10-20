module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',  // default path for fallback
      blocklist: null,
      allowlist: null,
      safe: false,
      allowUndefined: true,
    }],
  ],
};