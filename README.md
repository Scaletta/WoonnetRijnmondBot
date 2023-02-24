# [Woonnet Rijnmond](https://www.woonnetrijnmond.nl/) Bot
Automaticly check your estimated place for houses based on your preferences every hour with Github Actions.
<!-- TOC -->
* [Woonnet Rijnmond Bot](#woonnet-rijnmond-bot)
  * [Goals](#goals)
  * [Todo](#todo)
  * [How to use](#how-to-use)
  * [Dependencies](#dependencies)
  * [Disclaimer](#disclaimer)
<!-- TOC -->
## Goals
- To have no frustration checking the website and logging in (over and over), because it always logs you out...
- To actually see your estimated place, without clicking every house that is available.
- To check if a house it not a 55+ house or a bejaardenflat.
- To view it with ease on my phone.

## Todo
- Make UI better
- Check each house for keywords 55+, so it won't display at all.
- Automated push notifications based on the `config.minReageerPositie`.
- Clickable link for house.
- Detailed page of house.
- Better description.

## How to use
1. `Fork this repo`.
2. Add the repository secrets `WOONNET_USERNAME` & `WOONNET_PASSWORD` with your own credentials of Woonnet Rijnmond.
3. **Enable Github Pages** at Settings and select **GitHub Actions** as Source
4. Run your first action.
5. Your data will be fetched and will be published to your Github Page.

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
## Disclaimer
This repo is not affiliated in any way with Woonnet Rijnmond
