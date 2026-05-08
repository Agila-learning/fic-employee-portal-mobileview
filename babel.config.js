module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      'react-native-worklets/plugin',
    ],
  };
};
