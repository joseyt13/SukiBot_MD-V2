import axios from 'axios'
const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = (await import('@whiskeysockets/baileys')).default

const API_URL = 'https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text='
const MAX_RESULTS = 7

const handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '❄️ *Por favor, escribe algo para buscar en TikTok.*\n\n📌 Ejemplo:\n' + usedPrefix + command + ' gatos bailando',
      m
)
}

  const createVideoMessage = async (url) => {
    const { videoMessage} = await generateWAMessageContent(
      { video: { url}},
      { upload: conn.waUploadToServer}
)
    return videoMessage
}

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i> 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
;[array[i], array[j]] = [array[j], array[i]]
}
}

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🔍', key: m.key}
})

    await conn.reply(m.chat, '*✨ Buscando magia en TikTok...*', m, {
      contextInfo: {
        externalAdReply: {
          title: 'ElsaBot-MD | TikTok Search',
          body: global.dev || 'Fedexyz',
          thumbnail: global.avatar,
          sourceUrl: global.redes || 'https://tiktok.com'
}
}
})

    const { data} = await axios.get(API_URL + encodeURIComponent(text))
    const searchResults = data.data || []

    if (searchResults.length === 0) {
      return conn.reply(m.chat, '⚠️ No se encontraron resultados para tu búsqueda.', m)
}

    shuffleArray(searchResults)
    const topResults = searchResults.slice(0, MAX_RESULTS)

    const cards = []
    for (const result of topResults) {
      const videoMsg = await createVideoMessage(result.nowm)
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null}),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: global.dev || 'Fedexyz'}),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: result.title,
          hasMediaAttachment: true,
          videoMessage: videoMsg
}),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: []})
})
}

    const interactiveContent = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
},
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `✨ Resultados de búsqueda para: *${text}*`
}),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: global.dev || 'Fedexyz'
}),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
}),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards})
})
}
}
}, { quoted: m})

    await conn.relayMessage(m.chat, interactiveContent.message, {
      messageId: interactiveContent.key.id
})

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key}
})

} catch (error) {
    console.error('❌ Error en tiktoksearch:', error)
conn.reply(m.chat, `⚠️ *Ocurrió un error:* ${error.message}`, m)
}
}

handler.help = ['tiktoksearch <texto>']
handler.tags = ['buscador']
handler.command = ['tiktoksearch', 'ttss', 'tiktoks']
handler.register = false 
handler.group = true
export default handler
