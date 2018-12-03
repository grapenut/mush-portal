import Client from './client';

/** create the MUSH client */
var client = new Client();

if (window.onclientload) {
  window.onclientload(client);
} else {
  client.loadScript(process.env.PUBLIC_URL + '/local.js');
}

client.execUserScript('onLoad.js');
