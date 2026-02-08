const mineflayer = require('mineflayer')
const express = require('express')
const axios = require('axios')

// ================== CONFIG ==================
const config = {
  host: "YOUR_SERVER_IP",
  port: 25565,
  username: "AFK_Bot",
  version: false,

  discordWebhook: "PASTE_WEBHOOK_HERE"
}
// ============================================

const app = express()

app.get('/', (req,res)=>{
  res.send("🤖 Minecraft AFK bot running")
})

app.listen(3000, ()=>{
  console.log("Web server started")
})

// -------- DISCORD MESSAGE ----------
async function sendDiscord(msg){
  if(!config.discordWebhook) return
  try{
    await axios.post(config.discordWebhook,{
      content: msg
    })
  }catch(e){
    console.log("Discord error")
  }
}

// -------- CREATE BOT ----------
let bot

function startBot(){

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
  })

  bot.once('spawn', async () => {
    console.log("Bot joined server")
    sendDiscord("🟢 Bot joined server and started loop")

    squareLoop()
  })

  bot.on('end', ()=>{
    console.log("Bot disconnected. Reconnecting in 5s")
    sendDiscord("🔴 Bot disconnected. Reconnecting...")
    setTimeout(startBot, 5000)
  })

  bot.on('error', err => console.log(err))
}

// -------- MOVEMENT LOOP ----------
function sleep(ms){
  return new Promise(r => setTimeout(r, ms))
}

async function squareLoop(){
  while(true){

    // ↑ forward
    bot.setControlState('forward', true)
    await sleep(2000)
    bot.setControlState('forward', false)
    await sleep(500)

    // ← turn left
    bot.look(bot.entity.yaw + Math.PI/2, 0, true)
    await sleep(800)

    // ↓ backward
    bot.setControlState('back', true)
    await sleep(2000)
    bot.setControlState('back', false)
    await sleep(500)

    // → turn right
    bot.look(bot.entity.yaw - Math.PI/2, 0, true)
    await sleep(800)
  }
}

startBot()

// prevent crash
process.on("uncaughtException", console.error)
process.on("unhandledRejection", console.error)
                                     
