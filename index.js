const telegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '6544906111:AAE92kXzKP9N8pRLLqnhFqSwZnGt1Ochc1I';

const bot = new telegramBot(token, {polling: true});

bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'},
    {command: '/info', description: 'Информация'},
    {command: '/game', description: 'Игра'},
])

const chats = {};


const gameGuessTheNumber = async (id) => {
    await bot.sendMessage(id, "Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!")
    const randomNumber = Math.floor(Math.random()*10);
    chats[id] = randomNumber;
    await bot.sendMessage(id, "Отгадайте число", gameOptions);
}


const start = () => {
    bot.on('message', async msg => {
        const text = "Добро пожаловать!"; 
        const id = msg.chat.id;
    
        if(msg.text === "/start"){
            await bot.sendSticker(id, "https://chpic.su/_data/stickers/s/sophie_vk/sophie_vk_004.webp?v=1691844901");
            return bot.sendMessage(id, text);
        }
    
        if(msg.text === "/info"){
            return bot.sendMessage(id, `Тебя зовут ${msg.chat.first_name}`);
        }

        if(msg.text = "/game"){
            return gameGuessTheNumber(id);
        }

        return bot.sendMessage(id, "Я тебя не понимаю");
    })

    bot.on("callback_query", msg => {
        const data = msg.data;
        const id = msg.message.chat.id;

        if(data === '/again'){
            return gameGuessTheNumber(id);
        }

        if(Number(data)===chats[id]){
            return bot.sendMessage(id, "Вы отгадали число!", againOptions);
        }

        return bot.sendMessage(id, "Вы не угадали число, думаете дальше", gameOptions);
    })
    
}

start()