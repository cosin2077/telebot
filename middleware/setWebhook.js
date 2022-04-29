const safeCompare = require('safe-compare')
const setWebhook = (bot, path = '/setWebhook', auth = '201010') => async (ctx, next) => {
  const { webhook, authToken } = ctx.query;
  if (safeCompare(path, ctx.url)) {
    if (!auth || authToken !== auth) {
      ctx.status = 403
      return ctx.body = { msg: 'authToken needed!' }
    }
    if (!webhook) {
      ctx.status = 403
      return ctx.body = { msg: 'webhook needed!' }
    }
    const data = await bot.telegram.setWebhook(webhook)
    ctx.status = 200
    return ctx.body = data
  } else {
    return next()
  }
}
module.exports = {
  setWebhook
}