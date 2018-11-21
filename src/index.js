import Client from './client';

// create the MUSH client
var client = new Client();

// load local customization file
client.loadScript('./local.js');

client.execUserScript('onLoad.js');





