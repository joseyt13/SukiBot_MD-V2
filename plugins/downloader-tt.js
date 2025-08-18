import fetch from 'node-fetch'

const handler = async (m, { conn, args, usedPrefix, command}) => {
  if (!args[0]) {
    return m.reply(
      `📥 *Uso correcto:*\n${usedPrefix + command} <enlace válido de TikTok>\n\n📌 *Ejemplo:*\n${usedPrefix + command} https://www.tiktok.com/@usuario/video/123456789`
)
}

  await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key}})

  try {
    const apiURL = `https://myapiadonix.vercel.app/api/tiktok?url=${encodeURIComponent(args[0])}`
    const response = await fetch(apiURL)
    const data = await response.json()

    if (data.status!== 200 ||!data.result?.video) {
      throw new Error('No se pudo obtener el video.')
}

    const info = data.result

    const caption = `
🎬 *Video de TikTok descargado*

📌 *Título:* ${info.title}
👤 *Autor:* @${info.author.username || 'Desconocido'}
⏱️ *Duración:* ${info.duration || 'N/D'} segundos

📊 *Estadísticas:*
♥ *Likes:* ${info.likes?.toLocaleString() || 0}
💬 *Comentarios:* ${info.comments?.toLocaleString() || 0}
🔁 *Compartidos:* ${info.shares?.toLocaleString() || 0}
👁️ *Vistas:* ${info.views?.toLocaleString() || 0}
`.trim()

    await conn.sendMessage(m.chat, {
      video: { url: info.video},
      caption,
      fileName: `${info.title}.mp4`,
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: info.title,
          body: `Autor: ${info.author.name || 'Desconocido'}`,
          thumbnailUrl: info.thumbnail,
          sourceUrl: args[0],
          mediaType: 1,
          renderLargerThumbnail: true
}
}
}, { quoted: m})

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key}})

} catch (err) {
    console.error('❌ Error al procesar TikTok:', err)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}})
    m.reply('🚫 *No se pudo procesar el video.* Verifica el enlace o intenta más tarde.')
}
}

handler.command = ['tiktok', 'tt']
handler.help = ['tiktok <enlace>']
handler.tags = ['downloader']
export default handler
