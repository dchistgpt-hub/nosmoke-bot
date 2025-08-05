// bot/index.js
require('dotenv').config();
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const DOMAIN    = process.env.DOMAIN;           // https://bot.chatnzt.ru
const PORT      = process.env.PORT || 3000;     // тот же порт, что в Caddyfile

const bot = new Telegraf(BOT_TOKEN);

// ----- handlers ------------------------------------------------
bot.start(ctx => ctx.reply('Привет! Бот на веб-хуке.'));
bot.command('ping', ctx => ctx.reply('pong ✅'));
// ---------------------------------------------------------------

// путь вида /bot123:AA...
const WEBHOOK_PATH = `/bot${BOT_TOKEN}`;

(async () => {
  // регистрируем веб-хук у Telegram
  await bot.telegram.setWebhook(`${DOMAIN}${WEBHOOK_PATH}`);
  // запускаем HTTP-сервер внутри контейнера
  bot.startWebhook(WEBHOOK_PATH, null, PORT);
  console.log(`Webhook started on port ${PORT}`);
})();
