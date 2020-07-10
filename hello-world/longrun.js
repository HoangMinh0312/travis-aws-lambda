
const getEndedAuctions = require('./lib/getAucntion');

module.exports.processAuctions = async (event,context) =>{
    const auctionsToClose = await getEndedAuctions();
   console.log(auctionsToClose);
 }