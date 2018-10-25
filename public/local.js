/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// local panel config and event handlers
/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// panel defaults
/////////////////////////////////////////////////////////////////////
var config = client.panels.defaults;

config.theme = "#3f51b5";
config.container = client.react.container;
config.contentOverflow = "auto";
config.maximizedMargin = 5;
config.syncMargins = true;
config.boxShadow = false;
config.border = "1px solid black";
//config.borderRadius = 10;
//config.panelSize = {
//  width: 'calc(50% - ' + 1.5*config.maximizedMargin + 'px)',
//  height: 'calc(50% - ' + 1.5*config.maximizedMargin + 'px)',
//};
config.position = {
  my: "right-top",
  at: "right-top",
  offsetX: -config.maximizedMargin,
  offsetY: config.maximizedMargin,
};
config.dragit.snap = { repositionOnSnap: true };


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// MUSH event handlers
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// spawn windows
/////////////////////////////////////////////////////////////////////
function openFullHeight(which, obj) {
  obj.panelSize = {
    width: 'calc(50% - ' + 1.5*config.maximizedMargin + 'px)',
    height: 'calc(100% - ' + 2*config.maximizedMargin + 'px)',
  };
  client.addReactPanel(which, obj);
}

// open generic spawn window
client.events.on('spawn', (obj) => {
  client.panels.create(obj);
});

// open the chargen window
client.events.on('chargen', (obj) => {
  client.addReactPanel("Chargen", obj);
});

// open the phaser window
client.events.on('phaser', (obj) => {
  obj.contentSize = {
    width: "640px",
    height: "480px",
  };
  obj.resizeit = false;
  obj.panelSize = null;
  client.addReactPanel("Phaser", obj);
});

// open the bboard reader window
client.events.on('boardlist', (obj) => {
  openFullHeight("BBoard", obj);
  client.react.bboard.updateBoardList(obj.boardlist);
});

// open the bboard reader window
client.events.on('bbmsglist', (obj) => {
  openFullHeight("BBoard", obj);
  obj.messages.reverse();
  client.react.bboard.updateBoard(obj);
});

// open the bboard reader window
client.events.on('bbmsg', (obj) => {
  openFullHeight("BBoard", obj);
  client.react.bboard.openMessage(obj);
});

// open the mail reader window
client.events.on('maillist', (obj) => {
  openFullHeight("Mailbox", obj);
  obj.maillist.reverse();
  client.react.mailbox.updateMailList(obj.folder, obj.maillist, obj.unread);
});

// open a single mail item
client.events.on('mailitem', (obj) => {
  openFullHeight("Mailbox", obj);
  client.react.mailbox.openMailItem(obj);
});

// send a mail
client.events.on('sendmail', (obj) => {
  client.addReactPanel("Sendmail", obj);
  client.react.sendmail.setFields(obj.to, obj.subject, obj.body);
});

// update movement
client.events.on('move', (obj) => {
  if (client.react.phaser) {
    // tell phaser to redraw the current screen
  }
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
  client.react.statusbar && client.react.statusbar.setStatus("Connected to "+obj.login+".");
});

// clear the status bar after logging out
client.events.on('logout', (obj) => {
  client.react.statusbar && client.react.statusbar.setStatus(null);
});

// enable jsonapi commands
client.events.on('jsonapi', (obj) => {
  client.jsonapi = true;
  client.react.taskbar.forceUpdate();
});





