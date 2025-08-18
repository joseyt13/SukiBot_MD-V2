import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, args, command, usedPrefix}) => {
  if (!args[0]) {
    return m.reply(`❄️ *Uso correcto:*\n${usedPrefix + command} <enlace o nombre del video>\n\n📌 *Ejemplo:*\n${usedPrefix + command} Coldplay Viva La Vida`)
}

  await m.react('🔎')

  try {
    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = path.join('./JadiBots', botActual, 'config.json')

    let nombreBot = global.namebot || 'ElsaBot-MD'
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        if (config.name) nombreBot = config.name
} catch {}
}

    let url = args[0]
    let videoInfo = null

    // 🔍 Si no es enlace, buscar por nombre
    if (!url.includes('youtube.com') &&!url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos?.length) return m.reply('⚠️ No se encontraron resultados.')
      videoInfo = search.videos[0]
      url = videoInfo.url
} else {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
      const search = await yts({ videoId: id})
      if (search?.title) videoInfo = search
}

    if (videoInfo.seconds> 3780) {
      return m.reply('⛔ El video supera el límite de duración permitido (63 minutos).')
}

    let apiUrl = ''
    let isAudio = false

    if (command === 'play' || command === 'ytmp3') {
      apiUrl = `https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`
      isAudio = true
} else if (command === 'play2' || command === 'ytmp4') {
      apiUrl = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`
} else {
      return m.reply('❌ Comando no reconocido.')
}

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')
    const json = await res.json()
    if (!json.success) throw new Error('No se pudo obtener información del video.')

    const { title, thumbnail, quality, download} = json.data

    // 🎬 Mensaje enriquecido
    await conn.sendMessage(m.chat, {
      text: `🎧 *${title}*\n📀 *Calidad:* ${quality}\n⏳ *Procesando tu pedido...*`,
      contextInfo: {
        externalAdReply: {
          title: `${title} | ${quality}`,
          body: isAudio? '🎵 Audio en proceso...': '🎥 Video en proceso...',
          thumbnailUrl: thumbnail,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
}
}
}, { quoted: m})

    // 📥 Envío del archivo
    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: download},
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: true
}, { quoted: m})
} else {
      await conn.sendMessage(m.chat, {
        video: { url: download},
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
}, { quoted: m})
}

    await m.react('✅')

} catch (e) {
    console.error('❌ Error en el comando multimedia:', e)
    await m.react('❌')
    m.reply('🚫 Ocurrió un error procesando tu solicitud. Intenta con otro enlace o nombre.')
}
}

handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'play2', 'ytmp3', 'ytmp4']
export default handler
