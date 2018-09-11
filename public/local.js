/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// local panel config and event handlers
/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// panel defaults
/////////////////////////////////////////////////////////////////////

client.panels.defaults.theme = "default filled";
client.panels.defaults.container = client.react.container;
client.panels.defaults.contentOverflow = "auto";
client.panels.defaults.minimizeTo = "parent";
client.panels.defaults.maximizedMargin = 5;
client.panels.defaults.syncMargins = true;
client.panels.defaults.boxShadow = false;
client.panels.defaults.borderRadius = 10;
//client.panels.defaults.iconfont = 'material-icons';
client.panels.defaults.position = "right center";
//client.panels.defaults.resizeit = {
//  containment: 5,
//};
//client.panels.defaults.dragit = {
//  containment: 5,
/*
  snap: {
    repositionOnSnap: true,
    resizeToPreSnap:  true,
    callback: function() {
      // callback resizes panel depending on position it snapped to
      var pos = this.snappableTo,
        margins = jsPanel.pOcontainment(this.options.dragit.containment),
        width, height;
      // calculate desired dimensions ...
      if (pos.startsWith('center')) { // fullsize for panels snapped to center-top or center-bottom
        width  = `calc(100vw - ${margins[3]}px - ${margins[1]}px)`;
        height = `calc(50vh - ${margins[0]}px - ${margins[2]}px)`;
      } else if (pos.endsWith('center')) { // halfsize for panels snapped to left-center or right-center
        width  = `calc(50vw -  ${margins[1]}px - ${margins[3]}px)`;
        height = `calc(100vh - ${margins[0]}px - ${margins[2]}px)`;
      } else { // quartersize for panels snapped to a corner
        width  = `calc(50vw - ${margins[3]}px)`;
        height = `calc(50vh - ${margins[0]}px)`;
      }
      // resize panel
      this.resize({
        width: width,
        height: height
      });
    }
  }
*/
//};


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// MUSH event handlers
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// spawn windows
/////////////////////////////////////////////////////////////////////

// open generic spawn window
client.events.on('spawn', (obj) => {
  client.addPanel(obj);
});

// open the chargen window
client.events.on('chargen', (obj) => {
  if (client.chargen) {
    client.focusPanel("Chargen");
  } else {
    client.addReactPanel("Chargen", obj);
  }
});

// open the phaser window
client.events.on('phaser', (obj) => {
});

// open the mail reader window
client.events.on('maillist', (obj) => {
  if (client.react.mailbox) {
    client.focusPanel("Mailbox");
  } else {
    client.addReactPanel("Mailbox", obj);
  }
  client.react.mailbox.updateMailList(obj.folder, obj.maillist);

  // just in case we are out of sync
  client.react.taskbar.setUnreadMail(obj.unread);
});

// open a single mail item
client.events.on('mailitem', (obj) => {
  if (client.react.mailbox) {
    client.focusPanel("Mailbox");
  } else {
    client.addReactPanel("Mailbox", obj);
  }  
  client.react.mailbox.openMailItem(obj);
});


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// spawn overlays/modals
/////////////////////////////////////////////////////////////////////

// open login dialog
client.events.on('connect', (obj) => {
  client.react.login && client.react.login.openLogin(obj.msg);
  client.react.statusbar && client.react.statusbar.setStatus("Connecting...");
});


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// update taskbar/statusbar furniture
/////////////////////////////////////////////////////////////////////

// change the taskbar title
client.events.on('changetitle', (obj) => {
  client.react.taskbar && client.react.taskbar.setTitle(obj.title);
});

// update the unread mail count on the taskbar
client.events.on('unreadmail', (obj) => {
  client.react.taskbar && client.react.taskbar.setUnreadMail(obj.unread);
});

// update the unread bb message count on the taskbar
client.events.on('unreadbb', (obj) => {
  client.react.taskbar && client.react.taskbar.setUnreadBB(obj.unread);
});

// update the status bar after logging in
client.events.on('login', (obj) => {
  client.react.statusbar && client.react.statusbar.setTimer("Connected");
});

// clear the status bar after logging out
client.events.on('logout', (obj) => {
  client.react.statusbar && client.react.statusbar.setStatus(null);
});






