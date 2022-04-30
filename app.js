const { runApp } = require('./src')

runApp()
  .catch(err => {
    console.log(err)
    process.exit(1)
  })