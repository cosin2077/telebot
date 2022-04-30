const Router = require('@koa/router')
const router = new Router();

const useRouter = (app) => {
  router.get('/', async ctx => {
    ctx.body = 'Hello! nice to see you ❤️'
  })
  app.use(router.routes())
  app.use(router.allowedMethods())
}

module.exports = {
  useRouter
}