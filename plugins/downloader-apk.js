import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, text}) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🧊 *ElsaBot-MD* te ayuda a descargar APKs desde Aptoide.\n\n📌 *Ejemplo de uso:*\n${usedPrefix + command} Facebook Lite`,
}, { quoted: m})
}

  try {
    // 🔍 Reacción de búsqueda
    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key}})

    const results = await aptoide.search(text)
    if (!results.length) {
      return conn.sendMessage(m.chat, {
        text: `⚠️ No se encontraron resultados para *${text}*.\nIntenta con otro nombre o revisa la ortografía.`,
}, { quoted: m})
}

    const app = results[0]
    const data = await aptoide.download(app.id)
    const dl = await conn.getFile(data.link)

    const caption = `
📲 *APK Descargado con éxito*

🧊 *Nombre:* ${data.appname}
👨‍💻 *Desarrollador:* ${data.developer}
📦 *Versión:* ${app.version}
📊 *Tamaño:* ${(app.size / (1024 * 1024)).toFixed(2)} MB
`.trim()

    await conn.sendMessage(m.chat, {
      document: dl.data,
      fileName: `${data.appname}.apk`,
      mimetype: 'application/vnd.android.package-archive',
      caption,
}, { quoted: m})

    // ✅ Reacción final
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key}})

} catch (e) {
    console.error('❌ Error al descargar APK:', e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al procesar tu solicitud.*\nEs posible que la app no esté disponible o que haya un problema con la API.`,
}, { quoted: m})
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key}})
}
}

handler.help = ['apk <nombre>']
handler.tags = ['downloader']
handler.command = ['apk'];
handler.register = false
export default handler

// 🔧 Módulo Aptoide
const aptoide = {
  search: async (query) => {
    const res = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(query)}&limit=1`)
    const json = await res.json()
    const list = json.datalist?.list || []
    return list.map(app => ({
      name: app.name,
      size: app.size,
      version: app.file?.vername || 'N/A',
      id: app.package,
      download: app.stats?.downloads || 0,
}))
},

  download: async (id) => {
    const res = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(id)}&limit=1`)
    const json = await res.json()
    const app = json.datalist?.list?.[0]
    if (!app) throw new Error('App no encontrada')

    return {
      img: app.icon,
      developer: app.store?.name || 'Desconocido',
      appname: app.name,
      link: app.file?.path,
}
}
}
