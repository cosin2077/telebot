const safeCompare = require('safe-compare')
const setWebhook = (bot, path = '/setWebhook', auth = '201010') => async (ctx, next) => {
  const { webhook, authToken } = ctx.query;
  if (safeCompare(path, ctx.path)) {
    console.log(webhook, authToken)
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
      res = await bot.telegram.setWebhook(webhook)
      ctx.status = 200
    } catch (err) {
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