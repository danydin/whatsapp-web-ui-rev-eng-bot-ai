const client = require('./src/client');
const { handleMessage } = require('./src/router');

client.on('message', async msg => {
    try {
        await handleMessage(msg);
    } catch (error) {
        console.error('❌ Error handling message:', error);
    }
});

client.initialize();
