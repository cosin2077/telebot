
const safeRun = (cb, showError = true) => {
  try {
    cb && cb()
  } catch (err) {
    if (showError) {
      console.log(err)
    }
  }
}