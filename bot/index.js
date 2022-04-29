const HttpsProxyAgent = require('https-proxy-agent')
const { Telegraf } = require('telegraf')
const { v4: uuidV4 } = require('uuid')
require('dotenv').config()
const { startMessage, helpMessage } = require('../messages')
const { listenEvents } = require('../listen')
const proxyConfig = {
  telegram: {
    agent: new HttpsProxyAgent(process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY)
  }
}
const bot = new Telegraf(process.env.BOT_TOKEN, proxyConfig)

bot.start((ctx) => {
  ctx.replyWithHTML(startMessage)
})

bot.command('help', async ctx => {
  ctx.replyWithHTML(helpMessage)
})

bot.on('text', async ctx => {
  const { from, text } = ctx.update.message
  console.log(from, text)
})

bot.command('fact', async (ctx) => {
  ctx.reply('Generating, Please wait !!!')
});

let listenEventMsg = ''
listenEvents.forEach((event, index) => {
  listenEventMsg += event + ','
  if (index === listenEvents.length - 1) {
    console.log(`listening: ${listenEventMsg}`)
  }
  bot.on(event, async ctx => {
    console.log(ctx)
    console.log(ctx.update.message)
  })
})
const launch = (webhook) => {
  return bot.launch({
    webhook
  })
    .then(() => {
      console.log('run server bot succeed!')
    })
}

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = {
  bot,
  launch
}