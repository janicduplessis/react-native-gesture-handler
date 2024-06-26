module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-modules-commonjs',
      [
        'module-resolver',
        {
          extensions: ['.js', '.ts', '.tsx'],
          alias: {
            'react-native-gesture-handler/DrawerLayout':
              '../../src/components/DrawerLayout',
            'react-native-gesture-handler/Swipeable':
              '../../src/components/Swipeable',
            'react-native-gesture-handler/ReanimatedSwipeable':
              '../../src/components/ReanimatedSwipeable',
            'react-native-gesture-handler': '../../src/index',
          },
        },
      ],
    ],
  };
};
