require('dotenv').config();                 // читаем переменные из .env
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Простейшая команда /start
bot.start((ctx) => ctx.reply('Привет! Бот запущен.'));

bot.launch()
  .then(() => console.log('Bot started'))
  .catch((err) => console.error('Launch error', err));

// Корректное завершение при SIGTERM/SIGINT
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
