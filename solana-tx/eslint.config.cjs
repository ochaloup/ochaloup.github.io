const createSharedConfig = require('@marinade.finance/eslint-config')

const sharedConfig = createSharedConfig({})

module.exports = [
  ...sharedConfig,
  {
    rules: {
      'no-console': 'off',
    },
  },
]
