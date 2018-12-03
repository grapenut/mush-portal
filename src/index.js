import Client from './client';

/** create the MUSH client */
var client = new Client();

if (window.local && typeof(window.local) === "function") {
  // we defined a local() function, use that for customization
  window.local(client);
} else {
    client.loadScript('./local.js', null, () => {
      // error loading local.js, try remote.js instead
      client.loadScript('https://mushportal.com/remote.js');
    });
  }
}

client.execUserScript('onLoad.js');
