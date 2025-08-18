import { execSync} from 'child_process'

const handler = async (m, { conn, text, isROwner}) => {
  await m.react('🕓')

  // 🔐 Validación de propietario
  if (!isROwner) {
    await m.react('❌')
    return conn.reply(m.chat, '🚫 Este comando solo puede ser usado por el propietario del bot.', m)
}

  try {
    // 🧊 Ejecuta git pull con argumentos opcionales
    const command = 'git pull' + (text? ' ' + text: '')
    const stdout = execSync(command)

    const output = stdout.toString().trim()
    const caption = `
❄️ *ElsaBot-MD | Actualización completada*

📦 *Comando ejecutado:* \`${command}\`
📄 *Resultado:*
\`\`\`
${output || 'Sin cambios detectados.'}
\`\`\`
`.trim()

    await conn.sendMessage(m.chat, { text: caption}, { quoted: m})
    await m.react('✅')

} catch (err) {
    console.error('❌ Error al ejecutar git pull:', err)
    await m.react('❌')
    await conn.reply(m.chat, '⚠️ Ocurrió un error al intentar actualizar el bot.', m)
}
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'fix', 'fixed']
handler.rowner = true
export default handler
