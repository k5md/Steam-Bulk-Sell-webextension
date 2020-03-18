# Steam Bulk Sell

[![Maintainability](https://api.codeclimate.com/v1/badges/ef1118bb20e47d32b77b/maintainability)](https://codeclimate.com/github/k5md/Steam-Bulk-Sell-webextension/maintainability)
[![Build Status](https://travis-ci.com/k5md/Steam-Bulk-Sell-webextension.svg?token=ZSWp3q2qzbTb4nzaxqWy&branch=master)](https://travis-ci.com/k5md/Steam-Bulk-Sell-webextension)

Steam Bulk Sell is a web-extension for Firefox to help selling multiple inventory items at once. It allows one to select multiple items, use prices presets (median, median * multiplier, custom) and sell them.

[Addon page on mozilla.org](https://addons.mozilla.org/ru/firefox/addon/steam-bulk-sell/)

## How to use

You can either build the extension yourself or download it, then just navigate to your Steam community inventory, use checkboxes to select items you want to sell, then click "Sell" button, wait until prices have been fetched, modify them and sell items.

## Features

- Does not require any permissions, except for Steam inventory pages
- Allows to select whole inventory tab at once
- Prices are loaded asynchronously - just open sell modal once and the extension will start fetching prices for currently checked items, close modal and continue selecting/deselecting items
- Prices are fetched from Steam, so expect ~1s delay between requests, ~2s delay for each selling action

## How does it look?

[![sbs_0.md.gif](https://s5.gifyu.com/images/sbs_0.gif)](https://gifyu.com/image/IGOG)

## Build

#### Linux
1. Install [node and npm](https://nodejs.org)
2. In the project directory run `make install`
3. In the project directory run one of these commands:

   `make build-dev` to build for development

   `make build-prod` to build for production

   `make pack` to build production version and pack it with [web-ext](https://developer.mozilla.org/ru/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext)

Building has been tested with:
- Node.js version [11.15.0](https://nodejs.org/download/release/v11.15.0/)
- npm version 6.9.0
- Arch Linux (5.1.7 x86-64)

#### Windows
1. Install [node and npm](https://nodejs.org)
2. Int the project directory run `npm run install`
3. In the project directory run one of these commands:

   `npm run build-dev` to build for development

   `npm run build-prod` to build for production

   `npm run pack` to build production version and pack it with [web-ext](https://developer.mozilla.org/ru/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext)

Building has been tested with:
- Node.js version [11.15.0](https://nodejs.org/download/release/v11.15.0/)
- npm version 6.7.0
- Windows 7 SP1

For verification and calculating diffs with submitted addon, use Windows configuration. On Linux and MacOS systems diff will likely fail because of line endings difference affecting webpack hash generation. Or use diff with --strip-trailing-cr on .html and .js files.

## Development
To monitor changes in browser with hot-reloading you can do
- `npm run watch` or `make watch` to start rebuilding dist on every save in src directory. This is achieved via running webpack and web-ext both in watch mode with concurrently npm package. You can load extension in browser with `npm run browser` or `make browser`. 
- Sometimes the above is not the best choice, since browser can stop reloading the extension rebuild due to errors, in this case you should avoid running webpack and web-ext in watch mode. If you want to monitor changes, you can just `npm run browser` once after first build-dev and then run build-dev on each change you want to inspect.

## Internationalization

The extension uses [i18n](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Internationalization), so if you want to participate in translating the extension texts into your language, please, refer to [messages.json](https://github.com/k5md/Steam-Bulk-Sell-webextension/blob/master/src/_locales/en/messages.json) as an example and either create a pull request or create an issue on github.
Please, note that only "messages" properties need to be translated, "descriptions" are aimed to help translators.

## Credits

Cart icon is made by [Freepic](https://www.flaticon.com/authors/freepik) from [Flaticon](https://www.flaticon.com/).

## Problems, requests, suggestions

If you find a problem, please, [create an issue](https://github.com/k5md/Steam-Bulk-Sell-webextension/issues/new).
