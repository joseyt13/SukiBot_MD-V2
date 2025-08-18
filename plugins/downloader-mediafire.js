import axios from 'axios'

const handler = async (m, { conn, text}) => {
  if (!text) {
    return m.reply(
      `📎 *Por favor ingresa un enlace de Mediafire para continuar.*\n\n📌 *Ejemplo:*\nmediafire https://www.mediafire.com/file/abc123/archivo.zip`
)
}

  if (!/^https?:\/\/(www\.)?mediafire\.com\/file\/.+/.test(text)) {
    return m.reply('❗ *Enlace inválido.* Asegúrate de que sea un enlace directo de Mediafire.')
}

  await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key}})

  try {
    const apiUrl = `https://delirius-apiofc.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`
    const { data} = await axios.get(apiUrl)

    if (!data?.data?.link) throw new Error('No se pudo obtener el archivo.')

    const { filename, size, extension, link} = data.data

    const caption = `
📥 *Archivo descargado desde Mediafire*

🧾 *Nombre:* ${filename}
📦 *Tamaño:* ${size}
📄 *Tipo:* ${extension || 'Desconocido'}
🔗 *Enlace directo:* ${link}
`.trim()

    await conn.sendFile(m.chat, link, filename, caption, m)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key}})

} catch (err) {
    console.error('❌ Error al descargar desde Mediafire:', err)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}})
    m.reply('🚫 *Ocurrió un error al procesar el enlace.* Puede que el archivo no exista, el enlace esté roto o la API esté temporalmente fuera de servicio.')
}
}

handler.help = ['mediafire <enlace>']
handler.tags = ['downloader']
handler.command = ['mediafire']
handler.register = false
export default handler
