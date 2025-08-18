import axios from 'axios'

const handler = async (m, { conn, args, usedPrefix, text, command}) => {
  conn.tiktok = conn.tiktok || {}

  let query
  let fromSession = false

  if (text) {
    query = text
} else if (m.sender in conn.tiktok) {
    query = conn.tiktok[m.sender].query
    fromSession = true
}

  if (!query) {
    return m.reply(`❄️ *Por favor, ingresa una búsqueda para TikTok.*\n\n📌 *Ejemplo:*\n${usedPrefix + command} haikyuu edit`)
}

  try {
    let session = conn.tiktok[m.sender]

    if (!fromSession ||!session || session.index>= session.videos.length) {
      const res = await axios.get(`https://apizell.web.id/download/tiktokplay?q=${encodeURIComponent(query)}`)
      const json = res.data

      if (!json.status ||!json.data ||!json.data.length) {
        return m.reply('⚠️ No se encontró ningún video para esa búsqueda.')
}

      conn.tiktok[m.sender] = {
        query,
        index: 0,
        videos: json.data,
        time: setTimeout(() => delete conn.tiktok[m.sender], 60000)
}

      session = conn.tiktok[m.sender]
}

    const currentIndex = session.index
    const vid = session.videos[currentIndex]
    session.index++

    const caption = `
🎬 *TikTok Video Encontrado*

💜 *${vid.title}*

👤 *Autor:* ${vid.author}
👁️ *Vistas:* ${vid.views.toLocaleString()}
🔗 *Enlace:* ${vid.url}
`.trim()

    const buttons = [
      {
        buttonId: `${usedPrefix}${command}`,
        buttonText: { displayText: '🔄 Más resultados'},
        type: 1
}
    ]

    await conn.sendMessage(m.chat, {
      video: { url: vid.url},
      caption,
      buttons,
      headerType: 4
}, { quoted: m})

} catch (error) {
    console.error('❌ Error en tiktokvid:', error)
    m.reply('🚫 Ocurrió un error al procesar tu solicitud. Intenta nuevamente más tarde.')
    if (m.sender in conn.tiktok) {
      delete conn.tiktok[m.sender]
}
}
}

handler.help = ['tiktokvid <texto>']
handler.tags = ['downloader']
handler.command = ['tiktokvid', 'playtiktok']
handler.register = false
export default handler
