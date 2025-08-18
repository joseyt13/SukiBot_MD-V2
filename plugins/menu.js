import { xpRange} from '../lib/levelling.js'

// 🎯 Categorías del menú
const tags = {
  serbot: '🫟 SUBBOTS',
  eco: '💸 ECONOMÍA',
  downloader: '⬇️ DESCARGAS',
  tools: '🛠️ HERRAMIENTAS',
  owner: '👑 PROPIETARIO',
  info: 'ℹ️ INFORMACIÓN',
  game: '🎮 JUEGOS',
  gacha: '🎲 GACHA ANIME',
  reacciones: '💕 ANIME REACCIONES',
  group: '👥 GRUPOS',
  search: '🔎 BUSCADORES',
  sticker: '📌 STICKERS',
  ia: '🤖 IA',
  channel: '📺 CANALES',
  fun: '😂 DIVERSIÓN',
}

// 🧩 Plantilla del menú
const defaultMenu = {
  before: `
❄️ Hola, soy *%botname* ( %tipo)
👤 *%name*, %greeting

🪪 *Canal oficial:* https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N

📅 *Fecha:* %date
⏱️ *Actividad:* %uptime
%readmore
`.trimStart(),

  header: '\n╭─「 %category 」',
  body: '│ 🍭 %cmd %islimit %isPremium',
  footer: '╰───────────────',
  after: '\n🍂 Creado con cariño por *Fedexyz*.',
}

// 🧊 Handler principal
const handler = async (m, { conn, usedPrefix: _p}) => {
  try {
    const { exp, limit, level} = global.db.data.users[m.sender]
    const { min, xp, max} = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const d = new Date(Date.now() + 3600000)
    const date = d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric'})

    const help = Object.values(global.plugins)
.filter(p =>!p.disabled)
.map(p => ({
        help: Array.isArray(p.help)? p.help: [p.help],
        tags: Array.isArray(p.tags)? p.tags: [p.tags],
        prefix: 'customPrefix' in p,
        limit: p.limit,
        premium: p.premium,
}))

    const nombreBot = 'ElsaBot-MD'
    const bannerFinal = 'https://files.catbox.moe/woeor8.jpg'
    const tipo = conn.user.jid === global.conn.user.jid? '𝗣𝗿𝗶𝗻𝗰𝗶𝗽𝗮𝗹 🆅': '𝗦𝘂𝗯𝗕𝗼𝘁 🅱'
    const menuConfig = conn.menu || defaultMenu

    const _text = [
      menuConfig.before,
...Object.keys(tags).map(tag => {
        const cmds = help
.filter(menu => menu.tags?.includes(tag))
.map(menu => menu.help.map(h =>
            menuConfig.body
.replace(/%cmd/g, menu.prefix? h: `${_p}${h}`)
.replace(/%islimit/g, menu.limit? '⭐': '')
.replace(/%isPremium/g, menu.premium? '🪪': '')
).join('\n')).join('\n')
        return [menuConfig.header.replace(/%category/g, tags[tag]), cmds, menuConfig.footer].join('\n')
}),
      menuConfig.after
    ].join('\n')

    const replace = {
      '%': '%',
      p: _p,
      botname: nombreBot,
      taguser: '@' + m.sender.split('@')[0],
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      level,
      limit,
      name,
      date,
      uptime: clockString(process.uptime() * 1000),
      tipo,
      readmore: readMore,
      greeting,
}

    const text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
      (_, name) => String(replace[name])
)

    const imageContent = { image: { url: bannerFinal}}

    await conn.sendMessage(
      m.chat,
      {
...imageContent,
        caption: text.trim(),
        footer: '🦖 Menú de comandos',
        headerType: 4,
        mentionedJid: conn.parseMention(text)
},
      { quoted: m}
)

} catch (e) {
    console.error('❌ Error en el menú:', e)
    conn.reply(m.chat, '❎ Lo sentimos, ocurrió un error al generar el menú.', m)
}
}

handler.command = ['menu', 'help', 'hélp', 'menú', 'ayuda']
handler.register = false
export default handler

// 🔧 Utilidades
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms)? '--': Math.floor(ms / 3600000)
  let m = isNaN(ms)? '--': Math.floor(ms / 60000) % 60
  let s = isNaN(ms)? '--': Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const hour = new Date().getHours()
const greetingMap = {
  0: 'una linda noche 🌙', 1: 'una linda noche 💤', 2: 'una linda noche 🦉',
  3: 'una linda mañana ✨', 4: 'una linda mañana 💫', 5: 'una linda mañana 🌅',
  6: 'una linda mañana 🌄', 7: 'una linda mañana 🌅', 8: 'una linda mañana 💫',
  9: 'una linda mañana ✨', 10: 'un lindo día 🌞', 11: 'un lindo día 🌨',
  12: 'un lindo día ❄', 13: 'un lindo día 🌤', 14: 'una linda tarde 🌇',
  15: 'una linda tarde 🥀', 16: 'una linda tarde 🌹', 17: 'una linda tarde 🌆',
  18: 'una linda noche 🌙', 19: 'una linda noche 🌃', 20: 'una linda noche 🌌',
  21: 'una linda noche 🌃', 22: 'una linda noche 🌙', 23: 'una linda noche 🌃',
}
const greeting = 'Espero que tengas ' + (greetingMap[hour] || 'un buen día')
