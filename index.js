const functions = require('firebase-functions');
const sapper = require('./__sapper__/build/server/server.js').default;

// Expose Express API as a single Cloud Function:
console.log({sapper});
module.exports.app = functions.https.onRequest(sapper);