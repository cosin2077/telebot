
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