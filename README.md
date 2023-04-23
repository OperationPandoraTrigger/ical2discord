# ical2discord 
Import your ICal events to Discord

# Pre-Alpha Notice
This bot is not production ready and lacks **a lot** of features.

## Why?
Because I haven't found any bot capable of importing events  from a calendar to Discord. So I made one.

## How?
Should be simply as [adding the bot to your server](https://discord.com/api/oauth2/authorize?client_id=1096083464123584562&permissions=17600776030208&scope=bot%20applications.commands) and start prompting it with /help to get further instructions

## Wanna be self hosted?
Use the .env file to create [BOT_TOKEN](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-bot-s-token) and CLIENT_ID
Then `docker run --env-file=.env ical2discord`

## Used References & Libs
* [Ui icons created by IconMarketPK - Flaticon](https://www.flaticon.com/free-icons/ui "ui icons")
* ical parser https://github.com/jens-maus/node-ical
* html2markdown https://github.com/crosstype/node-html-markdown
* abstract-level https://github.com/Level/abstract-level
* discord.js https://github.com/discordjs/discord.js
