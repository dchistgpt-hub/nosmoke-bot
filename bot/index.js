require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
// Экранируем двоеточие в токене
const WEBHOOK_PATH = `/bot${process.env.BOT_TOKEN.replace(/:/g, '%3A')}`;
const PORT = process.env.PORT || 3000;

console.log('Environment:', {
  BOT_TOKEN: process.env.BOT_TOKEN,
  DOMAIN: process.env.DOMAIN,
  PORT: process.env.PORT
});
console.log('Webhook path:', WEBHOOK_PATH);

bot.start((ctx) => ctx.reply('Привет! Бот на веб-хуке.'));
bot.command('ping', (ctx) => ctx.reply('pong ✅'));

bot.use((ctx, next) => {
  console.log('Received update:', JSON.stringify(ctx.update, null, 2));
  return next();
});

app.use(express.json());
app.get('/test-bot', (req, res) => res.send('Bot Test OK'));
app.post(WEBHOOK_PATH, (req, res) => {
  bot.handleUpdate(req.body, res);
});

bot.telegram.setWebhook(`${process.env.DOMAIN}${WEBHOOK_PATH}`).then(() => {
  console.log(`Webhook set to ${process.env.DOMAIN}${WEBHOOK_PATH}`);
}).catch((err) => {
  console.error('Webhook setup failed:', err);
});

app.listen(PORT, () => {
  console.log(`Webhook started on port ${PORT}`);
});

bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});
