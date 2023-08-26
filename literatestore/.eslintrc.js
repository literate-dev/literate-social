module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    // 'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: {
          colon: { before: false, after: true },
        },
      },
    ],
  },
}
