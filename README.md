[![Test](https://github.com/abgita/ds-react-client/actions/workflows/test.js.yml/badge.svg?branch=main)](https://github.com/abgita/ds-react-client/actions/workflows/test.js.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdsticker.me)](https://dsticker.me)

# 🎶 Dancing Stickers - Web client
- **🤔 What is it?:** animated stickers on steroids
- **🤷‍♂ Why?:** to update my frontend development abilities (see [#background](https://github.com/abgita/ds-react-client#background) below)
- **⌛️Why is it so slow to load?:** because the servers run on Heroku's free dynos and they're put to sleep after an hour of inactivity
- **😠 I don't like the UI/UX!:** I know. I'm not an expert on those!.. but it isn't that bad, isn't it?

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![GitHub](https://img.shields.io/github/license/abgita/ds-react-client)
![GitHub package.json version](https://img.shields.io/github/package-json/v/abgita/ds-react-client)

## Project files

<pre>
.
├── devServer ───────────────> Static assets used on the development server only
├── public ──────────────────> Static assets used on the production server
├── src
│   ├── ds-api ──────────────> Here we wrap everything related to our application, like:
│   │                          - the state and most controllers
│   │                          - fetch, cache and release resources
│   │                          - spawn web workers to uncompress the sticker files
|   |                          - audio playback, etc...
|   |
|   |                          It is framework agnostic and provides a nice API to work with.
|   |
│   ├── utils ───────────────> General helper functions used by mutiple components, to keep it DRY
│   ├── components ──────────> The components used in more than one place
│   ├── routes
|   |   ├── route
│   |   |   ├── components ──> Components that are only used here
│   |   └── ...
</pre>

Most React components are self contained and have this structure:
<pre>
uniqueComponentName
├── [others] ────────────────> Other components that are only used by this one
├── index.js
└── style.scss
</pre>

## Background
I needed to make some *modern-stack* web project; it didn't have to be something
you could easily find (and copy) elsewhere. Something challenging and different.

I came up with the idea, while listening music and checking out a new telegram's animated sticker pack (this two guys: https://url.dsticker.me/AgADlAADUomRIw:1nYeVF5vIBxMxfPoL0SIWg)

So yeah, I had something to do! 🎉

## How it works

Everything starts on telegram. Specifically, here 👉 https://t.me/DancingStickers

We, the members of the channel, send new stickers we found.
There's a bot listening on the messages, which:
- Gets the sticker's id and metadata.
- Extracs the dominant colors from the sticker's thumbnail.
- Updates the stickers collection on the db (a mongodb instance on https://www.mongodb.com/cloud/atlas)

Then there's a server which acts as a proxy between Telegram's API and our application, 
it handles:
- Read requests to the stickers-list collection
- Sticker's thumb and animation (which are compressed lottie files: https://github.com/airbnb/lottie-web) requests

Another proxy server between the Spotify's API and our application, which manages our authentication token.

A server that keeps track of the recently used stickers, tracks and combinations.

And finally, another server to handle url previews (through https://ogp.me/).

Wrapping up (checked means the code is available):
- [ ] https://github.com/abgita/ds-telegram-bot
- [ ] https://github.com/abgita/ds-telegram-api-proxy
- [ ] https://github.com/abgita/ds-stickers-server
- [x] https://github.com/abgita/ds-spotify-api-proxy
- [x] https://github.com/abgita/ds-posts-server
- [ ] https://github.com/abgita/ds-links-proxy

## Issues, ideas or recommendations...

They're all welcome.

I'll keep working on this from time to time
whenever I feel like refactoring some code 👍
