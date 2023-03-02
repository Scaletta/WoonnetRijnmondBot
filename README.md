# [Woonnet Rijnmond](https://www.woonnetrijnmond.nl/) Bot
Automaticly check your estimated place for houses based on your preferences every hour with Github Actions and sent new houses to Pushover.
<!-- TOC -->
* [Woonnet Rijnmond Bot](#woonnet-rijnmond-bot)
  * [Why build this](#why-build-this)
  * [How to use](#how-to-use)
  * [Dependencies](#dependencies)
  * [Disclaimer](#disclaimer)
<!-- TOC -->
## Why build this
- To have no frustration checking the website and logging in (over and over), because it always logs you out...
- To actually see your estimated place, without clicking every house that is available.
- To filter out 55+ houses and bejaardenflats.
- To view it with ease on my phone.
- To check all houses on a map.
- To get push notifications when there are new houses available to me.
- Using this as a PWA app, because its offline(cached) data anyway.

## How to use
1. `Fork this repo`.
2. Add the repository secrets: `WOONNET_USERNAME`, `WOONNET_PASSWORD`, `INCLUDE55PLUS` = true or false, `PUSHOVERAPPKEY` & `PUSHOVERUSERKEY` with your own credentials.
3. Add the repository variable: `GITHUBPAGEURL` according to your GitHub Page URL.
4. **Enable Github Pages** at Settings and select **GitHub Actions** as Source
5. Run your first action.
6. Your data will be fetched and will be published to your Github Page.
7. Every hour, Github actions will fetch data from Woonnet Rijnmond and compare it to the old date. When there is new data found, you will receive a notifcation trough Pushover.

## Dependencies
- [React](https://github.com/facebook/react)
- [NextJS](https://github.com/vercel/next.js)
- [Axios](https://axios-http.com/)
- [Puppeteer](https://github.com/puppeteer/puppeteer)
- [NextUI](https://github.com/nextui-org/nextui)
- [Keen-Slider](https://github.com/rcbyr/keen-slider)
- [React Leaflet](https://react-leaflet.js.org/)
- [Leaflet](https://leafletjs.com/)
- [React-PDF](https://react-pdf.org/)
- [Pushover](https://pushover.net/)
- [pushover-notifications](https://github.com/qbit/node-pushover)
- [react-iframe](https://github.com/robbestad/react-iframe)
- [Next-PWA](https://github.com/shadowwalker/next-pwa)

## Disclaimer
This repo is not affiliated in any way with Woonnet Rijnmond. It is just made out of frustration by the woningnood.
