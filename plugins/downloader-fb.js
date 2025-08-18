import fetch from 'node-fetch'

const handler = async (m, { conn, args, usedPrefix, command}) => {
  if (!args[0]) {
    return m.reply(
      `📥 *Uso correcto:*\n${usedPrefix + command} <enlace válido de Facebook>\n\n📌 *Ejemplo:*\n${usedPrefix + command} https://www.facebook.com/watch/?v=1234567890`
)
}

  await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key}})

  try {
    const api = `https://api.dorratz.com/fbvideo?url=${encodeURIComponent(args[0])}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json ||!Array.isArray(json) || json.length === 0) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}})
      return m.reply('⚠️ No se encontró ningún video válido para ese enlace.')
}

    let sentAny = false

    for (const item of json) {
      if (!item.url ||!item.resolution) continue

      const caption = `
🎬 *Facebook Video Downloader*

📺 *Resolución:* ${item.resolution}
📁 *Archivo:* ${item.url.endsWith('.mp4')? item.url.split('/').pop(): 'Descarga disponible'}
🔗 *Enlace original:* ${args[0]}
`.trim()

      try {
        await conn.sendMessage(m.chat, {
          video: { url: item.url},
          caption,
          fileName: `${item.resolution.replace(/\s/g, '_')}.mp4`,
          mimetype: 'video/mp4'
}, { quoted: m})
        sentAny = true
} catch (err) {
        console.warn(`❌ Error al enviar video ${item.resolution}:`, err)
        continue
}
}

    await conn.sendMessage(m.chat, {
      react: { text: sentAny? '✅': '❌', key: m.key}
})

    if (!sentAny) {
      m.reply('🚫 No se pudo enviar ningún video. Puede que el enlace esté protegido o el formato no sea compatible.')
}

} catch (e) {
    console.error('❌ Error al procesar el enlace de Facebook:', e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}})
    m.reply('⚠️ Ocurrió un error al obtener el video. Verifica el enlace e intenta nuevamente.')
}
}

handler.command = ['facebook', 'fb', 'fbvideo']
handler.help = ['facebook <enlace>']
handler.tags = ['downloader']
export default handler
