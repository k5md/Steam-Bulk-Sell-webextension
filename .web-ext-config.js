module.exports = {
  verbose: true,
  sourceDir: './dist',
  build: {
    overwriteDest: true,
  },
  run: {
    firefoxProfile: 'SteamBulkSellFirefoxProfile',
    keepProfileChanges: true,
  },
};