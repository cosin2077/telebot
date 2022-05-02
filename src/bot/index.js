const HttpsProxyAgent = require('https-proxy-agent')
const { Telegraf, Markup } = require('telegraf')
const { v4: uuidV4 } = require('uuid')
require('dotenv').config()
const { startMessage, helpMessage } = require('../messages')
const { flattenArray } = require('../utils')
const { listenEvents } = require('../listen')
const useProxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY
let proxyConfig = {}
if (useProxy) {
  proxyConfig = {
    telegram: {
      agent: new HttpsProxyAgent(useProxy)
    }
  }
}

const bot = new Telegraf(process.env.BOT_TOKEN, proxyConfig)
const taskList = []
const commands = [
  ['🔍 Search', '😎 Popular', 'Start'], // Row1 with 2 buttons
  ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
  ['📢 Ads', '⭐️ Rate us', '👥 Contact'] // Row3 with 3 buttons
]
const commandsFlatten = flattenArray(commands)
bot.start((ctx) => {
  // ctx.replyWithHTML(startMessage)
  // ctx.reply('start with button', Markup
  //   .keyboard(['/simple', '/inline', '/pyramid'])
  //   .oneTime()
  //   .resize())
  renderStart(ctx)
})

bot.command('help', async ctx => {
  ctx.replyWithHTML(helpMessage)
})
bot.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      Markup.button.callback('Coke', 'Coke'),
      Markup.button.callback('Pepsi', 'Pepsi')
    ])
  })
})
bot.command('add', async ctx => {
  const username = ctx.message.from.username
  const text = ctx.message.text
  let addId = ''
  if (text) {
    addId = text.split(/\s/)[1]
  }
  console.log(`${username} call /add with id:${addId}[${text}]`)
  if (!taskList.find(item => item.username === username)) {
    ctx.reply(`add task ${addId} succeed!`)
    const msgInfo = await ctx.reply(Math.random())
    const task = {
      username,
      message_id: msgInfo.message_id,
      chat_id: msgInfo.chat.id,
      id: uuidV4(),
      itvId: setInterval(() => {
        ctx.telegram.editMessageText(task.chat_id, task.message_id, task.message_id, Math.random(),)
      }, 5 * 1e3)
    }
    taskList.push(task)
  } else {
    ctx.reply('already in task!')
  }
})

bot.command('stop', async ctx => {
  const username = ctx.message.from.username
  const text = ctx.message.text
  let stopId = ''
  if (text) { stopId = text.split(/\s/)[1] }
  if (!stopId) return ctx.editedMessage()
  console.log(`${username} call /stop with id:${stopId}[${text}]`)
  const findTaskIdx = taskList.findIndex(item => item.username === username)
  if (findTaskIdx === -1) { return ctx.reply('no running task!') }
  const task = taskList[findTaskIdx]
  console.log(`clear task: ${task.id}[${task.itvId}]`)
  clearInterval(task.itvId)
  taskList.splice(findTaskIdx, 1)
  ctx.reply(`stop task:${stopId} succeed!`)
})

bot.on('text', async ctx => {
  const { from, text } = ctx.update.message
  console.log(`bot.on('text')`)
  console.log(from, text)
  handleOnText(from, text, ctx)
})
const renderContact = (ctx) => {
  return ctx.reply(
    `you can contact with us with\ntelegram: @masteryice or\ntwitter: https://twitter.com/defimetech`,
    { parse_mode: 'HTML' }
  )
}
const renderStart = ctx => {
  return ctx.reply('start with button', Markup
    .keyboard(commands)
    .oneTime()
    .resize())
}
const handleOnText = (from, text, ctx) => {
  if (commandsFlatten.find(command => command === text)) {
    console.log(`run command:${text}`)
    if (/contact/gim.test(text)) {
      return renderContact(ctx)
    }
    if (/start/gim.test(text)) {
      return renderStart(ctx)
    }
    return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        Markup.button.callback('Coke', 'Coke'),
        Markup.button.callback('Pepsi', 'Pepsi')
      ])
    })
  }
}
bot.on('callback_query', async ctx => {
  console.log(ctx)
  const { from, data } = ctx.update.callback_query
  console.log(`bot.on('callback_query')`)
  console.log(from, data)
  handleOnCallback_query(from, data, ctx)
})
const handleOnCallback_query = (from, data, ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      Markup.button.callback('Coke', 'Coke'),
      Markup.button.callback('Pepsi', 'Pepsi')
    ])
  })
}
bot.command('fact', async (ctx) => {
  ctx.reply('Generating, Please wait !!!')
});

let listenEventMsg = ''
listenEvents.forEach((event, index) => {
  listenEventMsg += event + ','
  if (index === listenEvents.length - 1) {
    console.log(`all events listening init...`)
  }
  bot.on(event, async ctx => {
    console.log(`bot.on(${event})`)
    console.log(ctx.update.message)
  })
})
const launch = (webhook) => {
  return bot.launch({
    webhook
  })
    .then(() => {
      console.log('run server bot succeed!')
    })
}

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = {
  bot,
  launch
}