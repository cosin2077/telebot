const safeCompare = require('safe-compare')
const { launch } = require('../bot')
const setWebhook = (bot, path = '/setWebhook', auth = '201010') => async (ctx, next) => {
  const { webhook, authToken } = ctx.query;
  if (safeCompare(path, ctx.path)) {
    console.log('botInfo, webhook, authToken')
    console.log(botInfo, webhook, authToken)
    if (!auth || authToken !== auth) {
      ctx.status = 403
      return ctx.body = { msg: 'authToken needed!' }
    }
    if (!webhook) {
      ctx.status = 403
      return ctx.body = { msg: 'webhook needed!' }
    }
    let res = null
    try {
      const parsed = new URL(webhook)
      const webhookConfig = {
        domain: parsed.origin,
        hookPath: parsed.pathname
      }
      res = await launch(webhookConfig)
      res = 'set webhook succeed!'
      ctx.status = 200
    } catch (err) {
      console.log('await launch')
      console.log(err)
      ctx.status = 400
      res = { msg: err.message }
    }
    return ctx.body = res
  } else {
    return next()
  }
}
module.exports = {
  setWebhook
}