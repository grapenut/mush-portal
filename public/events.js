
// client JSON events

// open login dialog
client.events.on('connect', (obj) => {
  client.react.login && client.react.login.openLogin(obj.msg);
  client.react.statusbar && client.react.statusbar.setStatus("Connecting...");
});

// change the appbar header title
client.events.on('changetitle', (obj) => {
  client.react.header && client.react.header.setTitle(obj.title);
});

// open the chargen window
client.events.on('chargen', (obj) => {
  if (!client.chargen) {
    client.addWindow("Chargen", { component: "Chargen", props: { client: client } });
  }
  client.focusWindow("Chargen");
});

// open the phaser window
client.events.on('phaser', (obj) => {
  if (!client.phaser) {
    client.addWindow("Game", { component: 'Game', props: { client: client } });
  }
  if (obj.hasOwnProperty('state')) {
    client.phaser.events.emit('state', obj.state);
  }
  client.focusWindow("Game");
});

// update the unread mail count on the appbar header
client.events.on('unreadmail', (obj) => {
  client.react.header && client.react.header.setUnreadMail(obj.unread);
});

// open the mail reader window
client.events.on('maillist', (obj) => {
  if (client.react.mailbox) {
    client.react.mailbox.updateMailList(obj.folder, obj.maillist);
  } else {
    client.addWindow("Mailbox", { component: 'Mailbox', props: { client: client, folder: obj.folder, maillist: obj.maillist } });
  }
  
  client.react.header.setUnreadMail(obj.unread);
  
  if (obj.focus) {
    client.focusWindow("Mailbox");
  }
});

// open a single mail item
client.events.on('mailitem', (obj) => {
  if (client.react.mailbox) {
    client.react.mailbox.openMailItem(obj);
  } else {
    client.addWindow("Mailbox", { component: 'Mailbox', props: { client: client, mailitem: obj } });
  }
  
  if (obj.focus) {
    client.focusWindow("Mailbox");
  }
});

// update the unread bb message count on the appbar header
client.events.on('unreadbb', (obj) => {
  client.react.header && client.react.header.setUnreadBB(obj.unread);
});

// update the status bar after logging in
client.events.on('login', (obj) => {
  client.react.statusbar && client.react.statusbar.setTimer("Connected");
});

// clear the status bar after logging out
client.events.on('logout', (obj) => {
  client.react.statusbar && client.react.statusbar.setStatus(null);
});
