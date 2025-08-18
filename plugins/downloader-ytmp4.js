import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, args, usedPrefix, command}) => {
  if (!args[0]) {
    return m.reply(`🧊 *Uso correcto:*\n${usedPrefix + command} <enlace de YouTube o nombre del video>\n\n📌 Ejemplo:\n${usedPrefix + command} Coldplay Viva La Vida`)
}

  try {
    await m.react('🔎')

    let url = args[0]
    let videoInfo = null

    // 🔍 Si no es un enlace, realiza búsqueda
    if (!url.includes('youtube.com') &&!url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos || search.videos.length === 0) {
        return conn.sendMessage(m.chat, { text: '⚠️ No se encontraron resultados para tu búsqueda.'}, { quoted: m})
}
      videoInfo = search.videos[0]
      url = videoInfo.url
} else {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
      const search = await yts({ videoId: id})
      if (search && search.title) videoInfo = search
}

    // ⏱️ Validación de duración
    if (videoInfo.seconds> 3780) {
      return conn.sendMessage(m.chat, {
        text: '⛔ El video supera el límite de duración permitido (63 minutos).',
}, { quoted: m})
}

    // 🎧 Consulta a la API
    const apiUrl = `https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')

    const json = await res.json()
    if (!json.success ||!json.data?.download) throw new Error('No se pudo obtener el audio.')

    const { title, quality, download} = json.data
    const duration = videoInfo?.timestamp || 'Desconocida'
    const thumbnail = videoInfo?.thumbnail || null

    // 📢 Mensaje enriquecido
    await conn.sendMessage(m.chat, {
      text: `🎶 *${title}*\n⏱️ *Duración:* ${duration}\n🎚️ *Calidad:* ${quality}\n🔗 *Fuente:* ${url}`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: "🎧 Descargando audio desde YouTube...",
          thumbnailUrl: thumbnail,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
}
}
}, { quoted: m})

    // 📥 Envío del audio
    await conn.sendMessage(m.chat, {
      audio: { url: download},
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: false
}, { quoted: m})

    await m.react('✅')

} catch (e) {
    console.error('❌ Error en playaudio:', e)
    await m.react('❌')
    await conn.sendMessage(m.chat, {
      text: '🚫 *Ocurrió un error al procesar tu solicitud.*\nEs posible que el video no esté disponible o que la API esté temporalmente fuera de servicio.',
}, { quoted: m})
}
}

handler.help = ['playaudio <nombre o enlace>']
handler.tags = ['downloader']
handler.command = ['playaudio']
export default handler
