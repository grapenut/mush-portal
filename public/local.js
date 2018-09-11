/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// local panel config and event handlers
/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// panel defaults
/////////////////////////////////////////////////////////////////////

var config = client.panels.defaults;

config.theme = "default filled";
config.container = client.react.container;
config.contentOverflow = "auto";
config.minimizeTo = "parent";
config.maximizedMargin = 5;
config.syncMargins = true;
config.boxShadow = false;
config.border = "2px ridge darkgrey";
config.borderRadius = 10;
config.position = {
  my: "right-top",
  at: "right-top",
  offsetX: -5,
  offsetY: 5,
  autoposition: "down",
};
config.minimizeTo = false;
config.onminimized = function(container) {
  client.react.taskbar.pushTask(this);
  client.focus();
};
config.onclosed = function(container) {
  client.focus();
}
config.dragit.snap = {
  repositionOnSnap: true,
  resizeToPreSnap:  true,
  callback: function() {
    // callback resizes panel depending on position it snapped to
    var pos = this.snappableTo,
      margins = client.panels.pOcontainment(this.options.dragit.containment),
      width, height;
    // calculate desired dimensions ...
    if (pos.startsWith('center')) { // half height for panels snapped to center-top or center-bottom
      width  = `calc(100% - ${margins[3]}px - ${margins[1]}px)`;
      height = `calc(50% - 0.75*${margins[0]}px - 0.75*${margins[2]}px)`;
    } else if (pos.endsWith('center')) { // half width for panels snapped to left-center or right-center
      width  = `calc(50% - 0.75*${margins[1]}px - 0.75*${margins[3]}px)`;
      height = `calc(100% - ${margins[0]}px - ${margins[2]}px)`;
    } else { // quartersize for panels snapped to a corner
      width  = `calc(50% - 1.5*${margins[3]}px)`;
      height = `calc(50% - 1.5*${margins[0]}px)`;
    }
    // resize panel
    this.resize({
      width: width,
      height: height
    });
  }
};


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
  client.panels.create(obj);
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
  obj.unread && client.react.taskbar.setUnreadMail(obj.unread);
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






