const fetch = require('node-fetch')

const fetchApi = (url, options = {}) => {
  return fetch(url, options)
  .then(res => {
    const contentType = res.headers.get('content-type')
    const isJson = /json/.test(contentType)
    const isText = /text/.test(contentType)
    if (isJson) {
      return res.json()
    } else {
      return res.text()
    }
  })
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
}

fetchApi('/')
fetchApi('/asd')