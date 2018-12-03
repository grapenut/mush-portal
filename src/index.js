import Client from './client';

/** create the MUSH client */
var client = new Client();

if (window.local && typeof(window.local) === "function") {
  // we defined a local() function, use that for customization
  window.local(client);
} else {
  try {
    // load default local customization file
    client.loadScript('./local.js');
  } catch (e) {
    // as a last resort load remote.js from the mushportal website
    client.loadScript('http://www.mushportal.com/remote.js');
  }
}

client.execUserScript('onLoad.js');
