
const responseTime = async (ctx, next) => {
  if (!ctx.query.responseTime) return next()
  const start = process.hrtime()
  await next()
  const end = process.hrtime(start)
  const timeCost = end[0] * 1e3 + end[1] / 1e6
  const timeHeader = timeCost + 'ms'
  ctx.set('X-ResponseTime', timeHeader)
}
module.exports = {
  responseTime
}