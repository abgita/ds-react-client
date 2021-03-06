[![Test](https://github.com/abgita/ds-react-client/actions/workflows/test.js.yml/badge.svg?branch=main)](https://github.com/abgita/ds-react-client/actions/workflows/test.js.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdsticker.me)](https://dsticker.me)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![GitHub](https://img.shields.io/github/license/abgita/ds-react-client)
![GitHub package.json version](https://img.shields.io/github/package-json/v/abgita/ds-react-client)

# ð¶ Dancing Stickers - Web client
- **ð¤ What is it?:** animated stickers on steroids
- **ð¤·ââ Why?:** to update my frontend development abilities (see [#background](https://github.com/abgita/ds-react-client#background) below)
- **âï¸Why is it so slow to load?:** because the servers run on Heroku's free dynos and they're put to sleep after an hour of inactivity
- **ð  I don't like the UI/UX!:** I know. I'm not an expert on those!.. but it isn't that bad, isn't it?

![preview](https://user-images.githubusercontent.com/42152656/124974066-e4a9bc80-e01b-11eb-9161-322e49109159.png)

## Project files

<pre>
.
âââ devServer âââââââââââââââ> Static assets used on the development server only
âââ public ââââââââââââââââââ> Static assets used on the production server
âââ src
âÂ Â  âââ ds-api ââââââââââââââ> Here we wrap everything related to our application, like:
âÂ Â  â                          - the state and most controllers
âÂ Â  â                          - fetch, cache and release resources
âÂ Â  â                          - spawn web workers to uncompress the sticker files
|   |                          - audio playback, etc...
|   |
|   |                          It is framework agnostic and provides a nice API to work with.
|   |
âÂ Â  âââ utils âââââââââââââââ> General helper functions used by mutiple components, to keep it DRY
âÂ Â  âââ components ââââââââââ> The components used in more than one place
âÂ Â  âââ routes
|   |   âââ route
âÂ Â  |   |   âââ components ââ> Components that are only used here
âÂ Â  |   âââ ...
</pre>

Most React components are self contained and have this structure:
<pre>
uniqueComponentName
âââ [others] ââââââââââââââââ> Other components that are only used by this one
âââ index.js
âââ style.scss
</pre>

## Background
I needed to make some *modern-stack* web project; it didn't have to be something
you could easily find (and copy) elsewhere. Something challenging and different.

I came up with the idea, while listening music and checking out a new telegram's animated sticker pack (this two guys: https://url.dsticker.me/AgADlAADUomRIw:1nYeVF5vIBxMxfPoL0SIWg)

So yeah, I had something to do! ð

## How it works

Everything starts on telegram. Specifically, here ð https://t.me/DancingStickers

We, the members of the channel, send new stickers we found.
There's a bot listening on the messages, which:
- Gets the sticker's id and metadata.
- Extracts the dominant colors from the sticker's thumbnail.
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
whenever I feel like refactoring some code ð
