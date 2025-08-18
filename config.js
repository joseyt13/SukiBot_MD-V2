import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['5491156178758', '𝖿𝖾𝖽𝖾𝗑𝗒𝗓 ', true],
]

global.mods = []
global.prems = []

global.namebot = '✧ 𝙴𝚕𝚜𝚊𝙱𝚘𝚝 - 𝙼𝙳 🍁'
global.packname = 'ᨳ ⟡ 𝙴𝚕𝚜𝚊𝙱𝚘𝚝 - 𝙼𝙳 🎋'
global.author = '» 𝖬𝖺𝖽𝖾 𝖻𝗒 ﹫𝖿𝖾𝖽𝖾𝗑𝗒𝗓'
global.moneda = 'hielo 🧊'

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.vs = '2.2.0'
global.sessions = 'ElsaSession'
global.jadi = 'ElsaBots'
global.yukiJadibts = true

global.namecanal = '❇️'
global.idcanal = '120363402097425674@newsletter'
global.idcanal2 = '120363402097425674@newsletter'
global.canal = 'https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N'
global.canalreg = '120363402097425674@newsletter'

global.ch = {
  ch1: '120363402097425674@newsletter'
}

global.multiplier = 69
global.maxwarn = '2'



let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("🔄 Se actualizó 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
