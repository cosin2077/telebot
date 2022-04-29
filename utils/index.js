
const safeRun = (cb, showError = true) => {
  try {
    cb && cb()
  } catch (err) {
    if (showError) {
      console.log(err)
    }
  }
}

const handleError = () => {
  console.log('run handleError...')
  process.on('error', (err) => {
    console.log(`[process.on('error')]:`, err)
  })
  process.on('unhandledRejection', (err) => {
    console.log(`[process.on('unhandledRejection')]:`, err)
  })
  process.on('uncaughtException', (err) => {
    console.log(`[process.on('uncaughtException')]:`, err)
  })
}
handleError()

const handle404 = async (ctx, next) => {
  await next()
  if (ctx.status === 404) {
    ctx.body = 'not support this route!'
    ctx.status = 404
  }
}
const flattenArray = (array) => {
  let ret = []
  array.forEach(item => {
    if (!Array.isArray(item)) {
      ret.push(item)
    } else {
      ret.push(...flattenArray(item))
    }
  })
  return ret
}
module.exports = {
  handle404,
  safeRun,
  flattenArray
}