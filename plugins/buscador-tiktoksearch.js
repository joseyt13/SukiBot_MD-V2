import axios from 'axios';
const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = (await import('@whiskeysockets/baileys')).default;

// Configuración
const API_URL = 'https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=';
const MAX_RESULTS = 7;

const handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '🍁 𝑷𝒐𝒓 𝒇𝒂𝒗𝒐𝒓, 𝒏𝒐 𝒎𝒆 𝒅𝒆𝒋𝒆𝒔 𝒆𝒏 𝒃𝒍𝒂𝒏𝒄𝒐... 𝒆𝒔𝒄𝒓𝒊𝒃𝒆 𝒂𝒍𝒈𝒐 ✨.',
      m
);
}

  const createVideoMessage = async (url) => {
    const { videoMessage} = await generateWAMessageContent(
      { video: { url}},
      { upload: conn.waUploadToServer}
);
    return videoMessage;
};

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i> 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
}
};

  try {
    await conn.reply(m.chat, '*♡⃛ 𝑬𝒏𝒗𝒊𝒂𝒏𝒅𝒐 𝒍𝒐 𝒒𝒖𝒆 𝒉𝒂𝒔 𝒃𝒖𝒔𝒄𝒂𝒅𝒐...*', m, {
      contextInfo: {
        externalAdReply: {
          mediaUrl: null,
          mediaType: 1,
          showAdAttribution: true,
          title: '♡ ͜ ۬︵࣪᷼⏜݊᷼𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨⏜࣪᷼︵۬ ͜ ',
          body: global.dev,
          previewType: 0,
          thumbnail: global.avatar,
          sourceUrl: global.redes
}
}
});

    const { data} = await axios.get(API_URL + encodeURIComponent(text));
    const searchResults = data.data || [];

    if (searchResults.length === 0) {
      return conn.reply(m.chat, '⚠︎ No se encontraron resultados para tu búsqueda.', m);
}

    shuffleArray(searchResults);
    const topResults = searchResults.slice(0, MAX_RESULTS);

    const cards = [];
    for (const result of topResults) {
      const videoMsg = await createVideoMessage(result.nowm);
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null}),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: global.dev}),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: result.title,
          hasMediaAttachment: true,
          videoMessage: videoMsg
}),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: []})
});
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
              text: `✧ RESULTADO DE: ${text}`
}),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: global.dev
}),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
}),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards})
})
}
}
}, { quoted: m});

    await conn.relayMessage(m.chat, interactiveContent.message, {
      messageId: interactiveContent.key.id
});

} catch (error) {
    console.error('Error en tiktoksearch:', error);
    conn.reply(m.chat, `⚠︎ *OCURRIÓ UN ERROR:* ${error.message}`, m);
}
};

handler.help = ['tiktoksearch <texto>'];
handler.tags = ['buscador'];
handler.command = ['tiktoksearch', 'ttss', 'tiktoks'];
handler.register = false;
handler.group = true;

export default handler;
