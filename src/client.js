const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});

client.on('qr', qr => {
    console.log('📱 Scan this QR code with your WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

client.on('auth_failure', () => {
    console.error('❌ Authentication failed - check your session');
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Bot disconnected:', reason);
});

module.exports = client;
