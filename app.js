const { Telegraf } = require('telegraf')
const Koa = require('koa')
const koaBody = require('koa-body')
const safeCompare = require('safe-compare')
const { setWebhook, responseTime } = require('./middleware')
const { useRouter } = require('./router')
const { bot } = require('./bot')
const { safeRun } = require('./utils')

// First reply will be served via webhook response,
// but messages order not guaranteed due to `koa` pipeline design.
// Details: https://github.com/telegraf/telegraf/issues/294
bot.command('image', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }))
bot.on('text', (ctx) => ctx.reply('Hello'))

const PORT = 9525
const botApiPath = `/tele/masteryibot`
const setWebhookPath = `/tele/setWebhook`
const setWebhookAuth = '201010'
// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
// bot.telegram.setWebhook(`https://-----.localtunnel.me${secretPath}`)

const app = new Koa()
app
  .use(responseTime)
  .use(koaBody())
  .use(setWebhook(bot, setWebhookPath, setWebhookAuth))
  .use(async (ctx, next) => {
    if (safeCompare(botApiPath, ctx.path)) {
      console.log(ctx.query)
      console.log(ctx.request.body)
      try {
        // ctx.body = await bot.handleUpdate(ctx.request.body)
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
app.listen(PORT, () => {
  const msg =
    `
koa server running at: http://127.0.0.1:${PORT}
query with ?responseTime=true to show response time!

botApiPath: ${botApiPath} 
use POST ${setWebhookPath}?authToken=<authToken>&webhook=<webhook> to set webhook!
`
  console.log(msg)
})