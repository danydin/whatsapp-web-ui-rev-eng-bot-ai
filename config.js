require('dotenv').config();

module.exports = {
    businessName: process.env.BUSINESS_NAME || 'Our Business',
    supportHours: process.env.SUPPORT_HOURS || 'Monday-Friday 9am-5pm',
    ownerNumber: process.env.OWNER_NUMBER,
    
    // How long before a conversation session resets (in minutes)
    sessionTimeout: 30,
    
    // Max messages to remember per customer
    maxHistory: 10,
};
