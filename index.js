const TelegramApi = require('node-telegram-bot-api')

const token = '5394178116:AAFNqh16IGQ4W-MHHam1wF-bv0_-6uUuJwM'

const bot = new TelegramApi(token, {polling: true})

const {gameOptions, againOptions} = require('./options')

bot.setMyCommands([
  {command: '/start', description: 'Початкове вітання'},
  {command: '/info', description: 'Інформація про користувача'},
  {command: '/game', description: 'Угадай цифру'},
])

const charts= {}



const startGame = async id => {
  await bot.sendMessage(id, `Я зараз загадаю число від 0 до 9, ти маєш відгати цифру`)
  const randomNumber = Math.floor(Math.random() * 10);
  charts[id] = randomNumber
  await bot.sendMessage(id, 'Відгадай', gameOptions)
}

const start = () => {
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    // send msg 
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/7e8/aa6/7e8aa67b-ad91-4d61-8f62-301bde115989/192/1.webp')
      return bot.sendMessage(chatId, 'Вітаю!!!')
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`)
    }

    if(text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Я тебе не розумію!)')
  })
  
  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data === '/again') {
      return startGame(chatId)
    }
    if(data === charts[chatId]) {
      return await bot.sendMessage(chatId, `Вітаю, ти вірно відгадав цифру ${charts[chatId]}`, againOptions)
    } else {
      return await bot.sendMessage(chatId, `Нажаль, ти не відгадав, бот загадав цифру ${charts[chatId]}`, againOptions)
    }
  })
}

start()