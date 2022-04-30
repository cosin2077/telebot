const { Telegraf } = require('telegraf')
const Koa = require('koa')
const koaBody = require('koa-body')
const safeCompare = require('safe-compare')
const { setWebhook, responseTime } = require('./middleware')
const { useRouter } = require('./router')
const { bot } = require('./bot')
const { safeRun, handle404 } = require('./utils')
const { KOA_PORT, RUN_MODE } = process.env
// First reply will be served via webhook response,
// but messages order not guaranteed due to `koa` pipeline design.
// Details: https://github.com/telegraf/telegraf/issues/294
bot.command('image', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }))
bot.on('text', (ctx) => ctx.reply('Hello'))

const PORT = KOA_PORT
const botApiPath = `/tele/masteryibot`
const setWebhookPath = `/tele/setWebhook`
const setWebhookAuth = '201010'
// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
// bot.telegram.setWebhook(`https://-----.localtunnel.me${secretPath}`)
const runMode = RUN_MODE || process.argv[2] || 'local'
const app = new Koa()
app
  .use(responseTime)
  .use(handle404)
  .use(koaBody())
  .use(setWebhook(bot, setWebhookPath, setWebhookAuth))
  .use(async (ctx, next) => {
    if (safeCompare(botApiPath, ctx.path)) {
      console.log('ctx.request.body:', ctx.request.body)
      try {
        ctx.body = await bot.handleUpdate(ctx.request.body)
        ctx.status = 200
      } catch (err) {
        ctx.status = 500
        ctx.body = { msg: err.message }
      }
      return
    }
    return next()
  })
useRouter(app)

if (runMode === 'local') {
  console.log('run with local mode, start connecting bot server...')
  bot
    .launch()
    .then(() => {
      console.log('run server bot succeed!')
    })
}

const runApp = async () => {
  app.listen(PORT, () => {
    const msg =
      `
  koa server running at: http://127.0.0.1:${PORT}
  query with ?responseTime=true to show response time!
  
  botApiPath: ${botApiPath} 
  use GET ${setWebhookPath}?authToken=<authToken>&webhook=<webhook> to set webhook!
  `
    console.log(msg)
  })
  .on('error', err => {
    console.log(err)
    process.exit(1)
  })
}
module.exports = {
  runApp
}