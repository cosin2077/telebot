const HttpsProxyAgent = require('https-proxy-agent')
const { Telegraf } = require('telegraf')
const { v4: uuidV4 } = require('uuid')
require('dotenv').config()
const { startMessage, helpMessage } = require('./messages')
const { listenEvents } = require('./listen')
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

bot.command('fact', async (ctx) => {
  ctx.reply('Generating, Please wait !!!')
});

listenEvents.forEach(event => {
  console.log(`listen ${event}`)
  bot.on(event, async ctx => {
    console.log(ctx.update.message)
    ctx.replyWithHTML(`${JSON.stringify(ctx.update.message, null, 2)}`)
  })
})
bot.launch()
.then(() => {
  console.log('server connect bot succeed!')
}).catch(console.log)

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = bot