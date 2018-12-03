import Client from './client';

/** create the MUSH client */
var client = new Client();

if (window.local && typeof(window.local) === "function") {
  // we defined a local() function, use that for customization
  window.local(client);
} else {
  // load default local customization file
  client.loadScript('./local.js');
}

client.execUserScript('onLoad.js');
