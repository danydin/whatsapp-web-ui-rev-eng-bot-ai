const config = require('../config');

// Temporary in-memory session storage
// We'll move this to a database later
const sessions = {};

function getSession(customerId) {
    if (!sessions[customerId]) {
        sessions[customerId] = {
            history: [],
            lastMessageTime: Date.now(),
            waitingForHuman: false
        };
    }
    return sessions[customerId];
}

function isSessionExpired(session) {
    const minutesSinceLastMessage = 
        (Date.now() - session.lastMessageTime) / 1000 / 60;
    return minutesSinceLastMessage > config.sessionTimeout;
}

async function handleMessage(msg) {
    // Ignore group messages - this is a 1 on 1 customer service bot
    if (msg.from.includes('@g.us')) return;
    
    // Ignore status updates
    if (msg.from === 'status@broadcast') return;

    const customerId = msg.from;
    const messageText = msg.body.trim().toLowerCase();
    const session = getSession(customerId);

    // Reset session if expired
    if (isSessionExpired(session)) {
        sessions[customerId] = null;
        getSession(customerId);
    }

    // Update last message time
    session.lastMessageTime = Date.now();

    // Handle greeting
    if (isGreeting(messageText)) {
        await msg.reply(
            `👋 Welcome to ${config.businessName}!\n\n` +
            `How can I help you today?\n\n` +
            `Our support hours are: ${config.supportHours}`
        );
        return;
    }

    // Handle human escalation request
    if (isAskingForHuman(messageText)) {
        session.waitingForHuman = true;
        await msg.reply(
            `I'll connect you with a human agent right away.\n` +
            `Please wait a moment... 🙏`
        );
        // TODO: notify owner in Phase 6
        return;
    }

    // If waiting for human, hold the conversation
    if (session.waitingForHuman) {
        await msg.reply(
            `⏳ An agent will be with you shortly.\n` +
            `Our support hours are: ${config.supportHours}`
        );
        return;
    }

    // Everything else → AI handler (we'll add this in Phase 4)
    await msg.reply(
        `Thanks for your message! We'll add AI responses in the next step.`
    );
}

function isGreeting(text) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 
                       'good afternoon', 'good evening', 'start'];
    return greetings.some(g => text.includes(g));
}

function isAskingForHuman(text) {
    const triggers = ['human', 'agent', 'person', 'representative', 
                      'support', 'help me', 'speak to someone'];
    return triggers.some(t => text.includes(t));
}

module.exports = { handleMessage };
