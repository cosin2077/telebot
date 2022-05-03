const fetch = require('node-fetch')

const { taskList } = require('../task')
const apiFactory = address => `https://mainnet.explorer.api.nym.nodes.guru/api/accounts/${address}/balance`

const checkNymBalance = (address) => {
  const apiUrl = apiFactory(address)
  console.log(`checking balance of: ${address}`)
  return fetch(apiUrl)
    .then(res => {
      const type = res.headers.get('content-type')
      if (/json/gim.test(type)) {
        return res.json()
      }
      return res.text()
    })
}
const renderNym = ctx => {
  return ctx.reply(
    `start add nym checking task!\n use /addnym <your nym address> to watching your nym address balance!\nuse /stopnym <your nym address> to stop watching`
  )
}
console.log('taskList:', taskList)
const registerNymAction = bot => {
  console.log("register bot.command('addnym')")
  bot.command('addnym', async (ctx) => {
    const username = ctx.message.from.username
    const text = ctx.message.text
    let nymAddress = ''
    if (text) {
      nymAddress = text.split(/\s/)[1]
    }
    if (!nymAddress) return ctx.reply('nym address needed!')
    console.log(`${username} call /addnym with id:${nymAddress}[${text}]`)
    if (!taskList.find(item => item.username === username && item.action === 'addnym')) {
      ctx.reply(`add task[addnym] for ${nymAddress} succeed!`)
      const res = await checkNymBalance(nymAddress)
      const formatMsg = `${new Date()}\n${JSON.stringify(res, null, 2)}`
      let initialMsg = `${JSON.stringify(res, null, 2)}`
      const msgInfo = await ctx.reply(formatMsg)
      const task = {
        username,
        action: 'addnym',
        message_id: msgInfo.message_id,
        chat_id: msgInfo.chat.id,
        itvId: setInterval(async () => {
          // check balance every hour
          try {
            const res = await checkNymBalance(nymAddress)
            const resMsg = `${JSON.stringify(res, null, 2)}`
            if (resMsg !== initialMsg) {
              ctx.reply(`alert! balance changed!`)
              initialMsg = resMsg
            }
            const formatMsg = `${new Date()}\n${resMsg}`
            ctx.telegram.editMessageText(task.chat_id, task.message_id, task.message_id, formatMsg,)
          } catch (err) {
            clearInterval(task.itvId)
            const idx = taskList.findIndex(item => item === task)
            taskList.splice(idx, 1)
          }
        }, 60 * 60 * 1e3)
      }
      taskList.push(task)
    } else {
      ctx.reply('already in task!')
    }
  })
  bot.command('stopnym', async (ctx) => {
    const username = ctx.message.from.username
    const text = ctx.message.text
    let nymAddress = ''
    if (text) {
      nymAddress = text.split(/\s/)[1]
    }
    console.log(`${username} call /stopnym with id:${nymAddress}[${text}]`)

    const findTaskIdx = taskList.findIndex(item => item.username === username && item.action === 'addnym')
    if (findTaskIdx === -1) { return ctx.reply('no running task!') }

    const task = taskList[findTaskIdx]
    console.log(`clear task[${task.action}]: [${task.itvId}]`)
    clearInterval(task.itvId)
    taskList.splice(findTaskIdx, 1)
    return ctx.reply(`stop task[${task.action}]:${nymAddress} succeed!`)
  })
}
const handleNym = (ctx) => {
  return renderNym(ctx)
}

module.exports = {
  checkNymBalance,
  handleNym,
  registerNymAction,
}