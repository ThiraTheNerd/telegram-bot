const functions = require("firebase-functions");
const { Telegraf } = require('telegraf')
const apixu = require('apixu');
let config = require('./env.json');

if (Object.keys(functions.config()).length){
    config = functions.config();
}
const apixuClient = new apixu.Apixu({
    apikey: config.service.apixu_key
})

const bot = new Telegraf(config.service.telegram_key)
bot.start((ctx) => ctx.reply('Welcome'))
bot.on('text', (ctx) =>{
    let query = ctx.update.message.text;
    apixuClient.current(query).then((current) => {
        return ctx.reply(
            `The current weather in ${query} is C: ${current.current.temp_c} F: ${current.current.temp_f} ` );
    }).catch((err) => {
        return ctx.reply("This city does not Exist", err)
    });
});
// bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  apixuClient.current('Nairobi').then((current)=> {
    return response.send(current);
  }).catch((err)=>{
    return response.send(err);
  });
});
